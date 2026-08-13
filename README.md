# ReFit Studio

Demo de tienda de ropa de segunda mano (vintage, streetwear, casual) hecha en HTML/CSS/JS vanilla, sin dependencias externas.

## Funcionalidades

- Catálogo filtrable por categoría, talla y estado de la prenda
- Búsqueda en vivo
- Modal de detalle con medidas, material e historia de cada prenda
- Carrito con checkout que arma un mensaje de WhatsApp para el vendedor
- Tema claro/oscuro automático según el sistema

## Uso

Abre `index.html` directamente en el navegador, o sirve la carpeta con cualquier servidor estático:

```
python -m http.server 8080
```

Antes de usarlo en producción, reemplaza el número de WhatsApp de ejemplo (`WHATSAPP_NUMBER` al inicio del `<script>` en `index.html`) por el número real de la tienda.
