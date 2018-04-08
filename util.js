export const SATOSHIS = 100000000

export function limit8Decimals(v) {
  if (v.length > 8) {
    return v.slice(0, 8)
  } else if (v.length === 8) {
    return v
  } else {
    return v + new Array(8 - v.length).fill(0).join('')
  }
}

export function sanitizeDecimals(n) {
  let v = n + ''
  let num = v.split('.')


  if (num.length > 1) {
    return num[0] + '.' + limit8Decimals(num[1])
  } else {
    return num[0] + '.00000000'
  }
}


export function softLimit8Decimals(v) {
  if (!v){
    return v
  } else {
    v = '' + v
    if (v.indexOf('.') < 0) {
      return v
    } else {
      let [i, d] = v.split('.')
      if (d.length > 8) {
        return i + '.' + d.slice(0, 8)
      } else if (v.length <= 8) {
        return i + '.' + d
      }
    }
  }
}
