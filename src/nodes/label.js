import create from './createNode'

export default function label(inputNode, text) {
   const n = create('label')
   if (text) {
      n.textContent = text
   }
   if (inputNode) {
      n.appendChild(inputNode)
   }
   return n
}
