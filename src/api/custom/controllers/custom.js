"use strict";

/**
 *  custom controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::custom.custom", ({ strapi }) => ({
  async createWalletTopupSession(ctx) {
    const results = await strapi
      .service("api::custom.custom")
      .createCheckoutSession(ctx);

    return results;
  },

  async confirmWalletTopupSession(ctx) {
    const session = await strapi
      .service("api::custom.custom")
      .confirmCheckoutSession(ctx);

    if (session.payment_status === "paid") {
      return session;
    } else {
      ctx.throw(
        400,
        "It seems like the order wasn't verified. If this continues, please contact support"
      );
    }
  },
}));
