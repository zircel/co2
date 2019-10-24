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
        border: 1px solid #eee;
        padding: 20px;
        margin: 20px auto; 
        display: block; 
        font-family: Helvetica Neue, Helvetica;
      }

      * { box-sizing: border-box; }

      p {
         margin: 0 0 10px 0;
         color: #545454;
         font-size: 17px;
      }

      button {
         margin-right: 10px; 
         border: 1px solid #ccc;
         padding: 5px 10px;
         border-radius: 5px;
         font-size: 15px;
         cursor: pointer;
         display: block
      }
    </style>`

export default class Slider extends HTMLElement {
   constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
   }

   init(goto, config, page) {
      const onConfirmation = function(e) {
         const state = {}
         state[config.key] = e.target.value
         page.setState(state)
         // TODO: fix
         // .then(_ => goto('success'))
         // .catch(_ => goto('error'))
         goto('success')
      }

      const onSliderInput = function(e) {
         currentVal.textContent = e.target.value + (config.unit || '')
      }

      const attrs = {
         type: 'range',
         max: config.max,
         min: config.min,
         step: config.step,
         value: config.value
      }
      const currentVal = span(config.value + (config.unit || ''))
      this.shadowRoot.appendChild(h3(config.text))
      this.shadowRoot.appendChild(input(attrs, onSliderInput))
      this.shadowRoot.appendChild(currentVal)
      this.shadowRoot.appendChild(button('', 'Weiter', onConfirmation))
   }
}

customElements.define('carbon-slider', Slider)
