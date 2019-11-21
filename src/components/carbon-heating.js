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

select {
   width: 100%;
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
         state[config.key] = heatingInput.value
         page.setState(state)
         goto('success')
      }

      const wrapper = div(
         '',
         h3(config.text),
         heatingInput,
         button('', 'Bestätigen', onConfirm)
      )

      this.shadowRoot.appendChild(wrapper)
   }
}

customElements.define('carbon-heating', FlightInput)
