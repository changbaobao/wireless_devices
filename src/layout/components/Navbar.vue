<template>
  <div class="navbar">
    <div class="main-wrap clearfix">
      <div class="logo-container">
        <img
          src="../../assets/main_images/logo1.png"
          alt=""
          style="dispaly:block;"
        >
      </div>
      <!-- <div class="logo-container">无线设备管理平台</div> -->
      <div class="side-menu">
        <side-menu></side-menu>
      </div>
      <div class="right-menu">
        <el-dropdown
          class="avatar-container"
          trigger="click"
        >
          <div class="avatar-wrapper">
            <!-- <el-avatar
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
              class="user-avatar"
            /> -->

            {{ name }}
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu
            slot="dropdown"
            class="user-dropdown"
          >
            <router-link to="/updatePassword">
              <el-dropdown-item>修改密码</el-dropdown-item>
            </router-link>
            <el-dropdown-item
              divided
              @click.native="logout"
            >
              <span style="display:block;">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import sideMenu from './Sidebar/index'
export default {
  components: { sideMenu },
  computed: {
    ...mapGetters(['avatar', 'name']),
  },
  data() {
    return {
      activeIndex: 1,
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.navbar {
  // background: #001529;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .logo-container {
    float: left;
    // line-height: 64px;
    // font-size: 24px;
    // font-weight: 600;
    // color: rgba(0, 0, 0, 0.85);
    // font-family: cursive;
    overflow: hidden;
    img {
      width: 250px;
      height: 40px;
      margin: 10px;
      display: block;
    }
  }
  .side-menu {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 64px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #697b8c;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          // background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        color: #697b8c;
        .user-avatar {
          cursor: pointer;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          vertical-align: middle;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
