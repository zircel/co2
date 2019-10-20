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
               return div('', span('Zürich -->'), span(f.name))
            })
         ),
         button('', 'Abschliessen', goto.bind(null, 'finished')),
         button('', 'Weiteren Flug Erfassen', goto.bind(null, 'addanother'))
      )

      this.shadowRoot.appendChild(wrapper)
   }
}

customElements.define('carbon-flight-list', FlightList)
