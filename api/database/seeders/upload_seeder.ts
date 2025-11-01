import Upload from '#models/upload'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Upload.createMany([
      {
        name: 'istockphoto-1322575582-612x612.jpg',
        key: 'images/istockphoto-1322575582-612x612-jpg-1728864716769.jpg',
        mimeType: 'image/jpeg',
        size: 6290390,
      },
      {
        name: 'warrany.pdf',
        key: 'images/b1-the-atrium-pilot-pre-settlement-report-pdf-1743147260615.pdf',
        mimeType: 'application/pdf',
        size: 71019,
      },
    ])
  }
}
