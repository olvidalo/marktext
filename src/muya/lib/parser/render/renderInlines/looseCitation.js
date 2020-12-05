import { CLASS_OR_ID } from '../../../config'

export default function citation (h, cursor, block, token, outerClass) {
  const className = this.getClassName(outerClass, block, token, cursor)
  const { start, end } = token.range

  const marker = this.highlight(h, block, start, start + 1, token)
  const citeKey = this.highlight(h, block, start + 1, end, token)
  return [
    h(`span#citation-${citeKey}.${CLASS_OR_ID.AG_INLINE_CITATION}.${CLASS_OR_ID.AG_INLINE_CITATION_LOOSE}.${CLASS_OR_ID.AG_INLINE_RULE}`, [
      h(`span.${className}.${CLASS_OR_ID.AG_REMOVE}`, marker),
      h('a', {
        attrs: {
          spellcheck: 'false',
          href: `zotero://select/items/bbt:${citeKey}`,
          target: '_blank',
          title: citeKey
        }
      }, `${citeKey}`)
    ])
  ]
}
