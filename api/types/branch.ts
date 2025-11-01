import { ResourceType } from './common.js'

export enum BranchType {
  'apartment' = 'apartment',
  'villa' = 'villa',
  'townhouse' = 'townhouse',
  'house' = 'house',
}

export enum BranchMaintenanceServiceType {
  'before_7_year' = 'before_7_year',
  'after_7_year' = 'after_7_year',
}

export const BranchTypeList = [
  {
    key: BranchType.apartment,
    value: 'apartment',
  },
  {
    key: BranchType.villa,
    value: 'villa',
  },
  {
    key: BranchType.townhouse,
    value: 'townhouse',
  },
  {
    key: BranchType.house,
    value: 'house',
  },
]

export const BranchMaintenanceServiceTypeList = [
  {
    key: BranchMaintenanceServiceType.before_7_year,
    value: 'before 7 year',
  },
  {
    key: BranchMaintenanceServiceType.after_7_year,
    value: 'after 7 year',
  },
]

export const BranchFloorsList = [
  {
    key: 1,
    value: '1 floor',
  },
  {
    key: 2,
    value: '2 floors',
  },
  {
    key: 3,
    value: '3 floors',
  },
  {
    key: 4,
    value: '4 floors',
  },
  {
    key: 5,
    value: '5 floors',
  },
  {
    key: 6,
    value: '6 floors',
  },
  {
    key: 7,
    value: '7 floors',
  },
  {
    key: 8,
    value: '8 floors',
  },
  {
    key: 9,
    value: '9 floors',
  },
  {
    key: 10,
    value: '10 floors',
  },
]

export enum UtilityServiceProviderOptStatus {
  'pending' = 'pending',
  'optin' = 'optin',
  'optout' = 'optout',
}

export const branchTowerfloorList = (numFloors: number, floor?: number) => {
  if (numFloors < 1) {
    return []
  }
  const floorsArray = []

  floorsArray.push({ key: 0, value: 'Ground Floor', resourceType: ResourceType.FLOOR })

  for (let i = 1; i <= numFloors - 1; i++) {
    if (i <= 50) {
      floorsArray.push({ key: i, value: `Floor ${i}`, resourceType: ResourceType.FLOOR })
    }
  }

  const rooftopKey = Number(numFloors)
  floorsArray.push({ key: rooftopKey, value: 'Roof Top', resourceType: ResourceType.FLOOR })

  return floorsArray.filter((fl) => !floor || (floor && fl.key === floor))
}

export const branchBasementList = (numBasementLevels: number, basement?: number) => {
  const basementsArray = []

  for (let i = 1; i <= numBasementLevels; i++) {
    basementsArray.push({ key: i, value: `B${i}`, resourceType: ResourceType.BASEMENT })
  }

  return basementsArray.filter((fl) => !basement || (basement && fl.key === basement))
}
