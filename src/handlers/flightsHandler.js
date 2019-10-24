import { FLIGHT_CO2_CONSUMPTION } from '../data/flights'
import { getFlights } from '../datastore'

export default function(state, onUpdate) {
   const res = getFlights().reduce((sum, flight) => {
      return sum + flight.km * FLIGHT_CO2_CONSUMPTION
   }, 0)

   onUpdate('flights', res)
}
