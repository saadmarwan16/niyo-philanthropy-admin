"use strict";

/**
 * custom service.
 */

const { createCoreService } = require("@strapi/strapi").factories;
const stripe = require("stripe")(process.env.STRIPE_SK);

const fromDecimalToInt = (number) => parseInt(number * 100);

module.exports = createCoreService("api::custom.custom", ({ strapi }) => ({
  async createCheckoutSession(ctx) {
    const BASE_URL = ctx.request.headers.origin || "http://localhost:3000";
    const {
      name,
      description,
      image_url,
      amount,
      email,
      mode,
      submit_type,
      recurring,
      payment_type,
    } = ctx.request.body;
    console.log(name, description, amount, email, mode, submit_type, recurring);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            recurring,
            currency: "usd",
            product_data: {
              name,
              images: [
                // "https://res.cloudinary.com/dp4gyhksm/image/upload/v1661092230/large_image4_d374ac602d.jpg"
                image_url,
              ],
              description,
            },
            unit_amount: fromDecimalToInt(amount),
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      mode,
      //   mode: "payment",
      // mode: "subscription",
      submit_type,
      //   submit_type: "pay",
      //   submit_type: "donate",
      success_url: `${BASE_URL}/payment-success?checkout_session={CHECKOUT_SESSION_ID}&payment_type=${payment_type}`,
      cancel_url: `${BASE_URL}/payment-cancel`,
    });

    return { id: session.id, session };
  },
  async confirmCheckoutSession(ctx) {
    const { checkout_session } = ctx.request.body;

    return await await stripe.checkout.sessions.retrieve(checkout_session);
  },
}));
