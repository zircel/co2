import create from './createNode'

/**
 *
 * @param {String} href
 * @param {String|Node} content either a dom node or text
 * @param {String} className
 * @param {Function} clickHandler
 */
export default function a(href, content, className, clickHandler, openBlank) {
   const target = openBlank ? '_blank' : '_self'
   const n = create('a', { href, class: className, target })

   if (typeof clickHandler === 'function') {
      n.addEventListener('click', clickHandler)
   }

   if (content) {
      if (typeof content === 'string') {
         n.textContent = content
      } else {
         n.appendChild(content)
      }
   }

   return n
}
