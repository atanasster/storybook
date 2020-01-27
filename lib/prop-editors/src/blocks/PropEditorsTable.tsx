import React from 'react';
import { styled } from '@storybook/theming';
import { Table, SectionRow } from '@storybook/components';
import { ResetWrapper } from '@storybook/components/dist/typography/DocumentFormatting';
import { DocsContext, DocsContextProps } from '@storybook/addon-docs/dist/blocks';
import { PropertyEditorRow } from './PropEditorRow';

export const StylePropTable = styled(Table)<{}>(() => ({
  '&&': {
    'th:last-of-type, td:last-of-type': {
      width: '70%',
    },
  },
}));

export const TableWrapper: React.FC = ({ children }) => (
  <ResetWrapper>
    <StylePropTable className="docblock-propeditorstable">
      <thead>
        <tr>
          <th>property</th>
          <th>editor</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </StylePropTable>
  </ResetWrapper>
);

export interface PropEditorsTableProps {
  title?: string;
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
        return (
          <TableWrapper>
            <SectionRow section={title} />
            {Object.keys(properties).map(key => (
              <PropertyEditorRow
                storyId={id}
                key={key}
                prop={properties[key]}
                name={key}
                // @ts-ignore
                api={context.clientApi}
              />
            ))}
          </TableWrapper>
        );
      }
      return null;
    }}
  </DocsContext.Consumer>
);
