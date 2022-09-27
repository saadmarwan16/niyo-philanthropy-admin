module.exports = ({ env }) => {
  if (env("NODE_ENV") === "production") {
    return {
      "users-permissions": {
        config: {
          jwt: {
            expiresIn: "7d",
          },
        },
      },
      upload: {
        config: {
          provider: "cloudinary",
          providerOptions: {
            cloud_name: env("CLOUDINARY_NAME"),
            api_key: env("CLOUDINARY_KEY"),
            api_secret: env("CLOUDINARY_SECRET"),
          },
          actionOptions: {
            upload: {},
            uploadStream: {},
            delete: {},
          },
        },
      },
      email: {
        config: {
          provider: "sendgrid",
          providerOptions: {
            apiKey: env("SENDGRID_API_KEY"),
          },
        },
      },
    };
  }

  return {
    "users-permissions": {
      config: {
        jwt: {
          expiresIn: "7d",
        },
      },
    },
    email: {
      config: {
        provider: "sendgrid",
        providerOptions: {
          apiKey: env("SENDGRID_API_KEY"),
        },
      },
    },
  };
};
