export function getSubLocationTypeLabel(type_val: string) {
  const subLocationTypeChoices = {
    'online_only': 'Online',
    'offline_only': 'Offline',
    'omni_channel': 'Omni',
    'promo': 'Promo',
    'hold': 'hold',
    'point_redemption': 'Point Redemption'
  }
  return subLocationTypeChoices[type_val];
}
