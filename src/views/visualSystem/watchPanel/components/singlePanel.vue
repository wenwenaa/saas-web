<template>
	<div class="single-panel" :class="[statusClass]">
		<div class="status-container">
			<p class="single-panel_title">{{watchEquipmentName}}</p>
			<span class="status-tips">{{statusText}}</span>
		</div>
		<div class="timer-container">
			<div class="icon-time"></div>
			<div class="run-time">
				<p class="record"><span>{{watchRunTime}}</span>小时</p>
				<p class="tips">状态持续时间</p>
			</div>
		</div>
		<div class="chart-container" :id='"chart-box"+watchId'></div>
	</div>
</template>

<script type="text/javascript">
	import { drawEChart } from '@/utils/utils'

	export default {
		name: 'SinglePanel',
		props: {
			watchId: {
				type: Number
			},
			watchStatus: {
				type: String
			},
			watchEquipmentName: {
				type: String
			},
			watchRunTime: {
				type: Number
			},
			watchLightTimeVo: {
				type: Object,
				default: () => {}
			}
		},
		data () {
			return {
				statusClass: '',
				statusText: ''
			}
		},
		created () {
			this.transferStatus()
		},
		mounted () {
			this.drawChart()
		},
		methods: {
			drawChart () {
				const lineBarData = {
					xAxis: {
						type: 'value',
						show: false
					},
					yAxis: {
						type: 'category',
						show: false
					},
					series: [{
						name: 'run',
						type: 'bar',
						itemStyle: {
							color: '#7CA870',
							// barBorderRadius: [5, 0, 0, 5]
						},
						silent: true,
						barWidth: 40,
						stack: 'z',
						barGap: '-100%',
						data: [this.watchLightTimeVo.runTime]
					}, {
						name: 'pause',
						type: 'bar',
						barWidth: 40,
						z: 10,
						stack: 'z',
						barGap: '-100%',
						data: [this.watchLightTimeVo.pauseTime],
						itemStyle: {
							color: '#FFC53A',
						}
					}, {
						name: 'fault',
						type: 'bar',
						barWidth: 40,
						z: 10,
						stack: 'z',
						data: [this.watchLightTimeVo.faultTime],
						itemStyle: {
							color: '#F56C6C',
						}
					}, {
						name: 'off',
						type: 'bar',
						barWidth: 40,
						z: 10,
						stack: 'z',
						data: [this.watchLightTimeVo.offTime],
						itemStyle: {
							color: '#999999',
						}
					}, {
						name: 'margin',
						type: 'bar',
						barWidth: 40,
						z: 10,
						stack: 'z',
						data: [this.watchLightTimeVo.allTime - (this.watchLightTimeVo.runTime + this.watchLightTimeVo.pauseTime + this.watchLightTimeVo.faultTime + this.watchLightTimeVo.offTime)],
						itemStyle: {
							color: '#F0F0F0',
						}
					}]
				}
				const idStr = `chart-box${this.watchId}`
				drawEChart(idStr, lineBarData)
			},
			transferStatus () {
				switch (this.watchStatus) {
					case 'FAULT': // 故障
						this.statusClass = 'status-fault'
						this.statusText = '故障'
						break
					case 'PAUSE': // 暂停
						this.statusClass = 'status-pause'
						this.statusText = '暂停'
						break
					case 'RUN': // 运行
						this.statusClass = 'status-run'
						this.statusText = '运行'
						break
					case 'OFF': // 离线
						this.statusClass = 'status-offline'
						this.statusText = '离线'
						break
					default:
						this.statusClass = ''
				}
			}
		}
	}
</script>

<style lang="less">
	.single-panel{
		width: 263px;
		height: 227px;
		overflow: hidden;
		background-color: #D7EDD0;
		border-radius: 0.3em;
		border: 1px solid #478935;
		cursor: pointer;
		.status-container{
			position: relative;
			.single-panel_title{
				font-size: 14px;
				font-weight: bold;
				color: #444;
				line-height: 2;
				padding-left: 20px;
			}
			.status-tips{
				position: absolute;
				right: 0;
				top: 0;
				background: url('../../../../assets/images/icon/watchpanel-corner-run.png') no-repeat;
				background-size: 100% 100%;
				font-size: 12px;
				color: white;
				line-height: 20px;
				width: 50px;
				text-align: center;
			}
		}
		.timer-container{
			display: flex;
			padding-left: 20px;
			margin: 20px 0;
			.icon-time{
				background: url('../../../../assets/images/icon/clock.png') no-repeat;
				background-size: 100% 100%;
				width: 18px;
				height: 18px;
				margin-right: 10px;
				margin-top: 4px;
			}
			.run-time{
				.record{
					color: #444;
					font-size: 14px;
					span{
						font-size: 24px;
						font-weight: bold;
					}
				}
				.tips{
					font-size: 12px;
					color: #999;
				}
			}
		}
		.chart-container{
			height: 100px;
		}
	}
	.status-fault{
		background-color: #FDDCD7 !important;
		border-color: #FD1313 !important;
		.status-tips{
			background: url('../../../../assets/images/icon/watchpanel-corner-fault.png') no-repeat !important;
		}
	}
	.status-pause{
		background-color: #FAEDCE !important;
		border-color: #EA8900 !important;
		.status-tips{
			background: url('../../../../assets/images/icon/watchpanel-corner-pause.png') no-repeat !important;
		}
	}
	.status-offline{
		background-color: #E2E2E2 !important;
		border-color: #999999 !important;
		.status-tips{
			background: url('../../../../assets/images/icon/watchpanel-corner-offline.png') no-repeat !important;
		}
	}
</style>
