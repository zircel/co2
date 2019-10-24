import {
   CAR_EMISSION_DIESEL,
   CAR_EMISSION_ELECTRO,
   CAR_EMISSION_FUEL,
   CAR_LIFETIME,
   CAR_PRODODUCTION_EMISSION_ICE,
   CAR_PRODUCTION_EMISSION_ELECTRO
} from '../data/cars'

export default function(state, onUpdate) {
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
