<style lang="less">

</style>

<template>
    <Select @on-change="selected" v-model="warhoursId" style="width:150px" filterable>
        <Option v-for="item in selectWarhours" :value="item.Id" :key="item.Id">{{ item.WarhoursName }}</Option>
    </Select>
</template>
<!-- 路线下拉框 -->
<script>
    import Util from '@/libs/util';

    export default {
        name: 'warhours-component',
        props: {
            value: Number
        },
        model: {
            prop: 'value',
            event: 'valueChange'
        },
        data () {
            return {
                selectWarhours : [],
                warhoursId : this.value
            };
        },
        methods: {
            init() {

            },
            selected(key) {
                this.$emit('valueChange' , key)
            }
        },
        created () {
            // 可在此从服务端获取表格数据
            var _this = this;
            Util.getAjaxData({},'GetWarhoursList' , undefined).then((res) => {
                _this.selectWarhours = res;
            })
        },
        watch: {

        }
};
</script>
