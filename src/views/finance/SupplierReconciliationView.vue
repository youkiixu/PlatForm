<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div @keyup.enter="getData()">

        <Card>
            <Row class="margin-top-10">
            	<Col span="4">
                    线路:
                    <selectRoute @on-change="selectRouteChange"></selectRoute>
                </Col>
                <Col span="4">
                    仓库:
                    <selectWarhours @on-change="selectWarhoursChange"></selectWarhours>
                </Col>
                <Col span="4">
                    第三方公司:
                    <selectThirdPlatform @on-change="selectThirdPlatformChange"></selectThirdPlatform>
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
    import selectThirdPlatform from '../toolbar-components/selectThirdPlatform-component';
    import datePickerCompoent from '../toolbar-components/datePicker-component';   

    // dataGrid组件
    import initDataGridCompoent from '../toolbar-components/initDataGrid-noPage-component';
    

    export default {
        name: 'SupplierContactsDetailsView',
        components: {
            datePickerCompoent,
            selectWarhours,
            selectRoute,
            selectStatu,
            selectThirdPlatform,
            selectDelivery,

            initDataGridCompoent
        },
        data () {
            return {
                form: {
                    $StartDate: '',
                    $EndDate: '',

                    isLoad: true,
                    $pageRecord: 15,
                    // $rowIndex : 1,
                    strMethod: 'QuerySupplierReconciliationList',

                    $WarhoursCode: '',
                    $fStatus: '',
                    $LinCode: '',
                    $ThirdPlatformId: '',

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
                this.$refs.dataGrid.resizePage(1,10)
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
                this.form.$DisStartDate = data
            },
            endDateChange(data) {
                this.form.$EndDate = data
                this.form.$DisStartDate = data
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
            selectThirdPlatformChange(data) {
            	this.form.$ThirdPlatformId = data + ''
            },
            typeChange(data) {
                // 根据数值类型修改
                if(data == 0) {
                    this.form.$DisStartDate = undefined
                    this.form.$DisEndDate = undefined
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
            this.form.$StartDate = date.forweek;
            this.form.$EndDate = date.formatnowdate;
            this.getData()
        }
};
</script>
