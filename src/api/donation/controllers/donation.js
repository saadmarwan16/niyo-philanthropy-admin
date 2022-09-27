"use strict";

/**
 *  donation controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::donation.donation",
  ({ strapi }) => ({
    async create(ctx) {
      const results = await strapi
        .service("api::custom.custom")
        .createCheckoutSession(ctx);
      ctx.request.body.data = {
        ...ctx.request.body.data,
        donation_type: "checkout",
        status: "Unpaid",
        checkout_session: results.id,
      };
      await super.create(ctx);

      return { checkout_session: results.id };
    },
    async confirmDonation(ctx) {
      const session = await strapi
        .service("api::custom.custom")
        .confirmCheckoutSession(ctx);

      if (session.payment_status === "paid") {
        const entries = await strapi.entityService.findMany(
          "api::donation.donation",
          {
            filters: { checkout_session: session.id },
            populate: { campaign: true },
          }
        );
        if (entries.length === 0) {
          ctx.throw(
            400,
            "Ooops we could not find your donation. If this continues, please contact support"
          );
        } else {
          let entry = entries[0];
          const donationId = entry.id;
          const campaignId = entry.campaign.id;
          if (entry.status === "Unpaid") {
            entry = await strapi.entityService.update(
              "api::donation.donation",
              donationId,
              {
                data: {
                  status: "Paid",
                },
              }
            );
            const campaignEntry = await strapi.entityService.findOne(
              "api::campaign.campaign",
              campaignId
            );
            await strapi.entityService.update(
              "api::campaign.campaign",
              campaignId,
              {
                data: {
                  amount_raised:
                    campaignEntry.amount_raised + session.amount_total / 100,
                },
              }
            );

            return entry;
          } else {
            return {
              results: "Already confirmed donation",
            };
          }
        }
      } else {
        ctx.throw(
          400,
          "It seems like the donation wasn't verified. If this continues, please contact support"
        );
      }
    },
  })
);
