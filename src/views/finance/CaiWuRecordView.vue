<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div @keyup.enter="getData()">

        <Card>
            <Row>
            	<Col span="4">
                    关键词:
                    <Input v-model="form.$key" placeholder="请输入关键字..." style="width: 150px" />
                </Col>
                <Col span="14">
                    时间日期:
                    <datePickerCompoent
                    :showSelect="false"
                    @startDateChange="startDateChange"
                    @endDateChange="endDateChange"
                    ></datePickerCompoent>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <checkBoxCaiWuTypesList
                    @on-change-type="onChangeType"
                    @on-change-count="onChangeCount"
                ></checkBoxCaiWuTypesList>
            </Row>
            <Row class="margin-top-10">
                <Col span="3" style="padding-top: 6px;">
                    表格样式:
                    <i-switch v-model="showControl"  size="large"></i-switch>
                </Col>
                <Col span="3">
                    <span style="margin: 0 10px;"><Button type="primary" icon="search" @click="getData()">搜索</Button></span>
                </Col>
            </Row>
        </Card>

        <Card class="margin-top-10">
            <initDataGridCompoent ref="dataGrid" :param="form" :showControl="showControl" @selectRow="selectRow" @dbClickRow="dbClickRow"></initDataGridCompoent>
        </Card>
</div>
</template>
<!-- 快递订单列表 -->
<script>
    import Util from '../../libs/util';
    // 头部组件
    import datePickerCompoent from '../toolbar-components/datePicker-component';   
    import checkBoxCaiWuTypesList from '../toolbar-components/checkBoxCaiWuTypesList-component';

    // dataGrid组件
    import initDataGridCompoent from '../toolbar-components/initDataGrid-component';
    

    export default {
        name: 'CaiWuRecordView',
        components: {
            datePickerCompoent,
            checkBoxCaiWuTypesList,

            initDataGridCompoent
        },
        data () {
            return {
                form: {
                    $key: '',
                    $StartDate: '',
                    $EndDate: '',

                    isLoad: true,
                    $pageRecord: 15,
                    $rowIndex : 1,
                    strMethod: 'QueryCaiWuRecordList',

                    $CaiWuTypeId: '',
                    $CountCaiWuTypeId: '',

                },
                showControl: false,
                selectRowData: undefined,
            };
        },
        methods: {
            getData () {
                 for(var key in this.form) {
                    if(this.form[key] === ''){
                        	this.form[key] = undefined;
                    }
                }
                this.form.$rowIndex = 1;
                this.$refs.dataGrid.initDataGrid()
            },
            selectRow(data) {
                this.selectRowData = data
            },
            dbClickRow(data) {
                this.selectRowData = data
            },
            startDateChange(data) {
                this.form.$StartDate = data
            },
            endDateChange(data) {
                this.form.$EndDate = data
            },
            onChangeType(data) {
                var str = '';
                    data.map((item) => {
                        str += item + ','
                    })
                this.form.$CaiWuTypeId = str.substring(0, str.length - 1)
            },
            onChangeCount(data) {
                 var str = '';
                    data.map((item) => {
                        str += item + ','
                    })
                this.form.$CountCaiWuTypeId = str.substring(0, str.length - 1)
            }
        },
        mounted () {
            // 可在此从服务端获取表格数据
            // var date = Util.nowTime(this);
            // this.form.$StartDate = date.forweek;
            // this.form.$EndDate = date.formatnowdate;
            this.getData()  
        }
};
</script>
