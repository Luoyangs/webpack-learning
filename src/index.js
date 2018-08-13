import _ from 'lodash'

function component() {
  let ele = document.createElement('div')
  ele.innerHTML = _.join(['Hello', 'World'], ' ')
  return ele;
}

document.body.appendChild(component())