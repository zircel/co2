import create from './createNode'

export default function h2(text) {
   const n = create('h2')
   if (text) {
      n.textContent = text
   }
   return n
}
