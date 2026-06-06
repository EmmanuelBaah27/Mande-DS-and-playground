// Demo payment link for the prototype. Swap for a real per-user link when wired up.
export const PAYMENT_LINK = "https://mnde.app/p/DEMO123"

// User-facing copy (locked via mande-copywriter; see design spec).
export const SHARE_TITLE = "Ask someone to pay for you."
export const SHARE_DESCRIPTION =
  "Send your link to whoever's backing you — a parent, a mentor, a big sis. The moment they pay, your paths open automatically."
export const EMAIL_SUBJECT = "Could you help me unlock my career paths?"

// Warm, short prefilled message. Ends with the link so it renders as a tappable URL.
export function buildShareMessage(link: string): string {
  return `Hey — I'm using Mande to figure out my career path, and I'd love your help unlocking it. It's a one-time $30. Here's my link: ${link}`
}

export function buildWhatsappUrl(link: string): string {
  return `https://wa.me/?text=${encodeURIComponent(buildShareMessage(link))}`
}

export function buildMailtoUrl(link: string): string {
  const subject = encodeURIComponent(EMAIL_SUBJECT)
  const body = encodeURIComponent(buildShareMessage(link))
  return `mailto:?subject=${subject}&body=${body}`
}
