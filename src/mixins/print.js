export default {
    data () {
        return {
            printVisible: false, // 打印弹出框显示隐藏
            batchPrint: false, // 批量打印
            printList: [] // 打印数据
        }
    },
    methods: {
        partSelect (data) {
            this.printList = data
        },
        partSelectC (data) {
            this.printList = data
        },
        batchPrintFun () {
            this.batchPrint = true
            this.$nextTick(() => {
                this.batchPrint = true
            })
        },
        openPrint () {
            this.printVisible = true
        },
        closePrint (list, ref) {
            this.printVisible = false
            this.batchPrint = false
            this.printList = []
            if (list && ref) {
                list.forEach((row) => {
                    this.$refs[ref].toggleRowSelection(row, false)
                })
            }
        }
    }
}
