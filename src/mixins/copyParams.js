export default {
    data () {
        return {
            copyParams: ''
        }
    },
    computed: {
        copyParamsObj () {
            const { copyParams } = this
            return copyParams && copyParams !== '' ? JSON.parse(copyParams) : {}
        }
    },
    methods: {
        copyParamsFun (data = {}) {
            this.copyParams = JSON.stringify(data)
        }
    }
}
