import React, { FunctionComponent, ReactElement, ReactNode, ReactNodeArray } from 'react';
import { toId, storyNameFromExport } from '@storybook/csf';
import {
  Preview as PurePreview,
  PreviewProps as PurePreviewProps,
  PreviewPanelType,
  PreviewPanelTypes,
  PreviewExpandedState,
  PanelItemType,
  ControlsEditorsTable,
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

const createControlsPanel = (
  storyId: string,
  context: DocsContextProps
): PreviewPanelType | null => {
  // @ts-ignore
  const { storyStore, clientApi: api } = context;
  console.log(context);
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
  const panels: PreviewPanelTypes = [createControlsPanel(storyId, context)];
  const defaultProps = {
    ...props,
    panels: panels.filter((p: PreviewPanelType) => p),
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
