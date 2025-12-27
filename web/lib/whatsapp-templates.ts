/**
 * WhatsApp Message Templates
 * Utility functions for generating formatted WhatsApp messages
 */

interface Product {
  id: number;
  name: string;
  price?: number;
  sku?: string;
  description?: string;
}

interface ProductInquiry {
  product: Product;
  quantity?: number;
  sellerName?: string;
}

interface BulkInquiry {
  products: Product[];
  sellerName?: string;
}

/**
 * Generate a simple product inquiry message
 */
export const generateProductInquiryMessage = (product: Product): string => {
  const productInfo = [
    `📦 *Product:* ${product.name}`,
    // `💰 *Price:* ₹${parseFloat(String(product.price)).toFixed(0)}`,
  ];

  if (product.sku) {
    productInfo.push(`🏷️ *SKU:* ${product.sku}`);
  }

  return productInfo.join("\n");
};

/**
 * Generate a detailed product inquiry message with quantity
 */
export const generateDetailedInquiryMessage = ({
  product,
  quantity,
  sellerName,
}: ProductInquiry): string => {
  const lines = [
    `Hi${sellerName ? ` ${sellerName}` : ""}! 👋`,
    "",
    "I would like to inquire about the following product:",
    "",
    generateProductInquiryMessage(product),
  ];

  if (quantity) {
    lines.push(`📊 *Quantity Interested:* ${quantity}`);
  }

  lines.push("", "Could you please provide more details? Thank you!");

  return lines.join("\n");
};

/**
 * Generate a bulk inquiry message for multiple products
 */
export const generateBulkInquiryMessage = ({
  products,
  sellerName,
}: BulkInquiry): string => {
  const lines = [
    `Hi${sellerName ? ` ${sellerName}` : ""}! 👋`,
    "",
    "I would like to inquire about the following products:",
    "",
  ];

  products.forEach((product, index) => {
    lines.push(`*${index + 1}. ${product.name}*`);
    // lines.push(`   Price: ₹${parseFloat(String(product.price)).toFixed(0)}`)
    if (product.sku) {
      lines.push(`   SKU: ${product.sku}`);
    }
    lines.push("");
  });

  lines.push("Please provide pricing for bulk orders. Thank you!");

  return lines.join("\n");
};

/**
 * Generate an order tracking/follow-up message
 */
export const generateOrderFollowUpMessage = (orderId: string): string => {
  return [
    "Hi 👋",
    "",
    `I would like to know about the status of my order:`,
    `Order ID: ${orderId}`,
    "",
    "Could you please provide an update? Thank you!",
  ].join("\n");
};

/**
 * Generate a customer support inquiry message
 */
export const generateSupportInquiryMessage = (issue: string): string => {
  return [
    "Hi 👋",
    "",
    `I need help with the following:`,
    issue,
    "",
    "Could you please assist me? Thank you!",
  ].join("\n");
};

/**
 * Encode message for WhatsApp URL
 */
export const encodeWhatsAppMessage = (message: string): string => {
  return encodeURIComponent(message);
};

/**
 * Generate WhatsApp URL for a specific phone number
 */
export const generateWhatsAppURL = (
  phoneNumber: string,
  message: string,
): string => {
  // Ensure phone number is in international format and clean
  const cleanNumber = phoneNumber.replace(/[^\d+]/g, "");
  const encodedMessage = encodeWhatsAppMessage(message);

  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
};

/**
 * Generate WhatsApp Web URL (for desktop/browser)
 */
export const generateWhatsAppWebURL = (
  phoneNumber: string,
  message: string,
): string => {
  const cleanNumber = phoneNumber.replace(/[^\d+]/g, "");
  const encodedMessage = encodeWhatsAppMessage(message);

  return `https://web.whatsapp.com/send?phone=${cleanNumber}&text=${encodedMessage}`;
};

/**
 * Format phone number for WhatsApp (international format)
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-numeric characters except +
  let cleaned = phoneNumber.replace(/[^\d+]/g, "");

  // If it doesn't start with +, add +91 (India default)
  if (!cleaned.startsWith("+")) {
    // If it's 10 digits, assume India
    if (cleaned.length === 10) {
      cleaned = "+91" + cleaned;
    } else if (!cleaned.startsWith("+")) {
      cleaned = "+" + cleaned;
    }
  }

  return cleaned;
};

/**
 * Validate WhatsApp phone number format
 */
export const isValidWhatsAppNumber = (phoneNumber: string): boolean => {
  // Remove all non-numeric characters except +
  const cleaned = phoneNumber.replace(/[^\d+]/g, "");

  // Should have country code + at least 10 digits
  // Format: +[1-9]d{1,14}
  return /^\+?[1-9]\d{1,14}$/.test(cleaned);
};

/**
 * Get WhatsApp message for quick product share (short format)
 */
export const getQuickProductMessage = (product: Product): string => {
  return `Hi! I'm interested in "${product.name}" - ${product.sku ? ` (SKU: ${product.sku})` : ""}`;
};

/**
 * Build product link using organisation unique code and domain
 * Format: `organisationUniqueCode.domain/product/{id}`
 */
export const buildProductLink = (
  organisationUniqueCode: string,
  productId: number,
  domain?: string,
): string => {
  const webDomain =
    domain || process.env.NEXT_PUBLIC_WEB_DOMAIN || "localhost:3000";
  const code = organisationUniqueCode.toLowerCase();

  return `https://${code}.${webDomain}/product/${productId}`;
};

/**
 * Generate product inquiry message with product link
 */
export const generateProductInquiryWithLink = (
  product: Product,
  organisationUniqueCode: string,
  domain?: string,
): string => {
  const link = buildProductLink(organisationUniqueCode, product.id, domain);
  const productInfo = [
    `📦 *Product:* ${product.name}`,
    // `💰 *Price:* ₹${parseFloat(String(product.price)).toFixed(0)}`,
  ];

  if (product.sku) {
    productInfo.push(`🏷️ *SKU:* ${product.sku}`);
  }

  productInfo.push(`🔗 *Link:* ${link}`);

  return productInfo.join("\n");
};

/**
 * Generate detailed inquiry message with product link and quantity
 */
export const generateDetailedInquiryWithLink = ({
  product,
  quantity,
  sellerName,
  organisationUniqueCode,
  domain,
}: ProductInquiry & {
  organisationUniqueCode: string;
  domain?: string;
}): string => {
  const link = buildProductLink(organisationUniqueCode, product.id, domain);
  const lines = [
    `Hi${sellerName ? ` ${sellerName}` : ""}! 👋`,
    "",
    "I would like to inquire about the following product:",
    "",
    generateProductInquiryWithLink(product, organisationUniqueCode, domain),
  ];

  if (quantity) {
    lines.push(`📊 *Quantity Interested:* ${quantity}`);
  }

  lines.push(`🔗 *Product Link:* ${link}`);
  lines.push("", "Could you please provide more details? Thank you!");

  return lines.join("\n");
};

/**
 * Generate quick product share message with link
 */
export const getQuickProductMessageWithLink = (
  product: Product | Record<string, unknown>,
  organisationUniqueCode: string,
  domain?: string,
): string => {
  const link = buildProductLink(organisationUniqueCode, (product as Record<string, unknown>).id as number, domain);

  return `Hi! I'm interested in "${(product as Record<string, unknown>).name}" - ₹${parseFloat(String((product as Record<string, unknown>).price)).toFixed(0)}${(product as Record<string, unknown>).sku ? ` (SKU: ${(product as Record<string, unknown>).sku})` : ""}\n\n🔗 ${link}`;
};
