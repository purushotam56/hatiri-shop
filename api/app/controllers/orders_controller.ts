import { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import Cart from '#models/cart'
import Address from '#models/address'
import { errorHandler } from '#helper/error_handler'
import PDFDocument from 'pdfkit'
import StockService, { type OrderStatusType } from '#services/stock_service'

export default class OrdersController {
  async store({ auth, request, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const { addressId, notes } = request.only(['addressId', 'notes'])

      // Get cart items
      const cartItems = await Cart.query().where('userId', user.id)
      if (cartItems.length === 0) {
        return response.badRequest({ message: 'Cart is empty' })
      }

      // Validate cart items have required fields
      const invalidItem = cartItems.find((item) => !item.productId || !item.name || !item.price)
      if (invalidItem) {
        return response.badRequest({
          message: 'Cart contains invalid items. All items must have productId, name, and price',
        })
      }

      // Get address
      const address = await Address.query()
        .where('id', addressId)
        .where('userId', user.id)
        .firstOrFail()

      // Calculate totals
      const subtotal = cartItems.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
      )
      const deliveryFee = 0 // Free delivery for now
      const total = subtotal + deliveryFee

      // Create order
      const order = await Order.create({
        orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        customerId: user.id,
        addressId: address.id,
        deliveryAddress: `${address.street}, ${address.city}, ${address.state} ${address.pincode}`,
        customerName: address.fullName,
        customerPhone: address.phoneNumber,
        totalAmount: total,
        taxAmount: 0,
        deliveryAmount: deliveryFee,
        subtotal: subtotal,
        status: 'pending',
        notes: notes || '',
      })

      // Create order items
      await Promise.all(
        cartItems.map((item) =>
          OrderItem.create({
            orderId: order.id,
            productId: Number(item.productId),
            variantId: item.variantId ? Number(item.variantId) : null,
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
            currency: item.currency || 'INR',
            unit: item.unit || '',
          })
        )
      )

      // Clear cart after order creation
      await Cart.query().where('userId', user.id).delete()

      // Load items relationship before returning
      await order.load('items')

      return response.ok({ order })
    } catch (error) {
      return errorHandler(error, { auth, response } as HttpContext)
    }
  }

  async index({ auth, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const orders = await Order.query()
        .where('customerId', user.id)
        .preload('items')
        .orderBy('created_at', 'desc')

      return response.ok({ orders })
    } catch (error) {
      return errorHandler(error, { auth, response } as HttpContext)
    }
  }

  async show({ auth, params, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const order = await Order.query()
        .where('id', params.id)
        .where('customerId', user.id)
        .preload('items')
        .firstOrFail()

      return response.ok({ order })
    } catch (error) {
      return errorHandler(error, { auth, response } as HttpContext)
    }
  }

  async downloadInvoice({ auth, params, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const order = await Order.query()
        .where('id', params.id)
        .where('customerId', user.id)
        .preload('items')
        .firstOrFail()

      // Create PDF
      const doc = new PDFDocument()

      // Collect PDF data
      const chunks: Buffer[] = []
      doc.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })

      // Set response headers
      response.header('Content-Type', 'application/pdf')
      response.header(
        'Content-Disposition',
        `attachment; filename="Invoice-${order.orderNumber}.pdf"`
      )

      // Add header
      doc.fontSize(20).font('Helvetica-Bold').text('INVOICE', { align: 'center' })
      doc.moveDown(0.5)
      doc.fontSize(12).font('Helvetica').text(`Order #${order.orderNumber}`, { align: 'center' })
      doc.moveDown(0.5)

      // Horizontal line
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
      doc.moveDown(0.5)

      // Order info
      doc.fontSize(11).font('Helvetica-Bold').text('Order Information')
      doc.fontSize(10).font('Helvetica')
      doc.text(`Date: ${order.createdAt.toFormat('dd LLLL yyyy')}`)
      doc.text(`Status: ${order.status.toUpperCase()}`)
      doc.moveDown(0.5)

      // Customer info
      doc.fontSize(11).font('Helvetica-Bold').text('Customer Information')
      doc.fontSize(10).font('Helvetica')
      doc.text(`Name: ${order.customerName}`)
      doc.text(`Phone: ${order.customerPhone}`)
      doc.moveDown(0.5)

      // Delivery address
      doc.fontSize(11).font('Helvetica-Bold').text('Delivery Address')
      doc.fontSize(10).font('Helvetica')
      doc.text(order.deliveryAddress)
      doc.moveDown(0.5)

      // Horizontal line
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
      doc.moveDown(0.5)

      // Items table header
      doc.fontSize(11).font('Helvetica-Bold')
      const col1X = 50
      const col2X = 300
      const col3X = 400
      const col4X = 500

      doc.text('Item', col1X, doc.y)
      doc.text('Qty', col2X, doc.y - 15)
      doc.text('Price', col3X, doc.y - 15)
      doc.text('Total', col4X, doc.y - 15)
      doc.moveDown(0.5)

      // Items
      doc.fontSize(10).font('Helvetica')
      order.items?.forEach((item) => {
        const price = Number(item.price)
        const quantity = Number(item.quantity)
        const itemTotal = price * quantity
        doc.text(item.name, col1X, doc.y, { width: 240 })
        doc.text(quantity.toString(), col2X, doc.y - doc.heightOfString(item.name))
        doc.text(`₹${price.toFixed(2)}`, col3X, doc.y - doc.heightOfString(item.name))
        doc.text(`₹${itemTotal.toFixed(2)}`, col4X, doc.y - doc.heightOfString(item.name))
        doc.moveDown(1)
      })

      // Horizontal line
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
      doc.moveDown(0.5)

      // Summary
      const summaryX = 380
      const subtotal = Number(order.subtotal)
      const taxAmount = Number(order.taxAmount)
      const deliveryAmount = Number(order.deliveryAmount)
      const totalAmount = Number(order.totalAmount)

      doc.fontSize(10).font('Helvetica')
      doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, summaryX)
      if (taxAmount > 0) {
        doc.text(`Tax: ₹${taxAmount.toFixed(2)}`)
      }
      if (deliveryAmount > 0) {
        doc.text(`Delivery: ₹${deliveryAmount.toFixed(2)}`)
      }

      doc.fontSize(12).font('Helvetica-Bold')
      doc.text(`Total: ₹${totalAmount.toFixed(2)}`)

      // Footer
      doc.moveDown(2)
      doc.fontSize(9).font('Helvetica').text('Thank you for your purchase!', { align: 'center' })

      // Finalize PDF and send response
      await new Promise<void>((resolve, reject) => {
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks)
          response.send(pdfBuffer)
          resolve()
        })
        doc.on('error', reject)
        doc.end()
      })
    } catch (error) {
      return errorHandler(error, { auth, response } as HttpContext)
    }
  }

  async updateStatus({ auth, params, request, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const { status } = request.only(['status']) as { status: OrderStatusType }

      // Validate status value
      const validStatuses: OrderStatusType[] = [
        'pending',
        'confirmed',
        'preparing',
        'ready',
        'out_for_delivery',
        'delivered',
        'cancelled',
      ]

      if (!status || !validStatuses.includes(status)) {
        return response.badRequest({
          message: 'Invalid status. Must be one of: ' + validStatuses.join(', '),
        })
      }

      // Get order
      const order = await Order.query()
        .where('id', params.id)
        .where('customerId', user.id)
        .preload('items')
        .firstOrFail()

      const previousStatus = order.status as OrderStatusType

      // Validate status transition
      const validation = StockService.validateStatusTransition(previousStatus, status)
      if (!validation.valid) {
        return response.badRequest({ message: validation.error })
      }

      // Adjust stock based on status change
      const stockAdjustments = await StockService.adjustStockForStatusChange(
        order,
        previousStatus,
        status
      )

      // Update order status
      order.status = status
      await order.save()

      return response.ok({
        order,
        message: `Order status updated to ${status}`,
        stockAdjustments:
          stockAdjustments.length > 0
            ? stockAdjustments.map((adj) => ({
                productId: adj.productId,
                previousStock: adj.previousStock,
                newStock: adj.newStock,
                quantity: adj.quantity,
              }))
            : undefined,
      })
    } catch (error) {
      return errorHandler(error, { auth, response } as HttpContext)
    }
  }
}
