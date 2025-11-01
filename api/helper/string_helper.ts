export function titleCase(str: string) {
  let strArr = str ? str.toLowerCase().split(' ') : []
  for (var i = 0; i < strArr.length; i++) {
    strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1)
  }
  str = strArr.join(' ')
  return str.replace('_', '-') //TODO: Remove this line
}
