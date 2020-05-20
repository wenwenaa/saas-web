<template>
	<div class="equipment-detail-container">
		<tzHeadline :title="title" backText="返回" :isShowBack="true"></tzHeadline>
		<div class="caption"> <span>{{singleWatchData.baseEquipmentName}}</span> </div>
		<div class="detail-container">
			<div class="left">
				<p class="title">今日运行状况</p>
				<div class="top-chart">
					<div class="circle-chart-box">
						<div class="circle-chart_item" id="run-chart"></div>
						<div class="circle-chart_item" id="fault-chart"></div>
						<div class="circle-chart_item" id="pause-chart"></div>
						<div class="circle-chart_item" id="off-chart"></div>
					</div>
					<div class="line-chart-box" id="line-chart"></div>
				</div>
				<div class="bottom-satisfiy">
					<div class="total-time-box">
						<p>本月累计运行时间</p>
						<p class="time"><span>{{singleWatchData.mouthRunTime}}</span>小时</p>
					</div>
					<div class="total-fault-box">
						<p>本月故障总次数</p>
						<p class="num"><span>{{singleWatchData.faultCount}}</span>次</p>
					</div>
				</div>
			</div>
			<div class="right">
				<p class="title">历史运行</p>
				<div class="time-range-select">
					<span class="label">时间范围</span>
					<el-date-picker
						v-model="runTimeRangeVal"
						type="daterange"
						range-separator="-"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						@change="getRunHistoryData"
						>
					</el-date-picker>
				</div>
				<div class="classes-check">
					<span class="label">选择班次</span>
					<el-checkbox-group v-model="classesCheckList" class="classes-group" @change="getRunHistoryData">
						<el-checkbox v-for="index in singleWatchData.shiftCount" :key="index" :label="index">{{index | transferClassName}}班</el-checkbox>
					</el-checkbox-group>
				</div>
				<el-table
					:data="runHistoryData"
					class="table-box"
					border
					v-loading="tableLoading"
					element-loading-text="拼命加载中"
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(255, 255, 255, 0.8)"
					:header-cell-style="{'background-color': '#F9F9F9'}"
				>
					<el-table-column prop="shiftNo" label="班次" align="center" show-overflow-tooltip>
						<template slot-scope="scope">
							{{scope.row.hisDate}} {{scope.row.shiftNo | transferClassName}}班
						</template>
					</el-table-column>
					<el-table-column prop="pastStatus" label="色灯" align="center"  show-overflow-tooltip>
						<template slot-scope="scope">
							<span class="light-status" v-if="scope.row.pastStatus === 'RUN'" :class="scope.row.pastStatus === 'RUN' ? 'light-run' : ''"></span>
							<span class="light-status" v-if="scope.row.pastStatus === 'PAUSE'" :class="scope.row.pastStatus === 'PAUSE' ? 'light-pause' : ''"></span>
							<span class="light-status" v-if="scope.row.pastStatus === 'FAULT'" :class="scope.row.pastStatus === 'FAULT' ? 'light-fault' : ''"></span>
							<span class="light-status" v-if="scope.row.pastStatus === 'OFF'" :class="scope.row.pastStatus === 'OFF' ? 'light-off' : ''"></span>
						</template>
					</el-table-column>
					<el-table-column prop="startTime"  label="时间起点" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="endTime" label="时间终点" align="center"   show-overflow-tooltip></el-table-column>
					<el-table-column prop="duration" label="持续时长" align="center"   show-overflow-tooltip></el-table-column>
				</el-table>
				<el-pagination
					class="mt10"
					@current-change="handleCurrentChange"
					:current-page="currentPage"
					:total="runHistoryTotal"
				/>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	import { mapActions, mapState } from 'vuex'
	import moment from 'moment'
	import echarts from 'echarts'
	import { drawEChart } from '@/utils/utils'
	import filters from '../utils/index.js'

	export default {
		name: 'EquipmentDetail',
		data () {
			return {
				title: '设备详情',
				runTimeRangeVal: [],
				classesCheckList: [],
				tableLoading: false,
				currentPage: 1,
				total: 1,
				pageSize: 10
			}
		},
		mixins: [filters],
		computed: {
			...mapState({
				singleWatchData: state => state.visualWatch.singleWatchData,
				runHistoryTotal: state => state.visualWatch.runHistoryTotal,
				runHistoryData: state => state.visualWatch.runHistoryData
			})
		},
		mounted () {
			this.getSingleWatchData()
			this.getRunHistoryData()
		},
		methods: {
			...mapActions([
				'GET_SINGLE_WATCH_DATA',
				'GET_RUN_HISTORY_DATA'
			]),
			getSingleWatchData () {
				this.GET_SINGLE_WATCH_DATA({
					baseEquipmentId: this.$route.query.id,
					isPcApi: true
				}).then((res) => {
					if (res.status === 0) {
						this.drawCircleChart()
						this.drawLineChart()
					}
				})
			},
			getRunHistoryData () {
				this.GET_RUN_HISTORY_DATA({
					pageIndex: this.currentPage,
					pageSize: this.pageSize,
					baseEquipmentId: this.$route.query.id,
					inquiryShiftNos: this.classesCheckList,
					startTime: `${moment(this.runTimeRangeVal[0]).format('YYYY-MM-DD')} 00:00:00`,
					endTime: `${moment(this.runTimeRangeVal[1]).format('YYYY-MM-DD')} 23:59:59`
				})
			},
			drawCircleChart () {
				const baseStyle = {
					name: '访问来源',
					type: 'pie',
					radius: ['80%', '100%'],
					avoidLabelOverlap: false,
					hoverAnimation: false,
					silent: true,
					label: {
						normal: {
							show: true,
							position: 'center',
							formatter: '{d|{d}}%',
							color: 'black',
							fontSize: 14,
							rich: {
								b: {
									lineHeight: 20,
									color: 'black'
								},
								d: {
									fontSize: 20,
									color: 'black'
								}
							}
						}
					}
				}
				drawEChart('run-chart', {
					color: ['#7CA870', '#E7EDF5'],
					series: [
						{
							...baseStyle,
							data: [
								{ value: this.singleWatchData.runTime, name: '运行' },
								{ value: (this.singleWatchData.allTime - this.singleWatchData.runTime), label: { normal: { show: false }}}
							]
						}
					]
				})
				drawEChart('fault-chart', {
					color: ['#F56C6C', '#E7EDF5'],
					series: [
						{
							...baseStyle,
							data: [
								{ value: this.singleWatchData.faultTime, name: '故障' },
								{ value: (this.singleWatchData.allTime - this.singleWatchData.faultTime), label: { normal: { show: false }}}
							]
						}
					]
				})
				drawEChart('pause-chart', {
					color: ['#FFC53A', '#E7EDF5'],
					series: [
						{
							...baseStyle,
							data: [
								{ value: this.singleWatchData.pauseTime, name: '暂停' },
								{ value: (this.singleWatchData.allTime - this.singleWatchData.pauseTime), label: { normal: { show: false }}}
							]
						}
					]
				})
				drawEChart('off-chart', {
					color: ['#D8D8D8', '#E7EDF5'],
					series: [
						{
							...baseStyle,
							data: [
								{ value: this.singleWatchData.pauseTime, name: '暂停' },
								{ value: (this.singleWatchData.allTime - this.singleWatchData.offTime), label: { normal: { show: false }}}
							]
						}
					]
				})
			},
			drawLineChart () {
				drawEChart('line-chart', {
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					color: ['#F56C6C', '#FFC53A', '#7CA870', '#999999'],
					legend: {
						data: ['运行', '故障', '暂停', '离线']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [
						{
							type: 'category',
							axisTick: {
								alignWithLabel: true
							}
						}
					],
					yAxis: [
						{
							type: 'value'
						}
					],
					series: [
						{
							name: '总量',
							type: 'bar',
							barWidth: '60%',
							data: [
								this.singleWatchData.runTime || 0,
								this.singleWatchData.faultTime || 0,
								this.singleWatchData.pauseTime || 0,
								this.singleWatchData.offTime || 0
							],
							label: {
								show: true,
								position: 'top',
								formatter: '{c}h'
							},
							itemStyle: {
								barBorderRadius: 5,
								color: (params) => {
									const colorList = [
										['#7CA870', 'white'],
										['#F56C6C', 'white'],
										['#FFC53A', 'white'],
										['#999999', 'white']
									]
									const index = params.dataIndex
									return new echarts.graphic.LinearGradient(0, 0, 0, 1,
									[{
											offset: 0,
											color: colorList[index][0]
										},
										{
											offset: 1,
											color: colorList[index][1]
										}
									])
								}
							}
						}
					]
				})
			},
			handleCurrentChange (val) {
				this.currentPage = val
				this.pageIndex = 1
				this.getRunHistoryData()
			}
		}
	}
</script>

<style lang="less" scoped>
	.equipment-detail-container{
		.caption{
			font-size: 20px;
			margin: 20px 0;
			span{
				background-color: #7CA870;
				color: white;
				padding: 0.2em 0.3em;
			}
		}
		.detail-container{
			display: flex;
			.title{
				font-size: 14px;
				color: #444;
				font-weight: 400;
				line-height: 2.5;
			}
			.left{
				width: 30%;
				.top-chart{
					background-color: #FAFAFA;
					width: 100%;
					height: 500px;
					.circle-chart-box{
						display: flex;
						.circle-chart_item{
							width: 33.33%;
							height: 150px;
							padding: 40px 0 15px 0;
						}
					}
					.line-chart-box{
						height: 300px;
					}
				}
				.bottom-satisfiy{
					background-color: #EBEEF5;
					margin-top: 20px;
					display: flex;
					padding: 10px 0;
					.total-time-box{
						width: 50%;
						font-size: 12px;
						padding-left: 20px;
						.time{
							color: #7CA870;
							span{
								font-size: 24px;
								font-weight: bold;
							}
						}
					}
					.total-fault-box{
						width: 50%;
						font-size: 12px;
						padding-left: 20px;
						.num{
							color: #F56C6C;
							span{
								font-size: 24px;
								font-weight: bold;
							}
						}
					}
				}
			}
			.right{
				width: 70%;
				padding-left: 20px;
				.time-range-select{
					.label{
						margin-right: 10px;
					}
				}
				.classes-check{
					margin: 20px 0;
					.label{
						margin-right: 10px;
					}
					.classes-group{
						display: inline-block;
					}
				}
				.light-status{
					display: block;
					margin: 0 auto;
					width: 22px;
					height: 22px;
				}
				.light-run {
					background: url('../../../assets/images/icon/light-green.png') no-repeat;
					background-size: 100% 100%;
				}
				.light-pause {
					background: url('../../../assets/images/icon/light-yellow.png') no-repeat;
					background-size: 100% 100%;
				}
				.light-fault {
					background: url('../../../assets/images/icon/light-red.png') no-repeat;
					background-size: 100% 100%;
				}
				.light-off {
					background: url('../../../assets/images/icon/light-black.png') no-repeat;
					background-size: 100% 100%;
				}
			}
		}
	}
</style>
