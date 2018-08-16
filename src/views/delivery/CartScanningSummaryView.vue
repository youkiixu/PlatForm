
<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div @keyup.enter="getData()">

        <Card>
            <Row>
            	<Col span="4">
                    线路:
                    <selectRoute @on-change="selectRouteChange"></selectRoute>
                </Col>
                <Col span="4">
                    仓库:
                    <selectWarhours @on-change="selectWarhoursChange"></selectWarhours>
                </Col>
                <Col span="4">
                    订单状态:
                    <selectStatu @on-change="selectStatuChange"></selectStatu>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="16">
                    时间日期:
                    <datePickerCompoent
                    :showSelect="false"
                    @startDateChange="startDateChange"
                    @endDateChange="endDateChange"
                    ></datePickerCompoent>
                </Col>
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
    import selectWarhours from '../toolbar-components/selectWarhours-component';
    import selectRoute from '../toolbar-components/selectRoute-component';
    import selectStatu from '../toolbar-components/selectStatu-component';
    import datePickerCompoent from '../toolbar-components/datePicker-component';   

    // dataGrid组件
    import initDataGridCompoent from '../toolbar-components/initDataGrid-noPage-component';
    

    export default {
        name: 'CartScanningSummaryView',
        components: {
            datePickerCompoent,
            selectWarhours,
            selectRoute,
            selectStatu,

            initDataGridCompoent
        },
        data () {
            return {
                form: {
                    $key: '',
                    $dStartOper: '',
                    $dEndOper: '',

                    isLoad: true,
                    $pageRecord: 15,
                    // $rowIndex : 1,
                    strMethod: 'QueryCarScanningSummaryList',

                    $WarhoursCode: '',
                    $fStatus: '',
                    $LinCode: ''
                },
                showControl: false,
                selectRowData: undefined,
            };
        },
        methods: {
            getData () {
                //  for(var key in this.form) {
                //     if(this.form[key] === ''){
                //         	this.form[key] = undefined;
                //     }
                // }
                this.$refs.dataGrid.resizePage(1,10)
                this.$refs.dataGrid.initDataGrid()
            },
            selectRow(data) {
                this.selectRowData = data
            },
            dbClickRow(data) {
                this.selectRowData = data
                this.selectRowData = data
                var row = this.selectRowData
                var _this = this;
                // this.selectRowData = data
                let proData = {
                    isLoad: true,
                    $DriverID: row.Id,

                    $MStartDate : this.form.$dStartOper,
                    $MEndDate : this.form.$dEndOper,
                    strMethod: 'QueryCartScanningSummaryDetailsList'
                }
                for(var key in proData) {
                    if(proData[key] === ""){
                        proData[key] = undefined;
                    }
                }
                Util.openNewPage(_this, 'CartScanningSummaryDetailsView' , undefined, proData);
                _this.$router.push({
                    name: 'CartScanningSummaryDetailsView',
                    params: proData
                });
            },
            startDateChange(data) {
                this.form.$dStartOper = data
            },
            endDateChange(data) {
                this.form.$dEndOper = data
            },
            selectWarhoursChange(data) {
                this.form.$WarhoursCode = data  + ''
            },
            selectStatuChange(data) {
                this.form.$fStatus = data + ''
            },
            selectRouteChange(data) {
                this.form.$LinCode = data + ''
            }
        },
        mounted () {
            // 可在此从服务端获取表格数据
            var date = Util.nowTime(this,'最近一个月的数据');
            this.form.$dStartOper = date.formatwdate;
            this.form.$dEndOper = date.formatnowdate;
            this.getData()
        }
};
</script>
