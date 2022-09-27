// 'use strict';

// /**
//  * custom router.
//  */

// const { createCoreRouter } = require('@strapi/strapi').factories;

// module.exports = createCoreRouter('api::custom.custom');

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/receipt/confirm-receipt-checkout",
      handler: "receipt.confirmReceiptCheckout",
      config: {},
    },
    {
      method: "POST",
      path: "/make-wallet-donation",
      handler: "receipt.makeWalletDonation",
      config: {},
    },
  ],
};
