<template>
  <div class="navMenu">
    <template v-for="(nav, index) in navMenus">
      <el-menu-item
        v-if="nav && !nav.children"
        :key="index"
        :data="nav"
        :index="nav.path"
        :route="nav.path"
        :class="{activeClass: nav.meta.isSingle}"
      >
        <i v-if="nav.meta.icon" class="icon-menu1 tz-button-icon" :class="nav.meta.icon"></i>
        <span slot="title">{{nav.meta.title}}</span>
      </el-menu-item>
      <!-- 此菜单下还有子菜单 -->
      <el-submenu
        v-else-if="nav && nav.children"
        :key="index"
        :data="nav"
        :index="nav.path"
        :route="nav.path"
      >
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
// .hovers {
//   &:hover {
//     border-radius: 20px;
//     background-color: #d8f0ff !important;
//   }
// }

.navMenu {
  // background: transparent;
  .icon-menu1 {
    width: 18px;
    height: 18px;
    margin-right: 8px;
  }
  .el-menu-item {
    padding-left: 46px !important;
  }
  .el-menu-item.is-active {
    margin-left: -14px;
  }
  .el-menu-item.is-active::before {
    content: "";
    display: inline-block;
    border-radius: 50%;
    width: 8px;
    height: 8px;
    background-color: #fff;
    margin-right: 6px;
  }
  .el-icon-arrow-down::before {
    color: #fff;
  }
}
.el-menu {
  border-right: 0 !important;
}
.menu {
  height: auto!important;
}
</style>

