import React from 'react';
import { ControlsEditorsTable, ControlsEditorsTableProps } from '@storybook/prop-editors';
import { randomizeData } from './randomizeData';

export const ControlsTable: React.FC<ControlsEditorsTableProps> = props => (
  <ControlsEditorsTable
    {...props}
    extraActions={[
      {
        title: 'randomize',
        onAction: (state: ControlsEditorsTableProps) => {
          if (state.setControlValue && state.controls && state.storyId) {
            state.setControlValue(state.storyId, undefined, randomizeData(state.controls));
          }
        },
      },
    ]}
  />
);
