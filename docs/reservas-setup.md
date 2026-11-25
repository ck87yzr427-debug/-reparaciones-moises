# Reservas de visita de Moisés

## Acuerdos confirmados por el propietario

- Web y dominio: https://solucionesdemoises.es/; repositorio GitHub Pages existente.
- Importe pagado por el cliente: **5,00 EUR**, correspondiente a la visita.
- Si se realiza el trabajo, se descuentan esos 5 € de su importe.
- Si después de la visita no se realiza el trabajo, se mantienen como coste de la visita.
- El cliente debe elegir una hora realmente disponible.
- Lunes, martes y miércoles, de 08:30 a 12:30, zona **Europe/Madrid**.
- Cada cita bloquea **60 minutos en total, incluido el desplazamiento**.
- WhatsApp del propietario para recibir el aviso: **+34 662 480 440**.
- PayPal: pendiente de conectar y autorizar el cobro integrado.

## Estado real de esta entrega

Se ha implementado el apartado, las condiciones, los horarios y el conector para
una agenda alojada en SimplyBook.me. `reservas-config.json` conserva
`enabled: false` y ninguna URL de empresa se ha inventado.

En este estado no se puede pagar ni reservar online. La página lo indica y ofrece
una consulta por WhatsApp. Ese enlace es una consulta que envía el cliente; **no**
es la notificación automática de una reserva cobrada.

No hay secretos de PayPal o WhatsApp en este repositorio. No se ha registrado una
cuenta externa, comprado una suscripción, realizado un cobro ni enviado un aviso.

## Conexión propuesta

Usar una cuenta del propietario de SimplyBook.me para alojar agenda, bloqueos de
horarios y cobro PayPal. Así el servidor de reservas verifica el pago; GitHub Pages
solo muestra la agenda. La documentación de notificaciones indica que propietario
y clientes pueden recibir avisos de WhatsApp; la entrega al propietario y su
relación con el pago deben verificarse en la cuenta antes de activar la web.

1. Crear o acceder a una cuenta de SimplyBook.me del propietario. Comprobar el plan
   que cubre cobros e información de la visita. No contratar un plan ni comprar
   créditos sin la decisión del propietario sobre el coste real mostrado.
2. Conectar una cuenta PayPal apta para la integración comercial. Para la ruta de
   PayPal Business, el propietario debe crearla o actualizar su cuenta mediante
   el flujo oficial de PayPal; no compartir contraseñas ni secretos en el chat.
3. Crear un servicio de visita a domicilio de **5,00 EUR** y un único profesional.
   Configurar lunes/martes/miércoles de 08:30 a 12:30, bloques de 60 minutos que
   incluyen los desplazamientos. Registrar bloqueos y días no disponibles reales.
4. Pedir nombre, teléfono, correo, dirección/zona y una breve descripción del
   trabajo. Mostrar las condiciones de los 5 € antes del pago y en la confirmación.
   No añadir políticas de cancelación o de devolución no acordadas.
5. Exigir pago completo al reservar. Desactivar opciones de pago aplazado, efectivo
   o confirmación sin cobro. Verificar cuándo caduca un horario retenido sin pagar.
6. Configurar el teléfono del propietario y activar su aviso de confirmación por
   WhatsApp. Los mensajes usan plantillas aprobadas del proveedor y créditos.
   Verificar en una reserva de prueba autorizada que el aviso se recibe tras la
   confirmación del pago, con fecha/hora, cliente y referencia identificables.
7. Copiar el enlace público de la empresa y, si se desea incrustar el calendario,
   su URL de iframe generada por SimplyBook.me. Ponerlas en `bookingUrl`/`embedUrl`.
8. Solo después de verificar los cuatro puntos de `verifiedSetup`, marcarlos como
   `true` y activar `enabled`. Son una lista de preparación operativa del sitio,
   **no** una validación de pagos: la validación corresponde al proveedor.

La interfaz no confirma pagos a partir de parámetros de URL, mensajes de iframe o
un botón pulsado. Las cancelaciones, reembolsos y modificaciones reales se gestionan
en la agenda y en la pasarela conectada.

## Verificación disponible

- Pruebas Node de activación, importe/moneda y URLs del proveedor.
- Comprobación HTML de controles, anclas, identificadores y archivos requeridos.
- No se han probado pagos, disponibilidad externa ni entrega de WhatsApp: faltan
  las cuentas y su configuración.
- La infraestructura de navegador de previsualización no está disponible en esta
  sesión; no se ha realizado comprobación visual en navegador.

## Fuentes oficiales consultadas

- Agenda y cobros: https://help.simplybook.me/index.php?title=Accept_payments_custom_feature
- Ajustes y avisos: https://help.simplybook.me/index.php?title=Adjusting_notifications
- Planes y créditos: https://simplybook.me/en/pricing
- Conexión de pagos: https://help.simplybook.me/index.php?title=SBPay.me_payment_systems_setup
- Tipo de cuenta PayPal: https://www.paypal.com/es/cshelp/article/help339
