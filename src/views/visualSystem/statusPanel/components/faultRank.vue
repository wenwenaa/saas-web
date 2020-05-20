<template>
	<div class="fault-rank-container">
		<div id="fault-bar-chart"></div>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import { drawEChart } from '@/utils/utils'

	export default {
		name: 'FaultRank',
		props: {
			watchData: {
				type: Object,
				default: () => {}
			},
			currentClassName: {
				type: String,
				default: ''
			}
		},
		data () {
			return {
				legendData: [],
				seriesData: [],
				currentClassText: ''
			}
		},
		watch: {
			watchData (data) {
				if (data) {
					this.legendData = []
					this.seriesData = []
					data.lightRankingVo.lightHisVoFaultList.forEach((item) => {
						this.legendData.push(item.baseEquipmentName)
						this.seriesData.push(item.continueHours)
					})
					this.drawCharts()
				}
			},
			currentClassName (val) {
				this.currentClassText = this.transferClassName(val)
			}
		},
		methods: {
			drawCharts () {
				const _ = this
				function formatterRich (params) {
					const className = _.transferClassName(_.currentClassName)
					const currentStatusObj = _.getCurrentStatus(params.name)
					const durationRateObj = _.getDurationRate(currentStatusObj.lightHisVos)
					return `
							${params.name}${className}运行状态
							<table style="width: 100%; text-align: center;">
								<tr><td style="padding: 0 5px;">状态</td><td style="padding: 0 5px;">时长</td><td style="padding: 0 5px;">时长率</td></tr>
								<tr><td>运行</td><td>${currentStatusObj.runHours}h</td><td>${durationRateObj && durationRateObj.runDurationRate}</td></tr>
								<tr><td>暂停</td><td>${currentStatusObj.pauseHours}h</td><td>${durationRateObj && durationRateObj.pauseDurationRate}</td></tr>
								<tr style="color: red;"><td>故障</td><td>${currentStatusObj.faultHours}h</td><td>${durationRateObj && durationRateObj.faultDurationRate}</td></tr>
								<tr><td>离线</td><td>${currentStatusObj.offHours}h</td><td>${durationRateObj && durationRateObj.offDurationRate}</td></tr>
							</table>
						`
				}
				drawEChart('fault-bar-chart', {
					tooltip: {
						trigger: 'item',
						axisPointer: {
							type: 'shadow'
						},
						formatter: formatterRich
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
							},
							data: this.legendData
						}
					],
					yAxis: [
						{
							type: 'value',
							name: '时长(h)'
						}
					],
					series: [
						{
							type: 'bar',
							barWidth: '60%',
							data: this.seriesData,
							label: {
								show: true,
								position: 'top',
								formatter: '{c}h'
							},
							itemStyle: {
								barBorderRadius: 5,
								color: (params) => {
									const colorList = [
										['#0099FF', '#E0F3FF'],
										['#0099FF', '#E0F3FF'],
										['#0099FF', '#E0F3FF'],
										['#0099FF', '#E0F3FF']
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
			transferClassName (val) {
				switch (val) {
					case 'CURRENT_SHIFT_NO':
						return '本班次'
					case 'LAST_WEEK':
						return '近一周'
					case 'LAST_MONTH':
						return '近一月'
					case 'LAST_THREE_MONTH':
						return '近三月'
					default:
						return ''
				}
			},
			getCurrentStatus (name) {
				let obj = null
				this.watchData.lightRankingVo.lightHisVoFaultList.forEach((item) => {
					if (item.baseEquipmentName === name) {
						obj = item
					}
				})
				return obj
			},
			getDurationRate (data) {
				const durationRateObj = {
					runDurationRate: 0,
					pauseDurationRate: 0,
					faultDurationRate: 0,
					offDurationRate: 0
				}
				data.forEach((item) => {
					if (item.status === 'RUN') {
						durationRateObj.runDurationRate = `${Number(item.durationRate * 100).toFixed(2)}%`
					} else if (item.status === 'FAULT') {
						durationRateObj.faultDurationRate = `${Number(item.durationRate * 100).toFixed(2)}%`
					} else if (item.status === 'PAUSE') {
						durationRateObj.pauseDurationRate = `${Number(item.durationRate * 100).toFixed(2)}%`
					} else if (item.status === 'OFF') {
						durationRateObj.offDurationRate = `${Number(item.durationRate * 100).toFixed(2)}%`
					}
				})
				return durationRateObj
			}
		}
	}
</script>

<style lang="less" scoped>
	.fault-rank-container{
		#fault-bar-chart{
			height: 300px;
		}
	}
</style>
