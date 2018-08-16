<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div @keyup.enter="getData()">

        <Card>
            <Row>
            	<Col span="4">
                    扫描业务员:
                    <selectDelivery @on-change="selectDeliveryChange"></selectDelivery>
                </Col>
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
                    ref="datePicker"
                    @typeChange="typeChange"
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
    import selectDelivery from '../toolbar-components/selectDelivery-component';
    import datePickerCompoent from '../toolbar-components/selectDatePicker-component';      

    // dataGrid组件
    import initDataGridCompoent from '../toolbar-components/initDataGrid-component';
    

    export default {
        name: 'BusinessDistributionSummaryView',
        components: {
            datePickerCompoent,
            selectWarhours,
            selectRoute,
            selectStatu,
            selectDelivery,

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
                    strMethod: 'QueryDistributionSummaryList',

                    $WarhoursCode: '',
                    $fStatus: '',
                    $LinCode: '',
                    $DistributorId: '',

                    $DisStartDate: '',
                    $DisEndDate: ''
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
                this.form.$rowIndex = 1;
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
                    $WarhoursCode: this.$WarhoursCode,
                    $LinCode: this.$LinCode , 
                    $DistributorId: row.DistributorId,
                    $fStatus: this.$fStatus,

                    $StartDate : this.form.$StartDate,
                    $EndDate : this.form.$EndDate,
                    $DisStartDate : this.form.$MStartDate,
                    $DisEndDate : this.form.$MEndDate,
                    strMethod: 'QueryBusinessDistributionSummaryDetailsList'
                }
                for(var key in proData) {
                    if(proData[key] === ""){
                        proData[key] = undefined;
                    }
                }
                Util.openNewPage(_this, 'BusinessDistributionSummaryDetailsView' , undefined, proData);
                _this.$router.push({
                    name: 'BusinessDistributionSummaryDetailsView',
                    params: proData
                });
            },
            selectWarhoursChange(data) {
                this.form.$WarhoursCode = data  + ''
            },
            selectStatuChange(data) {
                this.form.$fStatus = data + ''
            },
            selectDeliveryChange(data) {
                this.form.$DistributorId = data
            },
            selectRouteChange(data) {
                this.form.$LinCode = data + ''
            },
            startDateChange(data) {
                    this.dateSetting(data)
            },
            endDateChange(data) {
                    this.dateSetting(data)
            },
            typeChange(data) {
                    this.dateSetting(data)
            },
            dateSetting(data){
                this.form.$EndDate = undefined
                this.form.$MEndDate = undefined
                this.form.$StartDate = undefined
                this.form.$MStartDate = undefined

                if(data.selectType == 0){
                    this.form.$StartDate = data.startDateValue
                    this.form.$EndDate = data.endDateValue
                } else if(data.selectType == 1) {
                    this.form.$MStartDate = data.startDateValue
                    this.form.$MEndDate = data.endDateValue
                }
            }
        },
        mounted () {
            // 可在此从服务端获取表格数据
            var datePickValue = this.$refs.datePicker.getData(0 , Util.nowTime().formatwdate , Util.nowTime().formatnowdate)
            this.dateSetting(datePickValue)
            this.getData()
        }
};
</script>
