import React, { FunctionComponent, useContext } from 'react';
import { isNil } from 'lodash';
import {
  PropsTable,
  PropsTableError,
  PropsTableProps,
  PropsTableRowsProps,
  PropsTableSectionsProps,
  TabsState,
} from '@storybook/components';
import { PropsExtractor } from '../lib/docgen/types';
import { inferPropsExtractor, filterRows } from './propExtract';
import { DocsContext, DocsContextProps } from './DocsContext';
import { Component, PropsSlot, CURRENT_SELECTION } from './shared';
import { getComponentName } from './utils';

interface PropsProps {
  exclude?: string[];
  of?: '.' | Component;
  components?: {
    [label: string]: Component;
  };
  slot?: PropsSlot;
}

export const getComponentProps = (
  component: Component,
  { exclude }: PropsProps,
  { parameters, ...context }: DocsContextProps
): PropsTableProps => {
  if (!component) {
    return null;
  }
  try {
    const params = parameters || {};
    const { framework = null } = params;

    const { extractProps = inferPropsExtractor(framework) }: { extractProps: PropsExtractor } =
      params.docs || {};
    if (!extractProps) {
      throw new Error(PropsTableError.PROPS_UNSUPPORTED);
    }
    let props = extractProps(component);
    const { rows } = props as PropsTableRowsProps;
    if (!isNil(exclude)) {
      const { sections } = props as PropsTableSectionsProps;
      if (rows) {
        props = { rows: filterRows(rows, exclude) };
      } else if (sections) {
        Object.keys(sections).forEach(section => {
          sections[section] = filterRows(sections[section], exclude);
        });
      }
    }
    const api: any = (context as any).clientApi;
    const story = context.storyStore.fromId(context.id) || {};

    return {
      ...props,
      propProps: {
        storyId: story.id,
        properties: story.properties,
        setPropertyValue: api.setPropertyValue,
        resetPropertyValue: api.resetPropertyValue,
        clickProperty: api.clickProperty,
      },
    };
  } catch (err) {
    return { error: err.message };
  }
};

export const getComponent = (props: PropsProps = {}, context: DocsContextProps): Component => {
  const { of } = props;
  const { parameters = {} } = context;
  const { component } = parameters;

  const target = of === CURRENT_SELECTION ? component : of;
  if (!target) {
    if (of === CURRENT_SELECTION) {
      return null;
    }
    throw new Error(PropsTableError.NO_COMPONENT);
  }
  return target;
};

const PropsContainer: FunctionComponent<PropsProps> = props => {
  const context = useContext(DocsContext);
  const { slot, components } = props;
  const {
    parameters: { subcomponents },
  } = context;

  let allComponents = components;
  if (!allComponents) {
    const main = getComponent(props, context);
    const mainLabel = getComponentName(main);
    const mainProps = slot ? slot(context, main) : getComponentProps(main, props, context);

    if (!subcomponents || typeof subcomponents !== 'object') {
      return mainProps && <PropsTable {...mainProps} />;
    }

    allComponents = { [mainLabel]: main, ...subcomponents };
  }

  const tabs: { label: string; table: PropsTableProps }[] = [];
  Object.entries(allComponents).forEach(([label, component]) => {
    tabs.push({
      label,
      table: slot ? slot(context, component) : getComponentProps(component, props, context),
    });
  });

  return (
    <TabsState>
      {tabs.map(({ label, table }) => {
        if (!table) {
          return null;
        }
        const id = `prop_table_div_${label}`;
        return (
          <div key={id} id={id} title={label}>
            {({ active }: { active: boolean }) =>
              active ? <PropsTable key={`prop_table_${label}`} {...table} /> : null
            }
          </div>
        );
      })}
    </TabsState>
  );
};

PropsContainer.defaultProps = {
  of: '.',
};

export { PropsContainer as Props };
