<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <Select clearable @on-change="selected" style="width:150px" filterable>
        <Option v-for="item in Status" :value="item.Logistics_status" :key="item.Logistics_status">{{ item.Title }}</Option>
    </Select>
</template>
<!-- 物流状态下拉框 -->
<script>
    import Util from '../../libs/util';

    export default {
        name: 'Statu-component',
        data () {
            return {
                Status : []
            };
        },
        methods: {
            selected(key) {
                this.$emit('on-change',key);
            }
        },
        created () {
        // 可在此从服务端获取表格数据
        var _this = this;
        Util.getAjaxData({},'GetLogisticsStatusList' , undefined).then((res) => {
            _this.Status = res;
        })
    }
};
</script>
