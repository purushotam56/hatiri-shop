import { BaseModel } from '@adonisjs/lucid/orm'

type ModelColumns<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]

export type ModelColumnsType<
  T extends typeof BaseModel,
  K extends ModelColumns<InstanceType<T>>,
> = Partial<Pick<InstanceType<T>, K>>

export const imageMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/svg+xml',
  'image/tiff',
  'image/x-icon',
  'image/heic',
  'image/heif',
  'image/avif',
]

export const itpTemplateFilterFields = [
  'propertyId',
  'branchId',
  'organisationId',
  'regionId',
  'isDefault',
] as const

export type ITPTemplateFilterField = (typeof itpTemplateFilterFields)[number]

export function itpTemplateFindMatchedKey(data: any): ITPTemplateFilterField | undefined {
  return itpTemplateFilterFields.find((key) => data[key] !== undefined && data[key] !== null)
}

export enum ResourceType {
  'WORSPACE' = 'organisation',
  'PROJECT' = 'branch',
  'PROPERTY' = 'property',
  'COMMON_AREA' = 'commonArea',
  'APPOINTMENT' = 'appointment',
  'PROJECT_TOWER' = 'branchTower',
  'PROJECT_BASEMENT' = 'branchBasement',
  'INSPECTION' = 'inspection',
  'DEFECT' = 'defect',
  'FLOOR' = 'floor',
  'BASEMENT' = 'basement',
}

export enum CacheKeyPrefix {
  PROJECT = 'pj',
  PROPERTY = 'pr',
  COMMON_AREA = 'ca',
  COMMON_AREA_CATEGORY = 'cac',
  PROJECT_TOWER = 'pt',
  FLOOR = 'flr',
  BASEMENT = 'bs',
  LOCATION_KEY = 'lk',
  LOCATION_LIST_KEY = 'llk',
  TRADE_CODES = 'trc',
}
