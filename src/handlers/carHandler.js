import {
   CAR_EMISSION_DIESEL,
   CAR_EMISSION_ELECTRO,
   CAR_EMISSION_FUEL
} from '../data/cars'

export default function(state, onUpdate) {
   onUpdate = onUpdate.bind(null, 'car')

   if (state.nocar) {
      return onUpdate(0)
   }

   if (state.distanceCar) {
      const distanceCar = Number.parseInt(state.distanceCar)
      const passengersCar = Number.parseInt(state.passengersCar) || 1

      if (state.isElectro) {
         console.log(
            'elektro',
            (distanceCar * CAR_EMISSION_ELECTRO) / (1000 * passengersCar)
         )
         return onUpdate(
            (distanceCar * CAR_EMISSION_ELECTRO) / (1000 * passengersCar)
         )
      }

      const fuelConsumption = Number.parseInt(state.fuelConsumption)
      const emission = state.isDiesel ? CAR_EMISSION_DIESEL : CAR_EMISSION_FUEL
      console.log(
         'benzin',
         passengersCar,
         (distanceCar * emission * fuelConsumption) / (100 * passengersCar)
      )
      onUpdate(
         (distanceCar * emission * fuelConsumption) / (100 * passengersCar)
      )
   }
}
