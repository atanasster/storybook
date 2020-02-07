module.exports = {
  stories: ['../src/stories/**/*.stories.(ts|mdx)'],
  addons: [
    '@component-controls/storybook-addon-controls',
    '@storybook/addon-docs',
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs',
    '@storybook/addon-options',
    '@storybook/addon-jest',
    '@storybook/addon-backgrounds',
    '@storybook/addon-a11y',
  ],
};
