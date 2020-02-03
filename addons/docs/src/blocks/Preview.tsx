import React, { FunctionComponent, ReactElement, ReactNode, ReactNodeArray } from 'react';
import { toId, storyNameFromExport } from '@storybook/csf';
import {
  Preview as PurePreview,
  PreviewProps as PurePreviewProps,
  PreviewPanelType,
  PreviewPanelTypes,
} from '@storybook/components';
import { getSourceProps } from './Source';
import { DocsContext, DocsContextProps } from './DocsContext';
import { getAddons } from './utils';

export enum SourceState {
  OPEN = 'open',
  CLOSED = 'closed',
  NONE = 'none',
}

type PreviewProps = PurePreviewProps & {
  withSource?: SourceState;
  mdxSource?: string;
};

const getPreviewProps = (
  {
    withSource = SourceState.CLOSED,
    mdxSource,
    children,
    ...props
  }: PreviewProps & { children?: ReactNode },
  context: DocsContextProps
): PurePreviewProps => {
  const { mdxStoryNameToKey, mdxComponentMeta, storyStore } = context;
  const childArray: ReactNodeArray = Array.isArray(children) ? children : [children];
  const stories = childArray.filter(
    (c: ReactElement) => c.props && (c.props.id || c.props.name)
  ) as ReactElement[];
  const targetIds = stories.map(
    s =>
      s.props.id ||
      toId(
        mdxComponentMeta.id || mdxComponentMeta.title,
        storyNameFromExport(mdxStoryNameToKey[s.props.name])
      )
  );
  const storyId = targetIds.length && targetIds[0];
  const story = storyStore.fromId(storyId);
  const panels: PreviewPanelTypes = story
    ? getAddons(story.parameters, 'preview', { storyId, context }).map(addon => ({
        name: addon.name,
        callback: addon.addon,
      }))
    : [];

  const defaultProps = {
    ...props,
    panels: panels.filter((p: PreviewPanelType) => p.callback),
  };
  if (withSource === SourceState.NONE) {
    return defaultProps;
  }
  if (mdxSource) {
    return {
      ...defaultProps,
      withSource: getSourceProps({ code: decodeURI(mdxSource) }, { storyStore }),
    };
  }

  const sourceProps = getSourceProps({ ids: targetIds }, { storyStore });
  return {
    ...defaultProps, // pass through columns etc.
    withSource: sourceProps,
    isExpanded: withSource === SourceState.OPEN,
  };
};

export const Preview: FunctionComponent<PreviewProps> = props => (
  <DocsContext.Consumer>
    {context => {
      const previewProps = getPreviewProps(props, context);
      return <PurePreview {...previewProps}>{props.children}</PurePreview>;
    }}
  </DocsContext.Consumer>
);
