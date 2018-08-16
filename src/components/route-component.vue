<style lang="less">

</style>

<template>
    <Select @on-change="selected" v-model="routeId" style="width:150px" filterable> 
        <Option v-for="item in selectRoutes" :value="item.Id" :key="item.Id">{{ item.RouteName }}</Option>
    </Select>
</template>
<!-- 路线下拉框 -->
<script>
    import Util from '@/libs/util';

    export default {
        name: 'route-component',
        props: {
            value: Number
        },
        model: {
            prop: 'value',
            event: 'valueChange'
        },
        data () {
            return {
                selectRoutes : [],
                routeId: this.value
            };
        },
        methods: {
            init() {
               
            },
            selected(key) {
                this.$emit('valueChange' , key)
            }
        },
        mounted () {

        },
        created () {
            // 可在此从服务端获取表格数据
            var _this = this;
            Util.getAjaxData({},'GetRouteList' , undefined).then((res) => {
                _this.selectRoutes = res;
                // this.init()
            })
        },
        watch : {
            value(val) {
                // this.init()
            }
        }
};
</script>
