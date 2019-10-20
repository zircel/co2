import create from './createNode'

export default function strong(text, className = '') {
   const n = create('strong', { class: className })
   if (text || text === 0) {
      n.textContent = text
   }
   return n
}
