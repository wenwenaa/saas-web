<template>
	<div class="work-rate-container">
		<div class="top">
			<p class="work-rate-info">运行时长: {{workPercents && workPercents.preRunHours}}</p>
			<p class="work-rate-info">
				<span v-if="currentClassName === 'CURRENT_SHIFT_NO'">上班次开工率: </span>
				<span v-if="currentClassName === 'LAST_WEEK'">上一周开工率: </span>
				<span v-if="currentClassName === 'LAST_MONTH'">上一月开工率: </span>
				<span v-if="currentClassName === 'LAST_THREE_MONTH'">上三个月开工率: </span>
				<span class="light-green">{{workPercents && workPercents.preWordedPercent}}</span>
			</p>
			<p class="work-rate-info">
				<span v-if="currentClassName === 'CURRENT_SHIFT_NO'">本班次开工率: </span>
				<span v-if="currentClassName === 'LAST_WEEK'">本周开工率: </span>
				<span v-if="currentClassName === 'LAST_MONTH'">本月开工率: </span>
				<span v-if="currentClassName === 'LAST_THREE_MONTH'">近三个月开工率: </span>
				<span class="light-green">{{workPercents && workPercents.wordedPercent}}</span>
			</p>
		</div>
		<div class="compare-tips">
			<p>相较于昨日开工率</p>
			<p class="fs18">
				<span v-if="workPercents && workPercents.wordedPercentDiff && parseInt(workPercents.wordedPercentDiff, 10) > 0">+</span>
				<span v-if="workPercents && workPercents.wordedPercentDiff && parseInt(workPercents.wordedPercentDiff, 10) < 0">-</span>
				{{workPercents && workPercents.wordedPercentDiff}}
			</p>
		</div>
		<div class="echart-box">
			<div id="line-charts"></div>
		</div>
	</div>
</template>

<script>
	import { drawEChart } from '@/utils/utils'

	export default {
		name: 'WorkRate',
		props: {
			workPercents: {
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
				xAxisData: [],
				valueData: []
			}
		},
		mounted () {},
		watch: {
			workPercents (data) {
				if (data) {
					data.workPercentList.forEach((item) => {
						this.xAxisData.push(item.eachDateFormat)
						this.valueData.push(item.eachWordedPercent)
					})
					this.drawCharts()
				}
			}
		},
		methods: {
			drawCharts () {
				drawEChart('line-charts', {
					color: ['#03CC00'],
					legend: {
						right: 50,
						top: 25,
						icon: 'roundRect',
						data: ['当前班次开工率']
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: this.xAxisData
					},
					yAxis: {
						type: 'value',
						name: '比率(%)'
					},
					series: [{
						name: '当前班次开工率',
						data: this.valueData,
						type: 'line',
						symbol: 'none',
						areaStyle: {
							color: '#5fe75d'
						},
						lineStyle: {
							color: '#03CC00'
						}
					}]
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.work-rate-container {
		position: relative;
		.top{
			.work-rate-info{
				line-height: 2.5;
				font-size: 12px;
				color: #999999;
				.light-green {
					color: #03CC00;
					font-weight: bold;
				}
			}
		}
		.compare-tips{
			position: absolute;
			top: 0px;
			right: 50px;
			background-color: #03CC00;
			border-radius: 0.5em;
			padding: 10px;
			color: white;
			width: 107px;
			.fs18{
				font-size: 18px;
				padding: 5px;
			}
		}
		.echart-box{
			#line-charts {
				height: 300px;
			}
		}
	}
</style>
