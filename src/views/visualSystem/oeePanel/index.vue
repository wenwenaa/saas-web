<template>
	<div class="oee-list">
		<tzHeadline title="OEE分析"></tzHeadline>
		<el-form :inline="true" size="medium">
			<el-form-item label="时间范围">
				<el-date-picker
					v-model="dateRange"
					type="daterange"
					range-separator="-"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					@change="getAllOeeData"
					>
				</el-date-picker>
			</el-form-item>
			<el-form-item label="车间">
				<el-select v-model="workShopVal" multiple placeholder="请选择" class="mr20" @change="getAllOeeData">
					<el-option
						v-for="item in workShopOptions"
						:key="item.code"
						:label="item.name"
						:value="item.code">
					</el-option>
				</el-select>
			</el-form-item>
			<br>
			<el-form-item label="选择班次">
				<el-checkbox-group v-model="classCheckList" class="classes-group" @change="getAllOeeData">
					<el-checkbox v-for="index in currentClassInfo.shiftCount" :key="index" :label="index">{{index | transferClassName}}班</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="" class="fr">
				<tzBtn :icon="shwoStyleClass" @click="toggleShowStyle">{{showStyleText}}</tzBtn>
			</el-form-item>
		</el-form>
		<style-table v-if="showStyle === 'table'" :oeeList="oeeList" :oeeTotal="oeeTotal" @handlePageChange="pageChange" @handlePageSizeChange="pageSizeChange"></style-table>
		<style-chart v-if="showStyle === 'chart'" :oeeList="oeeList" :classCount="currentClassInfo.shiftCount"></style-chart>
	</div>
</template>

<script type="text/javascript">
	import { mapActions, mapState } from 'vuex'
	import moment from 'moment'
	import styleTable from './components/styleTable'
	import styleChart from './components/styleChart'
	import filters from '../utils/index.js'

	export default {
		name: 'OeeList',
		data () {
			return {
				workShopVal: [],
				dateRange: [],
				classCheckList: [],
				showStyle: 'chart',
				showStyleText: '图表显示',
				shwoStyleClass: 'tz-icon-chart',
				pageIndex: 1,
				pageSize: 10
			}
		},
		mixins: [filters],
		computed: {
			...mapState({
				currentClassInfo: state => state.visualWatch.currentClass,
				oeeList: state => state.visualWatch.allOeeData,
				oeeTotal: state => state.visualWatch.allOeeTotal,
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
		components: {
			styleTable,
			styleChart
		},
		created () {
			this.getAllOeeData()
			this.getWorkShops()
			this.getCurrentClass()
		},
		methods: {
			...mapActions([
				'GET_WORKSHOPS',
				'GET_CURRENT_CLASS',
				'GET_ALL_OEE_DATA'
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
			getAllOeeData () {
				this.GET_ALL_OEE_DATA({
					startTime: this.dateRange[0] ? `${moment(this.dateRange[0]).format('YYYY-MM-DD')} 00:00:00` : '',
					endTime: this.dateRange[1] ? `${moment(this.dateRange[1]).format('YYYY-MM-DD')} 23:59:59` : '',
					inquiryShiftNos: this.classCheckList,
					inquiryWorkshop: this.workShopVal,
					pageIndex: this.pageIndex,
					pageSize: this.pageSize
				})
			},
			toggleShowStyle () {
				if (this.showStyle === 'table') {
					this.showStyle = 'chart'
					this.showStyleText = '表格显示'
					this.shwoStyleClass = 'tz-icon-table'
				} else if (this.showStyle === 'chart') {
					this.showStyle = 'table'
					this.showStyleText = '图表显示'
					this.shwoStyleClass = 'tz-icon-chart'
				}
			},
			pageChange (val) {
				this.pageIndex = val
				this.getAllOeeData()
			},
			pageSizeChange (val) {
				this.pageIndex = 1
				this.pageSize = val
				this.getAllOeeData()
			}
		}
	}
</script>
