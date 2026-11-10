/* Datos públicos localizados en fuentes del establecimiento y directorios locales.
   Carta y aforos exactos: pendientes de confirmación directa. */
const CONFIG = {
  name: "Valhalla Rivas",
  city: "Rivas-Vaciamadrid, Madrid",
  address: "Av. Aurelio Álvarez, 4, Local 15, 28521",
  phone: "+34 655 80 64 53",
  whatsapp: "34655806453",
  instagram: "https://www.instagram.com/valhallarivas/",
  email: "valhallarivas@hotmail.com",
  mapQuery: "Valhalla Rivas, Av. Aurelio Álvarez 4 Local 15, Rivas-Vaciamadrid",
  adminPin: "1234", // Demo: cambiar y proteger con backend antes de producción
  maxParty: 14, stayMinutes: 120, slotStep: 30, daysAhead: 60,
  // Horario publicado en la ficha de Google; confirmar festivos y cambios estacionales.
  hours: { 0:[19,25], 1:[19,25], 2:[19,25], 3:[19,25], 4:[19,25], 5:[19,25], 6:[19,25] },
  // Las capacidades son provisionales para la demo; el local debe confirmar aforos.
  zones: [
    { id:"sala", name:"Sala lounge", seats:999, desc:"Interior con sofás y ventanales circulares." },
    { id:"terraza", name:"Terraza", seats:999, desc:"Espacio exterior a pie de calle." },
    { id:"vip", name:"Terraza superior", seats:999, desc:"Terraza de la planta superior, cubierta y climatizada en invierno." }
  ],
  menu: {
    "Cachimbas": [
      ["Cachimbas de sabores","Selección de sabores disponibles en el local","Desde 15 €*"]
    ],
    "Cócteles y copas": [
      ["Cócteles","Coctelería y combinados","Consultar"],
      ["Mojitos","Disponibilidad según carta del día","Consultar"]
    ],
    "Batidos y smoothies": [
      ["Milkshake de Lotus","Uno de los batidos destacados en sus publicaciones","Consultar"],
      ["Smoothie de frutos rojos","Publicado por el establecimiento","Consultar"],
      ["Smoothie de piña y mango","Publicado por el establecimiento","Consultar"]
    ],
    "Tés": [
      ["Tés e infusiones","Una opción para acompañar la experiencia","Consultar"]
    ]
  }
};