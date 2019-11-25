'use strict'

import h3 from '../nodes/h3'
import input from '../nodes/input'
import span from '../nodes/span'
import button from '../nodes/button'

const template = document.createElement('template')

template.innerHTML = `
<style>  
:host { 
  width: 100%;
  max-width: 330px;
  padding: 20px;
  margin: 20px auto; 
  display: block; 
  font-family: var(--font-family);
  font-size: var(--font-size);
  box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.1);
  color: var(--font-color);
  border-radius: 20px;
}

h3 {
   font-size: var(--font-size);
   margin: 0;
}

input[type="range"] {
   width: 90%;
   margin: 20px 0;
   display: block;
   margin-bottom: 20px;
}

span {
   display: block;
}

* { box-sizing: border-box; }

button {
   border: 0;
   border-radius: 5px;
   padding: 9px 25px;
   margin-right: 16px;
   margin-top: 16px;
   font-weight: bold;
   font-size: var(--font-size);
   cursor: pointer;
   line-height: 1.2;
   background-color: white;
   box-shadow: 0px 0px 3px 0px #c1c1c1;
}
</style>`

export default class Slider extends HTMLElement {
   constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
   }

   init(goto, config, page) {
      const onConfirmation = function() {
         const state = {}
         state[config.key] = slider.value
         page.setState(state)
         // TODO: fix
         // .then(_ => goto('success'))
         // .catch(_ => goto('error'))
         goto('success')
      }

      const onSliderInput = function(e) {
         currentVal.textContent = `${e.target.value} ${config.unit || ''}`
      }

      const attrs = {
         type: 'range',
         max: config.max,
         min: config.min,
         step: config.step,
         value: config.value
      }

      const slider = input(attrs, onSliderInput)
      const currentVal = span(`${config.value} ${config.unit || ''}`)
      this.shadowRoot.appendChild(h3(config.text))
      this.shadowRoot.appendChild(slider)
      this.shadowRoot.appendChild(currentVal)
      this.shadowRoot.appendChild(button('', 'Weiter', onConfirmation))
   }
}

customElements.define('carbon-slider', Slider)
