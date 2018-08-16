<style lang="less">

</style>

<template>
    <Select v-model="deliveryer" @on-change="selected"  placeholder="线路名称" style="width:100px;" filterable>
        <Option v-for="item in selectDelivery" :value="item.Id" :key="item.Id">{{ item.RealName }}</Option>
    </Select>
</template>
<!-- 配送人员下拉框 -->
<script>
    import Util from '@/libs/util';
    
    export default {
        name: 'delivery-component',
        props:{
            RoleId: {
                type: String,
                default: '8,13'
            },
            value: Number
        },
        model: {
            prop: 'value',
            event: 'valueChange'
        },
        data () {
            return {
                selectDelivery : [],
                deliveryer: this.value
            };
        },
        methods: {
            selected(key) {
                this.$emit('valueChange' , key)
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

        },
        watch : {

        }
};
</script>
