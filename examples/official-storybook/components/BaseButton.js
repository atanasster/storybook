import React from 'react';
import PropTypes from 'prop-types';

/** BaseButton component description imported from comments inside the component file */
const BaseButton = ({ disabled, label, onClick, style, backgroundColor, color, type }) => (
  // eslint-disable-next-line react/button-has-type
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    style={{ ...style, backgroundColor, color }}
  >
    {label}
  </button>
);

BaseButton.defaultProps = {
  disabled: false,
  onClick: () => {},
  style: {},
  backgroundColor: 'buttonface',
  color: 'black',
  type: 'button',
};

BaseButton.propTypes = {
  /** Boolean indicating whether the button should render as disabled */
  disabled: PropTypes.bool,
  /** button label. */
  label: PropTypes.string.isRequired,
  /** onClick handler */
  onClick: PropTypes.func,
  /** Custom styles */
  style: PropTypes.shape({}),

  /** Background color */
  backgroundColor: PropTypes.string,

  /** Text color, default black */
  color: PropTypes.string,

  /** Button type */
  type: PropTypes.oneOf(['button', 'reset', 'submit']),
};

export default BaseButton;
