import { CLASS_OR_ID } from '../../../config'

export default function crossref (h, cursor, block, token, outerClass) {
  const className = this.getClassName(outerClass, block, token, cursor)
  // const { marker } = token
  const { start, end } = token.range
  //
  const startContent = start + 2
  const endContent = end - 2

  const startMarker = this.highlight(h, block, start, startContent, token)
  const endMarker = this.highlight(h, block, endContent, end, token)

  const content = token.content
  //

  return [
    h(`span#noteref-${token.content}.${CLASS_OR_ID.AG_INLINE_RULE}.${CLASS_OR_ID.AG_CROSSREF}`, [
      h(`span.${className}.${CLASS_OR_ID.AG_REMOVE}.${CLASS_OR_ID.AG_COPY_REMOVE}`, startMarker),
      h(`a.${CLASS_OR_ID.AG_CROSSREF_LINK}`, {
        props: {
          href: '#',
          target: '_blank',
          title: token.title
        }
      }, content),
      h(`span.${className}.${CLASS_OR_ID.AG_REMOVE}.${CLASS_OR_ID.AG_COPY_REMOVE}`, endMarker)
    ])
  ]
}
