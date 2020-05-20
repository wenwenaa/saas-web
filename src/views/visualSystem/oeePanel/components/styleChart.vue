<template>
	<div class="style-chart-container">
		<div class="line-chart-box" id="line-chart"></div>
	</div>
</template>

<script type="text/javascript">
	import { drawEChart } from '@/utils/utils'

	export default {
		name: 'styleChart',
		props: {
			oeeList: {
				type: Array,
				default: () => []
			},
			classCount: {
				type: Number,
				default: 0
			}
		},
		data () {
			return {
				xAxisData: [],
				seriesData: [],
				labelOption: {
					show: true,
					position: 'insideRight'
				}
			}
		},
		computed: {
			allProps () {
				const { oeeList, classCount } = this
				return {
					oeeList,
					classCount
				}
			}
		},
		watch: {
			allProps: {
				handler (newVal, oldVal) {
					if (newVal.oeeList && newVal.oeeList.length > 0 && newVal.classCount && newVal.classCount > 0) {
						this.calcChartData()
					}
				},
				deep: true
			}
		},
		mounted () {
			if (this.oeeList && this.oeeList.length > 0 && this.classCount && this.classCount > 0) {
				this.calcChartData()
			}
		},
		methods: {
			drawLineChart (xAxisData, seriesData) {
				console.log('xAxisData', xAxisData)
				console.log('seriesData', seriesData)
				const data = {
					color: ['#7CA870', '#FFC53A', '#F56C6C', '#999999'],
					legend: {
						data: ['运行', '暂停', '故障', '离线']
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
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
							data: xAxisData,
							axisTick: {
								alignWithLabel: true
							}
						}
					],
					yAxis: [
						{
							type: 'value',
							axisLabel: {
								formatter: '{value}%'
							}
						}
					],
					series: seriesData
				}
				drawEChart('line-chart', data)
			},
			calcChartData () {
				this.xAxisData = []
				this.seriesData = []
				for (let i = 0; i < this.classCount; i += 1) {
					// 班次循环
					const ret = this.calcSeriesData(i)

					this.oeeList.forEach((item, order) => {
						// 设备循环
						ret[0].data.push(item.lightOeeDetail[i] && item.lightOeeDetail[i].runTime)
						ret[1].data.push(item.lightOeeDetail[i] && item.lightOeeDetail[i].pauseTime)
						ret[2].data.push(item.lightOeeDetail[i] && item.lightOeeDetail[i].faultTime)
						ret[3].data.push(item.lightOeeDetail[i] && item.lightOeeDetail[i].offTime)

						const index = ret[0].indexTag
						const lightOeeDetailIndex = item.lightOeeDetail[index]
						const formatterStr = `${Number(index) + 1}班<br /> 运行：${lightOeeDetailIndex && lightOeeDetailIndex.runTime}H 20%<br />暂停：${lightOeeDetailIndex && lightOeeDetailIndex.pauseTime}H 20%<br />故障：${lightOeeDetailIndex && lightOeeDetailIndex.faultTime}H 20%<br />离线：${lightOeeDetailIndex && lightOeeDetailIndex.offTime}H 20%`
						console.log(formatterStr)
						if (order === 0) {
							ret[0].tooltip.formatter = formatterStr
						}
						if (order === 1) {
							ret[1].tooltip.formatter = formatterStr
						}
						if (order === 2) {
							ret[2].tooltip.formatter = formatterStr
						}
						if (order === 3) {
							ret[3].tooltip.formatter = formatterStr
						}
						if (i === 0) {
							this.xAxisData.push(item.equipmentName)
						}
					})
					this.seriesData.push(...ret)
				}
				this.$nextTick(() => {
					this.drawLineChart(this.xAxisData, this.seriesData)
				})
			},
			calcSeriesData (i) {
				const tooltip = {
					trigger: 'item',
					axisPointer: {
						type: 'shadow'
					}
				}
				return [
					{
						name: '运行',
						type: 'bar',
						stack: `${i + 1}班`,
						label: this.labelOption,
						barWidth: '10%',
						data: [],
						tooltip: {
							...tooltip,
							formatter: ''
						},
						indexTag: `${i}`
					},
					{
						name: '暂停',
						type: 'bar',
						stack: `${i + 1}班`,
						label: this.labelOption,
						barWidth: '10%',
						data: [],
						tooltip: {
							...tooltip,
							formatter: ''
						},
						indexTag: `${i}`
					},
					{
						name: '故障',
						type: 'bar',
						stack: `${i + 1}班`,
						label: this.labelOption,
						barWidth: '10%',
						data: [],
						tooltip: {
							...tooltip,
							formatter: ''
						},
						indexTag: `${i}`
					},
					{
						name: '离线',
						type: 'bar',
						stack: `${i + 1}班`,
						label: this.labelOption,
						barWidth: '10%',
						data: [],
						tooltip: {
							...tooltip,
							formatter: ''
						},
						indexTag: `${i}`
					}
				]
			}
		}
	}
</script>

<style lang="less">
	.style-chart-container{
		.line-chart-box{
			height: 500px;
		}
	}
</style>

