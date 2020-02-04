import { action } from '@storybook/addon-actions';

const logger = console;

export default {
  title: 'Addon/Controls',
};

export const Simple = ({ name }) => ({
  props: {
    name: {
      type: String,
      default: name,
    },
  },

  template: `<div @click="age++">I am {{ name }} and I'm {{ age }} years old.</div>`,

  data() {
    return { age: 40 };
  },
  created() {
    logger.debug('created');
  },
  destroyed() {
    logger.debug('destroyed');
  },
});

Simple.story = {
  controls: {
    name: { type: 'text', label: 'Name', value: 'John Doe' },
  },
};
export const AllControls = ({ name, stock, fruit, price, colour, today, items, nice }) => {
  return {
    props: {
      name: { default: name },
      stock: {
        default: stock,
      },
      fruit: { default: fruit },
      price: { default: price },
      colour: { default: colour },
      // [Vue warn]: Invalid default value for prop "today":
      // Props with type Object/Array must use a factory function to return the default value.
      today: { default: (i => () => i)(today) },
      // this is necessary, because we cant use arrays/objects directly in vue prop default values
      // a factory function is required, but we need to make sure the knob is only called once
      items: { default: (i => () => i)(items) },
      nice: { default: nice },
    },
    data: () => ({
      dateOptions: { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' },
    }),
    computed: {
      stockMessage() {
        return this.stock
          ? `I have a stock of ${this.stock} ${this.fruit}, costing $${this.price} each.`
          : `I'm out of ${this.fruit}${this.nice ? ', Sorry!' : '.'}`;
      },
      salutation() {
        return this.nice ? 'Nice to meet you!' : 'Leave me alone!';
      },
      formattedDate() {
        return new Date(this.today).toLocaleDateString('en-US', this.dateOptions);
      },
      style() {
        return {
          'border-color': this.colour,
        };
      },
    },
    template: `
          <div style="border: 2px dotted; padding: 8px 22px; border-radius: 8px" :style="style">
            <h1>My name is {{ name }},</h1>
            <h3>today is {{ formattedDate }}</h3>
            <p>{{ stockMessage }}</p>
            <p>Also, I have:</p>
            <ul>
              <li v-for="item in items" :key="item">{{ item }}</li>
            </ul>
            <p>{{ salutation }}</p>
          </div>
        `,
  };
};

AllControls.story = {
  name: 'All stories',
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

export const XssSafety = ({ text }) => ({
  props: {
    text: { default: text },
  },
  template: '<div v-html="text"></div>',
});

XssSafety.story = {
  name: 'XSS safety',
  controls: {
    text: {
      type: 'text',
      label: 'Rendered string',
      value: '<img src=x onerror="alert(\'XSS Attack\')" >',
    },
  },
};
