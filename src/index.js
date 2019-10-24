import './style.css'

import Slider from './components/carbon-slider'
import FlightInput from './components/carbon-flight-input'
import FlightList from './components/carbon-flight-list'
import Heating from './components/carbon-heating'
import FoodDistribution from './components/carbon-food-distribution'

import flightsHandler from './handlers/flightsHandler'
import trainHandler from './handlers/trainHandler'
import carHandler from './handlers/carHandler'
import foodHandler from './handlers/foodHandler'
import housingHandler from './handlers/housingHandler'

import button from './nodes/button'
import div from './nodes/div'

const selectionPanel = document.querySelector('#selection-panel')
const treePanel = document.querySelector('#tree-panel')
const treePanelInner = document.querySelector('#tree-panel > .inner')
const notification = document.querySelector('#notification')
const carbonBar = document.querySelector('#co2-bar')
const visualization = document.querySelector('#visualization')
const backButton = document.querySelector('button#back')

carbonBar.addEventListener('click', _ => {
   visualization.classList.add('show')
})

backButton.addEventListener('click', _ => {
   removeNodes(...treePanelInner.children)
   treePanel.classList.add('hidden')
   selectionPanel.classList.remove('hidden')
})

// TODO: defaults stimmen nicht
const DEFAULTS = new Map([
   ['car', 1200],
   ['train', 200],
   ['flights', 1500],
   ['housing', 2000],
   ['food', 2000]
])
const results = new Map(DEFAULTS)

const categories = [
   {
      id: '#food',
      tree: '/food',
      keypoints: [
         {
            name: 'Ernährung',
            triggers: ['z_termination'],
            handler: foodHandler
         }
      ]
   },
   {
      id: '#housing',
      tree: '/housing',
      keypoints: [
         {
            name: 'Wohnen',
            triggers: ['z_termination'],
            handler: housingHandler
         }
      ]
   },
   {
      id: '#commute',
      tree: '/commute',
      keypoints: [
         {
            name: 'Auto',
            triggers: ['text-326f-4e7e-8da8'],
            handler: carHandler
         },
         {
            name: 'Zug',
            triggers: ['z_termination'],
            handler: trainHandler
         }
      ]
   },
   {
      id: '#flights',
      tree: '/flights',
      keypoints: [
         {
            name: 'Fliegen',
            triggers: ['z_termination'],
            handler: flightsHandler
         }
      ]
   }
]

categories.forEach(cat => {
   const anchor = document.querySelector(cat.id)

   anchor.addEventListener('click', _ => {
      treePanel.classList.remove('hidden')
      selectionPanel.classList.add('hidden')

      // Configuration
      const page = document.createElement('zircel-page')
      page.pid = '5d1f11c8e5f98d40feaca0bb'
      page.path = cat.tree
      // TODO: mit reset state mache
      page.state = { nocar: false, distanceCar: '' }
      page.scrolling = 'document'

      page.register('carbon-slider', Slider)
      page.register('carbon-flight-input', FlightInput)
      page.register('carbon-flight-list', FlightList)
      page.register('carbon-heating', Heating)
      page.register('carbon-food-distribution', FoodDistribution)

      page.mode = process.env.NODE_ENV || 'development'
      page.addEventListener('zircel-update', e => {
         const node = e.detail.node
         const state = e.detail.state

         cat.keypoints.forEach(kp => {
            const onUpdate = function(key, val) {
               results.set(key, val)
               console.log('recalculation triggered', key, { results })
               const difference = DEFAULTS.get(key) - val
               showNotification(difference)
               updateBar()
               updateVisualization()
            }

            for (let t of kp.triggers) {
               if (node.id.includes(t)) {
                  kp.handler(state, onUpdate)
                  return
               }
            }
         })

         if (node.type === 'z_termination') {
            anchor.classList.add('done')
            treePanelInner.appendChild(
               button('viz-button', 'Deine Werte', _ => {
                  removeNodes(...treePanelInner.children)
                  treePanel.classList.add('hidden')
                  selectionPanel.classList.remove('hidden')
                  visualization.classList.add('show')
               })
            )
         }
      })

      page.init().catch(err => console.error(err))
      treePanelInner.appendChild(page)
   })
})

const showNotification = function(difference) {
   // shows the notification to the user
   notification.classList.add('show')

   // removes the notification from the view after 2 seconds
   setTimeout(() => {
      notification.classList.remove('show')
   }, 2000)

   if (difference > 0) {
      // better than average
      notification.classList.remove('worse')
      notification.classList.add('better')
      notification.textContent = `Du brauchst ${difference} kg weniger im Vergleich mit dem Durchschnittsschweizer.`
   } else {
      notification.classList.remove('better')
      notification.classList.add('worse')
      notification.textContent = `Du brauchst ${difference} kg mehr als der Durchschnittsschweizer.`
   }
}

const updateBar = function() {
   const sum = makeSum(results)
   carbonBar.textContent = `${sum} kg CO2 / Jahr`
}

const makeSum = function(map) {
   return Array.from(map.values()).reduce((s, v) => s + v, 0)
}

const updateVisualization = function() {
   removeNodes(...visualization.children)

   const personalSum = makeSum(results)
   const avgSum = makeSum(DEFAULTS)
   console.log(avgSum, personalSum)

   const closeBtn = button('', 'Schliessen', _ => {
      visualization.classList.remove('show')
   })

   const n = div('circle')
   n.style.width = `${personalSum / 8}px`
   n.style.height = `${personalSum / 8}px`
   visualization.append(n)

   const m = div('circle')
   m.classList.add('avg')
   m.style.width = `${avgSum / 8}px`
   m.style.height = `${avgSum / 8}px`
   visualization.append(m)

   // Array.from(results.entries()).forEach(e => {
   //    const [key, val] = e
   // })

   visualization.appendChild(closeBtn)
}

const removeNodes = function(...nodes) {
   nodes.forEach(n => {
      // regular nodes
      if (n && n.parentElement) n.parentElement.removeChild(n)
      // for nodes that are attachted to a shadowRoot
      if (n && n.parentNode) n.parentNode.removeChild(n)
   })
}

// initial render with default values
updateBar()
updateVisualization()
