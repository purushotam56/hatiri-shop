import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { PermissionKeyDetail, PermissionKeys } from '#types/permissions'
import Permission from '#models/permission'

export default class extends BaseSeeder {
  public async run() {
    const permissios = Object.keys(PermissionKeys).map((k) => ({
      permissionKey: k,
      permissionName: PermissionKeyDetail[k as keyof typeof PermissionKeyDetail],
    }))
    for (const per of permissios) {
      try {
        await Permission.create(per)
      } catch (e) {
        console.log(per.permissionName, ' already there')
      }
    }
  }
}
