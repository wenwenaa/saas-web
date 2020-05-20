<template>
  <div class="header">
    <div />
    <div class="header-right">
      <el-avatar
        :size="40"
        fit="cover"
        :src="userInfo.image ? `${imgDomain}${userInfo.image}` : ''"
      ></el-avatar>
      <el-dropdown @command="handleDropDown">
        <div class="more-btn" @command="handleDropDown">
          <span style="margin-right: 8px;">欢迎您,{{userInfo && userInfo.nickName}}</span>
          <img src="../../../assets/images/icon/more-btn.png" alt />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item :command="1">
            <i class="el-icon-edit-outline"></i>
            <span>切换企业</span>
          </el-dropdown-item> -->
          <el-dropdown-item :command="2">
            <i class="el-icon-switch-button"></i>
            <span>退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import * as urls from '../../../router/routePath'

export default {
  name: 'Header',
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.global.userInfo,
      imgDomain: state => state.global.imgDomain
    })
  },
  mounted () {},
  methods: {
    ...mapMutations([
      'SET_MATERIAL_TYPE_DIC_LIST',
      'SET_UNIT_DIC_LIST',
      'SET_HOUSE_DIC_LIST',
      'M_SET_GLOBAL_BAD_TYPE_LIST',
      'M_SET_GLOBAL_EQUIPMENT_LIST',
      'M_SET_GLOBAL_CUSTOMER_LIST',
      'M_SET_GLOBAL_SUPPLIER_LIST',
      'M_SET_GLOBAL_STAFF_LIST'
    ]),
    //  下拉选择
    handleDropDown (id) {
      if (id === 1) {
        // 去切换企业
        this.$router.push({ path: urls.BASE_MATERIAL })
        return
      }
      // 退出
      sessionStorage.clear()
      this.M_SET_GLOBAL_BAD_TYPE_LIST()
      this.M_SET_GLOBAL_EQUIPMENT_LIST()
      this.SET_MATERIAL_TYPE_DIC_LIST()
      this.SET_HOUSE_DIC_LIST()
      this.M_SET_GLOBAL_CUSTOMER_LIST()
      this.M_SET_GLOBAL_SUPPLIER_LIST()
      this.M_SET_GLOBAL_STAFF_LIST()
      this.$router.push({ path: urls.LOGIN })
    }
  }
}
</script>

<style lang="less" scoped>
@heardH: 60px;
.header {
  background: #fff;
  box-shadow: 0 0px 2px rgba(0, 0, 0, 0.1) inset;
  z-index: 10;
  padding: 0;
  width: 100%;
  height: @heardH;
  display: flex;
  min-width: 1058px;
  justify-content: space-between;
  align-items: center;
  &-right {
    height: @heardH;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    margin-right: 20px;
    .more-btn {
      margin-left: 10px;
    }
    .more-btn img {
      width: 4px;
      height: 100%;
    }
  }
}
</style>
