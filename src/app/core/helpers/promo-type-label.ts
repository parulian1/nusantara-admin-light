export function getPromoTypeLabel(type_val: string) {
  const promoTypeChoices = {
    'percentage': 'Percentage',
    'amount_off': 'Amount Off',
    'override_price': 'Override Price',
    'promo_bundling': 'Promo Bundling'
  }
  return promoTypeChoices[type_val];
}
