'use strict'

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
      console.log(config)
      const h3 = document.createElement('h3')
      h3.textContent = config.text

      const button = document.createElement('button')
      button.textContent = 'Weiter'
      button.addEventListener('click', _ => {
         const state = {}
         state[config.key] = input.value
         console.log(state, page.setState)
         page.setState(state)
         // TODO: fix
         // .then(_ => goto('success'))
         // .catch(_ => goto('error'))
         goto('success')
      })

      const input = document.createElement('input')
      input.type = 'range'
      input.max = config.max
      input.min = config.min
      input.value = config.value
      input.step = config.step

      this.shadowRoot.appendChild(h3)
      this.shadowRoot.appendChild(input)
      this.shadowRoot.appendChild(button)
   }
}

customElements.define('carbon-slider', Slider)
