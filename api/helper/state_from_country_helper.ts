import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

export default function stateFromCountry(countryCode: string) {
  const filePath = path.join(`resources/country/${countryCode.toUpperCase()}.json`)

  let result
  if (existsSync(filePath)) {
    const countryData = JSON.parse(readFileSync(filePath, 'utf-8'))
    result = countryData.states
  }

  return result
}
