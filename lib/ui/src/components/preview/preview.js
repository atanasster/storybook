import window from 'global';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizerific';
import copy from 'copy-to-clipboard';
import { styled } from '@storybook/theming';
import { Consumer } from '@storybook/api';
import { SET_CURRENT_STORY } from '@storybook/core-events';
import addons, { types } from '@storybook/addons';
import merge from '@storybook/api/dist/lib/merge';
import { Icons, IconButton, Loader, TabButton, TabBar, Separator } from '@storybook/components';

import { Helmet } from 'react-helmet-async';

import { Toolbar } from './toolbar';

import * as S from './components';

import { ZoomProvider, ZoomConsumer, Zoom } from './zoom';

import { IFrame } from './iframe';

const DesktopOnly = styled.span({
  // Hides full screen icon at mobile breakpoint defined in app.js
  '@media (max-width: 599px)': {
    display: 'none',
  },
});
const stringifyQueryParams = queryParams =>
  Object.entries(queryParams).reduce((acc, [k, v]) => {
    return `${acc}&${k}=${v}`;
  }, '');

const renderIframe = (storyId, viewMode, id, baseUrl, scale, queryParams) => (
  <IFrame
    key="iframe"
    id="storybook-preview-iframe"
    title={id || 'preview'}
    src={`${baseUrl}?id=${storyId}&viewMode=${viewMode}${stringifyQueryParams(queryParams)}`}
    allowFullScreen
    scale={scale}
  />
);

const getElementList = memoize(10)((getFn, type, base) => base.concat(Object.values(getFn(type))));

const ActualPreview = ({
  wrappers,
  viewMode,
  id,
  storyId,
  active,
  baseUrl,
  scale,
  queryParams,
  customCanvas,
}) => {
  const data = [storyId, viewMode, id, baseUrl, scale, queryParams];
  const base = customCanvas ? customCanvas(...data) : renderIframe(...data);
  return wrappers.reduceRight(
    (acc, wrapper, index) => wrapper.render({ index, children: acc, id, storyId, active }),
    base
  );
};

const IframeWrapper = styled.div(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: '100%',
  height: '100%',
  background: theme.background.content,
}));

const defaultWrappers = [
  {
    render: p => (
      <IframeWrapper id="storybook-preview-wrapper" hidden={!p.active}>
        {p.children}
      </IframeWrapper>
    ),
  },
];

const getTools = memoize(10)(
  (
    getElements,
    queryParams,
    panels,
    api,
    options,
    storyId,
    viewMode,
    docsOnly,
    location,
    path,
    baseUrl
  ) => {
    const tools = getElementList(getElements, types.TOOL, [
      panels.filter(p => !p.hidden).length > 1
        ? {
            render: () => (
              <Fragment>
                <TabBar key="tabs" scroll={false}>
                  {panels
                    .filter(p => !p.hidden)
                    .map((t, index) => {
                      const to = t.route({ storyId, viewMode, path, location });
                      const isActive = path === to;
                      return (
                        <S.UnstyledLink key={t.id || `l${index}`} to={to}>
                          <TabButton disabled={t.disabled} active={isActive}>
                            {t.title}
                          </TabButton>
                        </S.UnstyledLink>
                      );
                    })}
                </TabBar>
                <Separator />
              </Fragment>
            ),
          }
        : null,
      {
        match: p => p.viewMode === 'story',
        render: () => (
          <Fragment>
            <ZoomConsumer>
              {({ set, value }) => (
                <Zoom key="zoom" current={value} set={v => set(value * v)} reset={() => set(1)} />
              )}
            </ZoomConsumer>
            <Separator />
          </Fragment>
        ),
      },
    ]);

    const extraTools = getElementList(getElements, types.TOOLEXTRA, [
      {
        match: p => p.viewMode === 'story',
        render: () => (
          <DesktopOnly>
            <IconButton
              key="full"
              onClick={api.toggleFullscreen}
              title={options.isFullscreen ? 'Exit full screen' : 'Go full screen'}
            >
              <Icons icon={options.isFullscreen ? 'close' : 'expand'} />
            </IconButton>
          </DesktopOnly>
        ),
      },
      {
        match: p => p.viewMode === 'story',
        render: () => (
          <IconButton
            key="opener"
            href={`${baseUrl}?id=${storyId}${stringifyQueryParams(queryParams)}`}
            target="_blank"
            title="Open canvas in new tab"
          >
            <Icons icon="share" />
          </IconButton>
        ),
      },
      {
        match: p => p.viewMode === 'story',
        render: () => (
          <IconButton
            key="copy"
            onClick={() =>
              copy(
                `${window.location.origin}${
                  window.location.pathname
                }${baseUrl}?id=${storyId}${stringifyQueryParams(queryParams)}`
              )
            }
            title="Copy canvas link"
          >
            <Icons icon="copy" />
          </IconButton>
        ),
      },
    ]);
    // if its a docsOnly page, even the 'story' view mode is considered 'docs'
    const filter = item =>
      item &&
      (!item.match ||
        item.match({
          storyId,
          viewMode: docsOnly && viewMode === 'story' ? 'docs' : viewMode,
          location,
          path,
        }));

    const displayItems = list =>
      list.reduce(
        (acc, item, index) =>
          item ? (
            <Fragment key={item.id || item.key || `f-${index}`}>
              {acc}
              {item.render() || item}
            </Fragment>
          ) : (
            acc
          ),
        null
      );

    const left = displayItems(tools.filter(filter));
    const right = displayItems(extraTools.filter(filter));

    return { left, right };
  }
);

const getDocumentTitle = description => {
  return description ? `${description} ⋅ Storybook` : 'Storybook';
};

const mapper = ({ state }) => ({
  loading: !state.storiesConfigured,
});

class Preview extends Component {
  shouldComponentUpdate({ storyId, viewMode, docsOnly, options, queryParams, parameters }) {
    const { props } = this;

    return (
      options.isFullscreen !== props.options.isFullscreen ||
      options.isToolshown !== props.options.isToolshown ||
      viewMode !== props.viewMode ||
      docsOnly !== props.docsOnly ||
      storyId !== props.storyId ||
      queryParams !== props.queryParams ||
      parameters !== props.parameters
    );
  }

  componentDidUpdate(prevProps) {
    const { api, storyId, viewMode } = this.props;
    const { storyId: prevStoryId, viewMode: prevViewMode } = prevProps;
    if ((storyId && storyId !== prevStoryId) || (viewMode && viewMode !== prevViewMode)) {
      api.emit(SET_CURRENT_STORY, { storyId, viewMode });
    }
  }

  render() {
    const {
      id,
      path,
      location,
      viewMode,
      docsOnly,
      storyId,
      queryParams,
      getElements,
      api,
      customCanvas,
      options,
      description,
      baseUrl,
      parameters,
      withLoader,
    } = this.props;
    const toolbarHeight = options.isToolshown ? 40 : 0;
    const wrappers = getElementList(getElements, types.PREVIEW, defaultWrappers);
    let panels = getElementList(getElements, types.TAB, [
      {
        route: p => `/story/${p.storyId}`,
        match: p => p.viewMode && p.viewMode.match(/^(story|docs)$/),
        render: p => (
          <ZoomConsumer>
            {({ value }) => {
              const props = {
                viewMode,
                active: p.active,
                wrappers,
                id,
                storyId,
                baseUrl,
                queryParams,
                scale: value,
                customCanvas,
              };

              return (
                <>
                  {withLoader && (
                    <Consumer filter={mapper}>
                      {state => state.loading && <Loader id="preview-loader" role="progressbar" />}
                    </Consumer>
                  )}
                  <ActualPreview {...props} />
                </>
              );
            }}
          </ZoomConsumer>
        ),
        title: 'Canvas',
        id: 'canvas',
      },
    ]);
    const { previewTabs } = addons.getConfig();
    const parametersTabs = parameters ? parameters.previewTabs : undefined;
    if (previewTabs || parametersTabs) {
      // deep merge global and local settings
      const tabs = merge(previewTabs, parametersTabs);
      const arrTabs = Object.keys(tabs).map((key, index) => ({
        index,
        ...(typeof tabs[key] === 'string' ? { title: tabs[key] } : tabs[key]),
        id: key,
      }));
      panels = panels
        .filter(panel => {
          const t = arrTabs.find(tab => tab.id === panel.id);
          return t === undefined || t.id === 'canvas' || !t.hidden;
        })
        .map((panel, index) => ({ ...panel, index }))
        .sort((p1, p2) => {
          const tab_1 = arrTabs.find(tab => tab.id === p1.id);
          const index_1 = tab_1 ? tab_1.index : arrTabs.length + p1.index;
          const tab_2 = arrTabs.find(tab => tab.id === p2.id);
          const index_2 = tab_2 ? tab_2.index : arrTabs.length + p2.index;
          return index_1 - index_2;
        })
        .map(panel => {
          const t = arrTabs.find(tab => tab.id === panel.id);
          if (t) {
            return {
              ...panel,
              title: t.title || panel.title,
              disabled: t.disabled,
              hidden: t.hidden,
            };
          }
          return panel;
        });
    }
    const { left, right } = getTools(
      getElements,
      queryParams,
      panels,
      api,
      options,
      storyId,
      viewMode,
      docsOnly,
      location,
      path,
      baseUrl
    );

    return (
      <ZoomProvider>
        <Fragment>
          {id === 'main' && (
            <Helmet key="description">
              <title>{getDocumentTitle(description)}</title>
            </Helmet>
          )}
          {(left || right) && (
            <Toolbar key="toolbar" shown={options.isToolshown} border>
              <Fragment key="left">{left}</Fragment>
              <Fragment key="right">{right}</Fragment>
            </Toolbar>
          )}
          <S.FrameWrap key="frame" offset={toolbarHeight}>
            {panels.map(p => (
              <Fragment key={p.id || p.key}>
                {p.render({ active: p.match({ storyId, viewMode, location, path }) })}
              </Fragment>
            ))}
          </S.FrameWrap>
        </Fragment>
      </ZoomProvider>
    );
  }
}
Preview.propTypes = {
  id: PropTypes.string.isRequired,
  description: PropTypes.string,
  customCanvas: PropTypes.func,
  api: PropTypes.shape({
    on: PropTypes.func,
    off: PropTypes.func,
    emit: PropTypes.func,
    toggleFullscreen: PropTypes.func,
  }).isRequired,
  storyId: PropTypes.string,
  path: PropTypes.string,
  viewMode: PropTypes.string,
  location: PropTypes.shape({}).isRequired,
  getElements: PropTypes.func.isRequired,
  queryParams: PropTypes.shape({}).isRequired,
  options: PropTypes.shape({
    isFullscreen: PropTypes.bool,
    isToolshown: PropTypes.bool,
  }).isRequired,
  baseUrl: PropTypes.string,
  parameters: PropTypes.shape({
    previewTabs: PropTypes.shape({
      title: PropTypes.string,
      hidden: PropTypes.string,
      disabled: PropTypes.string,
    }),
  }),
  docsOnly: PropTypes.bool,
  withLoader: PropTypes.bool,
};

Preview.defaultProps = {
  viewMode: undefined,
  docsOnly: false,
  storyId: undefined,
  path: undefined,
  description: undefined,
  baseUrl: 'iframe.html',
  customCanvas: undefined,
  parameters: undefined,
  withLoader: true,
};

export { Preview };
