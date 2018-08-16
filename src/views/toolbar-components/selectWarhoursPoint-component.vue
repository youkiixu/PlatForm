<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <Select v-model="selectPointText" @on-change="selected" filterable>
        <Option v-for="item in selectPoint" :value="item.Text">{{item.Text}}</Option>
    </Select>
</template>

<script>
    import Util from '@/libs/util';
    export default {
        name: 'selectWarhoursPointComponent',
        props: {
            param: Object,
            selectPointItem: {
                type: String, 
                default: ''
            }
        },
        data () {
            return {
                selectPoint: [],
                selectPointText: ''
            };
        },
        methods: {
            selected(key) {
                var obj = undefined;

                this.selectPoint.map((item) => {
                    if(item.Text === key){
                        obj = item
                    }
                })
                if(obj) {
                    this.$emit('on-change',obj);
                }
                
            }
        },
        created () {
        // 可在此从服务端获取表格数据
        var _this = this;
        Promise.all([Util.getAjaxData({} , 'GetWarhoursList' , undefined) , Util.getAjaxData({} , 'GetThirdPlatformList' , undefined)]).then((res)=> {
            // _this.selectPoint.push(())
            res[0].map((item) => {
                _this.selectPoint.push({
                    Id: item.Id,
                    Text: item.WarhoursName,
                    IsManufactor: false
                })
            })
            res[1].map((item) => {
                _this.selectPoint.push({
                    Id: item.Id,
                    Text: item.Name,
                    IsManufactor: true
                })
            })
        })
    },
    watch: {
        selectPointItem(curVal,oldVal) {
            this.selectPointText = curVal
        }
    }
};
</script>
