import { getDistribution } from '../datastore'
import {
   CARB_CO2_PER_PORTION,
   CARBS_PORTION_SIZE,
   DAIRY_CO2_PER_PORTION,
   VEGGIE_PORTION_SIZE,
   meats,
   veggies
} from '../data/foods'

export default function(state, onUpdate) {
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

const getCo2ForFood = function(food, portions, portionSize) {
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
