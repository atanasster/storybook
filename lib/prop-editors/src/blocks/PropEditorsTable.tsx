import React from 'react';
import { styled } from '@storybook/theming';
import { ClientApi } from '@storybook/client-api';
import { ContextStoryProperties, ContextStoryProperty } from '@storybook/core-events';
import { Table, SectionRow, TabsState } from '@storybook/components';
import { ResetWrapper } from '@storybook/components/dist/typography/DocumentFormatting';
import { DocsContext } from '@storybook/addon-docs/dist/blocks';
import { PropertyEditorRow } from './PropEditorRow';

export const StylePropTable = styled(Table)<{}>(() => ({
  '&&': {
    'th:last-of-type, td:last-of-type': {
      width: '70%',
    },
  },
}));

const DEFAULT_GROUP_ID = 'Other';
export const TableWrapper: React.FC = ({ children }) => (
  <ResetWrapper>
    <StylePropTable className="docblock-propeditorstable">
      <thead>
        <tr>
          <th>property</th>
          <th>value</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </StylePropTable>
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
  <>
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
  </>
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
          <TableWrapper>
            <SectionRow section={title} />
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
          </TableWrapper>
        );
      }
      return null;
    }}
  </DocsContext.Consumer>
);
