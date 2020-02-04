/* eslint-disable import/extensions */
import { action } from '@storybook/addon-actions';
import { html } from 'lit-html';
import '../demo-wc-card.js';

export default {
  title: 'Addons/Controls',
};

export const Simple = ({ header, age, name }) => {
  return html`
    <demo-wc-card .header=${header}>
      I am ${name} and I'm ${age} years old.
    </demo-wc-card>
  `;
};

Simple.story = {
  controls: {
    name: { type: 'text', label: 'Name', value: 'John Doe' },
    header: { type: 'text', value: 'Power Ranger' },
    age: { type: 'number', label: 'Age', value: 44 },
  },
};
export const Story3 = ({ header, textColor, name }) => {
  return html`
    <demo-wc-card .header=${header}>
      I am ${name} and I'm 30 years old.
    </demo-wc-card>
    <style>
      html {
        --demo-wc-card-front-color: ${textColor};
      }
    </style>
  `;
};

Story3.story = {
  name: 'Color Selection',
  controls: {
    name: { type: 'text', label: 'Name', value: 'John Doe' },
    header: { type: 'text', value: 'Power Ranger' },
    textColor: { type: 'color', label: 'Text color', value: 'orangered' },
  },
};

export const Story4 = ({ name, stock, fruit, price, colour, today, items, nice }) => {
  const stockMessage = stock
    ? `I have a stock of ${stock} ${fruit}, costing &dollar;${price} each.`
    : `I'm out of ${fruit}${nice ? ', Sorry!' : '.'}`;

  const salutation = nice ? 'Nice to meet you!' : 'Leave me alone!';
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };

  const style = `border: 2px dotted ${colour}; padding: 8px 22px; border-radius: 8px`;

  return html`
    <div style="${style}">
      <h1>My name is ${name},</h1>
      <h3>today is ${new Date(today).toLocaleDateString('en-US', dateOptions)}</h3>
      <p>${stockMessage}</p>
      <p>Also, I have:</p>
      <ul>
        ${items.map(
          item => html`
            <li>${item}</li>
          `
        )}
      </ul>
      <p>${salutation}</p>
    </div>
  `;
};
Story4.story = {
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
    // this is necessary, because we cant use arrays/objects directly in vue prop default values
    // a factory function is required, but we need to make sure the knob is only called once
    items: { type: 'array', label: 'Items', value: ['Laptop', 'Book', 'Whiskey'] },
    nice: { type: 'boolean', abel: 'Nice', value: true },
  },
};

export const XssSafety = ({ content }) => {
  return html`
    <demo-wc-card>
      Code text works :)<br />
      Xss insert? ${content}
    </demo-wc-card>
  `;
};

XssSafety.story = {
  controls: {
    content: { type: 'text', value: '<img src=x onerror="alert(\'XSS Attack\')" >' },
  },
};
