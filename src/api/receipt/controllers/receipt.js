"use strict";

/**
 *  receipt controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::receipt.receipt", ({ strapi }) => ({
  async create(ctx) {
    const results = await strapi
      .service("api::custom.custom")
      .createCheckoutSession(ctx);
    const { user } = ctx.state;
    ctx.request.body.data = {
      ...ctx.request.body.data,
      status: "unused",
      checkout_session: results.id,
      owner: user.id,
    };
    await super.create(ctx);

    return { checkout_session: results.id };
  },
  async confirmReceiptCheckout(ctx) {
    const session = await strapi
      .service("api::custom.custom")
      .confirmCheckoutSession(ctx);

    if (session.payment_status === "paid") {
      const entries = await strapi.entityService.findMany(
        "api::receipt.receipt",
        {
          filters: { checkout_session: session.id },
          populate: { owner: true },
        }
      );
      if (entries.length === 0) {
        ctx.throw(
          400,
          "Ooops we could not find your receipt. If this continues, please contact support"
        );
      } else {
        let entry = entries[0];
        const receiptId = entry.id;
        const wallet_balance = entry.owner.wallet_balance;
        if (entry.status === "unused") {
          entry = await strapi.entityService.update(
            "api::receipt.receipt",
            receiptId,
            {
              data: {
                status: "used",
              },
            }
          );

          ctx.request.body = {
            ...ctx.request.body,
            wallet_balance: wallet_balance + session.amount_total / 100,
          };

          const results = await strapi.plugins[
            "users-permissions"
          ].controllers.user.updateMe(ctx);

          return results;
        } else {
          return {
            results: "Already used receipt",
          };
        }
      }
    } else {
      ctx.throw(
        400,
        "It seems like the receipt wasn't verified. If this continues, please contact support"
      );
    }
  },
  async makeWalletDonation(ctx) {
    const { user } = ctx.state;
    const wallet_balance = user.wallet_balance;
    const { amount, campaign } = ctx.request.body;
    if (wallet_balance >= amount) {
      ctx.request.body = {
        ...ctx.request.body,
        wallet_balance: wallet_balance - amount,
      };

      const results = await strapi.plugins[
        "users-permissions"
      ].controllers.user.updateMe(ctx);
      await strapi.entityService.create("api::donation.donation", {
        data: {
          status: "Paid",
          amount,
          donor: user.id,
          campaign,
          donation_type: "wallet",
          publishedAt: new Date(),
        },
      });
      const campaignEntry = await strapi.entityService.findOne(
        "api::campaign.campaign",
        campaign
      );
      await strapi.entityService.update("api::campaign.campaign", campaign, {
        data: {
          amount_raised: campaignEntry.amount_raised + amount,
        },
      });

      return {
        results,
      };
    } else {
      ctx.throw(
        400,
        "You do not have sufficient balance in your wallet. If you think this is a mistake, please contact support"
      );
    }

    return {
      results: "Just checking user",
    };
  },
}));
