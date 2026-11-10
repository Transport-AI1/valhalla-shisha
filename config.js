/* ===== CONFIGURACIÓN — edita aquí los datos reales del local ===== */
const CONFIG = {
  name: "Valhalla Shisha",
  city: "Rivas-Vaciamadrid, Madrid",
  address: "[Dirección del local]",          // TODO: completar
  phone: "[+34 000 000 000]",                // TODO: completar
  whatsapp: "34000000000",                   // solo números con prefijo país
  instagram: "",                             // ej: https://instagram.com/valhallashisha
  mapQuery: "Valhalla Shisha Rivas-Vaciamadrid",
  adminPin: "1234",                          // cambiar antes de producción
  maxParty: 14, stayMinutes: 120, slotStep: 30, daysAhead: 60,
  // Horario DEMO (0=domingo ... 6=sábado). Cierre >24 = madrugada del día siguiente
  hours: { 0:[17,25], 1:[17,25], 2:[17,25], 3:[17,25], 4:[17,25], 5:[17,27], 6:[17,27] },
  zones: [
    { id:"sala",    name:"Sala Lounge",     seats:30, desc:"Sofás y mesas bajas, ambiente tenue." },
    { id:"terraza", name:"Terraza",         seats:20, desc:"Al aire libre, ideal en noches templadas." },
    { id:"vip",     name:"Reservado Odín",  seats:10, desc:"Zona privada para grupos y celebraciones." }
  ],
  // Carta DEMO: precios orientativos, sustituir por los reales
  menu: {
    "Cachimbas": [
      ["Cachimba clásica","Sabor a elegir, mezcla de la casa","—"],
      ["Cachimba premium","Tabaco premium y base de fruta","—"],
      ["Cachimba en fruta","Servida en piña, sandía o pomelo","—"],
      ["Cachimba sin nicotina","Alternativa herbal","—"]
    ],
    "Sabores": [
      ["Frutales","Sandía, melocotón, mango, uva, limón","—"],
      ["Mentolados","Menta, hielo, sandía-menta","—"],
      ["Dulces","Vainilla, chicle, tarta de manzana","—"],
      ["Mezclas de la casa","Combinaciones exclusivas Valhalla","—"]
    ],
    "Bebidas": [
      ["Tés e infusiones","Té moruno, té verde, infusiones","—"],
      ["Refrescos y zumos","Selección habitual","—"],
      ["Granizados y batidos","Fríos y sin alcohol","—"],
      ["Cócteles","Consultar disponibilidad","—"]
    ]
  }
};
