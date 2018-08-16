
<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div @keyup.enter="getData()">

        <Card>
            <Row>
                
                <Col span="4">
                    仓库:
                    <selectWarhours @on-change="selectWarhoursChange"></selectWarhours>
                </Col>
                
                
            </Row>
            <Row class="margin-top-10">
                <Col span="4">
                    关键词:<Input v-model="form.$key" placeholder="物流单/订单号/会员号" style="width: 150px" />
                </Col>
                <Col span="16">
                    时间日期
                    <datePickerCompoent
                    @typeChange="typeChange"
                    @startDateChange="startDateChange"
                    @endDateChange="endDateChange"
                    ></datePickerCompoent>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="3" style="padding-top: 6px;">
                    表格样式
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
    import selectWarhours from '../toolbar-components/selectWarhours-component';
    import datePickerCompoent from '../toolbar-components/datePicker-component';   

    // dataGrid组件
    import initDataGridCompoent from '../toolbar-components/initDataGrid-noPage-component';
    

    export default {
        name: 'RevenueSummaryView',
        components: {
            datePickerCompoent,
            selectWarhours,

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
                    // $rowIndex : 1,
                    strMethod: 'QueryWarhoursTotal',

                    $WarhoursCode: '',

                    $MStartDate: '',
                    $MEndDate: ''
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
                this.form.$MStartDate = data
            },
            endDateChange(data) {
                this.form.$EndDate = data
                this.form.$MEndDate = data
            },
            selectWarhoursChange(data) {
                this.form.$WarhoursCode = data
            },
            typeChange(data) {
                // 根据数值类型修改
                if(data == 0) {
                    this.form.$MStartDate = undefined
                    this.form.$MEndDate = undefined
                }
                if(data == 1) {
                    this.form.$EndDate = undefined
                    this.form.$StartDate = undefined
                }
            }
        },
        mounted () {
            // 可在此从服务端获取表格数据
            var date = Util.nowTime(this);
            this.form.$dStartOper = date.forweek;
            this.form.$dEndOper = date.formatnowdate;
            this.getData()
        }
};
</script>
