# Valhalla Shisha · Web demo con motor de reservas
Abre `index.html` en el navegador (no requiere servidor ni instalación).

## Personalizar
Todos los datos están en `js/config.js`: dirección, teléfono, WhatsApp, horarios, zonas/aforos, carta y PIN.

## Motor de reservas
Fecha → personas → zona → hora (solo huecos con plaza real, mesa de 2 h) → datos → código VH-XXXXX, WhatsApp y .ics.
Panel de gestión: `index.html#admin` (PIN en config.js): filtrar por día, cancelar, alta manual y exportar CSV.

## Importante
La demo guarda las reservas en el navegador (localStorage). Para producción hace falta un backend (Supabase, Firebase o similar) y cambiar el PIN.
