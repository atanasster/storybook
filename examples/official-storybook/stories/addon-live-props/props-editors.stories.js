import React from 'react';
import PropTypes from 'prop-types';

export default {
  title: 'Addons/Live Props/examples',
};

export const dynamicProps = ({ showOptional }) => {
  return (
    <>
      <div>I must be here</div>
      {showOptional === 'yes' ? <div>Optional, I can disappear</div> : null}
    </>
  );
};

dynamicProps.propTypes = {
  showOptional: PropTypes.string.isRequired,
};

dynamicProps.story = {
  properties: {
    showOptional: {
      type: 'options',
      label: 'Show optional',
      defaultValue: 'yes',
      options: ['yes', 'no'],
      display: 'select',
    },
  },
};

export const radioEnum = ({ radio }) => radio;
radioEnum.story = {
  properties: {
    radio: {
      type: 'options',
      label: 'Radio',
      defaultValue: 'Monday',
      display: 'radio',
      options: {
        Monday: 'Monday',
        Tuesday: 'Tuesday',
        Wednesday: 'Wednesday',
      },
    },
  },
};

export const textProp = ({ text }) => text;

textProp.story = {
  properties: {
    text: { type: 'text', label: 'Text', defaultValue: 'Hello' },
  },
};
