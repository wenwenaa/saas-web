<template>
	<div class="pause-rank-container">
		<div id="pause-bar-chart"></div>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import { drawEChart } from '@/utils/utils'

	export default {
		name: 'PauseRank',
		props: {
			watchData: {
				type: Object,
				default: () => {}
			}
		},
		data () {
			return {
				legendData: [],
				seriesData: []
			}
		},
		watch: {
			watchData (data) {
				if (data) {
					this.legendData = []
					this.seriesData = []
					data.lightRankingVo.lightHisVoPauseList.forEach((item, index) => {
						this.legendData.push(`${index + 1}. ${item.baseEquipmentName}`)
						this.seriesData.push(item.continueHours)
					})
					this.drawCharts()
				}
			}
		},
		methods: {
			drawCharts () {
				drawEChart('pause-bar-chart', {
					tooltip: {
						show: false,
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					legend: {
						data: this.legendData
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					yAxis: [
						{
							type: 'category',
							axisTick: {
								alignWithLabel: true
							},
							show: true,
							axisLine: {
								show: false
							},
							data: this.legendData.reverse()
						}
					],
					xAxis: [
						{
							type: 'value',
							show: false
						}
					],
					series: [
						{
							type: 'bar',
							barWidth: '60%',
							data: this.seriesData.reverse(),
							label: {
								show: true,
								position: 'right',
								formatter: '{c}h'
							},
							itemStyle: {
								barBorderRadius: 5,
								color: '#F7B500'
							}
						}
					]
				})
			}
		}
	}
</script>

<style lang="less">
	.pause-rank-container{
		#pause-bar-chart{
			height: 300px;
		}
	}
</style>
