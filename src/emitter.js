function broadcast(componentName, eventName, params) {
  this.$children.forEach((child) => {
    const name = child.$options.componentName;

    if (name === componentName) {
      child.$emit(...[eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}

/**
 * 用于vue组件的mixins
 * @minxin
 */
export default {
  methods: {
    /**
     * 向父组件派发事件
     * @param {String} componentName 子组件componentName
     * @param {String} eventName 触发的事件名称
     * @param {Array} params 传递的数据
     */
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root;
      let name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit(...[eventName].concat(params));
      }
    },
    /**
     * 向子组件派发事件
     * @param {String} componentName 子组件componentName
     * @param {String} eventName 触发的事件名称
     * @param {Array} params 传递的数据
     */
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    },
  },
};
