import create from './createNode'

export default function textarea(attrs, inputHandler) {
   const textarea = create('textarea', attrs)
   textarea.addEventListener('input', inputHandler)
   return textarea
}
