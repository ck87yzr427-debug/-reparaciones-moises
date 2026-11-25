const VERIFIED_SETTINGS = [
  'realAvailability',
  'paypalRequired',
  'confirmationAfterPayment',
  'ownerWhatsAppNotification',
];

/** Public scheduling URLs only. Payment verification stays with the provider. */
export function validateSchedulingUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
    // Restrict to a tenant on the selected booking provider, not lookalike hosts.
    if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.simplybook\.(?:me|it)$/.test(hostname)) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function getBookingConnection(config) {
  if (!config || config.enabled !== true || config.provider !== 'simplybook') return null;
  if (config.amount !== '5.00' || config.currency !== 'EUR' || config.timeZone !== 'Europe/Madrid') return null;
  if (!VERIFIED_SETTINGS.every(key => config.verifiedSetup?.[key] === true)) return null;
  const bookingUrl = validateSchedulingUrl(config.bookingUrl);
  if (!bookingUrl) return null;
  const embedUrl = validateSchedulingUrl(config.embedUrl);
  // An iframe must belong to the same confirmed company as the booking link.
  if (config.embedUrl && (!embedUrl || new URL(embedUrl).hostname !== new URL(bookingUrl).hostname)) return null;
  return { bookingUrl, embedUrl };
}

export async function connectBookingSection(section, fetchConfig = fetch) {
  const open = section.querySelector('[data-booking-open]');
  const external = section.querySelector('[data-booking-external]');
  const status = section.querySelector('[data-booking-status]');
  const mount = section.querySelector('[data-booking-mount]');
  let connection;
  try {
    const response = await fetchConfig(new URL('./reservas-config.json', import.meta.url), { cache: 'no-cache' });
    if (!response.ok) return;
    connection = getBookingConnection(await response.json());
  } catch {
    // The useful WhatsApp consultation link remains available if setup is pending.
    return;
  }
  if (!connection) return;

  section.classList.add('booking-is-connected');
  external.href = connection.bookingUrl;
  external.hidden = false;
  status.textContent = 'Elige una hora disponible. Tu visita se confirma al completarse el pago de 5 € con PayPal.';

  if (!connection.embedUrl) {
    external.classList.add('button');
    external.textContent = 'Elegir día y hora';
    return;
  }
  open.hidden = false;
  open.addEventListener('click', () => {
    if (mount.querySelector('iframe')) return;
    const frame = section.ownerDocument.createElement('iframe');
    frame.src = connection.embedUrl;
    frame.title = 'Calendario de reservas de visita de Reparaciones y Soluciones de Moisés';
    frame.loading = 'eager';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allow = 'payment';
    frame.className = 'booking-provider-frame';
    mount.append(frame);
    mount.hidden = false;
    open.setAttribute('aria-expanded', 'true');
    open.hidden = true;
    status.textContent = 'Completa la reserva en el calendario. También puedes abrir la agenda en otra pestaña.';
    frame.addEventListener('load', () => { frame.focus(); }, { once: true });
  });
}

// Neither URL parameters nor browser messages can claim a payment was received.
if (typeof document !== 'undefined') {
  const section = document.querySelector('[data-booking-section]');
  if (section) connectBookingSection(section);
}
