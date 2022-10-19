const path = require("path");
const { mergeConfig } = require("vite");
module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  // async viteFinal(config, { configType }) {
  //   console.log(config, configType);
  //   return mergeConfig(config, {
  //     cacheDir: "node_modules/.vite-storybook",
  //   });
  // },
};
