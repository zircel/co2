import create from './createNode'

export default function ul(className, ...listpoints) {
   const n = create('ul', { class: className })

   listpoints.forEach(lp => {
      const li = create('li', {})
      li.textContent = lp
      n.appendChild(li)
   })
   return n
}
