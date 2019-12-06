import './style.css'

import Slider from './components/carbon-slider'
import FlightInput from './components/carbon-flight-input'
import FlightList from './components/carbon-flight-list'
import Heating from './components/carbon-heating'
import FoodDistribution from './components/carbon-food-distribution'

import DEFAULTS from './data/defaults'

import flightsHandler from './handlers/flightsHandler'
// import trainHandler from './handlers/trainHandler'
import carHandler from './handlers/carHandler'
import foodHandler from './handlers/foodHandler'
import housingHandler from './handlers/housingHandler'

const selectionPanel = document.querySelector('#selection-panel')
const treePanel = document.querySelector('#tree-panel')
const treePanelInner = document.querySelector('#tree-panel > .inner')
const notification = document.querySelector('#notification')
const carbonBar = document.querySelector('#co2-bar')
const visualization = document.querySelector('#visualization')
const treePanelCloseButton = document.querySelector('#tree-panel button.close')
const faqButton = document.querySelector('button#faq-button')
const faqPanel = document.querySelector('#faq-panel')
const faqCloseButton = document.querySelector('#faq-panel button.close')
const vizCloseButton = document.querySelector('#visualization button.close')
const vizButton = document.querySelector('button#viz-button')
const body = document.querySelector('body')

carbonBar.addEventListener('click', _ => {
   visualization.classList.add('show')
})

vizCloseButton.addEventListener('click', _ =>
   visualization.classList.remove('show')
)

vizButton.addEventListener('click', _ => showVisualization())

faqButton.addEventListener('click', _ => {
   faqPanel.classList.add('show')
   body.style.overflow = 'hidden'
})

faqCloseButton.addEventListener('click', _ => {
   body.style.overflow = 'auto'
   faqPanel.classList.remove('show')
})

treePanelCloseButton.addEventListener('click', _ => {
   removeNodes(...treePanelInner.children)
   treePanel.classList.add('hidden')
   selectionPanel.classList.remove('hidden')
   carbonBar.classList.remove('hidden')
})

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
            triggers: ['z_termination'],
            handler: carHandler
         }
         // {
         //    name: 'Zug',
         //    triggers: ['z_termination'],
         //    handler: trainHandler
         // }
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
      carbonBar.classList.add('hidden')

      // Configuration
      const page = document.createElement('zircel-page')
      page.pid = '5d1f11c8e5f98d40feaca0bb'
      page.path = cat.tree
      // TODO: mit reset state mache
      page.state = {
         nocar: false,
         isElectro: false,
         isDiesel: false,
         isPetrol: false,
         distanceCar: ''
      }
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

         // remove result visualization button in case it is already rendered
         // but the user decides to change a setting
         vizButton.classList.remove('show')

         cat.keypoints.forEach(kp => {
            const onUpdate = function(key, val) {
               results.set(key, val)
               const difference = DEFAULTS.get(key) - val
               showNotification(difference)
               updateBar(results, DEFAULTS)
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
            vizButton.classList.add('show')
         }
      })

      page.init().catch(err => console.error(err))
      treePanelInner.appendChild(page)
   })
})

const showVisualization = function() {
   removeNodes(...treePanelInner.children)
   treePanel.classList.add('hidden')
   selectionPanel.classList.remove('hidden')
   visualization.classList.add('show')
   vizButton.classList.remove('show')
   updateVisualization(results, DEFAULTS)
}

const showNotification = function(difference) {
   // shows the notification to the user
   notification.classList.add('show')

   // removes the notification from the view after 2 seconds
   setTimeout(() => {
      notification.classList.remove('show')
   }, 2500)

   if (difference > 0) {
      // better than average
      notification.classList.remove('worse')
      notification.classList.add('better')
      notification.innerHTML = `Du verbrauchst ${Math.abs(
         roundedTonns(difference)
      )} Tonnen weniger CO<sub>2</sub> als der 🇨🇭 Durchschnitt.`
   } else {
      notification.classList.remove('better')
      notification.classList.add('worse')
      notification.innerHTML = `Du verbrauchst ${Math.abs(
         roundedTonns(difference)
      )} Tonnen mehr CO<sub>2</sub> als der 🇨🇭 Durchschnitt.`
   }
}

const updateBar = function(results, defaults) {
   const sum = makeSum(results)
   const avgSum = makeSum(defaults)
   const tonns = roundedTonns(makeSum(results))
   if (sum === avgSum) {
      carbonBar.innerHTML = `🇨🇭 Durchschnitt: ${tonns} Tonnen CO<sub>2</sub> pro Jahr`
   } else {
      carbonBar.innerHTML = `Dein Verbrauch: ${tonns} Tonnen CO<sub>2</sub> pro Jahr`
   }
}

const roundedTonns = val => Number((val / 1000).toFixed(2))

const makeSum = function(map) {
   return Array.from(map.values()).reduce((s, v) => s + v, 0)
}

const updateVisualization = function(results, defaults) {
   const totalWidth = Math.min(500, document.documentElement.clientWidth - 40)
   const personalSum = makeSum(results)
   const avgSum = makeSum(defaults)
   const personalWidth =
      personalSum > avgSum ? totalWidth : (personalSum / avgSum) * totalWidth
   const avgWidth =
      avgSum > personalSum ? totalWidth : (avgSum / personalSum) * totalWidth

   const circles = visualization.querySelector('.circles')
   circles.style.width = `${totalWidth}px`
   circles.style.height = `${totalWidth}px`

   const you = visualization.querySelector('.circle.you')
   you.style.width = `${personalWidth}px`
   you.style.height = `${personalWidth}px`

   const youSpan = visualization.querySelector('.circle.you span')
   youSpan.textContent = `YOU = ${roundedTonns(personalSum)}t`

   const avg = visualization.querySelector('.circle.avg')
   avg.style.width = `${avgWidth}px`
   avg.style.height = `${avgWidth}px`

   const avgSpan = visualization.querySelector('.circle.avg span')
   avgSpan.textContent = `AVG = ${roundedTonns(avgSum)}t`

   const summary = visualization.querySelector('.summary')

   if (avgSum == personalSum) {
      summary.innerHTML = `Dein jährlicher CO<sub>2</sub> Ausstoss beträgt etwa 
      ${roundedTonns(
         personalSum
      )} Tonnen. Du bist damit gleich gut wie der 🇨🇭 Durchschnitt.`
   } else if (avgSum > personalSum) {
      const p = Math.round(((avgSum - personalSum) / personalSum) * 100)
      summary.innerHTML = `Dein jährlicher CO<sub>2</sub> Ausstoss beträgt etwa 
      ${roundedTonns(
         personalSum
      )} Tonnen. Du bist damit ${p}% besser als der 🇨🇭 Durchschnitt.`
   } else {
      const p = Math.round(((personalSum - avgSum) / avgSum) * 100)
      summary.innerHTML = `Dein jährlicher CO<sub>2</sub> Ausstoss beträgt etwa 
      ${roundedTonns(
         personalSum
      )} Tonnen. Du bist damit ${p}% schlechter als der 🇨🇭 Durchschnitt.`
   }

   const max = Array.from(results.values()).reduce(
      (max, c) => (max > c ? max : c),
      0
   )

   const dstyle = document.documentElement.style

   const foodRes = results.get('food')
   const housingRes = results.get('housing')
   const flightsRes = results.get('flights')
   const commuteRes = results.get('car') + results.get('train')

   dstyle.setProperty('--food-share', `${(foodRes / max) * 100}%`)
   dstyle.setProperty('--housing-share', `${(housingRes / max) * 100}%`)
   dstyle.setProperty('--commute-share', `${(commuteRes / max) * 100}%`)
   dstyle.setProperty('--flights-share', `${(flightsRes / max) * 100}%`)

   // gradient tick positions
   const foodTick = (100 * foodRes) / personalSum
   const housingTick = foodTick + (100 * housingRes) / personalSum
   const commuteTick = housingTick + (100 * commuteRes) / personalSum
   const flightsTick = commuteTick + (100 * flightsRes) / personalSum

   const ticks = [`var(--food-color) ${-10 + foodTick}%`]

   // those if statements filter out ticks which are too close to their neighbours
   if (foodTick + 2 < housingTick) {
      ticks.push(`var(--housing-color) ${-10 + housingTick}%`)
   }

   if (housingTick + 2 < commuteTick) {
      ticks.push(`var(--commute-color) ${-10 + commuteTick}%`)
   }

   if (commuteTick + 2 < flightsTick) {
      ticks.push(`var(--flights-color) ${-10 + flightsTick}%`)
   }

   you.style.background = `linear-gradient(90deg, ${ticks.join(', ')})`

   // console.log(results)
   // console.log(defaults)
   // console.log(ticks)
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
updateBar(results, DEFAULTS)
updateVisualization(results, DEFAULTS)
