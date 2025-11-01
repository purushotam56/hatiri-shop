export enum LocationKey {
  'PROJECT_SITE_ESTABLISHMENT' = 'branch_site_establishment',
  'PROJECT_EXTERNAL_WORK' = 'branch_external_work',
  'BASEMENT_CONSTRUCTION' = 'basement_construction',
  'TOWER_GROUND_FLOOR_CONSTRUCTION' = 'tower_ground_floor_construction',
  'TOWER_ROOF_TOP_CONSTRUCTION' = 'tower_roof_top_construction',
  'TOWER_FLOOR_CONSTRUCTION' = 'tower_floor_construction',
  'PROPERTY' = 'property',
  'COMMON_AREA' = 'common_area',
}

export enum LocationListKey {
  'SITE_ESTABLISHMENT' = 'site_establishment',
  'EXTERNAL_WORK' = 'external_work',
  'CONSTRUCTION' = 'construction',
  'PROPERTY' = 'property',
  'COMMON_AREA' = 'common_area',
}
export const locationNameMap: Record<LocationKey, string> = {
  [LocationKey.PROJECT_SITE_ESTABLISHMENT]: 'Branch - Site Establishment',
  [LocationKey.PROJECT_EXTERNAL_WORK]: 'Branch - External Work',
  [LocationKey.BASEMENT_CONSTRUCTION]: 'Basement Construction',
  [LocationKey.TOWER_GROUND_FLOOR_CONSTRUCTION]: 'Tower Ground Floor Construction',
  [LocationKey.TOWER_ROOF_TOP_CONSTRUCTION]: 'Tower Roof Top Construction',
  [LocationKey.TOWER_FLOOR_CONSTRUCTION]: 'Tower Floor Construction',
  [LocationKey.PROPERTY]: 'Property',
  [LocationKey.COMMON_AREA]: 'Common Area',
}

export const locationListNameMap: Record<LocationListKey, string> = {
  [LocationListKey.SITE_ESTABLISHMENT]: 'Site Establishment',
  [LocationListKey.EXTERNAL_WORK]: 'External Work',
  [LocationListKey.CONSTRUCTION]: 'Construction',
  [LocationListKey.COMMON_AREA]: 'Common Area',
  [LocationListKey.PROPERTY]: 'Property',
}

const locationMap: Record<LocationListKey, LocationKey[]> = {
  [LocationListKey.SITE_ESTABLISHMENT]: [LocationKey.PROJECT_SITE_ESTABLISHMENT],
  [LocationListKey.EXTERNAL_WORK]: [LocationKey.PROJECT_EXTERNAL_WORK],
  [LocationListKey.CONSTRUCTION]: [
    LocationKey.BASEMENT_CONSTRUCTION,
    LocationKey.TOWER_FLOOR_CONSTRUCTION,
    LocationKey.TOWER_GROUND_FLOOR_CONSTRUCTION,
    LocationKey.TOWER_ROOF_TOP_CONSTRUCTION,
  ],
  [LocationListKey.COMMON_AREA]: [LocationKey.COMMON_AREA],
  [LocationListKey.PROPERTY]: [LocationKey.PROPERTY],
}

const reverseLocationMap: Record<LocationKey, LocationListKey> = Object.entries(locationMap).reduce(
  (acc, [listKey, keys]) => {
    keys.forEach((key) => {
      acc[key] = listKey as LocationListKey
    })
    return acc
  },
  {} as Record<LocationKey, LocationListKey>
)

export const getLocationKeyByLocationListKey = (listKey: LocationListKey): LocationKey[] => {
  return locationMap[listKey] || []
}

export const getLocationListKeyByLocationKey = (
  locationKey: LocationKey
): { key: LocationListKey; name: string } | undefined => {
  const listKey = reverseLocationMap[locationKey]
  if (!listKey) return undefined

  return {
    key: listKey,
    name: locationListNameMap[listKey],
  }
}
