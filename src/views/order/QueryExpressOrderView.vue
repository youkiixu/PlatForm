<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div @keyup.enter="getData()">

        <Card>
            <Row class="margin-top-10">
                <span class="margin-lr-10px">
                    关键词:<Input v-model="form.$key" placeholder="物流单/订单号/会员号" style="width: 150px" />
                </span>
                
                <span class="margin-lr-10px">
                    运付方式:
                    <Select clearable  v-model="form.$TransportType" @on-change="transportTypeChange" style="width:150px">
                        <Option v-for="item in transportType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </span>
                <span class="margin-lr-10px">
                    代收款项:
                    <Select clearable v-model="form.$IsCollection" @on-change="isCollectionChange" style="width:150px">
                        <Option v-for="item in collection" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </span>
                <span class="margin-lr-10px">
                    订单状态:
                    <StatuComponent  @on-change="statuChange"></StatuComponent>
                </span>
            </Row>
            <Row class="margin-top-10">
                <span class="margin-lr-10px">
                    承运公司:
                    <CarrierCompanyComponent @on-change="carrierCompanyChange"></CarrierCompanyComponent>
                </span>
                <span class="margin-lr-10px">
                    时间日期:
                    <datePickerCompoent
                    :showSelect="false"
                    @startDateChange="startDateChange"
                    @endDateChange="endDateChange"
                    ></datePickerCompoent>
                </span>
            </Row>
            <Row class="margin-top-10">
                <span class="margin-lr-10px">
                    表格样式
                    <i-switch v-model="showControl"  size="large"></i-switch>
                </span>
                <span class="margin-lr-10px"><Button type="primary" icon="ios-search" @click="checkOrder">查看订单</Button></span>
                <span class="margin-lr-10px"><Button type="primary" icon="search" @click="getData()">搜索</Button></span>
            </Row>
        </Card>

        <Card style="position: relative;" class="margin-top-10">
            <initDataGridCompoent 
            ref="dataGrid" 
            :param="form" 
            :showControl="showControl" 
            @selectRow="selectRow" 
            @dbClickRow="dbClickRow"></initDataGridCompoent>
        </Card>
        <Modal
        v-model="showMolal"
        title="快递单详细信息"
        @on-ok="ok">
        <table cellpadding="0" cellspacing="0" id="ExpressOrderDetailse2" class="ExpressOrderDetailse MaxHW hidden">
            <tr><th>物流单号：</th><td id="lab-logisticsOrderNo"></td><th>物流单状态：</th><td id="lab-statu"></td></tr>
            <tr><th>收件人姓名：</th><td id="lab-receiveName" colspan="3"></td></tr>
            <tr><th>收件人联系电话：</th><td id="lab-receiveTelePhone" colspan="3"></td></tr>
            <tr><th>收件人联系地址：</th><td id="lab-receiveAddress" colspan="3"></td></tr>
            <tr><th>寄件人姓名：</th><td id="lab-ContactName" colspan="3"></td></tr>
            <tr><th>寄件人联系电话：</th><td id="lab-ContactTelePhone" colspan="3"></td></tr>
            <tr><th>寄件人联系地址：</th><td id="lab-ContactAddress" colspan="3"></td></tr>
            <tr><th>承运公司：</th><td id="lab-CarrierCompany"></td><th>承运公司快递单号：</th><td id="lab-CarrierCompanylogisticsOrderNo"></td></tr>
            <tr><th>配送人名：</th><td id="lab-DistributorName"></td><th>配送人电话：</th><td id="lab-DistributorTelePhone"></td></tr>
            <tr><th>运费：</th><td id="lab-Freight" style="color:red !important"></td><th>是否已付运费：</th><td id="lab-IsPayFreight"></td></tr>
            <tr><th>重量：</th><td id="lab-ObjectWeight"></td><th>运付方式：</th><td id="lab-TransportType"></td></tr>
            <tr><th>代收金额：</th><td id="lab-CollectionMoney" style="color:red !important"></td><th>是否已付代收金额：</th><td id="lab-IsCollection"></td></tr>
            <tr><th>注意事项：</th><td colspan="3" style="max-width:630px;word-wrap:break-word;overflow-y:auto"><div id="lab-NeedingAttention" class="MaxHW" style="height:120px !important;max-height:120px !important;"></div></td></tr>
            <tr><th>创建日期：</th><td id="lab-CreateDate" colspan="3"></td></tr>
        </table>
    </Modal>
</div>
</template>
<!-- 快递订单列表 -->
<script>
    import Util from '../../libs/util';
    import $ from 'jquery';
    import Cookies from 'js-cookie';
    import StatuComponent from '../toolbar-components/selectStatu-component';
    import CarrierCompanyComponent from '../toolbar-components/CarrierCompany-component';
    import initDataGridCompoent from '../toolbar-components/initDataGrid-component';
    import datePickerCompoent from '../toolbar-components/datePicker-component';

    export default {
        name: 'QueryExpressOrderView',
        components: {
            StatuComponent,
            CarrierCompanyComponent,
            initDataGridCompoent,
            datePickerCompoent
        },
        data () {
            return {
                form: {
                    $IsExpress: 1,
                    $key: '',
                    $Status: '',
                    $IsCollection: '',
                    $CarrierCompany: '',
                    $TransportType: '',
                    $StartDate: '',
                    $EndDate: '',
                    isLoad: true,
                    $pageRecord: 15,
                    $rowIndex : 1,
                    strMethod: 'QueryExpressOrderList'
                },
                showMolal: false,
                showMolal2: false,
                columnsList: [],
                tableData: [],
                intCount: '',
                showControl: false,
                transportType : [{ //运付方式
                    value: 'undefined',
                    label: '全部'
                },{
                    value: '0',
                    label: '无'
                },{
                    value: '1',
                    label: '寄付'
                },{
                    value: '2',
                    label: '到付'
                }],
                collection: [{ //代收款项
                    value: '',
                    label: '全部',

                    selected: true
                },{
                    value: '0',
                    label: '否'
                },{
                    value: '1',
                    label: '是'
                }],
                selectRowData: undefined,
                mol: {}
            };
        },
        methods: { 
            getData() {
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
                } else {
                    this.firstGetData()    
                }
                
            },
            firstGetData() {
                for(var key in this.form) {
                    if(this.form[key] === '') {
                        this.form[key] = undefined;
                    }
                }
                this.form.$rowIndex = 1;
                this.$refs.dataGrid.initDataGrid()
            },
            LoadStatuList () {
                baseData.LoadStatuList()
            },
            LoadCarrierCompany() {

            },
            selectRow(data) {
                this.selectRowData = data
            },
            dbClickRow(data) {
                this.selectRowData = data
                this.checkOrder()
            },
            carrierCompanyChange(data) {
                var expressCompany = '';
                if(data === '顺丰快递') {
                    expressCompany =  7
                } else if(data === '运通快递') {
                    expressCompany = 11
                } else if(data === '优速快递') {
                    expressCompany = 28
                }
                this.form.$CarrierCompany = expressCompany
            },
            transportTypeChange(data) {
                this.form.$TransportType = data
            },
            isCollectionChange(data) {
                this.form.$IsCollection = data
            },
            statuChange(data) {
                this.form.$Status = data
            },
            startDateChange(data) {
                this.form.$StartDate = data
            },
            endDateChange(data) {
                this.form.$EndDate = data
            },
            checkOrder() {
                var _this = this;
                if(this.selectRowData){
                    var par = {
                        isLoad: true,
                        $Id: this.selectRowData.LogisticsNo
                    }
                    Util.getAjaxData( par, 'QueryExpressOrderDetails' , undefined).then((res) => {
                        _this.showMolal = true;
                        var obj = res[0]
                        $('#ExpressOrderDetailse2 #lab-logisticsOrderNo').text(obj.Id);
                        $('#ExpressOrderDetailse2 #lab-statu').text(obj.Title);
                        $('#ExpressOrderDetailse2 #lab-receiveName').text(obj.ReceiveName);
                        $('#ExpressOrderDetailse2 #lab-receiveTelePhone').text(obj.ReceiveTelePhone);
                        $('#ExpressOrderDetailse2 #lab-receiveAddress').text(obj.ReceiveAddress);
                        $('#ExpressOrderDetailse2 #lab-ContactName').text(obj.ContactName);
                        $('#ExpressOrderDetailse2 #lab-ContactTelePhone').text(obj.ContactTelePhone);
                        $('#ExpressOrderDetailse2 #lab-ContactAddress').text(obj.ContactAddress);
                        $('#ExpressOrderDetailse2 #lab-CarrierCompany').text(obj.CarrierCompany);
                        $('#ExpressOrderDetailse2 #lab-CarrierCompanylogisticsOrderNo').text(obj.ExpressId);
                        $('#ExpressOrderDetailse2 #lab-DistributorName').text(obj.DistributorName);
                        $('#ExpressOrderDetailse2 #lab-DistributorTelePhone').text(obj.DistributorTelePhone);
                        $('#ExpressOrderDetailse2 #lab-Freight').text(obj.Freight);
                        $('#ExpressOrderDetailse2 #lab-IsPayFreight').text(obj.IsPayFreight);
                        $('#ExpressOrderDetailse2 #lab-ObjectWeight').text(obj.ObjectWeight);
                        $('#ExpressOrderDetailse2 #lab-TransportType').text(obj.TransportTypeTitle);
                        $('#ExpressOrderDetailse2 #lab-CollectionMoney').text(obj.CollectionMoney);
                        $('#ExpressOrderDetailse2 #lab-IsCollection').text(obj.IsPayCollectionMoney);
                        $('#ExpressOrderDetailse2 #lab-NeedingAttention').text(obj.NeedingAttention);
                        $('#ExpressOrderDetailse2 #lab-CreateDate').text(obj.CreateDate);
                    })

                }else {
                    this.$Notice.warning({
                        title: '提交失败',
                        desc: '请先选择一行'
                    })
                }
            },
            modifyOrder() {
                var _this =this;
                if(this.selectRowData){
                    var par = {
                        isLoad: true,
                        $Id: this.selectRowData.LogisticsNo
                    }
                    Util.getAjaxData( par, 'QueryExpressOrderDetails' , undefined).then((res) => {
                        _this.showMolal2 = true;
                        var obj = res[0]
                        _this.mol = obj
                        console.log(_this.mol)
                    })

                }else {
                    this.$Notice.warning({
                        title: '提交失败',
                        desc: '请先选择一行'
                    })
                }
            },
            ok() {
                this.showMolal = false
            },
            ok2() {
                this.showMolal2 = false
            }
        },
        mounted () {
        // 可在此从服务端获取表格数据
        // var date = Util.nowTime(this);
        //     this.form.$StartDate = date.forweek;
        //     this.form.$EndDate = date.formatnowdate;
        this.getData()
    }
};
</script>
