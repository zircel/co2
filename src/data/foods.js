// co2 in g per kg except for 'Milchprodukte' and 'Kohlenhydrate' (g per portion)
// Quelle, Konsumwerte: https://www.bfs.admin.ch/bfsstatic/dam/assets/5866399/master
// Quelle, Konsumwerte: fi-menuch-*.pdf *={Fleisch, Früchte, etc}

export const CARB_CO2_PER_PORTION = 82.55
export const DAIRY_CO2_PER_PORTION = 337.55
export const VEGGIE_PORTION_SIZE = 120
export const CARBS_PORTION_SIZE = 100

export const meats = new Map([
   [
      'Schwein',
      new Map([
         ['Schweiz', 3230],
         ['Europa', 3460],
         // Schiff + Flugzeug je 50%
         ['Übersee', (3570 + 14000) / 2]
      ])
   ],
   [
      'Poulet',
      new Map([
         ['Schweiz', 3730],
         ['Europa', 3960],
         // Schiff + Flugzeug je 50%
         ['Übersee', (4070 + 14500) / 2]
      ])
   ],
   [
      'Rind',
      new Map([
         ['Schweiz', 13730],
         ['Europa', 13960],
         // Schiff + Flugzeug je 50%
         ['Übersee', (14070 + 24500) / 2]
      ])
   ]
])

export const veggies = new Map([
   ['Schweiz', 530],
   ['Europa', 760],
   // Schiff + Flugzeug je 50%
   ['Übersee', (870 + 11300) / 2]
])
