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
      path: "/create-wallet-topup-session",
      handler: "custom.createWalletTopupSession",
      config: {},
    },
    {
      method: "POST",
      path: "/confirm-wallet-topup-session",
      handler: "custom.confirmWalletTopupSession",
      config: {},
    },
    // {
    //   method: "GET",
    //   path: "/get-category-edit/:id",
    //   handler: "custom.getCategoryEdit",
    //   config: {
    //     auth: false,
    //   },
    // },
  ],
};
