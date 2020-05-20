<template>
  <div class="navMenu">
    <template v-for="(nav, index) in navMenus">
      <el-menu-item v-if="nav && !nav.children" :key="index" :data="nav" :index="nav.path" :route="nav.path"
        :class="{activeClass: nav.meta.isSingle}">
        <i v-if="nav.meta.icon" class="icon-menu1 tz-button-icon" :class="nav.meta.icon"></i>
        <span slot="title">{{nav.meta.title}}</span>
      </el-menu-item>
      <!-- 此菜单下还有子菜单 -->
      <el-submenu v-else-if="nav && nav.children" :key="index" :data="nav" :index="nav.path" :route="nav.path">
        <template slot="title">
          <i v-if="nav.meta.icon" class="icon-menu1 tz-button-icon" :class="nav.meta.icon"></i>
          <span slot="title">{{nav.meta.title}}</span>
        </template>
        <!-- 递归 -->
        <NavMenu :navMenus="nav.children"></NavMenu>
      </el-submenu>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'NavMenu',
    props: {
      navMenus: {
        type: Array,
        default () {
          return []
        }
      }
    }
  }

</script>
<style lang="less">
  .navMenu {
    display: flex;
    max-width: 414px;
    flex-wrap: wrap;
    background: #fff;

    .icon-menu1 {
      width: 18px;
      height: 18px;
      margin-right: 8px;
    }

    .el-menu-item {
      padding: 0px 20px !important;
      min-width: 138px !important;
    }
    .el-menu-item.is-active span{
      color:#5C904E !important;
    }
    .el-menu-item.is-active::before {
      content: "";
      display: inline-block;
      border-radius: 50%;
      width: 8px;
      height: 8px;
      background-color: #5C904E;
      margin-right: 6px;
    }

    .el-icon-arrow-down::before {
      color: #fff;
    }
  }

  .menu {
    height: auto !important;
  }

</style>
