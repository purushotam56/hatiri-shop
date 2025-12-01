/**
 * Unit Types and Conversions
 *
 * Structure:
 * - Each unit type has multiple units
 * - Each unit has a conversion ratio (toBase) relative to base unit
 * - Base unit has toBase = 1
 * - All conversions are relative to base unit
 */

export interface Unit {
  name: string
  symbol: string
  toBase: number // Conversion ratio to base unit
}

export interface UnitType {
  units: Unit[]
}

export interface UnitSystem {
  [key: string]: UnitType
}

export const UNIT_SYSTEM: UnitSystem = {
  weight: {
    units: [
      { name: 'kilogram', symbol: 'kg', toBase: 1 },
      { name: 'gram', symbol: 'g', toBase: 1000 },
      { name: 'milligram', symbol: 'mg', toBase: 1000000 },
    ],
  },
  volume: {
    units: [
      { name: 'liter', symbol: 'l', toBase: 1 },
      { name: 'milliliter', symbol: 'ml', toBase: 1000 },
    ],
  },
  quantity: {
    units: [
      { name: 'dozen', symbol: 'dz', toBase: 1 },
      { name: 'piece', symbol: 'pc', toBase: 12 },
    ],
  },
}

/**
 * Get unit type by unit name
 * @param unit - Unit name or symbol (e.g., 'kg', 'kilogram', 'g', 'gram')
 * @returns Unit type name (e.g., 'weight') or null
 */
export function getUnitType(unit: string): string | null {
  for (const [typeName, typeData] of Object.entries(UNIT_SYSTEM)) {
    const found = typeData.units.find(
      (u) => u.name === unit || u.symbol === unit || u.symbol.toLowerCase() === unit.toLowerCase()
    )
    if (found) return typeName
  }
  return null
}

/**
 * Get compatible units for a given unit
 * @param unit - Unit name or symbol
 * @returns Array of compatible unit names in same type, or empty array
 */
export function getCompatibleUnits(unit: string): string[] {
  const unitType = getUnitType(unit)
  if (!unitType) return []

  return UNIT_SYSTEM[unitType].units.map((u) => u.name)
}

/**
 * Get conversion ratio between two units
 * @param fromUnit - Source unit
 * @param toUnit - Target unit
 * @returns Conversion ratio, or null if units not compatible
 */
export function getConversionRatio(fromUnit: string, toUnit: string): number | null {
  const fromType = getUnitType(fromUnit)
  const toType = getUnitType(toUnit)

  if (!fromType || !toType || fromType !== toType) return null

  const typeData = UNIT_SYSTEM[fromType]
  const from = typeData.units.find((u) => u.name === fromUnit || u.symbol === fromUnit)
  const to = typeData.units.find((u) => u.name === toUnit || u.symbol === toUnit)

  if (!from || !to) return null

  // ratio = (value in fromUnit) * (from.toBase / to.toBase) = value in toUnit
  return from.toBase / to.toBase
}

/**
 * Convert quantity from one unit to another
 * @param quantity - Amount to convert
 * @param fromUnit - Source unit
 * @param toUnit - Target unit
 * @returns Converted quantity, or null if units not compatible
 */
export function convertQuantity(quantity: number, fromUnit: string, toUnit: string): number | null {
  const ratio = getConversionRatio(fromUnit, toUnit)
  if (ratio === null) return null
  return quantity * ratio
}

/**
 * Normalize quantity to base unit
 * @param quantity - Amount to normalize
 * @param unit - Current unit
 * @returns Quantity in base unit, or null if unit not found
 */
export function normalizeToBaseUnit(quantity: number, unit: string): number | null {
  const unitType = getUnitType(unit)
  if (!unitType) return null

  const typeData = UNIT_SYSTEM[unitType]
  const unitData = typeData.units.find((u) => u.name === unit || u.symbol === unit)

  if (!unitData) return null

  return quantity * unitData.toBase
}

/**
 * Get base unit for a unit type
 * @param unit - Any unit name/symbol in the type
 * @returns Base unit object with toBase = 1
 */
export function getBaseUnit(unit: string): Unit | null {
  const unitType = getUnitType(unit)
  if (!unitType) return null

  const typeData = UNIT_SYSTEM[unitType]
  return typeData.units.find((u) => u.toBase === 1) || null
}

/**
 * Validate if units are compatible
 * @param unit1 - First unit
 * @param unit2 - Second unit
 * @returns true if units are in same type, false otherwise
 */
export function areUnitsCompatible(unit1: string, unit2: string): boolean {
  const type1 = getUnitType(unit1)
  const type2 = getUnitType(unit2)
  return type1 !== null && type1 === type2
}
