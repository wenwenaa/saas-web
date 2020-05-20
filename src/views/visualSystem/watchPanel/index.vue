<template>
	<div class="watch-panel">
		<tzHeadline title="设备监控">
			<template slot="btn">
				<screenfull class="right-menu-item hover-effect" />
			</template>
		</tzHeadline>
		<div class="caption-container">
			<div class="left">
				<div class="title">
					<p class="classes-date">{{currentClassInfo.currentDate}} {{currentClassInfo.currentShiftNo | transferClassName}}班</p>
					<p class="classes-tips">当前班次</p>
					<span class="corner corner-top-left"></span>
					<span class="corner corner-top-right"></span>
					<span class="corner corner-bottom-left"></span>
					<span class="corner corner-bottom-right"></span>
				</div>
				<div class="equipment">
					<div class="equipment-item">
						<p>故障设备</p>
						<p><span>{{currentClassInfo.faultEquipmentCount}}</span>台</p>
					</div>
					<div class="equipment-item">
						<p>暂停设备</p>
						<p><span>{{currentClassInfo.pauseEquipmentCount}}</span>台</p>
					</div>
					<div class="equipment-item">
						<p>运行设备</p>
						<p><span>{{currentClassInfo.runEquipmentCount}}</span>台</p>
					</div>
					<div class="equipment-item">
						<p>离线设备</p>
						<p><span>{{currentClassInfo.offEquipmentCount}}</span>台</p>
					</div>
					<span class="corner corner-top-left"></span>
					<span class="corner corner-top-right"></span>
					<span class="corner corner-bottom-left"></span>
					<span class="corner corner-bottom-right"></span>
				</div>
			</div>
			<div class="right">
				<div class="sort-container">
					<span class="label">车间</span>
					<el-select v-model="workShopVal" multiple placeholder="请选择" class="mr20" @change="handleFilterSort">
						<el-option
							v-for="item in workShopOptions"
							:key="item.code"
							:label="item.name"
							:value="item.code">
						</el-option>
					</el-select>

					<span class="label">排序方式</span>
					<el-select v-model="sortValue" placeholder="请选择" @change="handleFilterSort">
						<el-option
							v-for="item in sortOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</div>
				<div class="filter-container">
					<el-checkbox-group v-model="filterCheckList" @change="handleFilterCheck">
						<el-checkbox label="FAULT">故障 <span class="rectangle rect-fault"></span></el-checkbox>
						<el-checkbox label="PAUSE">暂停 <span class="rectangle rect-pause"></span></el-checkbox>
						<el-checkbox label="RUN">运行 <span class="rectangle rect-run"></span></el-checkbox>
						<el-checkbox label="OFF">离线 <span class="rectangle rect-offline"></span></el-checkbox>
					</el-checkbox-group>
				</div>
			</div>
		</div>
		<div class="all-watch-panel-container" v-if="watchDataList && watchDataList.length > 0">
			<div class="panel-item" v-for="item in watchDataList" :key="item.baseEquipmentId" @click="equipmentWatchDetail(item.baseEquipmentId)">
				<single-panel
					:watchId="item.baseEquipmentId"
					:watchStatus="item.currentStatus"
					:watchEquipmentName="item.equipmentName"
					:watchRunTime="item.duration"
					:watchLightTimeVo="item.lightTimeVo"
				></single-panel>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
import { mapActions, mapState } from 'vuex'
import Screenfull from '@/components/Screenfull'
import singlePanel from './components/singlePanel'

export default {
	name: 'WatchPanel',
	components: {
		singlePanel,
		Screenfull
	},
	data () {
		return {
			workShopVal: [],
			sortValue: 'status',
			sortOptions: [{
				value: 'code',
				label: '机号顺序'
			}, {
				value: 'status',
				label: '停机顺序'
			}],
			filterCheckList: ['RUN', 'PAUSE', 'FAULT', 'OFF']
		}
	},
	computed: {
		...mapState({
			currentClassInfo: state => state.visualWatch.currentClass,
			originWatchDataList: state => state.visualWatch.allWatchData,
			watchDataList: state => state.visualWatch.allWatchData,
			workShopOptions: (state) => {
				const allWorkShop = [
					{
						name: '全部车间',
						code: ''
					},
					...state.visualWatch.workShops
				]
				return allWorkShop
			}
		})
	},
	filters: {
		transferClassName (val) {
			switch (val) {
				case 1:
					return '一'
				case 2:
					return '二'
				case 3:
					return '三'
				case 4:
					return '四'
				default:
					return ''
			}
		}
	},
	created () {
		this.getAllWatchData()
		this.getWorkShops()
		this.getCurrentClass()
	},
	methods: {
		...mapActions([
			'GET_WORKSHOPS',
			'GET_CURRENT_CLASS',
			'GET_ALL_WATCH_DATA'
		]),
		getWorkShops () {
			this.GET_WORKSHOPS({
				isPcApi: true
			})
		},
		getCurrentClass () {
			this.GET_CURRENT_CLASS({
				isPcApi: true
			})
		},
		getAllWatchData () {
			const args = {
				pageIndex: 1,
				pageSize: 10,
				inquiryStatus: this.filterCheckList,
				orderBy: this.sortValue,
				inquiryWorkshop: this.workShopVal,
				isPcApi: true
			}
			this.GET_ALL_WATCH_DATA(args)
		},
		equipmentWatchDetail (id) {
			this.$router.push({
				name: 'equipmentWatchDetail',
				query: { id }
			})
		},
		handleFilterCheck () {
			this.getAllWatchData()
		},
		handleFilterSort () {
			this.getAllWatchData()
		}
	}
}
</script>

<style lang="less" scoped>
	.watch-panel{
		.caption-container{
			display: flex;
			.left{
				width: 50%;
				display: flex;
				.title{
					width: 30%;
					line-height: 1.5;
					position: relative;
					padding: 10px 20px;
					.classes-date{
						font-size: 20px;
						background-color: #7CA870;
						color: white;
						text-align: center;
					}
					.classes-tips{
						font-size: 14px;
						color: #444;
						line-height: 1;
						padding-top: 10px;
					}
				}
				.equipment{
					width: 60%;
					display: flex;
					margin-left: 20px;
					position: relative;
					.equipment-item{
						width: 25%;
						text-align: center;
						font-size: 12px;
						padding-top: 17px;
						span{
							font-size: 24px;
							font-weight: bold;
						}
					}
				}
			}
			.right{
				width: 50%;
				text-align: right;
				.sort-container{
					font-size: 16px;
					font-weight: bold;
					.label{
						margin-right: 10px;
					}
				}
				.filter-container{
					line-height: 2;
					.rectangle{
						display: inline-block;
						width: 20px;
						height: 10px;
						font-size: 14px;
					}
					.rect-fault{
						background-color: #F56C6C;
					}
					.rect-pause{
						background-color: #FFC53A;
					}
					.rect-run{
						background-color: #7CA870;
					}
					.rect-offline{
						background-color: #999999;
					}
				}
			}
		}
		.all-watch-panel-container{
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			margin-top: 20px;
			.panel-item{
				cursor: pointer;
				margin-right: 15px;
				margin-bottom: 15px;
			}
		}
		.corner{
			position: absolute;
			width: 12px;
			height: 12px;
			border: 2px solid transparent;
		}
		.corner-top-left{
			top: 0;
			left: 0;
			border-top-color: #DEEBFF;
			border-left-color: #DEEBFF;
		}
		.corner-top-right{
			top: 0;
			right: 0;
			border-top-color: #DEEBFF;
			border-right-color: #DEEBFF;
		}
		.corner-bottom-left{
			bottom: 0;
			left: 0;
			border-bottom-color: #DEEBFF;
			border-left-color: #DEEBFF;
		}
		.corner-bottom-right{
			bottom: 0;
			right: 0;
			border-bottom-color: #DEEBFF;
			border-right-color: #DEEBFF;
		}
	}
</style>
