import React, { PureComponent } from 'react';
import qs from 'qs';
import { document } from 'global';
import {
  StoryProperty,
  StoryProperties,
  StoryValues,
  Combo,
  Consumer,
  API,
  StoryInput,
} from '@storybook/api';
import { styled } from '@storybook/theming';
import copy from 'copy-to-clipboard';

import { STORY_CHANGED } from '@storybook/core-events';
import { TabWrapper, TabsState, ActionBar, ScrollArea } from '@storybook/components';

import { NoProperties } from './NoProperties';

import { SET, CHANGE } from '../shared';

import { getKnobControl } from './types';
import PropForm from './PropForm';
import { KnobStoreKnob, StoryPropertiesArray } from '../KnobStore';

const getTimestamp = () => +new Date();

export const DEFAULT_GROUP_ID = 'Other';

const PanelWrapper = styled(({ children, className }) => (
  <ScrollArea horizontal vertical className={className}>
    {children}
  </ScrollArea>
))({
  height: '100%',
  width: '100%',
});

interface PanelKnobGroups {
  title: string;
  render: (knob: any) => any;
}

interface KnobPanelProps {
  active: boolean;
  onReset?: object;
  api: API;
}

interface KnobPanelState {
  knobs: Record<string, KnobStoreKnob>;
}

interface KnobPanelOptions {
  timestamps?: boolean;
}

interface MapperReturnProps {
  story?: StoryInput;
  properties?: StoryProperties;
  values?: StoryValues;
}
const mapper = ({ state }: Combo): MapperReturnProps => {
  const { storyId } = state;
  if (!state.storiesHash[storyId]) {
    return {};
  }
  const { properties, values } = state.storiesHash[state.storyId] as StoryInput;
  return { story: state.storiesHash[storyId] as StoryInput, properties, values };
};

const copyProps = (props: StoryPropertiesArray) => {
  const { location } = document;
  const query = qs.parse(location.search, { ignoreQueryPrefix: true });

  props.forEach(prop => {
    query[`knob-${prop.name}`] = getKnobControl(prop.type).serialize(prop.value);
  });

  copy(`${location.origin + location.pathname}?${qs.stringify(query, { encode: false })}`);
};

const handlePropChange = (
  api: API,
  story: StoryInput,
  props: StoryPropertiesArray,
  changedKnob: StoryProperty
) => {
  const { setPropertyValue } = api;
  const { value } = changedKnob;
  setPropertyValue(story.id, changedKnob.name, value);
  const queryParams: { [key: string]: any } = {};

  props.forEach(p => {
    const prop = p.name === changedKnob.name ? changedKnob : p;
    queryParams[`knob-${prop.name}`] = getKnobControl(p.type).serialize(prop.value);
  });

  // api.setQueryParams(queryParams);
};

const handlePropClick = (api: API, storyId: string, knob: StoryProperty) => {
  const { clickProperty } = api;
  clickProperty(storyId, knob.name, knob);
};

const propEntries = (api: API, story: StoryInput, props: StoryPropertiesArray) => {
  const groups: Record<string, PanelKnobGroups> = {};
  const groupIds: string[] = [];

  const handleClick = (prop: StoryProperty) => {
    handlePropClick(api, story.id, prop);
  };
  props.forEach(prop => {
    const knobKeyGroupId = prop.groupId || DEFAULT_GROUP_ID;
    groupIds.push(knobKeyGroupId);
    groups[knobKeyGroupId] = {
      render: ({ active }) => (
        <TabWrapper key={knobKeyGroupId} active={active}>
          <PropForm
            // eslint-disable-next-line react/destructuring-assignment
            props={props.filter(p => (p.groupId || DEFAULT_GROUP_ID) === knobKeyGroupId)}
            onFieldChange={changedKnob => handlePropChange(api, story, props, changedKnob)}
            onFieldClick={handleClick}
          />
        </TabWrapper>
      ),
      title: knobKeyGroupId,
    };
  });

  // Always sort DEFAULT_GROUP_ID (ungrouped) tab last without changing the remaining tabs
  const sortEntries = (g: Record<string, PanelKnobGroups>): [string, PanelKnobGroups][] => {
    const unsortedKeys = Object.keys(g);
    if (unsortedKeys.includes(DEFAULT_GROUP_ID)) {
      const sortedKeys = unsortedKeys.filter(key => key !== DEFAULT_GROUP_ID);
      sortedKeys.push(DEFAULT_GROUP_ID);
      return sortedKeys.map<[string, PanelKnobGroups]>(key => [key, g[key]]);
    }
    return Object.entries(g);
  };

  return sortEntries(groups);
};
export default class KnobPanel extends PureComponent<KnobPanelProps> {
  static defaultProps = {
    active: true,
  };

  state: KnobPanelState = {
    knobs: {},
  };

  options: KnobPanelOptions = {};

  lastEdit: number = getTimestamp();

  loadedFromUrl = false;

  mounted = false;

  componentDidMount() {
    this.mounted = true;
    const { api } = this.props;
    api.on(SET, this.setKnobs);

    this.stopListeningOnStory = api.on(STORY_CHANGED, () => {
      if (this.mounted) {
        this.setKnobs({ knobs: {} });
      }
      this.setKnobs({ knobs: {} });
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    const { api } = this.props;

    api.off(SET, this.setKnobs);
    this.stopListeningOnStory();
  }

  setKnobs = ({
    knobs,
    timestamp,
  }: {
    knobs: Record<string, KnobStoreKnob>;
    timestamp?: number;
  }) => {
    const queryParams: Record<string, any> = {};
    const { api } = this.props;

    if (!this.options.timestamps || !timestamp || this.lastEdit <= timestamp) {
      Object.keys(knobs).forEach(name => {
        const knob = knobs[name];
        // For the first time, get values from the URL and set them.
        if (!this.loadedFromUrl) {
          const urlValue = api.getQueryParam(`knob-${name}`);

          // If the knob value present in url
          if (urlValue !== undefined) {
            const value = getKnobControl(knob.type).deserialize(urlValue);
            knob.value = value;
            queryParams[`knob-${name}`] = getKnobControl(knob.type).serialize(value);

            api.emit(CHANGE, knob);
          }
        }
      });

      api.setQueryParams(queryParams);
      this.setState({ knobs });

      this.loadedFromUrl = true;
    }
  };

  emitChange = (changedKnob: KnobStoreKnob) => {
    const { api } = this.props;

    api.emit(CHANGE, changedKnob);
  };

  handleChange = (changedKnob: KnobStoreKnob) => {
    this.lastEdit = getTimestamp();
    const { api } = this.props;
    const { knobs } = this.state;
    const { name } = changedKnob;
    const newKnobs = { ...knobs };
    newKnobs[name] = {
      ...newKnobs[name],
      ...changedKnob,
    };

    this.setState({ knobs: newKnobs }, () => {
      this.emitChange(changedKnob);

      const queryParams: { [key: string]: any } = {};

      Object.keys(newKnobs).forEach(n => {
        const knob = newKnobs[n];
        queryParams[`knob-${n}`] = getKnobControl(knob.type).serialize(knob.value);
      });

      api.setQueryParams(queryParams);
    });
  };

  stopListeningOnStory!: Function;

  render() {
    const { api, active: panelActive } = this.props;
    if (!panelActive) {
      return null;
    }
    return (
      <Consumer filter={mapper}>
        {props => {
          const { properties, values, story } = props as MapperReturnProps;
          const propsArray: StoryPropertiesArray = properties
            ? Object.keys(properties)
                .filter(key => !properties[key].hidden)
                .reduce((a: StoryPropertiesArray, key: string) => {
                  const prop = properties[key];
                  return [...a, { ...prop, name: key, value: values ? values[key] : undefined }];
                }, [])
            : [];
          if (!story || !propsArray.length) {
            return <NoProperties />;
          }
          const entries = propEntries(api, story, propsArray);
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
                    props={propsArray}
                    onFieldChange={changedKnob =>
                      handlePropChange(api, story, propsArray, changedKnob)
                    }
                    onFieldClick={prop => {
                      handlePropClick(api, story.id, prop);
                    }}
                  />
                )}
              </PanelWrapper>
              <ActionBar
                actionItems={[
                  { title: 'Copy', onClick: () => copyProps(propsArray) },
                  { title: 'Reset', onClick: () => {} },
                ]}
              />
            </>
          );
        }}
      </Consumer>
    );
  }
}
