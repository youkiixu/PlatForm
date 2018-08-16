<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <span>
        <div style="float: left;line-height: 32px;">
            日期:
        </div>
        <div style="float: left;margin-right: 5px;">
            <Select clearable @on-change="selected" style="width:150px">
            <Option v-for="item in selTime" :value="item.value" :key="item.value">{{ item.lebal }}</Option>
        </Select>
        </div>
        <div style="float: left">
            <datePickerCompoent
        v-if="showDate"
        :showSelect="false"
        @startDateChange="startDateChange"
        @endDateChange="endDateChange"
        ></datePickerCompoent>
        </div>
    </span>
</template>
<!-- 路线下拉框 -->
<script>
    import datePickerCompoent from './datePicker-component'; 

    export default {
        name: 'selectTime',
        components: {
            datePickerCompoent
        },
        data () {
            return {
                selTime : [{
                    value:0,
                    lebal:'所有时间'
                },{
                    value:1,
                    lebal:'今天'
                },{
                    value:2,
                    lebal:'昨天'
                },{
                    value:3,
                    lebal:'前天'
                },{
                    value:4,
                    lebal:'当月'
                },{
                    value:5,
                    lebal:'上个月'
                },{
                    value:7,
                    lebal:'今年'
                },{
                    value:8,
                    lebal:'自定义时段'
                }],
                showDate: false,
                startDate:'',
                endDate:''
            };
        },
        methods: {
            selected(key) {
                if(key == 8) {
                    this.showDate = true
                    // this.$emit('date-change',this.startDate , this.endDate);
                    this.$emit('on-change',key ,this.startDate , this.endDate);
                } else {
                    this.showDate = false
                    // this.$emit('date-change','' , '');
                    this.$emit('on-change',key , '' , '');
                }
                // this.$emit('on-change',key);
            },
            startDateChange(key) {
                this.startDate = key
                this.$emit('on-change',8 ,this.startDate , this.endDate);
            },
            endDateChange(key) {
                this.endDate = key
                this.$emit('on-change',8 ,this.startDate , this.endDate);
            }
        },
        created () {
            // 可在此从服务端获取表格数据
        }
    };
</script>
