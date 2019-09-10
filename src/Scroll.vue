<template>
  <div
    class="scroll-wrap"
    @mousewheel="mousewheelAction"
    @DOMMouseScroll="mousewheelAction"
    ref="body"
  >
    <div class="scroll-bar" ref="scrollBar"></div>
    <div class="scroll-content" ref="scrollContent">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ml-scroll',
  data() {
    return {};
  },
  methods: {
    /**
     * @name mousewheelAction
     * @description 滚轮的处理函数
     * @function
     * @param {String} e 需要校验的字符串
     */
    mousewheelAction(e) {
      const speedH = 40;
      const wheelRange = e.wheelDelta
        ? -e.wheelDelta / 120
        : (e.detail || 0) / 3; // 计算滚动的数值
      const h = Math.floor(wheelRange * speedH); // 取得滚动条需要改变的高度

      if (this.$refs.scrollBar.style.display !== 'none') {
        this.setConentTop(h);
        this.ajustBarFromContent();
      }
    },

    /**
     * @name resizeBar
     * @description 重置滚动条
     * @function
     */
    resizeBar() {
      if (this.$refs.body) {
        this.ajustBarHeight();
        this.setBarTop(0, 0);
        this.ajustContentFromBar();
      }
    },

    /**
     * @name setConentTop
     * @description 设置主体的高度
     * @function
     * @param {Number} h 变化的高度
     */
    setConentTop(h) {
      const { body, scrollContent } = this.$refs;

      const bodyHeight = body.clientHeight || body.offsetHeight;
      const wrapHeight = scrollContent.clientHeight || scrollContent.offsetHeight;
      if (scrollContent.offsetTop - h > 0) {
        scrollContent.style.top = '0px';
      } else if (scrollContent.offsetTop - h < bodyHeight - wrapHeight) {
        scrollContent.style.top = `${bodyHeight - wrapHeight}px`;
      } else {
        scrollContent.style.top = `${this.$refs.scrollContent.offsetTop - h}px`;
      }
    },

    /**
     * @name setBarTop
     * @description 设置滚动条top的位置
     * @function
     * @param {Number} h 变化的高度
     * @param {Number} lastTop 初始的高度
     */
    setBarTop(h, lastTop) {
      const bodyHeight = this.$refs.body.clientHeight || this.$refs.body.offsetHeight;
      const barHeight = this.$refs.scrollBar.clientHeight || this.$refs.scrollBar.offsetHeight;
      if (h + lastTop < 0) {
        this.$refs.scrollBar.style.top = '0px';
      } else if (h + lastTop + barHeight > bodyHeight) {
        this.$refs.scrollBar.style.top = `${bodyHeight - barHeight}px`;
      } else {
        this.$refs.scrollBar.style.top = `${h + lastTop}px`;
      }
    },

    /**
     * @name ajustBarHeight
     * @description 设置滚动条的长度
     * @function
     */
    ajustBarHeight() {
      const bodyHeight = this.$refs.body.clientHeight || this.$refs.body.offsetHeight;
      const wrapHeight =
        this.$refs.scrollContent.clientHeight || this.$refs.scrollContent.offsetHeight;
      let barH = (bodyHeight * bodyHeight) / wrapHeight;
      let bl = bodyHeight / wrapHeight;

      if (wrapHeight <= bodyHeight) {
        this.$refs.scrollBar.style.display = 'none';
        this.$refs.body.className = 'scroll-wrap';
      } else {
        if (barH < 16) {
          barH = 16;
          bl = (bodyHeight - barH) / (wrapHeight - bodyHeight);
        }
        this.$refs.scrollBar.style.height = `${barH}px`;
        this.bl = bl;
        this.$refs.scrollBar.style.display = 'block';
        this.$refs.body.className = 'scroll-wrap show-scrollbar';
      }
    },

    /**
     * @name ajustContentFromBar
     * @description 根据滚动条的位置设置主体的top
     * @function
     */
    ajustContentFromBar() {
      const barTop = this.$refs.scrollBar.offsetTop;
      this.$refs.scrollContent.style.top = `${-barTop / this.bl}px`;
    },

    /**
     * @name ajustBarFromContent
     * @description 根据主体的位置设置滚动条top
     * @function
     */
    ajustBarFromContent() {
      const wrapTop = this.$refs.scrollContent.offsetTop;
      this.$refs.scrollBar.style.top = `${-wrapTop * this.bl}px`;
    },

    /**
     * @name addListener
     * @description 添加事件的监听
     * @function
     */
    addListener() {
      this.addNativeListener();
      this.$on('resize', () => {
        this.resizeBar();
      });

      this.$on('update', () => {
        this.ajustBarHeight();
        this.ajustBarFromContent();
      });
    },

    /**
     * @name addListener
     * @description 添加对滚轮，滚动条按下滑动等操作监听
     * @function
     */
    addNativeListener() {
      // 监听按下事件
      let isMove = false;
      let mousedownY = null;
      let barY = null;
      this.$refs.scrollBar.addEventListener('mousedown', (e) => {
        isMove = true;
        mousedownY = e.clientY || e.screenY;
        barY = this.$refs.scrollBar.offsetTop;
      });

      document.addEventListener('mousemove', (e) => {
        if (isMove && this.$refs.scrollBar.style.display !== 'none') {
          const y = e.clientY || e.screenY;
          this.setBarTop(y - mousedownY, barY);
          this.ajustContentFromBar();
        }
      });

      document.addEventListener('mouseup', () => {
        isMove = false;
      });

      this.$refs.body.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isMove = true;
        mousedownY = e.touches[0].clientY || e.touches[0].screenY;
        barY = this.$refs.scrollBar.offsetTop;
      });

      document.addEventListener(
        'touchmove',
        (e) => {
          if (isMove && this.$refs.scrollBar.style.display !== 'none') {
            const y = e.touches[0].clientY || e.touches[0].screenY;
            this.setConentTop(mousedownY - y);
            this.ajustBarFromContent();
          }
        },
        { passive: false },
      );

      document.addEventListener('touchend', () => {
        isMove = false;
      });
    },
  },
  mounted() {
    this.addListener();
  },
};
</script>

<style  lang="less" scoped>
.scroll-wrap {
  position: relative;
  top: 0;
  height: 100%;
  overflow: hidden;

  .scroll-bar {
    position: absolute;
    right: 1px;
    top: 0;
    width: 8px;
    height: 20px;
    border-radius: 4px;
    background-color: #004a91;
  }

  .scroll-content {
    position: relative;
  }
}
.show-scrollbar {
  padding-right: 12px;
}
</style>
