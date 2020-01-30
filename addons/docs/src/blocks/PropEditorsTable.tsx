import React from 'react';
import { toId, storyNameFromExport } from '@storybook/csf';
import { PropEditorsTable as PurePropEditorsTable } from '@storybook/components';
import { ContextStoryProperties } from '@storybook/common';
import { DocsContextProps, DocsContext } from './DocsContext';
import { StoryProps } from './Story';
import { CURRENT_SELECTION } from './shared';

interface PropEditorsTable {
  title?: string;
  id?: string;
  name?: string;
}

const getPropertyProps = (
  props: PropEditorsTable,
  { id: currentId, storyStore, mdxStoryNameToKey, mdxComponentMeta }: DocsContextProps | null
): { properties?: ContextStoryProperties; id: string | null } => {
  const { id, name } = props;
  const inputId = id === CURRENT_SELECTION ? currentId : id;
  const previewId =
    inputId ||
    (mdxStoryNameToKey &&
      mdxComponentMeta &&
      toId(
        mdxComponentMeta.id || mdxComponentMeta.title,
        storyNameFromExport(mdxStoryNameToKey[name])
      ));
  if (!previewId) {
    return null;
  }
  const data = storyStore.fromId(previewId);

  const propsParam = (data && data.parameters && data.parameters.properties) || {};

  if (!data || propsParam.disable) {
    return null;
  }
  return {
    id: data.id,
    properties: data.properties,
  };
};
export const PropEditorsTable: React.FC<PropEditorsTable & StoryProps> = ({
  title = 'Property Editors',
  ...rest
}) => (
  <DocsContext.Consumer>
    {context => {
      const { properties, id } = getPropertyProps(rest, context) || {};
      const api: any = (context as any).clientApi;
      return id ? (
        <PurePropEditorsTable
          title={title}
          properties={properties}
          storyId={id}
          setPropertyValue={api.setPropertyValue}
          resetPropertyValue={api.resetPropertyValue}
          clickProperty={api.clickProperty}
        />
      ) : null;
    }}
  </DocsContext.Consumer>
);
