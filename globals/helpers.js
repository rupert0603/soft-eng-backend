function getFinalPrice(item) {
  let baseItemPrice = 0;
  let addOnsTotal = 0;
  let netItemPrice = 0;

  if (item.variant) {
    baseItemPrice = item.variant.price;
  } else {
    baseItemPrice = item.product.price;
  }

  addOnsTotal = item.addOns.reduce((total, addOn) => {
    return total + addOn.price;
  }, 0);

  netItemPrice = baseItemPrice + addOnsTotal;
  return netItemPrice;
}

function getCartTotalPrice(cartData, getFinalPrice) {
  return cartData.reduce((total, cartItem) => {
    return total + getFinalPrice(cartItem);
  }, 0);
}

module.exports = {
  getFinalPrice,
  getCartTotalPrice,
};
