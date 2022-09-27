"use strict";

/**
 *  donate controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::donate.donate", ({ strapi }) => ({
  async find(ctx) {
    ctx.query = { ...ctx.query, local: "en" };
    const { data, meta } = await super.find(ctx);
    const campaigns = await strapi.entityService.findMany(
      "api::campaign.campaign",
      {
        fields: ["title"],
        populate: {
          image: {
            fields: ["url"],
          },
        },
        sort: { title: "ASC" },
        filters: {
          completed: false,
        },
        limit: -1,
      }
    );
    data.campaigns = campaigns;

    return { data, meta };
  },
}));
