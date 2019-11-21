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
  padding: 20px;
  margin: 20px auto; 
  display: block; 
  font-family: var(--font-family);
  font-size: var(--font-size);
  box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.1);
  color: var(--font-color);
  border-radius: 20px;
}

* { box-sizing: border-box; }


h3 {
   font-size: var(--font-size);
   margin-bottom: 20px;
}

span {
   display: block;
}

label {
   margin: 5px 0;
   font-weight: bold;
   display: flex;
   align-items: center;
}

label span, label input, label select {
   display: inline;
   font-weight: normal;
   margin-left: 4px;
}

button {
   border: 0;
   border-radius: 5px;
   padding: 9px 25px;
   margin-right: 16px;
   margin-top: 16px;
   font-weight: bold;
   font-size: var(--font-size);
   line-height: 1.2;
   cursor: pointer;
   background-color: white;
   box-shadow: 0px 0px 3px 0px #c1c1c1;
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
         addFlight(to.value, retour.checked)
         goto('success')
      }

      const wrapper = div(
         '',
         h3('Flug eintragen'),
         div('', label(span('Zürich'), 'From:'), label(to, 'To:')),
         label(retour, 'Retour:'),
         button('', 'Weiter', onConfirm)
      )

      this.shadowRoot.appendChild(wrapper)
   }
}

customElements.define('carbon-flight-input', FlightInput)
