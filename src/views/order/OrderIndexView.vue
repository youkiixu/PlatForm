
<style lang="less">
    @import '../../styles/common.less';
</style>

<template> 
    <div @keyup.enter="getData()">

        <Card >
            <Row v-if="buttonGroup.length != 0">
                <span style="margin: 0 10px;" v-for="item in buttonGroup">
                    <Button :type="item.strValue" :icon="item.strImg" @click='buttonEvent(item.strEventMethod)'>{{item.strText}}</Button>
                </span>
            </Row> 
            <Row class="margin-top-10">  
                <span style="margin: 0 10px;">
                    关键词:
                    <Select v-model="keyIdSelected" @on-change="keyIdChange" style="width:150px">
                        <Option v-for="item in keyid" :value="item.value" :key="item.value" >{{ item.label }}</Option>
                    </Select>  
                    <Input v-model="keyName" placeholder="物流单/订单号/会员号" style="width: 150px" />
                </span>
                <span style="margin: 0 10px;">
                    承运公司:
                    <CarrierCompanyComponent @on-change="carrierCompanyChange"></CarrierCompanyComponent>
                </span>
                <span style="margin: 0 10px;">
                    打印状态:
                    <Select clearable v-model="form.$isPrint" style="width:150px">
                        <Option v-for="item in isPrint" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </span>
            </Row>
            <Row class="margin-top-10">
                <span style="margin: 0 10px;">
                    付款类型:
                    <Select clearable v-model="form.$paymentType" style="width:150px">
                        <Option v-for="item in isPaymentType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </span>
                <span style="margin: 0 10px;">
                    付款状态:
                    <Select clearable v-model="form.$orderIsPayment"  style="width:150px">
                        <Option v-for="item in isPay" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </span>
                <span style="margin: 0 10px;">
                    <selectTime @on-change="selectTimeChange"></selectTime>
                </span>
            </Row>
            <Row class="margin-top-10">
                <span style="margin: 0 10px;">
                    表格样式:
                    <i-switch v-model="showControl"  size="large"></i-switch>
                </span>
                <span style="margin: 0 10px;" v-show="printOrderAccess">
                    <!-- 打印订单 -->
                    <printOrderComponent ref="printOrderComponent" :selectGroupArray="selectGroupArray"></printOrderComponent>
                </span>
                <span style="margin: 0 10px;" v-show="editReplaceCourieredAccess">
                    <editReplaceCouriered ref="editReplaceCouriered"  :selectGroupArray="selectGroupArray" @on-success="getData()"></editReplaceCouriered>
                </span>
                <span style="margin: 0 10px;" v-show="cancelCollectionAccess">
                    <span style="margin: 0 10px;"><Button type="primary" icon="printer" @click="cancelCollection()">取消代收</Button></span>
                </span>
                <span style="margin: 0 10px;" v-show="modifyExPressCompayAccess">
                    <!-- 修改快递公司 -->
                    <modifyExPressCompayComponent ref="modifyExPressCompayComponent" @on-success="getData()" :selectGroupArray="selectGroupArray"></modifyExPressCompayComponent>
                </span>
                <span style="margin: 0 10px;">
                    <span style="margin: 0 10px;"><Button type="primary" icon="search" @click="getData()" >搜索</Button></span>
                </span>
            </Row>
        </Card>

        <Card class="margin-top-10">
            <initDataGridCompoent ref="dataGrid" :param="form" :showControl="showControl" @selectRow="selectRow" @dbClickRow="dbClickRow" @selectGroup="selectGroup" @showInfo="showInfo"></initDataGridCompoent>
        </Card>

    </div>
</template>
<!-- 代发快递列表 -->
<script>
    import Util from '../../libs/util';
    import print from '../../libs/printOrder';
    import Cookies from 'js-cookie';
    // 头部组件
    import selectTime from '../toolbar-components/selectTime-component'
    import CarrierCompany from '../toolbar-components/CarrierCompany-component';

    // dataGrid组件
    import initDataGridCompoent from '../toolbar-components/initDataGrid-component';
    
    // 查看快递信息组件
    import queryExpress from '../toolbar-components/queryExpress-component';
    // 修改快递公司组件
    import modifyExPressCompayComponent from './components/modifyExPressCompayComponent'
    // 查看快递信息组件
    import expressOrderRelation from './components/expressOrderRelation'
    // 打印订单组件
    import printOrderComponent from './components/printOrderComponent'
    // 修改快递单号
    import editReplaceCouriered from './components/editReplaceCourieredComponent'
    // 快递公司
    import CarrierCompanyComponent from '../toolbar-components/CarrierCompany-component';
    



    export default {
        name: 'OrderIndexView',
        components: {
            selectTime,
            CarrierCompany,
            initDataGridCompoent,
            expressOrderRelation,
            modifyExPressCompayComponent,
            printOrderComponent,
            editReplaceCouriered,
            queryExpress,
            CarrierCompanyComponent
        },
        data () {
            return {
                form: {
                    $startTime: '',
                    $stopTime: '',

                    isLoad: true,
                    $pageRecord: 15,
                    $rowIndex : 1,
                    strMethod: 'getExpressOrder',

                    $day: '',
                    $month: '', 
                    $year: '',
                    $paymentType: '',
                    $isPrint: '',
                    $orderIsPayment: '',
                    $orderId: '',
                    $userId: '',
                    $CourierNumber: '',
                    $expressCompanyName: ''
                },
                keyName: '',
                showControl: false,
                selectRowData: undefined,
                isPaymentType: [{
                    value: '1',
                    label: '寄付'
                },{
                    value: '2', 
                    label: '到付'
                }],
                isPay: [{
                    value: '0',
                    label: '未付款'
                },{
                    value: '1',
                    label: '已付款'
                }],
                isPrint: [{
                    value: '0',
                    label: '快递单未打印'
                },{
                    value: '1',
                    label: '快递单已打印'
                }],
                keyid: [{
                    value: '0',
                    label: '订单号'
                },{
                    value: '1',
                    label: '会员号'
                },{
                    value: '2',
                    label: '快递单号'
                }],
                keyIdSelected: '0',
                spinShow: false,
                selectGroupArray: [],
                printOrderAccess : false,
                editReplaceCourieredAccess : false,
                cancelCollectionAccess : false,
                modifyExPressCompayAccess : false,
                buttonGroup: []
            };
        },
        methods: {
            buttonEvent(e) {
                // 后端定义的按钮，需要在这里注册
                if(e === 'cancelCollection') {
                    this.cancelCollection()
                }
                if(e === 'modifyExPressCompay'){
                    // modifyExPressCompayComponent
                    this.$refs.modifyExPressCompayComponent.modifyExPressCompay()
                }
                if(e === 'editReplaceCouriered'){
                    // editReplaceCouriered
                    this.$refs.editReplaceCouriered.editReplaceCouriered()
                }
                if(e === 'printOrder'){
                    // printOrderComponent
                    this.$refs.printOrderComponent.printOrder()
                }
                if(e === 'DeliveryCompletion'){
                    this.DeliveryCompletion()
                }

            },
            getData (index) {
                var type = typeof (this.keyName);
                if(this.keyIdSelected == 0) {

                    this.form.$orderId = this.keyName
                }
                if(this.keyIdSelected == 1) {
                    this.form.$userId = this.keyName 
                }
                if(this.keyIdSelected == 2) {
                    this.form.$CourierNumber = this.keyName
                }
                var userInfo = JSON.parse(Cookies.get('userInfo'));
                if(userInfo.RoleId == 21) //代理商为21
                {
                    var par = {
                        strAddress: userInfo.address
                    }
                    Util.getAjaxData(par, undefined, '18c6f7e0-ef20-4088-b034-50c1ef577e39').then((res) => {
                        this.form.$rId = res.map.Code;
                        this.firstGetData()
                    })
                } else {
                    this.firstGetData()    
                }
                
            },
            firstGetData () {
                for(var key in this.form) {
                    if(this.form[key] === ''){
                        this.form[key] = undefined;
                    }
                }
                this.form.$rowIndex = 1; 
                this.$refs.dataGrid.initDataGrid(this.filterCol)
            },
            filterCol(GridInfo , vm) {
                var newGridInfo = []
                vm.tableColumnsFilter = []
                vm.oldColumnsList = []
                vm.oldData = []


                var colRow = {
                    type: 'selection',
                    key: 'selection',
                    width: 60,
                    align: 'center'
                }
                newGridInfo.push(colRow)
                // 筛选操作需要执行此操作
                Util.autoPushCol( colRow , vm)

                var colRow = {
                    title: '操作',
                    key: 'action',
                    width: 100,
                    align: 'center',
                    render: (h, params) => {
                        var row = params.row;
                        var buttonGroup = [h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    vm.showInfo(params.index)
                                }
                            }
                        }, '订单详情')]

                        return h('div', buttonGroup);
                    }
                }
                newGridInfo.push(colRow)
                Util.autoPushCol( colRow , vm)

                GridInfo.map((item,index) => {
                    if(!item.hidden){
                        if(index == 18){
                            var colRow = {
                                title: item.title,
                                key: item.field,
                                width: item.width,
                                height: item.height,
                                sortable: item.sortable
                            };
                            newGridInfo.push(colRow)
                            Util.autoPushCol( colRow , vm)
                        } else if(item.field === "Title") {
                            var colRow = {
                                title: item.title,
                                key: item.field,
                                width: item.width,
                                align: 'center',
                                render: (h, params) => {
                                    const row = params.row;
                                    const color = row.Title === null ? 'yellow' : row.Title === '配送完成' ? 'green' : 'blue';
                                    const text = row.Title === null? '无状态' : row.Title === '配送完成' ? row.Title : row.Title;
                                    return h('Tag', {
                                        props: {
                                            type: 'dot',
                                            color: color
                                        }
                                    }, text);

                                }
                            }
                            newGridInfo.push(colRow)
                            Util.autoPushCol( colRow , vm)
                        } else {
                            var colRow = {
                                title: item.title,
                                key: item.field,
                                width: item.width,
                                height: item.height,
                                sortable: item.sortable
                            }
                            newGridInfo.push(colRow)
                            Util.autoPushCol( colRow , vm)
                        }

                    }
                })
                return newGridInfo;
            },
            selectRow(data) {
                this.selectRowData = data
            },
            dbClickRow(data) {
                this.selectRowData = data

                this.$Modal.info({
                    render: (h) => {
                        return h(queryExpress , {
                            props: {
                                param: data.OrderId
                            }
                        })
                    }
                })
            },
            carrierCompanyChange(data) {
                this.form.$expressCompanyName = data ? data : undefined
            },
            selectTimeChange(data , startTime , endTime) {
                this.form.$day = ''
                this.form.$month =  ''
                this.form.$year =  ''
                if(data === 1) {
                    this.form.$day = 0
                }
                if(data === 2) {
                    this.form.$day = 1
                }
                if(data === 3) {
                    this.form.$day = 2
                }
                if(data === 4) {
                    this.form.$month = 0
                }
                if(data === 5) {
                    this.form.$month = 1
                }
                if(data === 7) {
                    this.form.$year =  0
                }
                if(data === 8) {
                    if(startTime && endTime) {
                        this.form.$startTime =  startTime
                        this.form.$stopTime =  endTime
                    }
                }
            },
            keyIdChange(key) {
                this.form.$orderId = ''
                this.form.$userId = ''
                this.form.$CourierNumber = ''
                this.keyIdSelected = key

            },
            showInfo(data) {
                var _this = this;
                var getOrderByIdMethod = 'getOrderById'
                
                if(data.OrderId.toString().length <= 6) {

                    getOrderByIdMethod = 'getOrderById_newShop'
                }
                
                var par = {
                    $orderId : data.OrderId,
                    isLoad: true,
                    strMethod : getOrderByIdMethod
                }
                _this.spinShow = true

                var par2 = {
                    ThirdPlatformOrderNo: data.OrderId,
                    strMethod: 'getExpressOrderRelation'
                }

                Promise.all([Util.getDataGrid(par2 , undefined , '94257d04-a8cb-4cf7-a3f1-49de7e34ff54' , this),Util.getDataGrid(par, undefined , undefined , this)]).then((res) => {
                    _this.$Modal.info({
                        width: 900,
                        render: (h) => {
                            return h(expressOrderRelation , { 
                                props: {
                                    param: res[1].dgData[0],
                                    param2: res[0]
                                }
                            })
                        }
                    })
                    _this.spinShow = false;
                })
            },
            selectGroup(data) {
                this.selectGroupArray = data
            },
            
            editReplaceCouriered() {

            },
            cancelCollection() {
                var _this = this;

                var len = _this.selectGroupArray.length;
                if(len != 1) {
                    this.$Notice.warning({
                        title: '操作失败',
                        desc: '请选择一行进行修改'
                    })
                    return
                }
                var selectObj = _this.selectGroupArray[0];
                // var money = selectObj.CollectionMoney == null ? 0 : selectObj.CollectionMoney.substr(0, selectObj.CollectionMoney.indexOf('('));
                // var monty = money == "" ? 0 : money;
                var monty = parseFloat(selectObj.CollectionMoney)
                if(monty > 0) {
                    this.$Modal.confirm({
                        title: '确认?',
                        content: '您将取消这条订单的代收货款',
                        onOk: function() {
                            var param = {
                                ids: selectObj.OrderId,
                                strMethod: 'cancelCollection'
                            }
                            Util.getDataGrid(param , undefined , "b8f2d8e2-9b23-4f6e-9ae6-e1ff2da62683" , this).then((res)=> {
                                console.log(res)
                                if(res == 1) {
                                    this.$Notice.success({
                                        title: '确认',
                                        desc: '取消代收货款成功'
                                    })
                                    _this.getData()
                                }
                            })
                        }
                    })
                } else {
                    this.$Notice.warning({
                        title: '操作失败',
                        desc: '此订单没有代收货款。'
                    })
                }
                
            },
            boxCarrierCompanyChange(e) {
                console.log(e)
            },
            buttonAccess() {
                // 已经取消这个功能，改用根据后台数据展示
                var Model = JSON.parse(Cookies.get('userInfo'));
                if (Model.RoleId == 14 || Model.RoleId == 1 || Model.TrueName == "陈国夫" || Model.TrueName == "岑达祥" || Model.TrueName == "陈国华"){
                 this.editReplaceCourieredAccess = true
             }
             if(Model.RoleId == 14 || Model.RoleId == 1 || Model.TrueName == "陈志根" || Model.TrueName == "陈国夫" || Model.TrueName == "陈国华" || Model.TrueName == "岑达祥"){
                this.printOrderAccess = true

            }
            if(Model.RoleId == 1) {
                this.cancelCollectionAccess = true

            }
            if (Model.RoleId == 1 || Model.TrueName == "张彩叶" || Model.RoleId == 4) {
                this.modifyExPressCompayAccess = true

            }


        },
        DeliveryCompletion() {
            var _this = this;
            var userInfo = JSON.parse(Cookies.get('userInfo'));
            if(this.selectGroupArray.length === 0 ){
                this.$Message.warning({
                    title: '操作失败',
                    content: '请选择一行进行修改'
                })
                return
            }
            if(_this.selectGroupArray[0].CourierNumber == ''){
                this.$Message.warning({
                    title: '操作失败',
                    content: '没有找到快递单号'
                })
                return
            }
            this.$Modal.confirm({
                title: '是否确认配送完成？',
                content: '确认配送完成后不能再次修改，确认继续操作?',
                onOk: function() {
                    var row = _this.selectGroupArray[0];
                    var par = {
                        orderNo: row.OrderId + '',
                        postid: row.CourierNumber,
                        userId: userInfo.userId
                    }

                    Util.getAjaxData(par , undefined , '59e567a2-2592-4cca-a587-4ce08340993c').then((res) => {
                        var data = res.map
                        if(data.result == 'ok'){
                            this.$Notice.success({
                                title: '操作成功',
                                desc: data.msg
                            })
                            
                            _this.$refs.dataGrid.changeRow(_this.$refs.dataGrid.pageRow)
                        }else {
                            this.$Notice.warning({
                                title: '操作失败',
                                desc: data.errMsg
                            })
                        }
                    })

                }
            })

        }

    },
    mounted () {
            // 可在此从服务端获取表格数据
            Util.initButton(this)
            this.getData()
        }
    };
</script>
