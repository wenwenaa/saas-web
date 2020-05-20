<template>
  <div class="lay">
    <el-container class="layout">
      <el-header class="header">
        <!-- <Header /> -->
        <!-- :unique-opened="true" -->
        <nav class="d-flex">
          <div class="logo">
            <img src="../../assets/images/logo.png" alt="天智MES系统" />
          </div>
          <el-menu mode="horizontal" :default-active="active" background-color="#5C904E" text-color="#fff"
            active-text-color="#fff" router >
            <template v-for="(nav, index) in menu">
              <el-menu-item v-if="nav && !nav.children" :key="index" :data="nav" :index="nav.path" :route="nav.path"
                :class="{activeClass: nav.meta.isSingle}">
                <!-- <i v-if="nav.meta.icon" class="icon-menu1 tz-button-icon" :class="nav.meta.icon"></i> -->
                <span slot="title">{{nav.meta.title}}</span>
              </el-menu-item>
              <!-- 此菜单下还有子菜单 -->
              <el-submenu v-else-if="nav && nav.children" :key="index" :data="nav" :index="nav.path" :route="nav.path">
                <template slot="title">
                  <!-- <i v-if="nav.meta.icon" class="icon-menu1 tz-button-icon" :class="nav.meta.icon"></i> -->
                  <span slot="title">{{nav.meta.title}}</span>
                </template>
                <!-- 递归 -->
                <NavMenu :navMenus="nav.children"></NavMenu>
              </el-submenu>
            </template>
          </el-menu>

        </nav>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
    <!-- <el-container class="layout">
      <div class="outBox">
        <el-aside class="side">
          <div class="logo">
            <img src="../../assets/images/logo.png" alt="天智MES系统" />
          </div>
          <el-menu
            class="menu"
            :default-active="active"
            background-color="#7CA870"
            text-color="#fff"
            active-text-color="#fff"
            :unique-opened="true"
            router
          >
            <NavMenu :navMenus="menu"></NavMenu>
          </el-menu>
        </el-aside>
      </div>
      <el-container style="width:calc(100vw - 206px)">
        <el-header class="header">
          <Header />
        </el-header>
        <div class="main" ref="mainContainer">
          <router-view />
        </div>
      </el-container>
    </el-container>-->
  </div>
</template>
<script>
  import NavMenu from './component/Menu.vue'
  // import Header from './component/Header.vue'
  import menu from '../../router/menuRouter'

  export default {
    name: 'layout',
    components: {
      NavMenu
      // Header
    },
    data () {
      return {
        menu,
        active: this.$route.path
      }
    },
    computed: {},
    watch: {
      $route (to, from) {
        if (to.path.includes(from.path)) {
          this.active = from.path
          return
        }
        this.active = to.path
      }
    },
    created () {},
    methods: {}
  }

</script>

<style lang="less" scoped>
  nav{
    background-color:rgb(92, 144, 78);
    height:60px;
  }
  .layout {
    width: 100%;
    height: 100%;
  }

  .header {
    padding: 0;
  }

  .outBox {
    width: 192px;
    overflow: hidden;
  }

  .icon-menu1 {
    width: 18px;
    height: 18px;
    margin-right: 8px;
  }

  .side {
    // background: #7ca870;
    // box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
    // overflow-x: hidden;
    width: 192px !important;
    height: 100%;
    // padding-right:10px;
    overflow-y: scroll;
    scrollbar-color: transparent transparent;
    scrollbar-track-color: transparent;
    -moz-scrollbar-track-color: transparent;
    //ie
    -ms-scroll-chaining: chained;
    -ms-overflow-style: none;
    -ms-content-zooming: zoom;
    -ms-scroll-rails: none;
    -ms-content-zoom-limit-min: 100%;
    -ms-content-zoom-limit-max: 500%;
    -ms-scroll-snap-type: proximity;
    -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
    -ms-overflow-style: none;
    scrollbar-base-color: white;
    scrollbar-3dlight-color: white;
    scrollbar-highlight-color: white;
    scrollbar-track-color: white;
    scrollbar-arrow-color: white;
    scrollbar-shadow-color: white;
    // scrollbar-dark-shadow-color: white;
  }

  .side::-webkit-scrollbar {
    display: none;
  }

  .logo {
    width: 190px;
    margin-right:20px;
  }

  .logo img {
    width: 100%;
    height: 60px;
  }

  .menu {
    margin-top: 110px;
    z-index: 2;
    box-sizing: border-box;
    overflow: hidden;
    height: 100%;
  }

  .main {
    height: calc(100vh - 60px);
    overflow-y: auto;
    background: #fff;
    min-width: 1152px;
    padding: 16px 16px 60px;
    box-sizing: border-box;
  }

</style>
<style lang="less">
  .lay {
    .el-submenu.is-opened {
      .el-submenu__title {
        span {
          background-color: #467B37 !important;
        }
      }
    }

    .el-submenu {
      display: flex !important;
      align-items: center !important;

      .el-submenu__title {
        padding: 0 !important;

        span {
          padding: 10px 20px;
          box-sizing: border-box;
          background-color: #5C904E !important;
          border-radius: 17px !important;
        }
        i{
          display: none !important;
        }
      }
    }

    .el-submenu__title:hover,
    .el-submenu__title:focus {
      background: none !important;
    }
  }

  .el-menu--horizontal {
    .el-menu {
      background-color: #fff !important;

      .el-menu-item {
        background: #fff !important;
        color: #282828 !important;
      }
    }

    .el-menu--popup {
      background: rgba(255, 255, 255, 1) !important;
      box-shadow: 0px 2px 18px 10px rgba(0, 0, 0, 0.06) !important;
      border-radius: 0px 0px 4px 4px !important;
      border: 1px solid rgba(210, 210, 210, 1) !important;
      min-width: 138px !important;
    }
  }

</style>
