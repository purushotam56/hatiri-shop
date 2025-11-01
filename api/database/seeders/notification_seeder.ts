import AdminUser from '#models/admin_user'
import Notification from '#models/notification'
import NotificationUser from '#models/notification_user'
import User from '#models/user'
import Organisation from '#models/organisation'
import { NotificationType } from '#types/notification'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import _ from 'lodash'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    const data = await this.client.rawQuery(`select * from notifications_bk`)
    const users = await User.query()
    const admins = await AdminUser.all()
    const organisation = await Organisation.query().preload('user')
    const notifications = data.rows.map((d: any) => ({
      ...d,
      user: users.find((u) => u.id === d.user_id)?.serialize(),
      organisation: organisation.find((u) => u.id === d.user_id)?.serialize(),
    }))

    const grouped = _.groupBy(notifications, (n: any) => [
      n.organisation_id,
      n.title,
      n.body,
      n.property_id,
      n.common_area_id,
      n.data,
    ])

    for (const notArr of Object.values(grouped)) {
      const notiusers = []
      const notification = await Notification.create({
        screen: notArr[0].data.screen,
        organisationId: notArr[0].organisation_id,
        branchId: notArr[0].branch_id,
        title: notArr[0].title,
        body: notArr[0].body,
        refId: notArr[0].data.id,
        refType: grabNotificationType(notArr[0].data.screen),
        createdAt: DateTime.fromJSDate(new Date(notArr[0].created_at)),
        updatedAt: DateTime.fromJSDate(new Date(notArr[0].updated_at)),
      })

      for (const noti of notArr) {
        notiusers.push({
          notificationId: notification.id,
          userId: noti.user.id,
          isRead: noti.is_read,
          needAction: noti.is_need_action,
        })
      }
      for (const admin of admins) {
        notiusers.push({
          notificationId: notification.id,
          adminUserId: admin.id,
          isRead: true,
          needAction: false,
        })
      }

      await NotificationUser.createMany(notiusers)
    }
  }
}

const grabNotificationType = (screen: string) => {
  screen = screen.toLowerCase()
  switch (screen) {
    case 'defect':
      return NotificationType.changeDefectSubmissionSubStatus
    case 'appointment':
      return NotificationType.appointment_booked
    case 'inspection':
      return NotificationType.inspection_started
    default:
      return NotificationType.changeDefectSubmissionSubStatus
  }
}
