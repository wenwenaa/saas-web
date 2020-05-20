<template>
	<div class="offline-rank-container">
		<el-table
		:data="tableData"
		style="width: 100%">
			<el-table-column
				label=""
			>
				<template slot-scope="scope">
					<span v-if="scope.row.index === 1" class="crown" :class="scope.row.index === 1 ? 'crown-gold' : ''"></span>
					<span v-else-if="scope.row.index === 2" class="crown" :class="scope.row.index === 2 ? 'crown-silver' : ''"></span>
					<span v-else-if="scope.row.index === 3" class="crown" :class="scope.row.index === 3 ? 'crown-copper' : ''"></span>
					<span v-else>{{scope.row.index}}</span>
				</template>
			</el-table-column>
			<el-table-column
				prop="baseEquipmentName"
				label="设备名称">
			</el-table-column>
			<el-table-column
				label="离线时长">
				<template slot-scope="scope">
					{{scope.row.continueHours}}h
				</template>
			</el-table-column>
			<el-table-column
				label="离线率">
				<template slot-scope="scope">
					{{Number(scope.row.durationRate*100).toFixed(2)}}%
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	export default {
		name: 'OfflineRank',
		props: {
			watchData: {
				type: Object,
				default: () => {}
			}
		},
		data () {
			return {
				tableData: []
			}
		},
		watch: {
			watchData (data) {
				if (data) {
					this.tableData = data.lightRankingVo.lightHisVoOffList
					this.tableData.forEach((item, index) => {
						item.index = index + 1
					})
				}
			}
		}
	}
</script>

<style lang="less">
	.offline-rank-container{
		.crown{
			display: block;
			width: 12px;
			height: 12px;
			margin: 0 auto;
			background-size: 100% 100%;
			background-repeat: no-repeat;
		}
		.crown-gold{
			background-image: url('../../../../assets/images/icon/equip-rank-one.png');
		}
		.crown-silver{
			background-image: url('../../../../assets/images/icon/equip-rank-two.png');
		}
		.crown-copper{
			background-image: url('../../../../assets/images/icon/equip-rank-three.png');
		}
	}
</style>
