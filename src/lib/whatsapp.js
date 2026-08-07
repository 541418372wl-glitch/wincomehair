export const WHATSAPP_NUMBER = '8618989846141';

export function waLink(text) {
  return `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
}

export const WA_DEFAULT_TEXT = 'Hello WINCOME, I would like to inquire about your custom hair accessories. Can we chat?';
