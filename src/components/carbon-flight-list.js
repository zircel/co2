'use strict'

import { getFlights } from '../datastore'

import div from '../nodes/div'
import button from '../nodes/button'
import span from '../nodes/span'
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

.list span {
   display: inline;
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

export default class FlightList extends HTMLElement {
   constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
   }

   init(goto) {
      const wrapper = div(
         '',
         h3('Deine Flüge'),
         div(
            'list',
            ...getFlights().map(f => {
               return div('', span('Zürich ✈️ '), span(f.name))
            })
         ),
         button('', 'Weiteren Flug Erfassen', goto.bind(null, 'addanother')),
         button('', 'Fertig', goto.bind(null, 'finished'))
      )

      this.shadowRoot.appendChild(wrapper)
   }
}

customElements.define('carbon-flight-list', FlightList)
