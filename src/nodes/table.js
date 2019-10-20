import create from './createNode'

// rows is a 2 dim array
export default function table(className, rows) {
   const n = create('table', { class: className, cellspacing: 0 })
   rows.forEach(r => {
      const tr = create('tr')
      n.appendChild(tr)
      r.forEach(c => {
         const td = create('td')
         if (c instanceof HTMLElement) {
            td.appendChild(c)
         } else {
            td.textContent = c
         }

         tr.appendChild(td)
      })
   })

   return n
}
