<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <Select clearable v-model="role" @on-change="selected" style="width:150px" filterable>
        <Option v-for="item in roleList" :value="item.Id" :key="item.Id">{{ item.RoleName }}</Option>
    </Select>
</template>
<!-- 路线下拉框 -->
<script>
    import Util from '../../libs/util';

    export default {
        name: 'selectRoute',
        props: {
            role: {
                type: Number,
                default: ''
            }
        },
        data () {
            return {
                roleList : []
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
            Util.getAjaxData({},'GetRoleList' , undefined).then((res) => {
                _this.roleList = res;
            })
        }
};
</script>
