module.exports = {
    plugins: [
      require('tailwindcss'),
      require('postcss-font-magician')({
        variants: {
          Staatliches: []
        },
        foundries: ['google']
      }),
      require('autoprefixer'),
    ],
  };
  