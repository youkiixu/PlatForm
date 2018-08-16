<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <Select clearable @on-change="selected" style="width:150px" filterable>
        <Option v-for="item in selectWarhours" :value="item.Id" :key="item.Id">{{ item.WarhoursName }}</Option>
    </Select>
</template>
<!-- 路线下拉框 -->
<script>
    import Util from '../../libs/util';

    export default {
        name: 'selectWarhours',
        data () {
            return {
                selectWarhours : []
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
            Util.getAjaxData({},'GetWarhoursList' , undefined).then((res) => {
                _this.selectWarhours = res;
            })
        }
};
</script>
