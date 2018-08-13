import _ from 'lodash'
import './style.css'
import icon from './icon.png'
import printMe from './print'

function component() {
  let ele = document.createElement('div')
  ele.innerHTML = _.join(['Hello', 'World'], ' ')
  ele.classList.add('hello')

  // 创建一个图片，并将它插入到现有的div中
  let image = new Image()
  image.src = icon
  ele.appendChild(image)

  let btn = document.createElement('button')
  btn.innerHTML = 'Click Me And Print'
  btn.addEventListener('click', printMe)
  ele.appendChild(btn)

  return ele
}

// document.body.appendChild(component())

// 当 print.js 改变导致页面重新渲染时，重新获取渲染的元素
let element = component()
document.body.appendChild(element)

if (module.hot) {
  module.hot.accept('./print.js', () => {
    console.log('Accetping the updated printMe module')
    // printMe()
    document.body.removeChild(element)
    element = component()
    document.body.appendChild(element)
  })
}
