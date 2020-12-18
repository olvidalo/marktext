import BaseScrollFloat from '../baseScrollFloat'
import { patch, h } from '../../parser/render/snabbdom'

import './index.css'

const defaultOptions = {
  placement: 'bottom-start',
  modifiers: {
    offset: {
      offset: '0, 0'
    }
  },
  showArrow: false
}

class CrossrefPicker extends BaseScrollFloat {
  static pluginName = 'crossrefPicker'

  constructor (muya, options = {}) {
    const name = 'ag-list-picker'
    const opts = Object.assign({}, defaultOptions, options)
    super(muya, name, opts)
    this.renderArray = []
    this.oldVnode = null
    this.activeItem = null
    this.listen()
  }

  listen () {
    super.listen()
    const { eventCenter } = this.muya
    eventCenter.subscribe('muya-crossref-picker', ({ reference, text, cb }) => {
      if (reference) {
        this.muya.options.crossrefAutoComplete(text).then(list => {
          this.show(reference, cb)
          this.renderArray = list
          this.activeItem = list[0]
          this.render()
        })
      } else {
        this.hide()
      }
    })
  }

  render () {
    const { renderArray, oldVnode, scrollElement, activeItem } = this
    let children = renderArray.map(item => {
      const text = h('div.language', item.name)
      const selector = activeItem === item ? 'li.item.active' : 'li.item'
      return h(selector, {
        dataset: {
          label: item.name
        },
        on: {
          click: () => {
            this.selectItem(item)
          }
        }
      }, [text])
    })

    if (children.length === 0) {
      children = h('div.no-result', 'No result')
    }
    const vnode = h('ul', children)

    if (oldVnode) {
      patch(oldVnode, vnode)
    } else {
      patch(scrollElement, vnode)
    }
    this.oldVnode = vnode
  }

  getItemElement (item) {
    const { name } = item
    return this.floatBox.querySelector(`[data-label="${name}"]`)
  }
}

export default CrossrefPicker
