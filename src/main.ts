function parse(x: number): number{
  return x * x
}

const ele = document.createElement('div')
ele.innerHTML = parse(2).toString()

document.body.appendChild(ele)