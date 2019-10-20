'use strict'

import { flights } from '../data/flights'
import { addFlight } from '../datastore'

import div from '../nodes/div'
import button from '../nodes/button'
import input from '../nodes/input'
import span from '../nodes/span'
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

   init(goto) {
      const retour = input({ type: 'checkbox', checked: true })
      const to = document.createElement('select')

      Array.from(flights.values()).forEach(f => {
         const option = document.createElement('option')
         option.value = f.abbr
         option.textContent = f.name
         to.appendChild(option)
      })

      const onConfirm = function() {
         addFlight(to.value)
         goto('success')
      }

      const wrapper = div(
         '',
         h3('Flug eintragen'),
         div('', label(span('Zürich'), 'From'), span('-->'), label(to, 'To')),
         label(retour, 'Retour'),
         button('', 'Eintragen', onConfirm)
      )

      this.shadowRoot.appendChild(wrapper)
   }
}

customElements.define('carbon-flight-input', FlightInput)
