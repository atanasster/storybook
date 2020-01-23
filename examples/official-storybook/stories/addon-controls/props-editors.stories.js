import React from 'react';
import PropTypes from 'prop-types';

export default {
  title: 'Addons/Controls/examples',
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

export const TweaksStaticValues = ({
  name,
  age,
  fruit,
  otherFruit,
  dollars,
  years,
  backgroundColor,
  items,
  otherStyles,
  nice,
  images,
  dog,
  birthday,
}) => {
  const intro = `My name is ${name}, I'm ${age} years old, and my favorite fruit is ${fruit}. I also enjoy ${otherFruit}, and hanging out with my dog ${dog.label}`;
  const style = { backgroundColor, ...otherStyles };
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

TweaksStaticValues.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  fruit: PropTypes.string.isRequired,
  otherFruit: PropTypes.string.isRequired,
  dollars: PropTypes.number.isRequired,
  years: PropTypes.number.isRequired,
  backgroundColor: PropTypes.string.isRequired,
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

TweaksStaticValues.story = {
  name: 'tweaks static values',
  properties: {
    name: { type: 'text', label: 'Name', defaultValue: 'Storyteller', groupId: GROUP_IDS.DISPLAY },
    age: { type: 'number', label: 'Age', defaultValue: 78, range: true, min: 0, max: 90, step: 5 },
    fruit: {
      type: 'options',
      label: 'Fruit',
      defaultValue: 'apple',
      options: {
        Apple: 'apple',
        Banana: 'banana',
        Cherry: 'cherry',
      },
      display: 'select',
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
    },
    dollars: { type: 'number', label: 'Dollars', defaultValue: 12.5, min: 0, max: 100, step: 0.01 },
    years: { type: 'number', label: 'Years in NY', defaultValue: 9 },

    backgroundColor: { type: 'color', label: 'background', defaultValue: '#dedede' },
    items: { type: 'array', label: 'Items', options: ['Laptop', 'Book', 'Whiskey'] },
    otherStyles: {
      type: 'object',
      label: 'Styles',
      defaultValue: {
        border: '2px dashed silver',
        borderRadius: 10,
        padding: 10,
      },
    },
    nice: { type: 'boolean', label: 'Nice', defaultValue: true },

    images: {
      type: 'files',
      label: 'Happy Picture',
      accept: 'image/*',
      defaultValue: [
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfiARwMCyEWcOFPAAAAP0lEQVQoz8WQMQoAIAwDL/7/z3GwghSp4KDZyiUpBMCYUgd8rehtH16/l3XewgU2KAzapjXBbNFaPS6lDMlKB6OiDv3iAH1OAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTAxLTI4VDEyOjExOjMzLTA3OjAwlAHQBgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0wMS0yOFQxMjoxMTozMy0wNzowMOVcaLoAAAAASUVORK5CYII=',
      ],
    },
    // array of objects

    dog: { type: 'select', options: arrayOfObjects, defaultValue: arrayOfObjects[0] },

    birthday: { type: 'date', label: 'Birthday', defaultValue: new Date() },
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

export const textProp = ({ text }) => text;

textProp.story = {
  properties: {
    text: { type: 'text', label: 'Text', defaultValue: 'Hello' },
  },
};
