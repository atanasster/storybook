import React from 'react';
import { styled } from '@storybook/theming';
import { ContextStoryProperties, ContextStoryProperty } from '@storybook/common';
import { ResetWrapper } from '../typography/index';
import { getSectionTitleStyle, getBlockBackgroundStyle } from '../blocks';
import { Table } from '../blocks/PropsTable/PropsTable';
import { TabsState } from '../tabs/tabs';
import { PropEditorsTableProps } from './types';

import { PropertyEditorRow } from './PropEditorRow';

const StyleTable = styled(Table)<{}>(() => ({
  '&&': {
    marginTop: 0,
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
  overflow: 'hidden',
  margin: '25px 0 40px',
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

const PropGroupTable: React.FC<PropEditorsTableProps> = ({
  properties,
  storyId,
  setPropertyValue,
  clickProperty,
}) => (
  <StyleTable className="docblock-propeditorstable">
    <tbody>
      {properties &&
        Object.keys(properties)
          .map((key, index) => ({
            name: key,
            property: {
              ...properties[key],
              order: properties[key].order === undefined ? index : properties[key].order,
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
              setPropertyValue={setPropertyValue}
              clickProperty={clickProperty}
            />
          ))}
    </tbody>
  </StyleTable>
);

interface GroupedPropertiesType {
  [key: string]: ContextStoryProperties;
}

export const PropEditorsTable: React.FC<PropEditorsTableProps & { title?: string }> = props => {
  const { properties, title = 'Property Editors' } = props;
  if (properties && Object.keys(properties).length) {
    const groupped: GroupedPropertiesType = Object.keys(properties)
      .filter(k => {
        const p: ContextStoryProperty = properties[k];
        return !p.hidden;
      })
      .reduce((acc: GroupedPropertiesType, k: string) => {
        const groupId = properties[k].groupId || DEFAULT_GROUP_ID;
        return { ...acc, [groupId]: { ...acc[groupId], [k]: properties[k] } };
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
                const group: ContextStoryProperties = groupped[key];
                const tabId = `prop_editors_div_${props.storyId}_${key}`;
                return (
                  <div key={tabId} id={tabId} title={key}>
                    {({ active }: { active: boolean }) =>
                      active ? (
                        <PropGroupTable key={tabId} {...{ ...props, properties: group }} />
                      ) : null
                    }
                  </div>
                );
              })}
          </TabsState>
        )}
      </BlockWrapper>
    );
  }
  return null;
};
