import React from 'react';
import {
  PreviewPanelCallback,
  PreviewExpandedState,
  PanelItemType,
  ControlsEditorsTable,
} from '@storybook/components';

export const createControlsPanel = ({
  storyId,
  context,
}: {
  storyId: string;
  context: any;
}): PreviewPanelCallback | null => {
  // @ts-ignore
  const { storyStore, clientApi: api } = context;
  const data = storyStore.fromId(storyId);
  const name = 'controls';
  if (data && data.controls && Object.keys(data.controls).length) {
    const { setControlValue, resetControlValue, clickControl } = api;
    const { controls } = data;
    return (expanded: PreviewExpandedState): PanelItemType => {
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
    };
  }
  return null;
};
