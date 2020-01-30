import React, { MouseEvent } from 'react';
import { window } from 'global';
import { styled } from '@storybook/theming';
import { ContextStoryControls, ContextStoryControl } from '@storybook/common';
import { ResetWrapper } from '../typography/index';
import { getSectionTitleStyle, getBlockBackgroundStyle } from '../blocks';
import { Table } from '../blocks/PropsTable/PropsTable';
import { ActionBar } from '../ActionBar/ActionBar';
import { TabsState } from '../tabs/tabs';
import { ControlsEditorsTableProps } from './types';

import { PropertyEditorRow } from './PropEditorRow';

const StyleTable = styled(Table)<{}>(() => ({
  '&&': {
    margin: 0,
    tbody: {
      boxShadow: 'none',
    },
    'th:last-of-type, td:last-of-type': {
      width: '70%',
    },
  },
}));

const PropEditorsContainer = styled.div<{}>(({ theme }) => ({
  position: 'relative',
  paddingBottom: '25px',
  ...getBlockBackgroundStyle(theme),
}));

const PropEditorsTitle = styled.div<{}>(({ theme }) => ({
  ...getSectionTitleStyle(theme),
  padding: '16px',
}));

const DEFAULT_GROUP_ID = 'Other';

export const BlockWrapper: React.FC = ({ children }) => (
  <ResetWrapper>
    <PropEditorsContainer className="docblock-propeditorsblock"> {children}</PropEditorsContainer>
  </ResetWrapper>
);

const PropGroupTable: React.FC<ControlsEditorsTableProps> = ({
  controls,
  storyId,
  setControlValue,
  clickControl,
}) => (
  <StyleTable className="docblock-propeditorstable">
    <tbody>
      {controls &&
        Object.keys(controls)
          .map((key, index) => ({
            name: key,
            property: {
              ...controls[key],
              order: controls[key].order === undefined ? index : controls[key].order,
            },
          }))
          .sort((a, b) => {
            const aOrder = a.property.order;
            const bOrder = b.property.order;
            return aOrder - bOrder;
          })
          .map(p => (
            <PropertyEditorRow
              storyId={storyId}
              key={`prop_editor_row_${storyId}_${p.name}`}
              prop={p.property}
              name={p.name}
              setControlValue={setControlValue}
              clickControl={clickControl}
            />
          ))}
    </tbody>
  </StyleTable>
);

interface GroupedControlsType {
  [key: string]: ContextStoryControls;
}

export const ControlsEditorsTable: React.FC<ControlsEditorsTableProps & {
  title?: string;
}> = props => {
  const [copied, setCopied] = React.useState(false);
  const { controls, title, storyId, resetControlValue } = props;
  if (controls && Object.keys(controls).length) {
    const onReset = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      resetControlValue(storyId);
    };
    const onCopy = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    };
    const groupped: GroupedControlsType = Object.keys(controls)
      .filter(k => {
        const p: ContextStoryControl = controls[k];
        return !p.hidden;
      })
      .reduce((acc: GroupedControlsType, k: string) => {
        const groupId = controls[k].groupId || DEFAULT_GROUP_ID;
        return { ...acc, [groupId]: { ...acc[groupId], [k]: controls[k] } };
      }, {});
    return (
      <BlockWrapper>
        {title && <PropEditorsTitle>{title}</PropEditorsTitle>}
        {Object.keys(groupped).length < 2 ? (
          <PropGroupTable {...props} />
        ) : (
          <TabsState>
            {Object.keys(groupped)
              .sort()
              .map(key => {
                const group: ContextStoryControls = groupped[key];
                const tabId = `prop_editors_div_${props.storyId}_${key}`;
                return (
                  <div key={tabId} id={tabId} title={key}>
                    {({ active }: { active: boolean }) =>
                      active ? (
                        <PropGroupTable key={tabId} {...{ ...props, controls: group }} />
                      ) : null
                    }
                  </div>
                );
              })}
          </TabsState>
        )}
        <ActionBar
          zIndex={0}
          actionItems={[
            { title: 'Reset', onClick: onReset },
            { title: copied ? 'Copied' : 'Copy', onClick: onCopy },
          ]}
        />
      </BlockWrapper>
    );
  }
  return null;
};