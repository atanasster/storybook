import React, { Children, FunctionComponent, ReactElement, ReactNode, useState } from 'react';
import { styled } from '@storybook/theming';
import { darken } from 'polished';
import { logger } from '@storybook/client-logger';

import { getBlockBackgroundStyle } from './BlockBackgroundStyles';
import { Source, SourceProps } from './Source';
import { ActionBar } from '../ActionBar/ActionBar';
import { Toolbar } from './Toolbar';

const SOURCE_EXPANDED = 'code';

export type PreviewExpandedState = boolean | string;

export interface PanelItemType {
  node: React.ReactNode;
  title?: string;
  disabled?: boolean;
}

export type PreviewPanelCallback = (expanded: PreviewExpandedState) => PanelItemType;
export interface PreviewPanelType {
  name: string;
  callback: PreviewPanelCallback;
}

export type PreviewPanelTypes = PreviewPanelType[];

export interface PreviewProps {
  isColumn?: boolean;
  columns?: number;
  withSource?: SourceProps;
  isExpanded?: PreviewExpandedState;
  withToolbar?: boolean;
  className?: string;
  panels?: PreviewPanelTypes;
}

const ChildrenContainer = styled.div<PreviewProps>(({ isColumn, columns }) => ({
  display: 'flex',
  position: 'relative',
  flexWrap: 'wrap',
  padding: '10px 20px 30px 20px',
  overflow: 'auto',
  flexDirection: isColumn ? 'column' : 'row',

  '> *': {
    flex: columns ? `1 1 calc(100%/${columns} - 20px)` : `1 1 0%`,
    marginTop: 20,
    maxWidth: '100%',
  },
}));

const StyledSource = styled(Source)<{}>(({ theme }) => ({
  margin: 0,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  borderBottomLeftRadius: theme.appBorderRadius,
  borderBottomRightRadius: theme.appBorderRadius,
  border: 'none',

  background:
    theme.base === 'light' ? 'rgba(0, 0, 0, 0.85)' : darken(0.05, theme.background.content),
  color: theme.color.lightest,
  button: {
    background:
      theme.base === 'light' ? 'rgba(0, 0, 0, 0.85)' : darken(0.05, theme.background.content),
  },
}));

interface PreviewContainerProps {
  canExpand: boolean;
  isExpanded?: PreviewExpandedState;
  withToolbar?: boolean;
}
const PreviewContainer = styled.div<PreviewContainerProps>(
  ({ theme, canExpand, isExpanded }) => ({
    position: 'relative',
    overflow: 'visible',
    margin: '25px 0 40px',
    ...getBlockBackgroundStyle(theme),
    borderBottomLeftRadius: canExpand && isExpanded && 0,
    borderBottomRightRadius: canExpand && isExpanded && 0,
    borderBottomWidth: isExpanded && 0,
  }),
  ({ withToolbar }) => withToolbar && { paddingTop: 40 }
);

const getSource = (withSource: SourceProps, expanded: PreviewExpandedState): PanelItemType => {
  switch (true) {
    case !!(withSource && withSource.error): {
      return {
        node: null,
        title: 'No code available',
        disabled: true,
      };
    }
    case expanded === SOURCE_EXPANDED || expanded === true: {
      return {
        node: <StyledSource {...withSource} dark />,
        title: 'Hide code',
      };
    }
    default: {
      return {
        node: null,
        title: 'Show code',
      };
    }
  }
};

function getStoryId(children: ReactNode) {
  if (Children.count(children) === 1) {
    const elt = children as ReactElement;
    if (elt.props) {
      return elt.props.id;
    }
  }
  return null;
}

const Relative = styled.div({
  position: 'relative',
});

const Scale = styled.div<{ scale: number }>(
  {
    position: 'relative',
  },
  ({ scale }) =>
    scale
      ? {
          transform: `scale(${1 / scale})`,
          transformOrigin: 'top left',
        }
      : {}
);

interface TabsInfo {
  name: string;
  item: PanelItemType;
}
const PositionedToolbar = styled(Toolbar)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 40,
});

/**
 * A preview component for showing one or more component `Story`
 * items. The preview also shows the source for the component
 * as a drop-down.
 */
const Preview: FunctionComponent<PreviewProps> = ({
  isColumn,
  columns,
  children,
  withSource,
  withToolbar = false,
  isExpanded = false,
  className,
  panels = [],
}) => {
  const [expanded, setExpanded] = useState(isExpanded ? SOURCE_EXPANDED : false);
  const allPanels: PreviewPanelTypes = [...panels];
  if (withSource) {
    allPanels.push({
      name: SOURCE_EXPANDED,
      callback: state => getSource(withSource, state),
    });
  }

  const tabs: TabsInfo[] = allPanels.map(panel => ({
    name: panel.name,
    item: panel.callback(expanded),
  }));
  const selected: TabsInfo | undefined = tabs.find(tab => tab.name === expanded);
  const actionItems =
    tabs &&
    tabs.map(tab => {
      let onClickExpanded: PreviewExpandedState = false;
      if (expanded !== tab.name) {
        onClickExpanded = tab.item.disabled ? expanded : tab.name;
      }
      return {
        title: tab.item.title,
        disabled: tab.item.disabled,
        onClick: () => setExpanded(onClickExpanded),
      };
    });
  const [scale, setScale] = useState(1);
  const previewClasses = className ? `${className} sbdocs sbdocs-preview` : 'sbdocs sbdocs-preview';

  if (withToolbar && Array.isArray(children)) {
    logger.warn('Cannot use toolbar with multiple preview children, disabling');
  }
  const showToolbar = withToolbar && !Array.isArray(children);
  return (
    <PreviewContainer
      {...{ canExpand: actionItems.length > 0, withToolbar: showToolbar, isExpanded }}
      className={previewClasses}
    >
      {showToolbar && (
        <PositionedToolbar
          border
          zoom={z => setScale(scale * z)}
          resetZoom={() => setScale(1)}
          storyId={getStoryId(children)}
          baseUrl="./iframe.html"
        />
      )}
      <Relative>
        <ChildrenContainer isColumn={isColumn} columns={columns}>
          {Array.isArray(children) ? (
            children.map((child, i) => <div key={i.toString()}>{child}</div>)
          ) : (
            <Scale scale={scale}>{children}</Scale>
          )}
        </ChildrenContainer>
        {actionItems.length > 0 && <ActionBar actionItems={actionItems} />}
      </Relative>
      {selected && selected.item && selected.item.node}
    </PreviewContainer>
  );
};

export { Preview };
