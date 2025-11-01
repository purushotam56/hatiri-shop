import { NOTIFICATIONS } from '#database/constants/table_names'
import { BaseSchema } from '@adonisjs/lucid/schema'
import _ from 'lodash'

export default class extends BaseSchema {
  protected tableName = NOTIFICATIONS

  async up() {
    await this.db.rawQuery(
      `CREATE TABLE IF NOT EXISTS ${this.tableName}_bk AS TABLE ${this.tableName};`
    )
    this.schema.alterTable(this.tableName, (table) => {
      table.text('screen')
      table.integer('ref_id').nullable()
      table.string('ref_type').nullable()

      table.dropForeign('user_id')
      table.dropColumn('user_id')
      table.dropColumn('is_read')
      table.dropColumn('for_admin')
      table.dropColumn('is_read_for_admin')
      table.dropColumn('is_need_action')
      table.dropColumn('data')
    })
    await this.db.rawQuery(`delete from ${this.tableName} where id > 0`)
    // // await this.db.rawQuery(`TRUNCATE TABLE ${this.tableName};`)
    // console.log('done')
    // const data = await this.db.rawQuery(`select * from notifications_bk`)
    // console.log('data')
    // const users = await AdminUser.query().first()
    // console.log('users')

    // // const notifications = await NotificationBk.query()
    // const notifications = data.rows.map((d:any) => ({
    //   ...d,
    //   // user: users.find(u => u.id === d.user_id)
    // }))
    // // Group notifications by all fields except user_id and is_read
    // const grouped = _.groupBy(
    //   notifications,
    //   (n: any) =>
    //   [
    //     n.organisation_id,
    //     n.title,
    //     n.body,
    //     n.property_id,
    //     n.common_area_id,
    //     n.data
    //   ]
    // )

    // console.log(Object.values(grouped)[0])
    // console.log(notifications[0])
    // console.log('')

    // throw new Error('done')

    // // Each group will have notifications with different user_id and is_read, but rest same
    // // const groupedNotifications = Object.values(grouped).map((group: any[]) => ({
    // //   ...group[0],
    // //   users: group.map((n) => ({
    // //   id: n.user_id,
    // //   is_read: n.is_read,
    // //   })),
    // // }))
    // // const grouped = _.groupBy(
    // //   notifications,
    // //   (n: any) =>
    // //     [
    // //       n.organisation_id,
    // //       n.title,
    // //       n.body,
    // //       n.created_at,
    // //       n.updated_at,
    // //       n.screen,
    // //       // add other fields that should be the same
    // //     ].join('|')
    // // )

    // // Each group will have notifications with different user_id and is_read, but rest same
    // // const groupedNotifications = Object.values(grouped).map((group: any[]) => ({
    // //   ...group[0],
    // //   users: group.map((n) => ({
    // //     user_id: n.user_id,
    // //     is_read: n.is_read,
    // //   })),
    // // }))
    // const admins = await AdminUser.all()
    // const workspc = new Set(notifications.map((n: any) => n.organisation_id))
    // const orgAdmins: Record<number | string, User[]> = {}
    // // console.log(data.rows)
    // // console.log(admins.map(admin => admin.toJSON()))
    // for (const workspcId of Array.from(workspc).map(id => Number(id))) {
    //   if (workspcId) {
    //     const workspce = await Organisation.query().where('id', workspcId).preload('user').first()
    //     orgAdmins[workspcId] = workspce?.user || []
    //   }
    // }

    // for (const notification of notifications) {
    // await Notification.query().where('id', notification.id).update({
    //   screen: notification.data.screen
    // })
    // console.log(notification.data.screen)
    // const notiusers: any = [
    //   {
    //     notificationId: notification.id,
    //     userId: notification.user_id,
    //     isRead: notification.is_read,
    //     needAction: false,
    //   }
    // ]
    // // if (notification.for_admin) {
    // for (const admin of admins) {
    //   notiusers.push(
    //     {
    //       notificationId: notification.id,
    //       adminUserId: admin.id,
    //       isRead: notification.is_read_for_admin,
    //       needAction: notification.is_need_action,
    //     }
    //   )
    // }
    // for (const admin of (orgAdmins[notification.organisation_id] || [])) {
    //   notiusers.push(
    //     {
    //       notificationId: notification.id,
    //       userId: admin.id,
    //       isRead: notification.is_read_for_admin,
    //       needAction: notification.is_need_action,
    //     }
    //   )
    // }
    // }
    // await NotificationUser.createMany(notiusers)
    // }
  }

  async down() {
    // this.schema.alterTable(this.tableName, (table) => {
    // })
  }
}
