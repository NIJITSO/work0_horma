/**
 * Format price in Moroccan Dirham (MAD / DH)
 * The site strictly supports only Moroccan Dirham without currency conversion.
 */
export function formatPrice(priceMAD: number): string {
  return `${Math.round(priceMAD)} DH`;
}
