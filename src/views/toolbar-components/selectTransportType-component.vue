<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <Select clearable @on-change="selected" style="width:150px" filterable>
        <Option v-for="item in transportType" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
</template>
<!-- 运付方式下拉框 -->
<script>
    import Util from '../../libs/util';

    export default {
        name: 'selectTransportType',
        data () {
            return {
                transportType : [{ //运付方式
                    value: 'undefined',
                    label: '全部'
                },{
                    value: '0',
                    label: '无'
                },{
                    value: '1',
                    label: '寄付'
                },{
                    value: '2',
                    label: '到付'
                }]
            };
        },
        methods: {
            selected(key) {
                this.$emit('on-change',key);
            }
        }
};
</script>
