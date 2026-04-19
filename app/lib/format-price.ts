export const formatPriceUah = (amount: number) =>
  new Intl.NumberFormat("uk-UA", {
    maximumFractionDigits: 0,
  }).format(amount);
