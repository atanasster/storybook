import React from 'react';
import { styled } from '@storybook/theming';
import { ClientApi } from '@storybook/client-api';
import { ContextStoryProperties, ContextStoryProperty } from '@storybook/common';
import {
  Table,
  TabsState,
  ResetWrapper,
  getSectionTitleStyle,
  getBlockBackgroundStyle,
} from '@storybook/components';

import { DocsContext } from '../DocsContext';
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

export interface PropEditorsTableProps {
  title?: string;
}

interface PropGroupTableProps {
  properties: ContextStoryProperties;
  storyId: string;
  api: ClientApi;
}
const PropGroupTable: React.FC<PropGroupTableProps> = ({ properties, storyId, api }) => (
  <StyleTable className="docblock-propeditorstable">
    <tbody>
      {Object.keys(properties).map(key => (
        <PropertyEditorRow
          storyId={storyId}
          key={key}
          prop={properties[key]}
          name={key}
          // @ts-ignore
          api={api}
        />
      ))}
    </tbody>
  </StyleTable>
);

interface GroupedPropertiesType {
  [key: string]: ContextStoryProperties;
}

export const PropEditorsTable: React.FC<PropEditorsTableProps> = ({
  children,
  title = 'Property editors',
  ...props
}) => (
  <DocsContext.Consumer>
    {context => {
      const { storyStore, id } = context;
      // eslint-disable-next-line no-underscore-dangle
      const story = storyStore._data[id];
      if (story && Object.keys(story.properties).length) {
        const { properties } = story;
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
            <PropEditorsTitle>{title}</PropEditorsTitle>
            {Object.keys(groupped).length < 2 ? (
              <PropGroupTable
                properties={properties}
                storyId={id}
                // @ts-ignore
                api={context.clientApi}
              />
            ) : (
              <TabsState>
                {Object.keys(groupped)
                  .sort()
                  .map(key => {
                    const group: ContextStoryProperties = groupped[key];
                    const tabId = `prop_editors_div_${key}`;
                    return (
                      <div key={tabId} id={tabId} title={key}>
                        {({ active }: { active: boolean }) =>
                          active ? (
                            <PropGroupTable
                              properties={group}
                              storyId={id}
                              // @ts-ignore
                              api={context.clientApi}
                            />
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
    }}
  </DocsContext.Consumer>
);
