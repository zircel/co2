import { flights as flightMap } from './data/flights'
import housingMap from './data/housing'
import {
   CARB_CO2_PER_PORTION,
   CARBS_PORTION_SIZE,
   DAIRY_CO2_PER_PORTION,
   VEGGIE_PORTION_SIZE,
   meats,
   veggies
} from './data/foods'

const flights = []

const distributions = new Map()

export function addFlight(abbr) {
   flights.push(flightMap.get(abbr))
}

export function getFlights() {
   return flights
}

export function getHeatingFactor(key) {
   console.log(housingMap, key)
   return housingMap.get(key).factor
}

export function addDistribution(key, names, values) {
   const total = values.reduce((s, v) => s + v, 0)
   const distribution = new Map()
   names.forEach((n, i) => distribution.set(n, values[i] / total))
   distributions.set(key, distribution)
}

export function getDistribution(key) {
   return distributions.get(key)
}

export function getCo2ForFood(food, portions, portionSize) {
   if (food == 'veggies') {
      const yearlyKg = (portions * 365 * VEGGIE_PORTION_SIZE) / 1000
      const dist = Array.from(getDistribution('location').entries())
      return dist.reduce((sum, e) => {
         const [loc, share] = e
         return sum + (share * veggies.get(loc) * yearlyKg) / 1000
      }, 0)
   } else if (food == 'meat') {
      if (!getDistribution('meat')) {
         return 0
      }

      const mdist = Array.from(getDistribution('meat').entries())
      const ldist = Array.from(getDistribution('location').entries())
      // sum up different types of meat
      return mdist.reduce((sum, e) => {
         const [meat, mshare] = e
         const yearlyKg = (portions * 52 * portionSize) / 1000
         // sum up differnt locations of origin
         const co2 = ldist.reduce((sum, e) => {
            const [loc, lshare] = e
            const meatCo2 = meats.get(meat).get(loc)
            return sum + (lshare * meatCo2 * yearlyKg) / 1000
         }, 0)
         return sum + mshare * co2
      }, 0)
   } else if (food == 'carbs') {
      return (CARB_CO2_PER_PORTION * CARBS_PORTION_SIZE * portions) / 1000
   } else if (food == 'dairy') {
      return (DAIRY_CO2_PER_PORTION * portions) / 1000
   }
}
