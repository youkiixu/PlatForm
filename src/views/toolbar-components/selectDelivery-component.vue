<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <Select clearable @on-change="selected" style="width:150px" filterable>
        <Option v-for="item in selectDelivery" :value="item.Id" :key="item.Id">{{ item.RealName }}</Option>
    </Select>
</template>
<!-- 路线下拉框 -->
<script>
    import Util from '../../libs/util';
    

    export default {
        name: 'selectDelivery',
        props:{
            RoleId: {
                type: String,
                default: '8,13'
            }
        },
        data () {
            return {
                selectDelivery : []
            };
        },
        methods: {
            selected(key) {
                this.$emit('on-change',key);
            }
        },
        mounted () {
            var _this = this;
            var param = {
                $RoleId: _this.RoleId
            }
            Util.getAjaxData(param,'GetDeliveryList' , undefined).then((res) => {
                _this.selectDelivery = res;
            })
        },
        created () {
            // 可在此从服务端获取表格数据
            // var _this = this;
            // var param = {
            //     $RoleId: RoleId
            // }
            // Util.getAjaxData({},'GetDeliveryList' , undefined).then((res) => {
            //     _this.selectDelivery = res;
            // })
        }
};
</script>
