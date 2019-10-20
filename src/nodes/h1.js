import create from './createNode'

export default function h1(text) {
   const n = create('h1')
   if (text) {
      n.textContent = text
   }
   return n
}
