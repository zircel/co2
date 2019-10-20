import create from './createNode'

export default function button(className, text, clickHandler) {
   const btn = create('button', { class: className }, clickHandler)
   if (text) {
      btn.textContent = text
   }
   return btn
}
