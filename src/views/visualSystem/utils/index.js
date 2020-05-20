export default {
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
	}
}
