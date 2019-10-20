import create from './createNode'

export default function div(className, ...children) {
   const n = create('div', { class: className })
   children.forEach(c => {
      if (!c) return
      if (c instanceof Element) {
         n.appendChild(c)
      } else {
         n.textContent = c
      }
   })
   return n
}
