export default function create(nodeType, attributes, clickHandler) {
   const node = document.createElement(nodeType)

   if (attributes) {
      Object.keys(attributes).forEach(key => {
         node.setAttribute(key, attributes[key])
      })
   }

   if (typeof clickHandler === 'function') {
      node.addEventListener('click', clickHandler, false)
   }

   return node
}
