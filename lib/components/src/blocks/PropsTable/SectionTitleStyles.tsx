import { Theme } from '@storybook/theming';
import { transparentize } from 'polished';

export const getSectionTitleStyle: (theme: Theme) => object = (theme: Theme) => ({
  letterSpacing: '0.35em',
  textTransform: 'uppercase',
  fontWeight: theme.typography.weight.black,
  fontSize: theme.typography.size.s1 - 1,
  lineHeight: '24px',
  color:
    theme.base === 'light'
      ? transparentize(0.4, theme.color.defaultText)
      : transparentize(0.6, theme.color.defaultText),
  background: `${theme.background.app} !important`,
});
