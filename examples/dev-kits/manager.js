import React from 'react';
import { PropTypes } from 'prop-types';
import { Button } from '@storybook/react/demo';
import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';
import { useAddonState } from '@storybook/api';
import { AddonPanel } from '@storybook/components';

addons.setConfig({
  theme: themes.dark,
  panelPosition: 'bottom',
});

const StatePanel = ({ active, key }) => {
  const [state, setState] = useAddonState('test');
  return (
    <AddonPanel key={key} active={active}>
      Click to change from manager:
      <br />
      <br />
      <Button
        onClick={() => {
          console.log(setState);
          setState(state === 'baz' ? 'fooo' : 'baz');
        }}
      >
        {state}
      </Button>
    </AddonPanel>
  );
};

StatePanel.propTypes = {
  active: PropTypes.bool.isRequired,
  key: PropTypes.string.isRequired,
};

addons.addPanel('useAddonState', {
  id: 'useAddonState',
  title: 'useAddonState',
  render: StatePanel,
});
