<template>
	<div class="single-style-table-container">
		<el-table
			:data="oeeList"
			class="table-box"
			border
			v-loading="tableLoading"
			element-loading-text="拼命加载中"
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(255, 255, 255, 0.8)"
			:header-cell-style="{'background-color': '#F9F9F9'}"
		>
			<el-table-column prop="hisDate" label="时间" align="center" show-overflow-tooltip></el-table-column>
			<el-table-column prop="faultTime" label="故障时长" align="center"  show-overflow-tooltip></el-table-column>
			<el-table-column prop="faultPercentage"  label="故障率" align="center" show-overflow-tooltip></el-table-column>
			<el-table-column prop="pauseTime" label="暂停时长" align="center"   show-overflow-tooltip></el-table-column>
			<el-table-column prop="pausePercentage" label="暂停率" align="center"   show-overflow-tooltip></el-table-column>
			<el-table-column prop="offTime" label="离线时长" align="center"   show-overflow-tooltip></el-table-column>
			<el-table-column prop="offPercentage" label="离线率" align="center"   show-overflow-tooltip></el-table-column>
			<el-table-column prop="runTime" label="运行时长" align="center"   show-overflow-tooltip></el-table-column>
			<el-table-column prop="runPercentage" label="运行率" align="center"   show-overflow-tooltip></el-table-column>
		</el-table>
		<tzPagination :total="oeeTotal" @_currentPageChange="pageChange" @_pageSizeChange="pageSizeChange">
		</tzPagination>
	</div>
</template>

<script type="text/javascript">
	export default {
		name: 'styleTableContainer',
		props: {
			oeeList: {
				type: Array,
				default: () => []
			},
			oeeTotal: {
				type: Number,
				default: 0
			}
		},
		data () {
			return {
				tableLoading: false
			}
		},
		created () {},
		methods: {
			// 页码改变
			pageChange (val) {
				this.$emit('handlePageChange', val)
			},
			// size改变
			pageSizeChange (size) {
				this.$emit('handlePageSizeChange', size)
			}
		}
	}
</script>

<style lang="less">
	.single-style-table-container{}
</style>
