export function parsedArray(values: any) {
  const isArray = Array.isArray(values) ? values : [values]
  const parsedValues = isArray
    .map((val: string) => val.replace(/\[|\]/g, '').split(',')) // Remove brackets and split
    .flat()
    .map((val: string) => val.trim().replace(/^['"]|['"]$/g, ''))

  return parsedValues.map((val) => {
    const num = Number.parseInt(val, 10)
    return Number.isNaN(num) ? val : num // Keep strings as is
  })
}
