import fetch from '../../utils/fetch'
import api from '../../global/api'

const watchList = {
	state: {
		currentClass: {},
		allWatchData: {},
		singleWatchData: {},
		allOeeTotal: 0,
		allOeeData: [],
		singleOeeTotal: 0,
		singleOeeData: [],
		runHistoryTotal: 0,
		runHistoryData: [],
		workShops: []
	},
	mutations: {
		// 保存当前班次数据到state
		saveCurrentClassData (state, payload) {
			state.currentClass = payload
		},
		// 保存监控数据到state
		saveAllWatchData (state, payload) {
			state.allWatchData = payload
		},
		// 保存单个设备详情到state
		saveSingleWatchData (state, payload) {
			state.singleWatchData = payload
		},
		// 保存历史运行数据到state
		saveRunHistoryData (state, payload) {
			state.runHistoryTotal = payload.total
			state.runHistoryData = payload.records
		},
		// 保存oee列表数据到state
		saveAllOeeData (state, payload) {
			state.allOeeTotal = payload.total
			state.allOeeData = payload.records
		},
		// 保存单个oee列表数据到state
		saveSingleOeeData (state, payload) {
			state.singleOeeTotal = payload.total
			state.singleOeeData = payload.records
		},
		// 保存车间列表数据
		saveWorkShopData (state, payload) {
			state.workShops = payload
		}
	},
	actions: {
		// 获取车间数据
		async GET_WORKSHOPS ({ commit }, payload) {
			try {
				const url = `${api.visualWatch.workShops}?isPcApi=${payload.isPcApi}`
				const res = await fetch.get(url, payload)
				if (res.status === 0) {
					commit('saveWorkShopData', res.data)
				}
				return new Promise((resolve) => {
					resolve(res)
				})
			} catch (e) {
				console.log(e)
				return {}
			}
		},
		// 获取首页数据（设备状态可视图）
		async GET_OVERVIEW ({ commit }, payload) {
			try {
				const url = `${api.visualWatch.overview}?typeEnum=${payload.typeEnum}&workShopStr=${payload.workShopStr}&isPcApi=${payload.isPcApi}`
				const res = await fetch.get(url)
				return new Promise((resolve) => {
					resolve(res)
				})
			} catch (e) {
				console.log(e)
				return {}
			}
		},
		// 获取当前班次信息
		async GET_CURRENT_CLASS ({ commit }, payload) {
			try {
				const url = `${api.visualWatch.currentClass}?isPcApi=${payload.isPcApi}`
				const res = await fetch.get(url, payload)
				if (res.status === 0) {
					commit('saveCurrentClassData', res.data)
				}
				return new Promise((resolve) => {
					resolve(res)
				})
			} catch (e) {
				console.log(e)
				return {}
			}
		},
		// 获取所有监控数据
		async GET_ALL_WATCH_DATA ({ commit }, payload) {
			try {
				const url = `${api.visualWatch.list}?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}&isPcApi=${payload.isPcApi}`
				const res = await fetch.post(url, payload)
				if (res.status === 0) {
					commit('saveAllWatchData', res.data.records)
				}
				return new Promise((resolve) => {
					resolve(res)
				})
			} catch (e) {
				console.log(e)
				return {}
			}
		},
		// 获取单个监控数据
		async GET_SINGLE_WATCH_DATA ({ commit }, payload) {
			try {
				const url = `${api.visualWatch.singleData}?baseEquipmentId=${payload.baseEquipmentId}&isPcApi=${payload.isPcApi}`
				const res = await fetch.get(url)
				if (res.status === 0) {
					commit('saveSingleWatchData', res.data)
				}
				return new Promise((resolve) => {
					resolve(res)
				})
			} catch (e) {
				console.log(e)
				return {}
			}
		},
		// 获取历史运行数据
		async GET_RUN_HISTORY_DATA ({ commit }, payload) {
			try {
				const url = `${api.visualWatch.runHistory}?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`
				const res = await fetch.post(url, payload)
				if (res.status === 0) {
					commit('saveRunHistoryData', res.data)
				}
				return new Promise((resolve) => {
					resolve(res)
				})
			} catch (e) {
				console.log(e)
				return {}
			}
		},
		// 获取所有OEE数据
		async GET_ALL_OEE_DATA ({ commit }, payload) {
			try {
				const url = `${api.visualWatch.oeeList}?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`
				const res = await fetch.post(url, payload)
				if (res.status === 0) {
					commit('saveAllOeeData', res.data)
				}
				return new Promise((resolve) => {
					resolve(res)
				})
			} catch (e) {
				console.log(e)
				return {}
			}
		},
		// 获取单个OEE数据
		async GET_SINGLE_OEE_DATA ({ commit }, payload) {
			try {
				const url = `${api.visualWatch.singleOeeList}?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`
				const res = await fetch.post(url, payload)
				if (res.status === 0) {
					commit('saveSingleOeeData', res.data)
				}
				return new Promise((resolve) => {
					resolve(res)
				})
			} catch (e) {
				console.log(e)
				return {}
			}
		},
		// 获取单个OEE数据
		async GET_QRCODE ({ commit }, payload) {
			try {
				const url = `${api.visualWatch.qrcode}?miniLightToken=${payload.miniLightToken}`
				const res = await fetch.get(url, payload)
				return new Promise((resolve) => {
					resolve(res)
				})
			} catch (e) {
				console.log(e)
				return {}
			}
		}
	}
}

export default {
	state: {
		...watchList.state
	},
	mutations: {
		...watchList.mutations
	},
	actions: {
		...watchList.actions
	}
}
