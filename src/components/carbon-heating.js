'use strict'

import housing from '../data/housing'

import div from '../nodes/div'
import button from '../nodes/button'

import label from '../nodes/label'
import h3 from '../nodes/h3'

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

export default class FlightInput extends HTMLElement {
   constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
   }

   init(goto, config, page) {
      const heatingInput = document.createElement('select')

      Array.from(housing.entries()).forEach(e => {
         const [key, value] = e
         const option = document.createElement('option')
         option.value = key
         option.textContent = value.name

         heatingInput.appendChild(option)
      })

      const onConfirm = function() {
         const state = {}
         console.log(config.key)
         state[config.key] = heatingInput.value
         page.setState(state)
         goto('success')
      }

      const wrapper = div(
         '',
         h3(config.text),
         label(heatingInput, 'Heizungstyp'),
         button('', 'Bestätigen', onConfirm)
      )

      this.shadowRoot.appendChild(wrapper)
   }
}

customElements.define('carbon-heating', FlightInput)
