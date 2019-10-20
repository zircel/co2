import create from './createNode'

export default function h3(text) {
   const n = create('h3')
   if (text) {
      n.textContent = text
   }
   return n
}
