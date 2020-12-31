<template>
  <section class="app-main">
    <el-card>
      <transition
        name="fade-transform"
        mode="out-in"
      >
        <keep-alive>
          <router-view :key="key" />
        </keep-alive>
      </transition>
    </el-card>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    },
  },
}
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 84px);
  /* width: 100%; */
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 20px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    max-height: calc(100vh - 84px);
    min-height: calc(100vh - 84px);
    padding: 10px;
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
