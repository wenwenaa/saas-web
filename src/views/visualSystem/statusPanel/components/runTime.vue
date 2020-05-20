<template>
	<div class="run-time-container">
		<div class="left">
			<div class="current-class-run-data">
				<div class="trend" :class="(watchData && watchData.runHoursDiff) > 0 ? '' : 'trend-down'"><span class="icon " :class="(watchData && watchData.runHoursDiff) > 0 ? 'icon-up' : 'icon-down'"></span>{{watchData && watchData.runHoursDiff}}h</div>
				<div class="runhours">{{watchData && watchData.runHours}}h</div>
				<div class="desc">{{currentClassName | transferClassName}}运行时长</div>
			</div>
			<div id="circle-charts"></div>
		</div>
		<div class="right">
			<div class="status-box">
				<p class="status-desc"><span class="left">总设备</span><span class="right">{{watchData && watchData.totalEquipmentQuantity}}台</span></p>
				<p class="status-desc"><span class="left">累计开工设备</span><span class="right">{{watchData && watchData.workedEquipmentQuantity}}台</span></p>
				<p class="status-desc"><span class="left">开工率</span><span class="right red">{{watchData && watchData.wordedPercent}}
					<span class="compare">
						较昨天
						<img src="@/assets/images/icon/rank-up.png" v-if="watchData && watchData.wordedPercent > 0">
						<img src="@/assets/images/icon/rank-up.png" v-else>
					</span></span></p>
			</div>
		</div>
	</div>
</template>

<script>
	import { drawEChart } from '@/utils/utils'

	export default {
		name: 'RunTime',
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
				runTimeData: [
					{
						value: 0,
						name: '运行',
						rate: 0,
						itemStyle: {
							color: '#03CC00'
						}
					},
					{
						value: 0,
						name: '故障',
						rate: 0,
						itemStyle: {
							color: '#FFC53A'
						}
					},
					{
						value: 0,
						name: '暂停',
						rate: 0,
						itemStyle: {
							color: '#F56C6C'
						}
					},
					{
						value: 0,
						name: '离线',
						rate: 0,
						itemStyle: {
							color: '#D8D8D8'
						}
					}
				]
			}
		},
		watch: {
			watchData (data) {
				if (data) {
					this.runTimeData[0].value = data.runHours
					this.runTimeData[0].rate = data.runPercent

					this.runTimeData[1].value = data.faultHours
					this.runTimeData[1].rate = data.faultPercent

					this.runTimeData[2].value = data.pauseHours
					this.runTimeData[2].rate = data.pausePercent

					this.runTimeData[3].value = data.offHours
					this.runTimeData[3].rate = data.offPercent
					this.drawCharts()
				}
			}
		},
		filters: {
			transferClassName (val) {
				switch (val) {
					case 'CURRENT_SHIFT_NO':
						return '本班次'
					case 'LAST_WEEK':
						return '本周'
					case 'LAST_MONTH':
						return '近一月'
					case 'LAST_THREE_MONTH':
						return '近三月'
					default:
						return ''
				}
			}
		},
		methods: {
			drawCharts () {
				drawEChart('circle-charts', {
					tooltip: {
						show: false,
						confine: true,
						trigger: 'item',
							formatter: '{a} <br/>{b}: {c}h ({d}%)'
					},
					legend: {
						orient: 'vertical',
						data: ['运行', '故障', '暂停', '离线'],
						left: 300,
						top: 100,
						formatter: (name) => {
							let i = 0
							this.runTimeData.forEach((item, index) => {
								if (name === item.name) {
									i = index
								}
							})
							return `${this.runTimeData[i].name} ${this.runTimeData[i].value}h ${this.runTimeData[i].rate}`
						}
					},
					series: [
						{
							name: '访问来源',
							left: -220,
							type: 'pie',
							radius: ['50%', '70%'],
							avoidLabelOverlap: false,
							hoverAnimation: false,
							label: {
								show: false
							},
							itemStyle: {
								shadowColor: 'rgba(0, 0, 0, 0.5)',
								shadowBlur: 20
							},
							labelLine: {
								show: false
							},
							data: this.runTimeData
						}
					]
				})
			}
		}
	}
</script>

<style lang="less">
	.run-time-container{
		display: flex;
		.left{
			position: relative;
			width: 55%;
			#circle-charts{
				height: 300px;
			}
			.current-class-run-data{
				position: absolute;
				width: 130px;
				height: 130px;
				top: 86px;
				left: 72px;
				border-radius: 50%;
				padding: 17px 0 0 0px;
				text-align: center;
				.trend-down{
					color: #32d62f !important;
				}
				.trend{
					color: #F56C6C;
					font-size: 14px;
					margin-bottom: 14px;
					.icon{
						display: inline-block;
						width: 14px;
						height: 12px;
						background-repeat: no-repeat;
						background-size: 100% auto;
						margin-right: 5px;
					}
					.icon-up{
						background-image: url('../../../../assets/images/icon/rank-up.png');
					}
					.icon-down{
						background-image: url('../../../../assets/images/icon/rank-down.png');
					}
				}
				.runhours{
					color: #444444;
					font-size: 24px;
				}
				.desc{
					color: #999999;
					font-size: 14px;
				}
			}
		}
		.right {
			width: 45%;
			.status-box{
				background-color: #FAFAFA;
				margin-right: 50px;
				margin-top: 50px;
				padding: 30px 0 10px 30px;
				border-radius: 0.5em;
				.status-desc{
					line-height: 3;
					font-size: #444444;
					display: flex;
					.left{
						width: 50%;
					}
					.right {
						width: 50%;
						font-weight: bold;
						.compare{
							margin-left: 10px;
							border: 1px solid #F56C6C;
							font-weight: normal;
							padding: 0.1em 0.2em;
							border-radius: 0.2em;
							transform: scale(0.58);
							img {
								display: inline;
								transform: scale(0.7)
							}
						}
					}
					.red{
						color: #F56C6C;
					}
				}
			}
		}
	}
</style>
