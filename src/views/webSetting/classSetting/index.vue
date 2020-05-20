<template>
	<div class="class-setting-container">
		<tzHeadline title="班次设置">
			<template slot="btn">
				<el-button class="tz-btn-add" round size="medium" @click="handleSaveClass">保存</el-button>
			</template>
		</tzHeadline>
		<div class="class-note">
			<div class="tips">注意：</div>
			<div class="content">
				<p>班期=1时，班期开始时间和班期结束时间手动定义且半期总跨度不可超过24H</p>
				<p>班期>1时，班期总跨度定位24H，中间的班期开始时间继承上一行的班期结束时间(非手动填写)</p>
				<p class="caution">设定后的班期将会影响您工程三色灯的数据显示，请谨慎确认</p>
			</div>
		</div>
		<div class="class-select-box">
			<div class="class-select">
				<p class="tips"><span>*</span>班期数</p>
				<el-select v-model="classValue" placeholder="请选择" @change='handleClassChange'>
					<el-option
					v-for="item in classOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value">
					</el-option>
				</el-select>
			</div>
			<div class="class-time-select">
				<p class="tips"><span>*</span>开始时间</p>
				<el-time-select
					v-model="startTime"
					:picker-options="{
						start: '00:00',
						step: '00:05',
						end: '24:00'
					}"
					@change="handleTimeChange"
					placeholder="选择时间">
				</el-time-select>
			</div>
		</div>
		<div class="class-list-box">
			<el-table
				:data="classList"
				class="table-box"
				border
				v-loading="tableLoading"
				element-loading-text="拼命加载中"
				element-loading-spinner="el-icon-loading"
				element-loading-background="rgba(255, 255, 255, 0.8)"
				:header-cell-style="{'background-color': '#F9F9F9'}"
			>
				<el-table-column prop="no" label="序号" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="className" label="班次名称" align="center"  show-overflow-tooltip>
					<template slot-scope="scope">
						{{ scope.row.className | filterClassName }}
					</template>
				</el-table-column>
				<el-table-column prop="startTime"  label="班期开始时间" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="endTime" label="班期结束时间" align="center"   show-overflow-tooltip></el-table-column>
			</el-table>
		</div>
		<tzDialog :dialogTitle="dialogTitle" :dialogVisible="dialogVisible" @dialogClose="dialogClose">
			<template slot="single">
				<div>班期保存后，将影响工厂三色灯的数据统计，确定保存？</div>
				<div class="btn-box">
					<el-button class="tz-staff-cancel" round size="medium" @click="cancelClass">取消</el-button>
					<el-button class="tz-search-submit" round size="medium" @click="saveClass">确定保存</el-button>
				</div>
			</template>
		</tzDialog>
	</div>
</template>

<script type="text/javascript">
	import { mapActions } from 'vuex'

	export default {
		name: 'classSetting',
		data () {
			return {
				classValue: '1',
				classOptions: [{
					value: '1',
					label: '1班'
				}, {
					value: '2',
					label: '2班'
				}, {
					value: '3',
					label: '3班'
				}, {
					value: '4',
					label: '4班'
				}],
				classList: [],
				tableLoading: false,
				startTime: '',
				dialogTitle: '温馨提示',
				dialogVisible: false,
				loopTimer: 1
			}
		},
		filters: {
			filterClassName (val) {
				switch (parseInt(val, 0)) {
					case 1:
						return '第一班'
					case 2:
						return '第二班'
					case 3:
						return '第三班'
					case 4:
						return '第四班'
					default:
						break
				}
				return val
			}
		},
		methods: {
			...mapActions([
				'A_ADD_CLASS'
			]),
			saveClass () {
				this.A_ADD_CLASS({
					shiftCount: this.classValue,
					startTime: `${this.startTime}:00`
				}).then((res) => {
					this.cancelClass()
				})
			},
			cancelClass () {
				this.dialogVisible = false
			},
			dialogClose () {
				this.dialogVisible = false
			},
			// 开始时间，班期数
			calcClass (beginTime, distance) {
				if (!beginTime || !distance) {
					return
				}
				const singleTimeRange = {
					no: `0${parseInt(this.classValue, 0) - parseInt(this.loopTimer, 0) + 1}`,
					className: parseInt(this.classValue, 0) - parseInt(this.loopTimer, 0) + 1,
					startTime: '',
					endTime: ''
				}
				const ret = this.calcTime(beginTime, distance)
				singleTimeRange.startTime = beginTime
				singleTimeRange.endTime = ret

				this.classList.push(singleTimeRange)
				// 判断班次是否执行完毕
				if (this.loopTimer -= this.loopTimer > 0) {
					this.calcClass(ret, distance)
				}
			},
			calcTime (date, distance) {
				// 凡是date中有'次日'的，返回结果中必有'次日'
				if (!date || !distance) {
					return
				}
				let [hours, mins] = date.split(':')
				hours = hours.replace(/\s*/g, '')
				mins = mins.replace(/\s*/g, '')
				let nextTip = false // 是否有'次日'的标记
				if (hours.indexOf('次日') > -1) {
					nextTip = true
					hours = hours.replace('次日', '')
				}
				distance = distance || 1
				switch (parseInt(distance, 0)) {
					case 1:
						hours = this.formatTime(parseInt(hours, 0) + 24)
						break
					case 2:
						hours = this.formatTime(parseInt(hours, 0) + 12)
						break
					case 3:
						hours = this.formatTime(parseInt(hours, 0) + 8)
						break
					case 4:
						hours = this.formatTime(parseInt(hours, 0) + 6)
						break
					default:
						break
				}
				hours = nextTip ? `次日${hours}` : hours
				return `${hours}:${mins}`
			},
			// 把超过24的格式转换成'次日'的格式
			formatTime (hours) {
				if (hours === undefined) {
					return
				}
				if (parseInt(hours, 0) >= 24) {
					hours -= 24
					return String(hours).length === 1 ? `次日0${hours}` : `次日${hours}`
				}
				return hours
			},
			handleTimeChange () {
				if (!this.startTime) {
					return
				}
				this.classList = []
				this.loopTimer = parseInt(this.classValue, 0)
				this.calcClass(this.startTime, this.classValue)
			},
			handleClassChange () {
				this.loopTimer = parseInt(this.classValue, 0)
				this.startTime = ''
				this.classList = []
			},
			handleSaveClass () {
				this.dialogVisible = true
			}
		}
	}
</script>

<style lang="less">
	.class-setting-container{
		.class-note{
			display: flex;
			font-size: 14px;
			color: #999;
			line-height: 2;
			.tips{
				width: 50px;
			}
			.content{
				.caution{
					color: #F56C6C;
				}
			}
		}
		.class-select-box{
			display: flex;
			margin-top: 20px;
			.tips{
				font-size: 16px;
				span{
					color: #F56C6C;
					margin-right: 5px;
				}
			}
			.class-select{
				width: 200px;
			}
			.class-time-select{
				padding-left: 20px;
			}
		}
		.class-list-box{
			margin-top: 10px;
			width: 650px;
		}
		.btn-box{
			text-align: center;
			margin-top: 30px;
		}
	}
</style>
