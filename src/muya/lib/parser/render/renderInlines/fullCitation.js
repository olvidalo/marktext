import { CLASS_OR_ID } from '../../../config'
import { getCitationLink } from '../../utils'

export default function fullCitation (h, cursor, block, token, outerClass) {
  const className = this.getClassName(outerClass, block, token, cursor)
  const { start, end } = token.range
  const startMarker = this.highlight(h, block, start, start + 1, token)
  const endMarker = this.highlight(h, block, end - 1, end, token)
  const startContent = start + 1
  const citeItems = []
  const citationItemRegex = /(.*?)(?:(-?@)([\p{L}\d\-:.#$%&+?<>~/]+))(.*?)(;|$)/gu
  const { citationLinks, citationLinkTemplate } = this.muya.options

  let m
  let pos = startContent
  let keyMarkerElem = null

  while ((m = citationItemRegex.exec(token.content)) !== null) {
    if (m.index === citationItemRegex.lastIndex) {
      citationItemRegex.lastIndex++
    }

    m.forEach((match, groupIndex) => {
      switch (groupIndex) {
        case 0: return
        case 2: // key marker
          keyMarkerElem = h(`span.${CLASS_OR_ID.AG_INLINE_CITATION_KEY_MARKER}.${CLASS_OR_ID.AG_REMOVE}`,
            this.highlight(h, block, pos, pos + match.length, token)
          )
          break
        case 3: { // key
          const citekeyElem = h(`span.${CLASS_OR_ID.AG_INLINE_CITATION_CITEKEY}`, this.highlight(h, block, pos, pos + match.length, token))
          const content = [keyMarkerElem, citekeyElem]
          console.log(content)
          const item = citationLinks ? h('a', {
            attrs: {
              spellcheck: 'false',
              href: getCitationLink(match, citationLinkTemplate),
              target: '_blank',
              title: match
            }
          }, content) : h('span', content)
          citeItems.push(item)
        }
          break
        default:
          if (match.length > 1) {
            citeItems.push(h('span', this.highlight(h, block, pos, pos + match.length, token)))
          }
      }
      pos += match.length
    })
  }

  return [
    h(`span.${CLASS_OR_ID.AG_INLINE_CITATION}.${CLASS_OR_ID.AG_INLINE_CITATION_FULL}.${CLASS_OR_ID.AG_INLINE_RULE}`, [
      h(`span.${className}.${CLASS_OR_ID.AG_REMOVE}`, startMarker),
      ...citeItems,
      h(`span.${className}.${CLASS_OR_ID.AG_REMOVE}`, endMarker)
    ])
  ]
}
