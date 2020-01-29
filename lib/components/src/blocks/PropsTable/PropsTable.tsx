import React, { FC } from 'react';
import { styled } from '@storybook/theming';
import { opacify, transparentize, darken, lighten } from 'polished';
import { PropRow, PropRowProps } from './PropRow';
import { SectionRow, SectionRowProps } from './SectionRow';
import { PropDef, PropType, PropDefaultValue, PropSummaryValue } from './PropDef';
import { EmptyBlock } from '../EmptyBlock';
import { ResetWrapper } from '../../typography/DocumentFormatting';
import { PropEditorsTableProps, PropertyEditor, getPropertyEditor } from '../../prop-editors';

export const Table = styled.table<{}>(({ theme }) => ({
  '&&': {
    // Resets for cascading/system styles
    borderCollapse: 'collapse',
    borderSpacing: 0,
    color: theme.color.defaultText,
    tr: {
      border: 'none',
      background: 'none',
    },

    'td, th': {
      padding: 0,
      border: 'none',
      verticalAlign: 'top',
    },
    // End Resets

    fontSize: theme.typography.size.s2,
    lineHeight: '20px',
    textAlign: 'left',
    width: '100%',

    // Margin collapse
    marginTop: 25,
    marginBottom: 40,

    'th:first-of-type, td:first-of-type': {
      paddingLeft: 20,
    },

    'th:last-of-type, td:last-of-type': {
      paddingRight: 20,
      width: '20%',
    },

    th: {
      color:
        theme.base === 'light'
          ? transparentize(0.25, theme.color.defaultText)
          : transparentize(0.45, theme.color.defaultText),
      paddingTop: 10,
      paddingBottom: 10,

      '&:not(:first-of-type)': {
        paddingLeft: 15,
        paddingRight: 15,
      },
    },

    td: {
      paddingTop: '16px',
      paddingBottom: '16px',

      '&:not(:first-of-type)': {
        paddingLeft: 15,
        paddingRight: 15,
      },

      '&:last-of-type': {
        paddingRight: 20,
      },
    },

    // Table "block" styling
    // Emphasize tbody's background and set borderRadius
    // Calling out because styling tables is finicky

    // Makes border alignment consistent w/other DocBlocks
    marginLeft: 1,
    marginRight: 1,

    'tr:first-child': {
      'td:first-child, th:first-child': {
        borderTopLeftRadius: theme.appBorderRadius,
      },
      'td:last-child, th:last-child': {
        borderTopRightRadius: theme.appBorderRadius,
      },
    },

    'tr:last-child': {
      'td:first-child, th:first-child': {
        borderBottomLeftRadius: theme.appBorderRadius,
      },
      'td:last-child, th:last-child': {
        borderBottomRightRadius: theme.appBorderRadius,
      },
    },

    tbody: {
      // slightly different than the other DocBlock shadows to account for table styling gymnastics
      boxShadow:
        theme.base === 'light'
          ? `rgba(0, 0, 0, 0.10) 0 1px 3px 1px,
          ${transparentize(0.035, theme.appBorderColor)} 0 0 0 1px`
          : `rgba(0, 0, 0, 0.20) 0 2px 5px 1px,
          ${opacify(0.05, theme.appBorderColor)} 0 0 0 1px`,
      borderRadius: theme.appBorderRadius,

      tr: {
        background: 'transparent',
        overflow: 'hidden',
        '&:not(:first-child)': {
          borderTopWidth: 1,
          borderTopStyle: 'solid',
          borderTopColor:
            theme.base === 'light'
              ? darken(0.1, theme.background.content)
              : lighten(0.05, theme.background.content),
        },
      },

      td: {
        background: theme.background.content,
      },
    },
    // End finicky table styling
  },
}));

export enum PropsTableError {
  NO_COMPONENT = 'No component found',
  PROPS_UNSUPPORTED = 'Props unsupported. See Props documentation for your framework.',
}

export interface PropsTableRowsProps {
  rows: PropDef[];
  propProps?: PropEditorsTableProps;
}

export interface PropsTableSectionsProps {
  sections?: Record<string, PropDef[]>;
}

export interface PropsTableErrorProps {
  error: PropsTableError;
}

export type PropsTableProps = PropsTableRowsProps | PropsTableSectionsProps | PropsTableErrorProps;

type PropsTableRowProps = PropRowProps & {
  propProps?: PropEditorsTableProps;
};
const PropsTableRow: FC<SectionRowProps | PropsTableRowProps> = props => {
  const { section } = props as SectionRowProps;
  if (section) {
    return <SectionRow section={section} />;
  }
  const { row, propProps } = props as PropsTableRowProps;

  const field = propProps && propProps.properties ? propProps.properties[row.name] : undefined;
  let control: React.ReactNode | undefined;
  const { setPropertyValue, clickProperty, storyId } = propProps || {};
  const onChange = (propName: string, value: any) => {
    if (setPropertyValue && storyId) {
      setPropertyValue(storyId, propName, value);
    }
  };
  const onClick = () => {
    if (clickProperty && storyId) {
      clickProperty(storyId, row.name, field);
    }
  };
  if (field) {
    const InputType: PropertyEditor = getPropertyEditor(field.type);
    if (InputType) {
      control = <InputType prop={field} name={row.name} onChange={onChange} onClick={onClick} />;
    }
  }
  return <PropRow row={row} control={control} />;
};

/**
 * Display the props for a component as a props table. Each row is a collection of
 * PropDefs, usually derived from docgen info for the component.
 */
const PropsTable: FC<PropsTableProps> = props => {
  const { error } = props as PropsTableErrorProps;
  if (error) {
    return <EmptyBlock>{error}</EmptyBlock>;
  }

  let allRows: any[] = [];
  const { sections } = props as PropsTableSectionsProps;
  const { rows, propProps } = props as PropsTableRowsProps;
  if (sections) {
    Object.keys(sections).forEach(section => {
      const sectionRows = sections[section];
      if (sectionRows && sectionRows.length > 0) {
        allRows.push({ key: section, value: { section } });
        sectionRows.forEach(row => {
          allRows.push({
            key: `${section}_${row.name}`,
            value: { row },
          });
        });
      }
    });
  } else if (rows) {
    allRows = rows.map(row => ({
      key: row.name,
      value: { row },
    }));
  }

  if (allRows.length === 0) {
    return <EmptyBlock>No props found for this component</EmptyBlock>;
  }

  const hasSmartControls = propProps && propProps.properties;

  return (
    <ResetWrapper>
      <Table className="docblock-propstable">
        <thead className="docblock-propstable-head">
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Default</th>
            {hasSmartControls && <th>Edit</th>}
          </tr>
        </thead>
        <tbody className="docblock-propstable-body">
          {allRows.map(row => (
            <PropsTableRow key={row.key} {...row.value} propProps={propProps} />
          ))}
        </tbody>
      </Table>
    </ResetWrapper>
  );
};

export { PropsTable, PropDef, PropType, PropDefaultValue, PropSummaryValue };
