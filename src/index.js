import _ from 'lodash'
import './style.css'
// import icon from './icon.png'
// import printMe from './print'
// import { cube } from './util/math'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(registion => {
    console.log('serviceWorker registed:', registion)
  }).catch(err => {
    console.log('serviceWorker registion failed:', err)
  })
}

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!')
}

function component() {
  let ele = document.createElement('div')
  ele.innerHTML = _.join(['Hello', 'World'], ' ')
  ele.classList.add('hello')

  // 创建一个图片，并将它插入到现有的div中
  // let image = new Image()
  // image.src = icon
  // ele.appendChild(image)
  // ele.addEventListener('click', () => import(/* webpackChunkName: "print" */'./print').then(module => {
  //   module.default()
  // }))

  // let btn = document.createElement('button')
  // btn.innerHTML = [
  //   'Click Me And Print',
  //   '5 cubed is equal to ' + cube(5) 
  // ].join('\n\n')
  // // btn.addEventListener('click', () => import(/* webpackChunkName: "print" */'./print').then(module => {
  // //   module.default()
  // // }))
  // ele.appendChild(btn)

  return ele
}

document.body.appendChild(component())

// 当 print.js 改变导致页面重新渲染时，重新获取渲染的元素
// let element = component()
// document.body.appendChild(element)

// if (module.hot) {
//   module.hot.accept('./print.js', () => {
//     console.log('Accetping the updated printMe module')
//     // printMe()
//     document.body.removeChild(element)
//     element = component()
//     document.body.appendChild(element)
//   })
// }
