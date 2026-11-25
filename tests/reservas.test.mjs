import test from 'node:test';
import assert from 'node:assert/strict';
import { getBookingConnection, validateSchedulingUrl } from '../reservas.mjs';

function readyConfig() {
  return {
    enabled: true, provider: 'simplybook', amount: '5.00', currency: 'EUR',
    timeZone: 'Europe/Madrid', bookingUrl: 'https://example-business.simplybook.me/v2/',
    embedUrl: 'https://example-business.simplybook.me/v2/?widget-type=iframe',
    verifiedSetup: { realAvailability: true, paypalRequired: true, confirmationAfterPayment: true, ownerWhatsAppNotification: true },
  };
}

test('pending accounts, unchecked paid flow, or missing WhatsApp cannot activate online bookings', () => {
  assert.equal(getBookingConnection(null), null);
  assert.equal(getBookingConnection({ ...readyConfig(), enabled: false }), null);
  for (const key of Object.keys(readyConfig().verifiedSetup)) {
    const config = readyConfig();
    config.verifiedSetup[key] = false;
    assert.equal(getBookingConnection(config), null, key);
  }
});

test('a different price, currency, or time zone cannot silently replace the advertised conditions', () => {
  for (const change of [{ amount: '50.00' }, { currency: 'USD' }, { timeZone: 'UTC' }]) {
    assert.equal(getBookingConnection({ ...readyConfig(), ...change }), null);
  }
});

test('rejects insecure URLs, credentials, lookalike hosts, ports and other companies', () => {
  for (const value of [
    'javascript:alert(1)', 'http://example-business.simplybook.me/',
    'https://example-business.simplybook.me.evil.test/', 'https://evil-simplybook.me/',
    'https://example-business.simplybook.me:444/', 'https://user:password@example-business.simplybook.me/',
    'https://simplybook.me/',
  ]) assert.equal(validateSchedulingUrl(value), null, value);
  assert.equal(getBookingConnection({ ...readyConfig(), embedUrl: 'https://different-company.simplybook.me/' }), null);
});

test('accepts the same verified company, including a link-only flow when embedding is unavailable', () => {
  assert.deepEqual(getBookingConnection(readyConfig()), {
    bookingUrl: readyConfig().bookingUrl, embedUrl: readyConfig().embedUrl,
  });
  assert.deepEqual(getBookingConnection({ ...readyConfig(), embedUrl: '' }), {
    bookingUrl: readyConfig().bookingUrl, embedUrl: null,
  });
});
