import { flights as flightMap } from './data/flights'
import housingMap from './data/housing'

const flights = []
const distributions = new Map()

export function addFlight(abbr) {
   flights.push(flightMap.get(abbr))
}

export function getFlights() {
   return flights
}

export function getHeatingFactor(key) {
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
