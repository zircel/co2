import { getHeatingFactor } from '../datastore'

export default function(state, onUpdate) {
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
