import React from 'react';
import PropTypes from 'prop-types';

export default {
  title: 'Addons/Controls/examples',
};
// using prop shortcut:
// propname: 'xxxxx' will generate 'text' field type

export const textDefaultProp = ({ text }) => text;
textDefaultProp.story = {
  properties: {
    text: 'Hello',
  },
};

export const selectProp = ({ value }) => (
  <div>{JSON.stringify({ value: String(value) }, null, 2)}</div>
);

selectProp.propTypes = {
  value: PropTypes.string,
};

selectProp.defaultProps = {
  value: undefined,
};

selectProp.story = {
  properties: {
    value: {
      type: 'options',
      label: 'Select',
      defaultValue: 1,
      options: [1, 2, 3, undefined, null],
      display: 'select',
    },
  },
};

export const tweaksStaticValues = ({
  userName,
  age,
  fruit,
  otherFruit,
  dollars,
  years,
  backgroundColor,
  color,
  items,
  otherStyles,
  nice,
  images,
  dog,
  birthday,
}) => {
  const intro = `My name is ${userName}, I'm ${age} years old, and my favorite fruit is ${fruit}. I also enjoy ${otherFruit}, and hanging out with my dog ${dog.label}`;
  const style = { backgroundColor, color, ...otherStyles };
  const salutation = nice ? 'Nice to meet you!' : 'Leave me alone!';
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };

  return (
    <div style={style}>
      <p>{intro}</p>
      <p>My birthday is: {new Date(birthday).toLocaleDateString('en-US', dateOptions)}</p>
      <p>I live in NY for {years} years.</p>
      <p>My wallet contains: ${dollars.toFixed(2)}</p>
      <p>In my backpack, I have:</p>
      <ul>{items && items.map(item => <li key={item}>{item}</li>)}</ul>
      <p>{salutation}</p>
      <p>
        When I am happy I look like this: <img src={images[0]} alt="happy" />
      </p>
    </div>
  );
};

tweaksStaticValues.propTypes = {
  userName: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  fruit: PropTypes.string.isRequired,
  otherFruit: PropTypes.string.isRequired,
  dollars: PropTypes.number.isRequired,
  years: PropTypes.number.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  otherStyles: PropTypes.arrayOf(PropTypes.string).isRequired,
  nice: PropTypes.bool.isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  dog: PropTypes.shape({
    label: PropTypes.string,
    dogParent: PropTypes.string,
    location: PropTypes.string,
  }).isRequired,
  birthday: PropTypes.string.isRequired,
};
const arrayOfObjects = [
  {
    label: 'Sparky',
    dogParent: 'Matthew',
    location: 'Austin',
  },
  {
    label: 'Juniper',
    dogParent: 'Joshua',
    location: 'Austin',
  },
];
const GROUP_IDS = {
  DISPLAY: 'Display',
  GENERAL: 'General',
  FAVORITES: 'Favorites',
};

tweaksStaticValues.story = {
  properties: {
    userName: {
      type: 'text',
      label: 'Name',
      defaultValue: 'Storyteller',
      groupId: GROUP_IDS.GENERAL,
    },
    age: {
      type: 'number',
      label: 'Age',
      defaultValue: 78,
      range: true,
      min: 0,
      max: 90,
      step: 5,
      groupId: GROUP_IDS.GENERAL,
    },
    birthday: {
      type: 'date',
      label: 'Birthday',
      defaultValue: new Date(),
      groupId: GROUP_IDS.GENERAL,
    },
    dollars: {
      type: 'number',
      label: 'Dollars',
      defaultValue: 12.5,
      min: 0,
      max: 100,
      step: 0.01,
      groupId: GROUP_IDS.GENERAL,
    },
    years: { type: 'number', label: 'Years in NY', defaultValue: 9, groupId: GROUP_IDS.GENERAL },
    nice: { type: 'boolean', label: 'Nice', defaultValue: true, groupId: GROUP_IDS.FAVORITES },
    items: {
      type: 'array',
      label: 'Items',
      defaultValue: ['Laptop', 'Book', 'Whiskey'],
      groupId: GROUP_IDS.FAVORITES,
    },

    fruit: {
      type: 'options',
      label: 'Fruit',
      defaultValue: 'apple',
      options: {
        Apple: 'apple',
        Banana: 'banana',
        Cherry: 'cherry',
      },
      groupId: GROUP_IDS.FAVORITES,
    },
    otherFruit: {
      type: 'options',
      label: 'Other Fruit',
      defaultValue: 'watermelon',
      options: {
        Kiwi: 'kiwi',
        Guava: 'guava',
        Watermelon: 'watermelon',
      },
      display: 'radio',
      groupId: GROUP_IDS.FAVORITES,
    },
    dog: {
      type: 'select',
      options: arrayOfObjects,
      defaultValue: arrayOfObjects[0],
      groupId: GROUP_IDS.FAVORITES,
    },
    backgroundColor: {
      type: 'color',
      defaultValue: '#dedede',
      groupId: GROUP_IDS.DISPLAY,
    },

    color: {
      type: 'color',
      defaultValue: '#000000',
      groupId: GROUP_IDS.DISPLAY,
    },

    otherStyles: {
      type: 'object',
      label: 'Styles',
      defaultValue: {
        border: '2px dashed silver',
        borderRadius: 10,
        padding: 10,
      },
      groupId: GROUP_IDS.DISPLAY,
    },
    images: {
      type: 'files',
      label: 'Happy Picture',
      accept: 'image/*',
      defaultValue: [
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfiARwMCyEWcOFPAAAAP0lEQVQoz8WQMQoAIAwDL/7/z3GwghSp4KDZyiUpBMCYUgd8rehtH16/l3XewgU2KAzapjXBbNFaPS6lDMlKB6OiDv3iAH1OAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTAxLTI4VDEyOjExOjMzLTA3OjAwlAHQBgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0wMS0yOFQxMjoxMTozMy0wNzowMOVcaLoAAAAASUVORK5CYII=',
      ],
      groupId: GROUP_IDS.DISPLAY,
    },

    hidden: { type: 'text', hidden: true },
  },
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

export const complexSelect = ({ m }) => {
  const value = m.toString();
  const type = Array.isArray(m) ? 'array' : typeof m;
  return (
    <pre>
      the type of {JSON.stringify(value, null, 2)} = {type}
    </pre>
  );
};

complexSelect.propTypes = {
  m: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.arrayOf(PropTypes.number)])
    .isRequired,
};

complexSelect.story = {
  properties: {
    m: {
      type: 'select',
      label: 'complex',
      options: {
        number: 1,
        string: 'string',
        object: {},
        array: [1, 2, 3],
        function: () => {},
      },
      defaultValue: 'string',
    },
  },
};

export const optionsProperties = ({
  optionRadio,
  optionInlineRadio,
  optionSelect,
  optionsMultiSelect,
  optionsCheck,
  optionsInlineCheck,
}) => {
  return (
    <div>
      <p>Weekday: {optionRadio}</p>
      <p>Weekend: {optionInlineRadio}</p>
      <p>Month: {optionSelect}</p>
      <p>Fruit:</p>
      <ul>
        {optionsMultiSelect.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>Vegetables:</p>
      <ul>
        {optionsCheck.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>Dairy:</p>
      <ul>
        {optionsInlineCheck.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

optionsProperties.propTypes = {
  optionRadio: PropTypes.string.isRequired,
  optionInlineRadio: PropTypes.string.isRequired,
  optionSelect: PropTypes.string.isRequired,
  optionsMultiSelect: PropTypes.arrayOf(PropTypes.string).isRequired,
  optionsCheck: PropTypes.arrayOf(PropTypes.string).isRequired,
  optionsInlineCheck: PropTypes.arrayOf(PropTypes.string).isRequired,
};

optionsProperties.story = {
  properties: {
    optionRadio: {
      type: 'options',
      label: 'Radio',
      options: {
        Monday: 'Monday',
        Tuesday: 'Tuesday',
        Wednesday: 'Wednesday',
      },
      defaultValue: 'Tuesday',
      display: 'radio',
    },
    optionInlineRadio: {
      type: 'options',
      label: 'Inline Radio',
      options: {
        Saturday: 'Saturday',
        Sunday: 'Sunday',
      },
      defaultValue: 'Saturday',
      display: 'inline-radio',
    },
    optionSelect: {
      type: 'options',
      label: 'Select',
      options: {
        January: 'January',
        February: 'February',
        March: 'March',
      },
      defaultValue: 'January',
      display: 'select',
    },
    optionsMultiSelect: {
      type: 'options',
      label: 'Multi Select',
      options: {
        Apple: 'apple',
        Banana: 'banana',
        Cherry: 'cherry',
      },
      defaultValue: ['apple'],
      display: 'multi-select',
    },
    optionsCheck: {
      type: 'options',
      label: 'Check',
      options: {
        Corn: 'corn',
        Carrot: 'carrot',
        Cucumber: 'cucumber',
      },
      defaultValue: ['carrot'],
      display: 'check',
    },
    optionsInlineCheck: {
      type: 'options',
      label: 'Inline Check',
      options: {
        Milk: 'milk',
        Cheese: 'cheese',
        Butter: 'butter',
      },
      defaultValue: ['milk'],
      display: 'inline-check',
    },
  },
};

let injectedItems = [];
let injectedIsLoading = false;

const ItemLoader = ({ isLoading, items }) => {
  if (isLoading) {
    return <p>Loading data</p>;
  }
  if (!items.length) {
    return <p>No items loaded</p>;
  }
  return (
    <ul>
      {items.map(i => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
};

ItemLoader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export const triggersActionsViaButton = () => {
  // Needed to enforce @babel/transform-react-constant-elements deoptimization
  // See https://github.com/babel/babel/issues/10522
  const loaderProps = {
    isLoading: injectedIsLoading,
    items: injectedItems,
  };
  return (
    <>
      <p>Hit the knob button and it will toggle the items list into multiple states.</p>
      <ItemLoader {...loaderProps} />
    </>
  );
};

triggersActionsViaButton.story = {
  properties: {
    button: {
      type: 'button',
      onClick: () => {
        if (!injectedIsLoading && injectedItems.length === 0) {
          injectedIsLoading = true;
        } else if (injectedIsLoading && injectedItems.length === 0) {
          injectedIsLoading = false;
          injectedItems = ['pencil', 'pen', 'eraser'];
        } else if (injectedItems.length > 0) {
          injectedItems = [];
        }
      },
    },
  },
};

export const radioEnum = ({ radio }) => radio;

radioEnum.story = {
  properties: {
    radio: {
      type: 'radios',
      label: 'Radio',
      defaultValue: 'Monday',
      options: {
        Monday: 'Monday',
        Tuesday: 'Tuesday',
        Wednesday: 'Wednesday',
      },
    },
  },
};

export const reservedKeyword = ({ values }) => values;

reservedKeyword.story = {
  properties: {
    values: { type: 'text', label: 'Text', defaultValue: 'Hello' },
  },
};
