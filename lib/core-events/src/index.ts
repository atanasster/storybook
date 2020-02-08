enum events {
  CHANNEL_CREATED = 'channelCreated',
  GET_CURRENT_STORY = 'getCurrentStory',
  SET_CURRENT_STORY = 'setCurrentStory',
  GET_STORIES = 'getStories',
  SET_STORIES = 'setStories',
  STORIES_CONFIGURED = 'storiesConfigured',
  SELECT_STORY = 'selectStory',
  PREVIEW_KEYDOWN = 'previewKeydown',
  STORY_ADDED = 'storyAdded',
  STORY_CHANGED = 'storyChanged',
  STORY_UNCHANGED = 'storyUnchanged',
  FORCE_RE_RENDER = 'forceReRender',
  REGISTER_SUBSCRIPTION = 'registerSubscription',
  STORY_INIT = 'storyInit',
  STORY_RENDER = 'storyRender',
  STORY_RENDERED = 'storyRendered',
  STORY_MISSING = 'storyMissing',
  STORY_ERRORED = 'storyErrored',
  STORY_THREW_EXCEPTION = 'storyThrewException',
  STORIES_COLLAPSE_ALL = 'storiesCollapseAll',
  STORIES_EXPAND_ALL = 'storiesExpandAll',
  DOCS_RENDERED = 'docsRendered',
  STORY_SET_CONTROL_VALUE = 'storySetControlValue',
  STORY_CLICK_CONTROL = 'storyClickControl',
  SHARED_STATE_CHANGED = 'sharedStateChanged',
  SHARED_STATE_SET = 'sharedStateSet',
  NAVIGATE_URL = 'navigateUrl',
}

// Enables: `import Events from ...`
export default events;

// Enables: `import * as Events from ...` or `import { CHANNEL_CREATED } as Events from ...`
// This is the preferred method
export const {
  CHANNEL_CREATED,
  GET_CURRENT_STORY,
  SET_CURRENT_STORY,
  GET_STORIES,
  SET_STORIES,
  STORIES_CONFIGURED,
  SELECT_STORY,
  PREVIEW_KEYDOWN,
  FORCE_RE_RENDER,
  REGISTER_SUBSCRIPTION,
  STORY_INIT,
  STORY_ADDED,
  STORY_RENDER,
  STORY_RENDERED,
  STORY_MISSING,
  STORY_ERRORED,
  STORY_CHANGED,
  STORIES_COLLAPSE_ALL,
  STORIES_EXPAND_ALL,
  STORY_THREW_EXCEPTION,
  DOCS_RENDERED,
  STORY_SET_CONTROL_VALUE,
  STORY_CLICK_CONTROL,
  SHARED_STATE_CHANGED,
  SHARED_STATE_SET,
  NAVIGATE_URL,
} = events;
