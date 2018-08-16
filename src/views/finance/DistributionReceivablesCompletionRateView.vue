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
    import Cookies from 'js-cookie';
    // 头部组件
    import selectWarhours from '../toolbar-components/selectWarhours-component';
    import selectRoute from '../toolbar-components/selectRoute-component';
    import selectDelivery from '../toolbar-components/selectDelivery-component';
    import datePickerCompoent from '../toolbar-components/datePicker-component';   

    // dataGrid组件
    import initDataGridCompoent from '../toolbar-components/initDataGrid-noPage-component';
    

    export default {
        name: 'BusinessDistributionSummaryView',
        components: {
            datePickerCompoent,
            selectWarhours,
            selectRoute,
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
                    strMethod: 'QueryDistributionReceivablesCompletionRateList',

                    $WarhoursCode: '',
                    $LinCode: '',
                    $DistributorId: '',

                    $rId: '',
                    $DisStartDate: '',
                    $DisEndDate: ''
                },
                showControl: false,
                selectRowData: undefined,
            };
        },
        methods: {
            getData () {
                var userInfo = JSON.parse(Cookies.get('userInfo'));
                if(userInfo.RoleId == 21) //代理商为21
                {
                    var par = {
                        strAddress: userInfo.address
                    }
                    Util.getAjaxData(par, undefined, '18c6f7e0-ef20-4088-b034-50c1ef577e39').then((res) => {
                        this.form.$rId = res.Code;
                        this.firstGetData()
                    })
                } else 
                    this.firstGetData()
            },
            firstGetData() {
                  for(var key in this.form) {
                    if(this.form[key] === ''){
                            this.form[key] = undefined;
                    }
                }
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
            selectDeliveryChange(data) {
                this.form.$DistributorId = data
            },
            selectRouteChange(data) {
                this.form.$LinCode = data + ''
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
            var date = Util.nowTime(this , '最近一个月的数据'); 
            this.form.$StartDate = date.formatwdate;
            this.form.$EndDate = date.formatnowdate;
            this.getData()
        }
};
</script>
