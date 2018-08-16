<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <Select clearable @on-change="selected" style="width:150px" filterable>
        <Option v-for="item in collection" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
</template>
<!-- 代收货款下拉框 -->
<script>
    import Util from '../../libs/util';

    export default {
        name: 'selectCollection',
        data () {
            return {
                collection: [{ //代收款项
                    value: '',
                    label: '全部'
                },{
                    value: '0',
                    label: '否'
                },{
                    value: '1',
                    label: '是'
                }],
            };
        },
        methods: {
            selected(key) {
                this.$emit('on-change',key);
            }
        }
};
</script>
