import React from 'react';
import {
  PreviewPanelType,
  PreviewExpandedState,
  PanelItemType,
  ControlsEditorsTable,
} from '@storybook/components';

export const createControlsPanel = (storyId: string, context: any): PreviewPanelType | null => {
  // @ts-ignore
  const { storyStore, clientApi: api } = context;
  const data = storyStore.fromId(storyId);
  const name = 'controls';
  if (data && data.controls && Object.keys(data.controls).length) {
    const { setControlValue, resetControlValue, clickControl } = api;
    const { controls } = data;
    return {
      name,
      callback: (expanded: PreviewExpandedState): PanelItemType => {
        switch (true) {
          case expanded === name: {
            return {
              node: (
                <ControlsEditorsTable
                  storyId={storyId}
                  controls={controls}
                  setControlValue={setControlValue}
                  resetControlValue={resetControlValue}
                  clickControl={clickControl}
                />
              ),
              title: `Hide ${name}`,
            };
          }
          default: {
            return {
              node: null,
              title: `Show ${name}`,
            };
          }
        }
      },
    };
  }
  return null;
};
