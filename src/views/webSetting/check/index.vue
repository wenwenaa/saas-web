<template>
  <div>
    <tzHeadline title="审核流设置"></tzHeadline>
    <div class="modules" v-for="(item,i) in list" :key="i">
      <div class="module-name">{{item.approveType | filterDic(arr,'type','name')}}</div>
      <div class="is-use">
        <span class="is-use-title">是否启用</span>
        <el-switch
          :value="item.enableFlag"
          active-color="#13ce66"
          active-value="Y"
          inactive-value="N"
          @change="stopCheck(item.approveId,item.enableFlag)"
        ></el-switch>
      </div>
      <div class="check-box">
        <div class="check-line" v-for="(staff,index) in item.approveSeqList" :key="index">
          <div class="check-item">
            <div class="check-item-title">审核人</div>
            <div
              class="check-item-name"
              @click="editMember(index,i)"
            >{{staff.realname}}{{staff.stuffNo?`(${staff.stuffNo})`:''}}</div>
            <div class="del-btn pointer" @click="delMember(index,i)">
              <img src="../../../assets/images/icon/del-circle.png" alt />
            </div>
          </div>
          <div class="arrow">
            <img src="../../../assets/images/icon/arrow-line.png" alt />
          </div>
        </div>
        <div class="add-check pointer" @click="addMember(i)">
          <div>添加</div>
          <div>审核人</div>
        </div>
      </div>
    </div>
    <tz-staff
      :dialogVisible="addVisible"
      :chooseType="chooseType"
      :type="type"
      @submit="selectStaff"
      @cancle="cancleStaff"
      ref="staff"
    ></tz-staff>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import keepAlive from '../../../mixins/keepAlive'
import dic from '../../../global/dictionary'

export default {
  data () {
    return {
      value2: true,
      addVisible: false,
      type: 'add',
      index: 0,
      arr: dic.moduleName,
      parIndex: '',
      chooseType: 'single'
    }
  },
  mixins: [keepAlive],
  computed: {
    ...mapState({
      list: state => state.webSetting.list
    })
  },
  created () {
    this.A_GET_CHECK_LIST()
  },
  activated () {
    this.A_GET_CHECK_LIST()
  },
  methods: {
    ...mapActions([
      'A_GET_CHECK_LIST',
      'A_ADD_CHECK_POINT',
      'A_DEL_CHECK_POINT',
      'A_CHANGE_CHECK_POINT',
      'A_EDIT_CHECK_POINT'
    ]),
    ...mapMutations([]),
    addMember (i) {
      this.addVisible = true
      this.type = 'add'
      this.parIndex = i
    },
    selectStaff (row) {
      if (
        this.list[this.parIndex].approveSeqList &&
        this.list[this.parIndex].approveSeqList.some(
          item => item.stuffId === row.id
        )
      ) {
        this.$message({
          message: '该人员已经在审核人员中，不能重复添加',
          type: 'warning'
        })
      } else if (this.type === 'add') {
        if (
          this.list[this.parIndex].approveSeqList &&
          this.list[this.parIndex].approveSeqList.length > 5
        ) {
          this.$message.success('审核人员最多只能添加五个')
        } else {
          this.A_ADD_CHECK_POINT({
            approveId: this.list[this.parIndex].approveId,
            stuffId: row.id,
            stuffNo: row.stuffNo,
            realname: row.realname
          }).then((res) => {
            if (res.status === 0) {
              this.addVisible = false
            }
          })
        }
      } else {
        this.A_EDIT_CHECK_POINT({
          approveSeqId: this.list[this.parIndex].approveSeqList[this.index]
            .approveSeqId,
          stuffId: row.id,
          stuffNo: row.stuffNo,
          realname: row.realname
        }).then((res) => {
          if (res.status === 0) {
            this.addVisible = false
          }
        })
      }
    },
    cancleStaff () {
      this.addVisible = false
    },
    delMember (index, i) {
      if (this.list[i].approveSeqList.length === 1) {
        this.$confirm('是否删除最后一个审核人?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.A_DEL_CHECK_POINT({
              approveSeqId: this.list[i].approveSeqList[index].approveSeqId
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        this.A_DEL_CHECK_POINT({
          approveSeqId: this.list[i].approveSeqList[index].approveSeqId
        })
      }
    },
    editMember (index, i) {
      this.addVisible = true
      this.type = 'edit'
      this.index = index
      this.parIndex = i
    },
    stopCheck (id, v) {
      const arg = {
        approveId: id,
        enabledFlag: v === 'Y' ? 'N' : 'Y'
      }
      this.A_CHANGE_CHECK_POINT(arg)
    }
  }
}
</script>

<style lang="scss" scoped>
.modules {
  margin-bottom: 42px;
}

.module-name {
  color: #0c1b30;
  font-size: 18px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 20px;
}

.is-use {
  display: inline-block;
  margin-left: 50px;
}

.is-use-title {
  margin-right: 30px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
}

.check-box {
  display: flex;
  flex-wrap: wrap;
}

.check-item {
  min-width: 73px;
  height: 73px;
  border: 1px dashed #979797;
  box-sizing: border-box;
  position: relative;
}

.check-item-title {
  min-width: 73px;
  height: 28px;
  background: rgba(220, 223, 230, 1);
  font-size: 12px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(136, 136, 136, 1);
  line-height: 28px;
  text-align: center;
}

.check-item-name {
  padding: 0 10px;
  box-sizing: border-box;
  color: #282828;
  font-size: 14px;
  line-height: 45px;
  text-align: center;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
}

.arrow {
  width: 79px;
  height: 10px;
}

.arrow img {
  height: 100%;
}

.check-line {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
}

.add-check {
  border: 1px dashed #7ca870;
  width: 73px;
  height: 73px;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: rgba(124, 168, 112, 0.2);
  font-size: 14px;
  color: #7ca870;
}

.del-btn {
  width: 16px;
  height: 16px;
  position: absolute;
  right: 0;
  top: 0;
}

.del-btn img {
  width: 100%;
  height: 100%;
}
</style>>
