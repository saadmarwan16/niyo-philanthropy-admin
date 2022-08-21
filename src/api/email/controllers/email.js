"use strict";

/**
 *  email controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::email.email", ({ strapi }) => ({
  async sendEmail(ctx) {
    const query = ctx.query;

    try {
      await strapi.plugins["email"].services.email.send({
        to: process.env.RECIPIENT_EMAIL_ADDRESS,
        from: "saadmarwan16@gmail.com",
        subject: `New Message from ${query.first_name} ${
          query.last_name ?? ""
        }`,
        html: `<h3>Email address: ${query.email}</h3> ${
          query.phone ? `<h4>Phone number: ${query.phone}</h4>` : ""
        } <br /> ${query.message}`,
      });

      ctx.body = "Success";
    } catch (err) {
      ctx.body = err;
    }
  },
}));
