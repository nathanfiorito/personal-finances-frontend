// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import nextConfig from "eslint-config-next";

export default [
  { ignores: ["app/**", ".next/**", "node_modules/**"] },
  ...(Array.isArray(nextConfig) ? nextConfig : [nextConfig]),
];
