import MyButton from '../Button.vue';

export default {
  title: 'Button',
  component: MyButton,
};

export const Rounded = ({ rounded, color }) => ({
  components: { MyButton },
  props: {
    rounded: { default: rounded },
    color: { default: color },
  },
  template: '<my-button :rounded="rounded" :color="color">A Button with rounded edges</my-button>',
});

export const Square = () => ({
  components: { MyButton },
  template: '<my-button :rounded="false">A Button with square edges</my-button>',
});
