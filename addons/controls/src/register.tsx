import * as React from 'react';
import addons from '@storybook/addons';
import { PropsPanel } from './components/Panel';
import { ADDON_ID, PANEL_ID, PARAM_KEY } from './shared';

addons.register(ADDON_ID, api => {
  addons.addPanel(PANEL_ID, {
    title: 'Controls',
    render: ({ active, key }) => <PropsPanel api={api} key={key} active={active} />,
    paramKey: PARAM_KEY,
  });
});
