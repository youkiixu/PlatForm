
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
    import selectDelivery from '../toolbar-components/selectDelivery-component';
    import datePickerCompoent from '../toolbar-components/datePicker-component';   

    // dataGrid组件
    import initDataGridCompoent from '../toolbar-components/initDataGrid-noPage-component';
    

    export default {
        name: 'OrderCollectionDetailsView',
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
                    // $pageRecord: 10,
                    // $rowIndex : 1,
                    strMethod: 'QueryOrderCollectionDetailsList',

                    $WarhoursCode: '',
                    $fStatus: '',
                    $LinCode: '',
                    $DistributorId: '',

                    // $StartDate: '',
                    // $EndDate: '',
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
                this.form.$DisStartDate = data
            },
            endDateChange(data) {
                this.form.$DisEndDate = data
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
            }
        },
        mounted () {
            // 可在此从服务端获取表格数据
            var date = Util.nowTime(this);
            this.form.$DisStartDate = date.forweek;
            this.form.$DisEndDate = date.formatnowdate;
            this.getData()
        }
};
</script>
