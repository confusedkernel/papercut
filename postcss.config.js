module.exports = function (ctx) {
  var isProduction = ctx && ctx.env === "production";

  return {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      ...(isProduction
        ? {
            cssnano: {
              preset: "default",
            },
          }
        : {}),
    },
  };
};
