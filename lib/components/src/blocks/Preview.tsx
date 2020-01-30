import React, { Children, FunctionComponent, ReactElement, ReactNode, useState } from 'react';
import { styled } from '@storybook/theming';
import { darken } from 'polished';
import { logger } from '@storybook/client-logger';

import { getBlockBackgroundStyle } from './BlockBackgroundStyles';
import { Source, SourceProps } from './Source';
import { PropEditorsTable, PropEditorsTableProps } from '../prop-editors';
import { ActionBar, ActionItem } from '../ActionBar/ActionBar';
import { Toolbar } from './Toolbar';

const SOURCE_EXPANDED = 'code';
const PROPS_EXPANDED = 'props';

type ExpandedState = false | typeof SOURCE_EXPANDED | typeof PROPS_EXPANDED | true;

export interface PreviewProps {
  isColumn?: boolean;
  columns?: number;
  withSource?: SourceProps;
  isExpanded?: ExpandedState;
  withToolbar?: boolean;
  className?: string;
  propProps?: PropEditorsTableProps;
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

const PreviewContainer = styled.div<PreviewProps>(
  ({ theme, withSource, isExpanded }) => ({
    position: 'relative',
    overflow: 'visible',
    margin: '25px 0 40px',
    ...getBlockBackgroundStyle(theme),
    borderBottomLeftRadius: withSource && isExpanded && 0,
    borderBottomRightRadius: withSource && isExpanded && 0,
    borderBottomWidth: isExpanded && 0,
  }),
  ({ withToolbar }) => withToolbar && { paddingTop: 40 }
);

interface SourceItem {
  source?: ReactElement;
  actionItem: ActionItem;
}

const getSource = (
  withSource: SourceProps,
  expanded: ExpandedState,
  setExpanded: Function
): SourceItem => {
  switch (true) {
    case !!(withSource && withSource.error): {
      return {
        source: null,
        actionItem: {
          title: 'No code available',
          disabled: true,
          onClick: () => setExpanded(expanded === SOURCE_EXPANDED ? false : expanded),
        },
      };
    }
    case expanded === SOURCE_EXPANDED || expanded === true: {
      return {
        source: <StyledSource {...withSource} dark />,
        actionItem: { title: 'Hide code', onClick: () => setExpanded(false) },
      };
    }
    default: {
      return {
        source: null,
        actionItem: { title: 'Show code', onClick: () => setExpanded(SOURCE_EXPANDED) },
      };
    }
  }
};

const getProperties = (
  props: PropEditorsTableProps,
  expanded: ExpandedState,
  setExpanded: Function
): SourceItem => {
  switch (true) {
    case !props || !props.properties || !Object.keys(props.properties).length: {
      return {
        source: null,
        actionItem: null,
      };
    }
    case expanded === PROPS_EXPANDED: {
      return {
        source: <PropEditorsTable {...props} />,
        actionItem: { title: 'Hide controls', onClick: () => setExpanded(false) },
      };
    }
    default: {
      return {
        source: null,
        actionItem: { title: 'Show controls', onClick: () => setExpanded(PROPS_EXPANDED) },
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
  propProps,
  ...props
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const { source, actionItem: actionSource } = getSource(withSource, expanded, setExpanded);
  const { source: propsTable, actionItem: actionProps } = getProperties(
    propProps,
    expanded,
    setExpanded
  );
  const actions = [actionProps, actionSource].filter(a => a);
  const [scale, setScale] = useState(1);
  const previewClasses = className ? `${className} sbdocs sbdocs-preview` : 'sbdocs sbdocs-preview';

  if (withToolbar && Array.isArray(children)) {
    logger.warn('Cannot use toolbar with multiple preview children, disabling');
  }
  const showToolbar = withToolbar && !Array.isArray(children);
  return (
    <PreviewContainer
      {...{ withSource, withToolbar: showToolbar }}
      {...props}
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
        {(withSource || propsTable) && <ActionBar actionItems={actions} />}
      </Relative>
      {withSource && source}
      {propProps && propsTable}
    </PreviewContainer>
  );
};

export { Preview };
