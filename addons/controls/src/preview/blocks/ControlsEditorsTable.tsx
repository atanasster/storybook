import React from 'react';
import { toId, storyNameFromExport } from '@storybook/csf';
import { ControlsEditorsTable as PureControlsEditorsTable } from '@storybook/components';
import { ContextStoryControls } from '@storybook/common';
import {
  CURRENT_SELECTION,
  StoryProps,
  DocsContextProps,
  DocsContext,
} from '@storybook/addon-docs/blocks';

interface ControlsEditorsTableProps {
  title?: string;
  id?: string;
  name?: string;
}

const getPropertyProps = (
  props: ControlsEditorsTableProps,
  { id: currentId, storyStore, mdxStoryNameToKey, mdxComponentMeta }: DocsContextProps | null
): { controls?: ContextStoryControls; id: string | null } | null => {
  const { id, name } = props;
  const inputId = id === CURRENT_SELECTION ? currentId : id;
  const previewId =
    inputId ||
    (mdxStoryNameToKey &&
      mdxComponentMeta &&
      name &&
      toId(
        mdxComponentMeta.id || mdxComponentMeta.title,
        storyNameFromExport(mdxStoryNameToKey[name])
      ));
  if (!previewId) {
    return null;
  }
  const data = storyStore.fromId(previewId);

  const propsParam = (data && data.parameters && data.parameters.controls) || {};

  if (!data || propsParam.disable) {
    return null;
  }
  return {
    id: data.id,
    controls: data.controls,
  };
};
export const ControlsEditorsTable: React.FC<ControlsEditorsTableProps & StoryProps> = ({
  title = 'Property Editors',
  ...rest
}) => (
  <DocsContext.Consumer>
    {context => {
      const { controls, id } = getPropertyProps(rest, context) || {};
      const api: any = (context as any).clientApi;
      return id ? (
        <PureControlsEditorsTable
          title={title}
          controls={controls}
          storyId={id}
          setControlValue={api.setControlValue}
          resetControlValue={api.resetControlValue}
          clickControl={api.clickControl}
        />
      ) : null;
    }}
  </DocsContext.Consumer>
);
