import { version } from '../package.json';
import Scroll from './Scroll.vue';

Scroll.version = version;
Scroll.install = function (Vue, options) {
  Vue.component(Scroll.name, Scroll);
};

export default Scroll;
