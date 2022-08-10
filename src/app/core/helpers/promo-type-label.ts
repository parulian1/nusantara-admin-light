export function getPromoTypeLabel(type_val: string) {
  const promoTypeChoices = {
    'percentage': 'Percentage',
    'amount_off': 'Amount Off',
    'override_price': 'Override Price',
    'promo_bundling': 'Promo Bundling',
    'free_gift': 'Free Gift / Lucky Dip',
    'multiply_point': 'Multiply Loyalty Point',
  }
  return promoTypeChoices[type_val];
}
