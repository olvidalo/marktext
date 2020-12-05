import { findNearestParagraph } from '../selection/dom'
import selection from '../selection'

const REGEX = /\[{2}.*?\]{2}/g

const crossrefCtrl = ContentState => {
  ContentState.prototype.checkEditCrossref = function () {
    const node = selection.getSelectionStart()
    const parent = node.parentElement
    if (parent.classList.contains('ag-crossref')) {
      return { paragraph: findNearestParagraph(node), text: node.text }
    }

    return { paragraph: null }
  }

  ContentState.prototype.updateLink = function (link) {
    const { start, end } = this.cursor
    const { key, offset: startOffset } = start
    const { offset: endOffset } = end
    const block = this.getBlock(key)

    let groups
    while ((groups = REGEX.exec(block.text)) !== null) {
      const matchStart = groups.index
      const matchEnd = matchStart + groups[0].length
      if (startOffset >= matchStart && endOffset <= matchEnd) {
        const linkStart = matchStart + 2
        const linkEnd = matchEnd - 2

        block.text = block.text.substr(0, linkStart) + link + block.text.substr(linkEnd)

        const newLinkEnd = linkStart + link.length
        const cursorPos = newLinkEnd + 2

        const cursor = { ...this.cursor.start, offset: cursorPos }
        this.cursor = {
          start: cursor,
          end: cursor
        }

        this.partialRender()
        this.muya.dispatchSelectionChange()
        this.muya.dispatchChange()
      }
    }
  }
}

export default crossrefCtrl
