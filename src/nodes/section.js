import create from './createNode'

export default function section(id, ...children) {
   const n = create('section', { id })
   children.forEach(c => {
      if (c) n.appendChild(c)
   })
   return n
}
