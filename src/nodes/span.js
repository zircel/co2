import create from './createNode'

export default function span(text, className = '') {
   const n = create('span', { class: className })
   if (text || text === 0) {
      n.textContent = text
   }
   return n
}
