<template>
  <div class="childBom">
    <tzHeadline title="BOM详情" isShowBack :customBack="false" @back="headBack"></tzHeadline>
    <header class="bom-header">
      <main class="tabs-main">
        <section class="tabs">
          <section v-for="(version, i) in versionList" :key="i" class="tab-item pointer ellipsis"
            @click="versionSwitch(version, i)"
            :class="version.versionNum === curVersion.versionNum ? 'tab-item-active' : ''">
            <!--&& version.versionName.length > 3 ? `${version.versionName.substring(0, 3)}...` : version.versionName-->
            {{version.versionName || '未命名'}}({{version.versionNum}})
            <span v-if="version.defaultFlag === 'Y'" class="tab-item-tip">
              <img src="../../../assets/images/icon/default.png" alt="默认" />
            </span>
          </section>
        </section>
      </main>
      <div>
        <el-button v-if="curVersion.defaultFlag === 'N' && curVersion.enableFlag === 'Y'" type="text"
          @click="defaultFlagC" style="margin-right: 16px">设为默认</el-button>
        <el-checkbox v-model.trim="enableFlag" true-label="Y" false-label="N" @change="enableFlagC">启用</el-checkbox>
        <el-dropdown @command="handleDropDown">
          <span class="el-dropdown-link pointer">
            <i style="fontSize: 16px;color: #7CA870;margin-left: 16px" class="el-icon-menu"></i>
            更多操作
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1">导入</el-dropdown-item>
            <el-dropdown-item :command="2">导出</el-dropdown-item>
            <el-dropdown-item :command="3">删除当前版本</el-dropdown-item>
            <el-dropdown-item :command="4">修改BOM版本名称</el-dropdown-item>
            <el-dropdown-item :command="5">复制为新的版本</el-dropdown-item>
            <el-dropdown-item :command="6">复用其他BOM结构</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>

    <el-row :gutter="8">
      <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="6">
        <el-card class="box-card">
          <p>
            <span class="head-title">BOM结构</span>
          </p>
          <el-tree ref="tree" :data="treeData" :props="defaultProps" node-key="code" :current-node-key="currentNodeKey"
            default-expand-all highlight-current @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <div>
                <el-tooltip :disabled="!data.materialName || (data.materialName && data.materialName.length <= 8)"
                  effect="dark" :content="data.materialName" placement="top">
                  <span>{{ data.materialName && data.materialName.length > 8 ? `${data.materialName.substring(0, 8)}...` : data.materialName }}</span>
                </el-tooltip>
                <p>
                  <el-tooltip :disabled="!data.materialCode || (data.materialCode && data.materialCode.length <= 8)"
                    effect="dark" :content="data.materialCode" placement="top">
                    <span>{{ data.materialCode && data.materialCode.length > 8 ? `${data.materialCode.substring(0, 8)}...` : data.materialCode }}</span>
                  </el-tooltip>
                </p>
              </div>
              <span>{{ data && data.nodeNum }}</span>
            </span>
          </el-tree>
          <!-- <el-loading v-model.trim="sidebarLoading"></el-loading> -->
        </el-card>
      </el-col>
      <el-col :xs="16" :sm="16" :md="16" :lg="18" :xl="18">
        <!-- 列表 -->
        <el-card class="box-card">
          <div class="bottom-sec">
            <span class="head-title">物料母件（{{currentData.level || 1}}阶）</span>
            <el-table border header-align="center" :data="partBom.baseMaterialId ? [partBom] : []"
              v-loading="modalLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255, 255, 255, 0.8)"
              :header-cell-style="{'background-color': '#F9F9F9'}">
              <el-table-column prop="typeName" label="物料类型" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="materialCode" label="物料编号" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="unitName" label="主计量单位" align="center"></el-table-column>
              <el-table-column prop="processRoute" label="工艺路线" align="center" show-overflow-tooltip></el-table-column>
            </el-table>
            <p class="sub-title">
              <span class="head-title">物料子件（{{(currentData.level || 1) + 1}}阶）</span>
              <span>
                <el-button round size="medium" class="tz-btn-add" @click="visible = true">新增子件</el-button>
              </span>
            </p>
            <el-table border :data="list" v-loading="tableLoading" element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)"
              :header-cell-style="{'background-color': '#F9F9F9'}" header-align="center">
              <el-table-column prop="typeName" label="物料类型" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="materialCode" label="物料编号" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="unitName" label="主计量单位" align="center"></el-table-column>
              <el-table-column prop="processRoute" label="工艺路线" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="useCount" label="用量" align="center"></el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template slot-scope="scope">
                  <el-link style="color: #444444" :underline="false" :disabled="false"
                    @click.stop.prevent="childEdit(scope.row)">编辑</el-link>
                  <!-- <el-divider direction="vertical"></el-divider> -->
                  <el-link :underline="false" style="margin-left: 10px" type="warning"
                    @click.stop.prevent="del(scope.row)">删除</el-link>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <reuseBom :visible="reuseVisible" @close="reuseClose" :targetBomParam="currentData || {}" @submit="bomMultiplex" />
    <material isDisabled isShowUseCount :visible="visible" @close="close" @submit="materialSubmit"
      :defaultData="list" />
    <el-dialog width="560px" :title="type === 'version' ? '修改版本名称' :'修改用量'" :visible.sync="updateVisible">
      <el-form :model="updateData" :rules="rules" ref="updateData" label-width="50px">
        <el-row :gutter="16" style="line-height: 30px" v-if="type !== 'version'">
          <el-col :span="8">物料类型：
            <el-tooltip
              :disabled="!curChildData.typeName || (curChildData.typeName && curChildData.typeName.length <= 4)"
              effect="dark" :content="curChildData.typeName" placement="top">
              <span>{{ curChildData.typeName && curChildData.typeName.length > 4 ? `${curChildData.typeName.substring(0, 4)}...` : curChildData.typeName }}</span>
            </el-tooltip>
          </el-col>
          <el-col :span="8">物料编号：
            <el-tooltip
              :disabled="!curChildData.materialCode || (curChildData.materialCode && curChildData.materialCode.length <= 4)"
              effect="dark" :content="curChildData.materialCode" placement="top">
              <span>{{ curChildData.materialCode && curChildData.materialCode.length > 4 ? `${curChildData.materialCode.substring(0, 4)}...` : curChildData.materialCode }}</span>
            </el-tooltip>
          </el-col>
          <el-col :span="8">物料名称：
            <el-tooltip
              :disabled="!curChildData.materialName || (curChildData.materialName && curChildData.materialName.length <= 4)"
              effect="dark" :content="curChildData.materialName" placement="top">
              <span>{{ curChildData.materialName && curChildData.materialName.length > 4 ? `${curChildData.materialName.substring(0, 4)}...` : curChildData.materialName }}</span>
            </el-tooltip>
          </el-col>
          <el-col :span="8">物料规格：
            <el-tooltip :disabled="!curChildData.spec || (curChildData.spec && curChildData.spec.length <= 4)"
              effect="dark" :content="curChildData.spec" placement="top">
              <span>{{ curChildData.spec && curChildData.spec.length > 4 ? `${curChildData.spec.substring(0, 4)}...` : curChildData.spec }}</span>
            </el-tooltip>
            <!--{{curChildData.spec}}-->
          </el-col>
          <el-col :span="8">主计量单位：
            <el-tooltip
              :disabled="!curChildData.unitName || (curChildData.unitName && curChildData.unitName.length <= 4)"
              effect="dark" :content="curChildData.unitName" placement="top">
              <span>{{ curChildData.unitName && curChildData.unitName.length > 4 ? `${curChildData.unitName.substring(0, 4)}...` : curChildData.unitName }}</span>
            </el-tooltip>
          </el-col>
          <el-col :span="8">工艺路线：
            <el-tooltip
              :disabled="!curChildData.processRoute || (curChildData.processRoute && curChildData.processRoute.length <= 4)"
              effect="dark" :content="curChildData.processRoute" placement="top">
              <span>{{ curChildData.processRoute && curChildData.processRoute.length > 4 ? `${curChildData.processRoute.substring(0, 4)}...` : curChildData.processRoute }}</span>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-form-item v-if="type === 'version'" prop="versionName" label="名称">
          <el-input clearable v-model.trim="updateData.versionName" :maxlength="10" size="medium"/>
        </el-form-item>
        <el-form-item v-else prop="useCount" label="用量">
          <el-input-number clearable :precision="6" style="width: 100%" v-model.trim.number="updateData.useCount"
            :min="0" :max="99999999" size="medium" :controls="false" placeholder="用量"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button round size="medium" class="tz-staff-cancel" @click="updateVisible = false">取 消</el-button>
        <el-button round size="medium" type="primary" class="tz-staff-submit" @click="dialogSubmit('updateData')">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    mapActions,
    mapState,
    mapMutations
  } from 'vuex'
  import reuseBom from './component/reuseBom.vue'

  const rulesConfig = {
    required: true,
    trigger: 'change'
  }
  export default {
    name: 'bomDetail',
    components: {
      reuseBom
    },
    data () {
      const checkUseCount = (rule, value, callback) => {
        if (value === null || value === undefined) {
          return callback(new Error('请输入用量'))
        }
        if (value === 0) {
          return callback(new Error('用量不能为0'))
        }
        return callback()
      }
      return {
        visible: false, // 物料选择
        updateVisible: false, // 修改用量，  版本名称
        reuseVisible: false, // 复用
        type: 'useCount', // useCount 用量 修改用量  version  修改版本名称
        updateData: {
          versionName: undefined,
          useCount: undefined
        },
        rules: {
          versionName: [{
            ...rulesConfig,
            message: '请输入版本名称'
          }],
          useCount: [{
             validator: checkUseCount,
              trigger: 'change'
          }]
        },
        curVersion: {}, // 当前版本
        enableFlag: 'N', // 当前版本的启用状态
        defaultProps: {
          children: 'children',
          label: 'materialName'
        },
        currentData: {}, // 当前选择的母件信息
        curChildData: {}, // 当前编辑的子件信息
        currentNodeKey: null
      }
    },
    computed: {
      ...mapState({
        // btnLoading: state => state.global.sidebarLoading,
        sidebarLoading: state => state.global.sidebarLoading,
        tableLoading: state => state.global.tableLoading,
        modalLoading: state => state.global.modalLoading,
        partBom: state => state.base.bom.partBom || {}, // 母件详情
        list: state => state.base.bom.childList, // 子件列表
        treeData: state => state.base.bom.structureTree, // bom结构
        versionList: state => state.base.bom.versionList // bom版本数据
      })
    },
    created () {
      const {
        id = 1
      } = this.$route.params
      this.curId = id
      this.getVersionList()
    },
    methods: {
      // 所有异步请求
      ...mapActions([
        'A_BOM_CHILD_ADD',
        'A_UPDATE_BOM_USE_COUNT',
        'A_UPDATE_BOM_VERSION_NAME',
        'A_GET_BOM_CHILD_LIST',
        'A_GET_BOM_VERSION_LIST',
        'A_GET_BOM_VERSION_COPY',
        'A_GET_BOM_VERSION_DEFAULT',
        'A_GET_BOM_STRUCTURE_LIST',
        'A_BOM_CHILD_DEL',
        'A_BOM_DETAIL',
        'A_BOM_PART_DETAIL',
        'A_BOM_CHILD_DETAIL',
        'A_GET_BOM_VERSION_DEL',
        'A_GET_BOM_VERSION_ENABLE_FLAG',
        'A_GET_BOM_MULTIPLEX'
      ]),
      // 同步vuex数据
      ...mapMutations([
        'M_SET_BOM_VERSION_LIST',
        'M_SET_BOM_STRUCTURE_LIST',
        'M_SET_BOM_CHILD_LIST',
        'M_SET_BOM_DETAIL'
      ]),
      // 头部返回
      headBack () {
        this.$router.push({
          name: 'bom'
        })
      },
      // 获取版本
      async getVersionList () {
        try {
          const {
            status,
            data
          } = await this.A_GET_BOM_VERSION_LIST({
            baseBomId: this.curId
          })
          if (status === 0 && data && data.length > 0) {
            const [temp] = data
            this.curVersion = temp
            this.enableFlag = temp.enableFlag
            this.getStructureList()
          } else if (data && data.length === 0) {
            this.M_SET_BOM_STRUCTURE_LIST([])
            this.M_SET_BOM_DETAIL({})
            this.M_SET_BOM_CHILD_LIST([])
          }
        } catch (e) {
          console.log(e)
        }
      },
      // 获取bom 结构
      async getStructureList () {
        try {
          const {
            baseBomId,
            baseBomVersionId,
            versionNum
          } = this.curVersion
          const arg = {
            baseBomId,
            baseBomVersionId,
            versionNum
          }
          const {
            status,
            data
          } = await this.A_GET_BOM_STRUCTURE_LIST(arg)
          if (status === 0 && data && data.length > 0) {
            const [temp] = data
            this.currentData = temp
            this.currentNodeKey = temp.code
            this.getData()
            this.getPartDetail()
          }
        } catch (e) {
          console.log(e)
        }
      },
      // 获取bom 结构只获取当前数组不刷新其他关联数据
      getStructureListV2 () {
        const {
          versionNum,
          baseBomId,
          baseBomVersionId
        } = this.currentData
        const verArg = {
          baseBomId,
          baseBomVersionId,
          versionNum
        }
        this.A_GET_BOM_STRUCTURE_LIST(verArg)
      },
      // 获取子件数据
      getData () {
        const {
          baseBomId,
          baseBomVersionId,
          baseBomDetailId,
          code
        } = this.currentData
        const arg = {
          baseBomId,
          baseBomVersionId,
          baseBomDetailId,
          code
        }
        this.A_GET_BOM_CHILD_LIST(arg)
      },
      // 母件详情
      getPartDetail () {
        const {
          baseBomId,
          baseBomVersionId,
          code,
          rootNode,
          baseMaterialId,
          baseBomDetailId
        } = this.currentData
        const arg = {
          baseBomId,
          baseBomVersionId,
          code,
          baseMaterialId,
          baseBomDetailId
        }
        if (rootNode) {
          this.A_BOM_PART_DETAIL(arg)
          return
        }
        this.A_BOM_CHILD_DETAIL(arg)
      },
      // 点击tree
      handleNodeClick (data) {
        if (this.currentData.code === data.code) {
          return
        }
        this.currentData = data
        this.currentNodeKey = data.code
        this.getData()
        this.getPartDetail()
      },
      // 复用关闭
      reuseClose () {
        this.reuseVisible = false
      },
      //  更多下拉选择
      handleDropDown (id) {
        if (id === 1) {
          // 导入
          this.$message.error('暂不支持该功能')
          return
        }
        if (id === 2) {
          // 导出
          this.$message.error('暂不支持该功能')
          return
        }
        if (id === 3) {
          // 删除当前版本
          this.delVersion()
          return
        }
        if (id === 4) {
          // 修改bom版本名称
          this.updateData.versionName = this.curVersion.versionName
          this.updateData.useCount = undefined
          this.type = 'version'
          this.updateVisible = true
          return
        }
        if (id === 5) {
          // 复制为新版本
          this.copyBom()
          return
        }
        // 复用其他BOM结构 id === 6
        this.reuseVisible = true
      },
      // 版本切换
      versionSwitch (item, i) {
        if (this.curVersion.versionNum === item.versionNum) {
          return
        }
        this.curVersion = item
        this.$set(this, 'enableFlag', item.enableFlag)
        this.enableFlag = item.enableFlag
        this.getStructureList()
      },
      // 复制为新版本
      async copyBom () {
        try {
          const {
            baseBomId,
            baseBomVersionId,
            versionName
          } = this.curVersion
          const arg = {
            baseBomId,
            baseBomVersionId,
            versionName: versionName && versionName !== '' ? `复制${versionName}` : ''
          }
          const {
            status,
            data
          } = await this.A_GET_BOM_VERSION_COPY(arg)
          if (status === 0) {
            this.$message.success('复制成功')
            const result = [...this.versionList, data]
            this.M_SET_BOM_VERSION_LIST(result)
            this.curVersion = data
            this.enableFlag = data.enableFlag
            this.getStructureList()
          }
        } catch (e) {
          console.log(e)
          this.$message.success('复制失败')
        }
      },
      // bom复用
      async bomMultiplex (targetBom) {
        try {
          const {
            treeData
          } = this
          if (treeData && treeData.length > 0) {
            const [temp] = treeData
            const {
              baseBomId,
              baseBomVersionId,
              code,
              rootNode,
              baseBomDetailId
            } = temp
            const arg = {
              targetBom: {
                baseBomId,
                baseBomVersionId,
                code,
                rootNode,
                baseBomDetailId
              },
              sourceBom: {
                baseBomId: targetBom.baseBomId,
                baseBomVersionId: targetBom.baseBomVersionId,
                versionNum: targetBom.versionNum
              }
            }
            const {
              status
            } = await this.A_GET_BOM_MULTIPLEX(arg)
            if (status === 0) {
              this.reuseClose()
              this.getStructureListV2()
              this.getData()
            }
            return
          }
          this.$message.error('请选择要复用到哪个版本下')
        } catch (e) {
          console.log(e)
        }
      },
      // 点击确认
      dialogSubmit (formName) {
        const {
          type
        } = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (type === 'version') {
              this.updateVersionName()
              return
            }
            this.updateUseCount()
          }
        })
      },
      // 打开修改用量
      childEdit (row) {
        this.curChildData = row
        this.type = 'useCount'
        this.updateData.versionName = undefined
        this.updateData.useCount = row.useCount
        this.updateVisible = true
      },
      // 修改版本名称
      async updateVersionName () {
        try {
          const {
            versionName
          } = this.updateData
          const {
            baseBomVersionId,
            baseBomId
          } = this.curVersion
          const arg = {
            baseBomId,
            baseBomVersionId,
            versionName
          }
          const {
            status
          } = await this.A_UPDATE_BOM_VERSION_NAME(arg)
          if (status === 0) {
            this.$message.success('更新成功')
            this.updateVisible = false
            const result = this.versionList.map(it => ({
              ...it,
              versionName: baseBomVersionId === it.baseBomVersionId
                ? versionName
                : it.versionName
            }))
            this.curVersion = {
              ...this.curVersion,
              versionName
            }
            this.M_SET_BOM_VERSION_LIST(result)
          }
        } catch (e) {
          console.log(e)
          this.$message.error('更新失败')
        }
      },
      // 更新用量
      async updateUseCount () {
        try {
          const {
            baseBomDetailId,
            baseBomId,
            baseBomVersionId,
            baseMaterialId,
            code
          } = this.curChildData
          const arg = {
            baseBomDetailId,
            baseBomId,
            baseBomVersionId,
            baseMaterialId,
            code,
            useCount: this.updateData.useCount
          }
          const {
            status
          } = await this.A_UPDATE_BOM_USE_COUNT(arg)
          if (status === 0) {
            this.$message.success('更新成功')
            this.updateVisible = false
            this.getData()
          }
        } catch (e) {
          this.$message.error('更新失败')
          console.log(e)
        }
      },
      // 设置当前版本为默认版本
      async defaultFlagC () {
        try {
          const {
            baseBomVersionId,
            baseBomId
          } = this.curVersion
          const arg = {
            bomVersionId: baseBomVersionId,
            baseBomId
          }
          const {
            status
          } = await this.A_GET_BOM_VERSION_DEFAULT(arg)
          if (status === 0) {
            this.$message.success('设置成功')
            const result = this.versionList.map((it, i) => ({
              ...it,
              defaultFlag: baseBomVersionId === it.baseBomVersionId ? 'Y' : 'N'
            }))
            this.curVersion.defaultFlag = 'Y'
            this.M_SET_BOM_VERSION_LIST(result)
          }
        } catch (e) {
          this.$message.error('设置失败')
          console.log(e)
        }
      },
      // 设置是否启用
      async enableFlagC (val) {
        try {
          const {
            baseBomVersionId,
            baseBomId,
            defaultFlag,
            enableFlag
          } = this.curVersion
          if (defaultFlag === 'Y') {
            this.$message.error('此版本为默认版本，不能处于未启用状态')
            this.$nextTick(() => {
              this.enableFlag = enableFlag
            })
            return
          }
          const arg = {
            baseBomVersionId,
            baseBomId,
            enableFlag: val
          }
          const { status } = await this.A_GET_BOM_VERSION_ENABLE_FLAG(arg)
          if (status === 0) {
            this.$message.success('设置成功')
            const result = this.versionList.map((it, i) => ({
              ...it,
              enableFlag: baseBomVersionId === it.baseBomVersionId ? val : it.enableFlag
            }))
            this.curVersion = {
              ...this.curVersion,
              enableFlag: val
            }
            this.M_SET_BOM_VERSION_LIST(result)
          }
        } catch (e) {
          console.log(e)
          this.$message.error('设置失败')
        }
      },
      // 关闭添加子件
      close () {
        this.visible = false
      },
      // 选择物料 新增子件 (请求接口)
      async materialSubmit (val) {
        try {
          const {
            baseBomId,
            baseBomVersionId,
            baseMaterialId,
            code
          } = this.currentData
          const arg = {
            code,
            baseBomId,
            baseBomVersionId,
            baseMaterialId,
            children: val.map(item => ({
              baseMaterialId: item.baseMaterialId,
              useCount: item.useCount,
              baseMaterialName: item.materialName
            })) || []
          }
          const {
            status
          } = await this.A_BOM_CHILD_ADD(arg)
          if (status === 0) {
            this.$message.success('新增成功')
            this.getStructureListV2()
            this.getData()
            this.close()
          }
        } catch (e) {
          console.log(e)
          this.$message.error('新增失败')
        }
      },
      // 删除版本
      delVersion () {
        const {
          versionList,
          curVersion
        } = this
        if (versionList && versionList.length === 1) {
          this.$message.error('该BOM最少要保留一个版本')
          return
        }
        if (curVersion.defaultFlag === 'Y') {
          this.$message.error('该版本为该BOM的默认版本,暂不能删除')
          return
        }
        this.$confirm('此操作将永久删除该版本, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            this.delVerAction()
          })
          .catch(() => {})
      },
      // 删除版本请求接口
      async delVerAction () {
        try {
          const {
            baseBomId,
            baseBomVersionId
          } = this.curVersion
          const arg = {
            baseBomId,
            baseBomVersionId,
            rootNode: true
          }
          const {
            status
          } = await this.A_GET_BOM_VERSION_DEL(arg)
          if (status === 0) {
            this.$message.success('删除成功')
            const result = this.versionList.filter(
              (it, i) => it.baseBomVersionId !== baseBomVersionId
            )
            this.M_SET_BOM_VERSION_LIST(result)
            const [temp] = result
            this.curVersion = temp
            this.enableFlag = temp.enableFlag
            this.getStructureList()
          }
        } catch (e) {
          console.log(e)
          this.$message.error('删除失败')
        }
      },
      // 删除子件
      del (row) {
        this.$confirm('此操作将永久删除该子件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            this.delAction(row)
          })
          .catch(() => {})
      },
      // 删除子件请求接口
      async delAction (row) {
        try {
          const {
            baseBomDetailId,
            baseBomId,
            baseBomVersionId,
            baseMaterialId,
            code,
            rootNode
          } = row
          const arg = {
            baseBomDetailId,
            baseBomId,
            baseBomVersionId,
            baseMaterialId,
            code,
            rootNode: rootNode || false
          }
          const {
            status
          } = await this.A_BOM_CHILD_DEL(arg)
          if (status === 0) {
            this.$message.success('删除成功')
            this.getStructureListV2()
            this.getData()
          }
        } catch (e) {
          this.$message.error('删除失败')
          console.log(e)
        }
      }
    }
  }

</script>
<style lang="less" scoped>
  .bom-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .title {
    font-size: 16px;
  }

  .tabs-main {
    max-width: calc(100% - 200px);
    overflow-x: auto;
    padding-left: 1px;
    margin-bottom: 4px;
  }

  .tabs {
    display: flex;
    flex-flow: row wrap;
  }

  .tab-item {
    display: inline-block;
    padding: 10px 16px;
    border: 1px solid #dcdfe6;
    margin-left: -1px;
    position: relative;
    text-align: center;
    /*width: 120px;*/
    border-radius: 4px;
  }

  .tab-item-tip {
    position: absolute;
    top: -3px;
    left: 0;
  }

  .tab-item:hover {
    background-color: #7ca870;
    color: #fff;
  }

  .tab-item-active {
    background-color: #7ca870;
    color: #fff;
  }

  .sub-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

</style>
<style>
  .childBom .el-input-number .el-input__inner {
    text-align: left !important;
  }
</style>
