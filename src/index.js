import './style.css'

import Slider from './components/carbon-slider'
import FlightInput from './components/carbon-flight-input'
import FlightList from './components/carbon-flight-list'
import Heating from './components/carbon-heating'
import FoodDistribution from './components/carbon-food-distribution'

import { getFlights, getHeatingFactor, getCo2ForFood } from './datastore'
import { FLIGHT_CO2_CONSUMPTION } from './data/flights'
import {
   CAR_EMISSION_DIESEL,
   CAR_EMISSION_ELECTRO,
   CAR_EMISSION_FUEL,
   CAR_LIFETIME,
   CAR_PRODODUCTION_EMISSION_ICE,
   CAR_PRODUCTION_EMISSION_ELECTRO
} from './data/cars'
import button from './nodes/button'

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

const flightsHandler = function(state, onUpdate) {
   const res = getFlights().reduce((sum, flight) => {
      return sum + flight.km * FLIGHT_CO2_CONSUMPTION
   }, 0)

   onUpdate('flights', res)
}

const trainHandler = function(state, onUpdate) {
   // TODO:
}

const carHandler = function(state, onUpdate) {
   onUpdate = onUpdate.bind(null, 'car')

   if (state.nocar) {
      return onUpdate(0)
   }

   if (state.distanceCar) {
      const distanceCar = Number.parseInt(state.distanceCar)
      const passengersCar = Number.parseInt(state.passengersCar) || 1
      const yearsDriving = CAR_LIFETIME / distanceCar

      if (state.electro) {
         const electroConsumption = Number.parseInt(state.electroConsumption)

         return onUpdate(
            (distanceCar * electroConsumption * CAR_EMISSION_ELECTRO) /
               (100 * passengersCar) +
               CAR_PRODUCTION_EMISSION_ELECTRO / yearsDriving
         )
      }

      const fuelConsumption = Number.parseInt(state.fuelConsumption)
      const emission = state.diesel ? CAR_EMISSION_DIESEL : CAR_EMISSION_FUEL
      onUpdate(
         (distanceCar * emission * fuelConsumption) / (100 * passengersCar) +
            CAR_PRODODUCTION_EMISSION_ICE / yearsDriving
      )
   }
}

const housingHandler = function(state, onUpdate) {
   console.log(state)
   // power [kWh/m^2]
   let power = 0
   // sizeHousing [m^2]
   const sizeHousing = Number.parseInt(state.sizeHousing)
   // heatingHouse --> heating type
   const heatingFactor = getHeatingFactor(state.heatingHousing)
   // number of people living in the same house/apartment
   const peopleHousing = Number.parseInt(state.peopleHousing)

   if (state.oldHousing) {
      power = 200
   } else if (state.newHousing) {
      power = 100
   } else if (state.minergieHousing) {
      power = 40
   }

   // console.log({ sizeHousing, peopleHousing, heatingFactor })
   onUpdate('housing', (sizeHousing * power * heatingFactor) / peopleHousing)
}

const foodHandler = function(state, onUpdate) {
   // per week
   const meatPortions = Number.parseInt(state.meatPortions)
   // in gram
   const meatPortionSize = Number.parseInt(state.meatPortionSize)
   // per day
   const veggiePortions = Number.parseInt(state.veggiePortions)
   const carbsPortions = Number.parseInt(state.carbsPortions)
   const dairyPortions = Number.parseInt(state.dairyPortions)
   // not used yet
   const noSaisonality = state.noSaisonality

   const vegCo2 = getCo2ForFood('veggies', veggiePortions)
   const meatCo2 = getCo2ForFood('meat', meatPortions, meatPortionSize)
   const carbsCo2 = getCo2ForFood('carbs', carbsPortions)
   const dairyCo2 = getCo2ForFood('dairy', dairyPortions)

   onUpdate('food', vegCo2 + meatCo2 + carbsCo2 + dairyCo2)
}

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
         console.log({ node, state })

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
                  kp.handler(e.detail.state, onUpdate)
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
   const closeBtn = document.createElement('button')
   closeBtn.textContent = 'Schliessen'
   closeBtn.addEventListener('click', _ => {
      visualization.classList.remove('show')
   })

   console.log(avgSum, personalSum)
   const n = document.createElement('div')
   n.classList.add('circle')
   n.style.width = `${personalSum / 8}px`
   n.style.height = `${personalSum / 8}px`
   visualization.append(n)

   const m = document.createElement('div')
   m.classList.add('circle', 'avg')
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
