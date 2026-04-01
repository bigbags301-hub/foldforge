/**
 * A/B Testing Utility for Premium Free Month Popup
 * Deterministically assigns users to variants based on session/device
 */

export type PopupVariant = "variant-a" | "variant-b";

const VARIANT_KEY = "premium_popup_variant";
const VARIANT_SEED_KEY = "premium_popup_seed";

/**
 * Get or create a deterministic variant assignment for the user
 * Uses a simple hash of browser fingerprint for consistency
 */
export function getPopupVariant(): PopupVariant {
  // Check if variant is already assigned in localStorage
  const stored = localStorage.getItem(VARIANT_KEY);
  if (stored === "variant-a" || stored === "variant-b") {
    return stored;
  }

  // Generate a seed if not already present
  let seed = localStorage.getItem(VARIANT_SEED_KEY);
  if (!seed) {
    seed = generateSeed();
    localStorage.setItem(VARIANT_SEED_KEY, seed);
  }

  // Deterministically assign variant based on seed
  const variant = hashToVariant(seed);
  localStorage.setItem(VARIANT_KEY, variant);

  return variant;
}

/**
 * Generate a unique seed based on browser fingerprint
 */
function generateSeed(): string {
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.width,
    screen.height,
    screen.colorDepth,
  ].join("|");

  return btoa(fingerprint).substring(0, 16);
}

/**
 * Deterministically hash seed to variant (50/50 split)
 */
function hashToVariant(seed: string): PopupVariant {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash) % 2 === 0 ? "variant-a" : "variant-b";
}

/**
 * Track popup event for analytics
 */
export function trackPopupEvent(
  variant: PopupVariant,
  eventType: "shown" | "submitted" | "closed"
) {
  const event = {
    timestamp: new Date().toISOString(),
    variant,
    eventType,
    url: window.location.href,
  };

  // Send to analytics endpoint if available
  try {
    fetch("/api/analytics/popup-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    }).catch(() => {
      // Silently fail if endpoint not available
    });
  } catch (err) {
    console.debug("Analytics tracking failed:", err);
  }
}
