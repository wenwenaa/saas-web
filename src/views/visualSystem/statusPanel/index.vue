<template>
	<div class="status-panel">
		<tzHeadline title="设备监控"></tzHeadline>
		<el-form :inline="true" size="medium" class="relative">
			<span class="mr10">车间</span>
			<el-select v-model="workShopVal" multiple placeholder="请选择" class="mr20" @change="getOverviewData">
				<el-option
					v-for="item in workShopOptions"
					:key="item.code"
					:label="item.name"
					:value="item.code">
				</el-option>
			</el-select>
			<el-form-item>
				<el-button plain class="classbtn" :class="currentClassName === 'CURRENT_SHIFT_NO' ? 'classbtn_active' : ''" @click="handleSwitchClass('CURRENT_SHIFT_NO')">当前班次</el-button>
				<el-button plain class="classbtn" :class="currentClassName === 'LAST_WEEK' ? 'classbtn_active' : ''" @click="handleSwitchClass('LAST_WEEK')">近一周</el-button>
				<el-button plain class="classbtn" :class="currentClassName === 'LAST_MONTH' ? 'classbtn_active' : ''" @click="handleSwitchClass('LAST_MONTH')">近一月</el-button>
				<el-button plain class="classbtn" :class="currentClassName === 'LAST_THREE_MONTH' ? 'classbtn_active' : ''" @click="handleSwitchClass('LAST_THREE_MONTH')">近三月</el-button>
			</el-form-item>
			<div class="qrcode-box">
				<div class="desc">微信扫一扫<br >随时随地查看</div>
				<div class="qrcode"><el-image :src="qrCode" :preview-src-list="qrCodeSrcList"></el-image></div>
			</div>
		</el-form>
		<div class="watch-status-container">
			<div class="top">
				<div class="left">
					<h2 class="panel-title">本班次运行时长占比</h2>
					<runTime :watchData="allData" :currentClassName="currentClassName"></runTime>
				</div>
				<div class="right">
					<h2 class="panel-title">设备开工率表现</h2>
					<workRate :workPercents="allData" :currentClassName="currentClassName"></workRate>
				</div>
			</div>
			<div class="bottom">
				<div class="left">
					<h2 class="panel-title">设备故障排行</h2>
					<div class="sub">
						<span class="left">{{allData && allData.lightRankingVo.lightHisVoFaultCount}}</span>
						<span class="right">/15</span>
					</div>
					<faultRank :watchData="allData" :currentClassName="currentClassName"></faultRank>
				</div>
				<div class="middle">
					<h2 class="panel-title">设备暂停排行</h2>
					<div class="sub">
						<span class="left">{{allData && allData.lightRankingVo.lightHisVoPauseCount}}</span>
						<span class="right">/15</span>
					</div>
					<pauseRank :watchData="allData"></pauseRank>
				</div>
				<div class="right">
					<h2 class="panel-title">设备离线排行</h2>
					<div class="sub">
						<span class="left">{{allData && allData.lightRankingVo.lightHisVoOffCount}}</span>
						<span class="right">/15</span>
					</div>
					<offlineRank :watchData="allData"></offlineRank>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
import { mapActions, mapState } from 'vuex'
import runTime from './components/runTime'
import workRate from './components/workRate'
import faultRank from './components/faultRank'
import pauseRank from './components/pauseRank'
import offlineRank from './components/offlineRank'

export default {
	name: 'WatchPanel',
	components: {
		runTime,
		workRate,
		faultRank,
		pauseRank,
		offlineRank
	},
	data () {
		return {
			workShopVal: [],
			currentClassName: 'CURRENT_SHIFT_NO',
			allData: null,
			qrCode: null,
			qrCodeSrcList: []
		}
	},
	computed: {
		...mapState({
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
	created () {
		this.getWorkShops()
		this.getOverviewData()
		this.getQrcode()
	},
	methods: {
		...mapActions([
			'GET_WORKSHOPS',
			'GET_OVERVIEW',
			'GET_QRCODE'
		]),
		getWorkShops () {
			this.GET_WORKSHOPS({
				isPcApi: true
			})
		},
		getOverviewData () {
			this.GET_OVERVIEW({
				typeEnum: this.currentClassName,
				workShopStr: this.workShopVal,
				isPcApi: true
			}).then((res) => {
				if (res.status === 0) {
					this.allData = res.data
				}
			})
		},
		getQrcode () {
			this.GET_QRCODE({
				miniLightToken: sessionStorage.getItem('miniLightToken')
			}).then((res) => {
				if (res.status === 0) {
					this.qrCode = `data:image/png;base64,${res.data}`
					this.qrCodeSrcList.push(this.qrCode)
				}
			})
		},
		handleSwitchClass (className) {
			this.currentClassName = className
			this.getOverviewData()
		}
	}
}
</script>

<style lang="less" scoped>
	.status-panel{
		.qrcode-box{
			position: absolute;
			top: 0px;
			right: 0px;
			width: 160px;
			display: flex;
			align-items: center;
			.desc {
				width: 100px;
			}
			.qrcode {
				width: 50px;
				img {
					width: 100%;
				}
			}
		}
		.classbtn{
			border: 1px solid #7CA870;
			color: #7CA870;
		}
		.classbtn_active {
			background-color: #7CA870;
			color: white;
		}
		.watch-status-container{
			.panel-title{
				font-size: 16px;
				color: #444;
				font-weight: bold;
				padding: 10px;
			}
			.top{
				display: flex;
				margin-bottom: 20px;
				.left{
					width: 66%;
				}
				.right{
					width: 33%;
				}
			}
			.bottom{
				display: flex;
				.left{
					width: 33%;
					position: relative;
				}
				.middle{
					width: 33%;
					position: relative;
				}
				.right{
					width: 33%;
					position: relative;
				}
				.sub{
					position: absolute;
					right: 5px;
					top: 10px;
					.left{
						font-weight: bold;
						font-size: 16px;
					}
				}
			}
		}
	}
</style>
