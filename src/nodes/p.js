import create from './createNode'

export default function p(text, className = '') {
   const n = create('p', { class: className })
   if (text || text === 0) {
      n.textContent = text
   }
   return n
}
