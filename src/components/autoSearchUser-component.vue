<style lang="less">

</style>

<template>
    <div>
        <AutoComplete 
            :data="nameList" 
            v-model="name" 
            :disabled="disabled"
            placeholder="请输入寄件人姓名或id"
            @on-change="changeEvent"
            @on-search="searchEvent"
            @on-select="selectEvent"
            @keyup.enter.native = "enterEvent(name)" 
            ></AutoComplete>
    </div>
</template>
<!-- 配送人员下拉框 -->
<script>
    import Api from '@/libs/api';
    import Util from '@/libs/util';

    export default {
        name: 'autoSearchUser-component',
        props:{
            value: '',
            disabled: {
                type: Boolean,
                default: false
            }
        },
        model: {
            prop: 'value',
            event: 'valueChange'
        },
        data () {
            return {
                name : this.value,
                nameList : [],
                userDetailList: [],
                socket: {}
            }; 
        },
        computed : {
            webSocket () {
                return this.$store.state.app.webSocket
            }
        },
        methods: {
            changeEvent(value) {
                // console.log(this.name)
                // this.$emit('valueChange' , value)
            },
            searchEvent(value) {
                var _this = this;

                this.$emit('valueChange' , value)
                Api.QueryUserInfoList(value , _this).then((res)=>{
                    var data = res.dgData;
                    _this.nameList = []
                    _this.userDetailList = []
                    _this.userDetailList = data
                    data.map((item) => {
                        if(item.RealName){
                            _this.nameList.push(item.RealName)    
                        }
                    })
                })
            },
            selectEvent(value) {
                var _this = this;
                _this.userDetailList.map((item) => {
                    _this.$emit('on-select' , item)
                })
            },
            enterEvent(value) {
                this.$emit('on-enter' , value)
            },
            socketSend(value) {
                var _this = this;
                var par = {
                    $key: value,
                    isLoad: true, 
                    $pageRecord: 10,
                    $rowIndex : 1 
                }
                Util.socketSend(par , 'QueryUserInfoList' , undefined )
            },
            setNameList() {
                var nameListVal = this.$store.state.app.webSocket.data
                this.nameList = []
                this.userDetailList = nameListVal
                nameListVal((item) => {
                    if(item.RealName){
                        this.nameList.push(item.RealName)
                    }
                    
                })
                
                
            }

        },
        mounted () {

        },
        created () {
            var _this = this;

        },
        watch : {
            value(val) {
                this.name = val
            },  
            webSocket(val) {
                if(val.strMethod === 'QueryUserInfoList') {
                    this.setNameList()
                }
            }
        }
};
</script>
