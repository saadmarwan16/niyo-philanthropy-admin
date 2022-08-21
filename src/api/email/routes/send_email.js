module.exports = {
    routes: [
      {
        method: "POST",
        path: "/emails/send-email",
        handler: "email.sendEmail",
        config: {
          auth: false,
        },
      },
    ],
  };
  