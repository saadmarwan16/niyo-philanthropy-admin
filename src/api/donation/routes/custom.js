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
      path: "/donations/confirm-donation",
      handler: "donation.confirmDonation",
      config: {},
    },
  ],
};
