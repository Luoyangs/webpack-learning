export function square(x) {
  return x * x
}

export function cube(x) {
  return x * x * x
}

export function parse(params) {
  console.log('params:', params)
  let current = parseFloat(params).toFixed(2).toString()
  console.log('current:', current)
  current = current.replace('.', ',')
  let _int = current.split(',')[0]
  let _decimal = current.split(',')[1]
  
}