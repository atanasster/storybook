import React from 'react';
import qs from 'qs';
import { document } from 'global';
import { StoryProperties, StoryProperty } from '@storybook/core-events';
import { Combo, Consumer, API, StoryInput } from '@storybook/api';
import { styled } from '@storybook/theming';
import copy from 'copy-to-clipboard';

import { TabWrapper, TabsState, ActionBar, ScrollArea } from '@storybook/components';
import { NoProperties } from './NoProperties';

import { PropForm } from './PropForm';

export const DEFAULT_GROUP_ID = 'Other';

const PanelWrapper = styled(({ children, className }) => (
  <ScrollArea horizontal vertical className={className}>
    {children}
  </ScrollArea>
))({
  height: '100%',
  width: '100%',
});

interface PanelPropsGroups {
  title: string;
  render: (props: any) => any;
}

interface PropsPanelProps {
  active: boolean;
  api: API;
}

interface MapperReturnProps {
  story?: StoryInput;
  properties?: StoryProperties;
}
const mapper = ({ state }: Combo): MapperReturnProps => {
  const { storyId } = state;
  if (!state.storiesHash[storyId]) {
    return {};
  }
  const { properties } = state.storiesHash[state.storyId] as StoryInput;
  return { story: state.storiesHash[storyId] as StoryInput, properties };
};

const copyProps = (props: StoryProperties) => {
  const { location } = document;
  const query = qs.parse(location.search, { ignoreQueryPrefix: true });

  copy(`${location.origin + location.pathname}?${qs.stringify(query, { encode: false })}`);
};

const handlePropChange = (api: API, story: StoryInput, name: string, newValue: any) => {
  const { setPropertyValue } = api;
  setPropertyValue(story.id, name, newValue);
};

const handlePropClick = (api: API, storyId: string, name: string, prop: StoryProperty) => {
  const { clickProperty } = api;
  clickProperty(storyId, name, prop);
};

const propEntries = (api: API, story: StoryInput, props: StoryProperties) => {
  const groups: Record<string, PanelPropsGroups> = {};
  const groupIds: string[] = [];

  const handleClick = (name: string, prop: StoryProperty) => {
    handlePropClick(api, story.id, name, prop);
  };
  Object.keys(props).forEach(key => {
    const prop: StoryProperty = props[key];
    const propKeyGroupId = prop.groupId || DEFAULT_GROUP_ID;
    groupIds.push(propKeyGroupId);
    groups[propKeyGroupId] = {
      render: ({ active }) => (
        <TabWrapper key={propKeyGroupId} active={active}>
          <PropForm
            props={Object.keys(props)
              .filter(k => {
                const p = props[k];
                return (p.groupId || DEFAULT_GROUP_ID) === propKeyGroupId;
              })
              .reduce((acc: StoryProperties, k: string) => ({ ...acc, [k]: props[k] }), {})}
            onFieldChange={(name: string, newValue: any) =>
              handlePropChange(api, story, name, newValue)
            }
            onFieldClick={handleClick}
          />
        </TabWrapper>
      ),
      title: propKeyGroupId,
    };
  });

  // Always sort DEFAULT_GROUP_ID (ungrouped) tab last without changing the remaining tabs
  const sortEntries = (g: Record<string, PanelPropsGroups>): [string, PanelPropsGroups][] => {
    const unsortedKeys = Object.keys(g);
    if (unsortedKeys.includes(DEFAULT_GROUP_ID)) {
      const sortedKeys = unsortedKeys.filter(key => key !== DEFAULT_GROUP_ID);
      sortedKeys.push(DEFAULT_GROUP_ID);
      return sortedKeys.map<[string, PanelPropsGroups]>(key => [key, g[key]]);
    }
    return Object.entries(g);
  };

  return sortEntries(groups);
};
export const PropsPanel: React.FC<PropsPanelProps> = ({ api, active: panelActive }) => {
  if (!panelActive) {
    return null;
  }
  return (
    <Consumer filter={mapper}>
      {p => {
        const { properties, story } = p as MapperReturnProps;
        const props: StoryProperties = properties
          ? Object.keys(properties)
              .filter(key => !properties[key].hidden)
              .reduce((a, key: string) => {
                const prop = properties[key];
                return { ...a, [key]: prop };
              }, {})
          : {};
        if (!story || !Object.keys(props).length) {
          return <NoProperties />;
        }
        const entries = propEntries(api, story, props);
        // console.log(entries);
        return (
          <>
            <PanelWrapper>
              {entries.length > 1 ? (
                <TabsState>
                  {entries.map(([k, v]) => (
                    <div id={k} key={k} title={v.title}>
                      {v.render}
                    </div>
                  ))}
                </TabsState>
              ) : (
                <PropForm
                  props={props}
                  onFieldChange={(name: string, newValue: any) =>
                    handlePropChange(api, story, name, newValue)
                  }
                  onFieldClick={(name: string, prop: StoryProperty) => {
                    handlePropClick(api, story.id, name, prop);
                  }}
                />
              )}
            </PanelWrapper>
            <ActionBar
              actionItems={[
                { title: 'Copy', onClick: () => copyProps(props) },
                { title: 'Reset', onClick: () => api.resetPropertyValue(story.id) },
              ]}
            />
          </>
        );
      }}
    </Consumer>
  );
};
