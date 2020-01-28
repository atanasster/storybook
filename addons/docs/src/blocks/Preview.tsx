import React, { FunctionComponent, ReactElement, ReactNode, ReactNodeArray } from 'react';
import { toId, storyNameFromExport } from '@storybook/csf';
import {
  Preview as PurePreview,
  PreviewProps as PurePreviewProps,
  PropEditorsTableProps,
} from '@storybook/components';
import { getSourceProps } from './Source';
import { DocsContext, DocsContextProps } from './DocsContext';

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
  { id: currentId, mdxStoryNameToKey, mdxComponentMeta, storyStore, ...rest }: DocsContextProps
): PurePreviewProps => {
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
  const data = storyStore.fromId(storyId);
  // @ts-ignore
  const api: any = rest.clientApi;
  const propProps: PropEditorsTableProps = data
    ? {
        title: null,
        storyId,
        setPropertyValue: api.setPropertyValue,
        resetPropertyValue: api.resetPropertyValue,
        clickProperty: api.clickProperty,
        properties: data.properties,
      }
    : undefined;
  const defaultProps = {
    ...props,
    propProps,
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
