
<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <Select clearable @on-change="selected" style="width:150px" filterable>
        <Option v-for="item in selectQitems" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
</template>
<!-- 路线下拉框 -->
<script>
    import Util from '../../libs/util';

    export default {
        name: 'selectQitems',
        data () {
            return {
                selectQitems : [{
                    value: '补差价',
                    label: '补差价'
                },{
                    value: '长尾产品',
                    label: '长尾产品'
                },{
                    value: '手挽袋',
                    label: '手挽袋'
                },{
                    value: '数码画册',
                    label: '数码画册'
                },{
                    value: '拼版PVC卡',
                    label: '拼版PVC卡'
                },{
                    value: '商标机不干胶',
                    label: '商标机不干胶'
                },{
                    value: '彩色专版不干胶',
                    label: '彩色专版不干胶'
                },{
                    value: '水晶字',
                    label: '水晶字'
                },{
                    value: '无碳联单',
                    label: '无碳联单'
                },{
                    value: '专版单张',
                    label: '专版单张'
                },{
                    value: '彩盒',
                    label: '彩盒'
                },{
                    value: '封套',
                    label: '封套'
                },{
                    value: '数码单张',
                    label: '数码单张'
                },{
                    value: '专版画册',
                    label: '专版画册'
                },{
                    value: '芙蓉字',
                    label: '芙蓉字'
                },{
                    value: '拼版名片',
                    label: '拼版名片'
                },{
                    value: 'PVC字',
                    label: 'PVC字'
                },{
                    value: '不干胶材料',
                    label: '不干胶材料'
                },{
                    value: '轮转机不干胶',
                    label: '轮转机不干胶'
                },{
                    value: '喷绘',
                    label: '喷绘'
                },{
                    value: '拼版单张',
                    label: '拼版单张'
                },{
                    value: '特价画册',
                    label: '特价画册'
                },{
                    value: '彩色拼版不干胶',
                    label: '彩色拼版不干胶'
                },{
                    value: '彩色信封',
                    label: '彩色信封'
                },{
                    value: '信纸表格',
                    label: '信纸表格'
                }]
            };
        },
        methods: {
            selected(key) {
                this.$emit('on-change',key);
            }
        },
        created () {
            // 可在此从服务端获取表格数据
            
        }
};
</script>
