import { action } from '@storybook/addon-actions';
import { document } from 'global';

const cachedContainer = document.createElement('p');

export default {
  title: 'Addons/Controls',
};

export const Simple = ({ name, age }) => {
  const content = `I am ${name} and I'm ${age} years old.`;
  return `<div>${content}</div>`;
};

Simple.story = {
  controls: {
    name: { type: 'text', label: 'Name', value: 'John Doe' },
    age: { type: 'number', label: 'Age', value: 44 },
  },
};
export const DOM = ({ name }) => {
  const container = document.createElement('p');
  container.textContent = name;
  return container;
};

DOM.story = {
  controls: {
    name: { type: 'text', label: 'Name', value: 'John Doe' },
  },
};

export const Story3 = ({ name, textColor }) => {
  cachedContainer.textContent = name;
  cachedContainer.style.transition = 'color 0.5s ease-out';
  cachedContainer.style.color = textColor;
  return cachedContainer;
};

Story3.story = {
  name: 'CSS transitions',
  controls: {
    name: { type: 'text', label: 'Name', value: 'John Doe' },
    textColor: { type: 'color', label: 'Text color', value: 'orangered' },
  },
};

export const AllControls = ({ name, stock, fruit, price, colour, today, items, nice }) => {
  const stockMessage = stock
    ? `I have a stock of ${stock} ${fruit}, costing &dollar;${price} each.`
    : `I'm out of ${fruit}${nice ? ', Sorry!' : '.'}`;

  const salutation = nice ? 'Nice to meet you!' : 'Leave me alone!';
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };

  const style = `border: 2px dotted ${colour}; padding: 8px 22px; border-radius: 8px`;

  return `<div style="${style}">
        <h1>My name is ${name},</h1>
        <h3>today is ${new Date(today).toLocaleDateString('en-US', dateOptions)}</h3>
        <p>${stockMessage}</p>
        <p>Also, I have:</p>
        <ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>
        <p>${salutation}</p>
      </div>
    `;
};

AllControls.story = {
  name: 'All controls',
  controls: {
    name: { type: 'text', label: 'Name', value: 'Jane' },
    stock: { type: 'number', label: 'Stock', value: 20, range: true, min: 0, max: 30, stpe: 5 },
    button: { type: 'button', label: 'Arbitrary action', onClick: action('You clicked it!') },
    fruit: {
      type: 'options',
      label: 'Fruit',
      options: {
        Apple: 'apples',
        Banana: 'bananas',
        Cherry: 'cherries',
      },
      value: 'apples',
    },
    price: { type: 'number', label: 'Price', value: 2.25 },
    colour: { type: 'color', label: 'Border', value: 'deeppink' },
    today: { type: 'date', label: 'Today', value: new Date('Jan 20 2017 GMT+0') },
    items: { type: 'array', label: 'Items', value: ['Laptop', 'Book', 'Whiskey'] },
    nice: { type: 'boolean', abel: 'Nice', value: true },
  },
};

export const XssSafety = ({ content }) => content;

XssSafety.story = {
  controls: {
    content: {
      type: 'text',
      value: '<img src=x onerror="alert(\'XSS Attack\')" >',
      escapeValue: true,
    },
  },
};
