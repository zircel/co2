import create from './createNode'

export default function input(attrs, inputHandler) {
   const input = create('input', attrs, inputHandler)
   input.addEventListener('input', inputHandler)
   return input
}
