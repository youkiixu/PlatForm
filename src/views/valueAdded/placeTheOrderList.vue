

<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div @keyup.enter="getData()">

        <Card>
            <Row v-if="buttonGroup.length != 0">
                <span style="margin: 0 10px;" v-for="item in buttonGroup">
                    <Button :type="item.strValue" :icon="item.strImg" @click='buttonEvent(item.strEventMethod)'>{{item.strText}}</Button>
                </span>
            </Row>
            <Row class="margin-top-10">
                <Col span="4">
                    关键词:<Input v-model="form.$key" placeholder="物流单/订单号/会员号" style="width: 150px" />
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
                    扫描业务员: 
                    <selectDelivery @on-change="selectDeliveryChange"></selectDelivery>
                </Col> 
                <Col span="4">
                    订单状态:
                    <selectStatu @on-change="selectStatuChange"></selectStatu>
                </Col>
                
            </Row>
            <Row class="margin-top-10">
                <Col span="4">
                    是否代收款:
                    <selectCollection @on-change="selectCollectionChange"></selectCollection>
                </Col>

                <Col span="12">
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
                    表格样式
                    <i-switch v-model="showControl"  size="large"></i-switch>
                </Col>
                <Col span="3">
                    <span style="margin: 0 10px;"><Button type="primary" icon="search" @click="getData()">搜索</Button></span>
                </Col>

            </Row>
        </Card>

        <Card class="margin-top-10">
            <initDataGridCompoent ref="dataGrid" :param="form" :showControl="showControl" @selectRow="selectRow" @dbClickRow="dbClickRow" ></initDataGridCompoent>
        </Card> 
    </div>
</template>
<!-- 物流订单列表 -->
<script> 
    import Util from '../../libs/util';
    import toolMap from '@/libs/map'

    // 头部组件
    import selectCollection from '../toolbar-components/selectCollection-component';
    import selectRoute from '../toolbar-components/selectRoute-component';
    import selectWarhours from '../toolbar-components/selectWarhours-component';
    import selectDelivery from '../toolbar-components/selectDelivery-component';
    import selectStatu from '../toolbar-components/selectStatu-component';
    import selectThirdPlatform from '../toolbar-components/selectThirdPlatform-component';
    import datePickerCompoent from '../toolbar-components/datePicker-component';   

    // dataGrid组件
    import initDataGridCompoent from '../toolbar-components/initDataGrid-component';



    export default {
        name: 'placeTheOrderList',
        components: {
            datePickerCompoent,
            selectCollection,
            selectRoute,
            selectWarhours,
            selectDelivery,
            selectStatu,


            initDataGridCompoent
        },
        data () {
            return {
                form: {
                    $key: '',
                    $StartDate: '',
                    $EndDate: '',

                    $IsExpress: 0,

                    isLoad: true,
                    $pageRecord: 15,
                    $rowIndex : 1,
                    strMethod: 'QueryOrderList',

                    $Status: '',
                    $LinCode: '',
                    $WarhoursCode: '',
                    $DistributorId: '',
                    $Qitems: '',
                    $IsCollection: '',

                    $MStartDate: '',
                    $MEndDate: '',

                    // $ThirdPlatformOrderNo: '0',
                    $OrderForm: 5,
                },
                showControl: false,
                selectRowData: undefined,
                buttonGroup: []
            };
        },
        methods: {
            buttonEvent(e) {
                if(e === 'add') {
                    this.addOrder()
                }
            },
            getData () {
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

         GridInfo.map((item,index) => {
            if(!item.hidden){
                if(index == 8){
                    var colRow = {
                        title: item.title,
                        key: item.field,
                        width: item.width,
                                    // fixed: 'right',
                                    height: item.height,
                                    sortable: item.sortable
                                }
                                newGridInfo.push(colRow)
                                // 筛选操作需要执行此操作
                                Util.autoPushCol( colRow , vm)
                            } else if(item.field === "stStatus") {
                                var colRow = {
                                    title: item.title,
                                    key: item.field,
                                    width: item.width,
                                    align: 'center',
                                    render: (h, params) => {
                                        const row = params.row;
                                        const color = toolMap.statusColor(row.stStatus);
                                        const text = row.stStatus === null? '无状态' : row.stStatus === '配送完成' ? row.stStatus : row.stStatus;
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
                                // 筛选操作需要执行此操作
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
        var _this = this;
        this.selectRowData = data
        var row = this.selectRowData
        var proData = {
            type: 1,
            LogisticsNo : data.LogisticsNo
        };
        Util.openNewPage(_this, 'placeTheOrder' , undefined, proData);
        _this.$router.push({
            name: 'placeTheOrder',
            params: proData
        });
    },
    startDateChange(data) {
        this.form.$StartDate = data
        this.form.$MStartDate = data
    },
    endDateChange(data) {
        this.form.$EndDate = data
        this.form.$MEndDate = data
    },
    selectCollectionChange(data) {
        this.form.$IsCollection = data
    },

    selectRouteChange(data) {
        this.form.$LinCode = data
    },
    selectWarhoursChange(data) {
        this.form.$WarhoursCode = data
    },
    selectDeliveryChange(data) {
        this.form.$DistributorId = data
    },
    selectStatuChange(data) {
        this.form.$Status = data + ''
    },
    selectThirdPlatformChange(data) {
        this.form.$ThirdPlatformId = data
    },
    selectQitemsChange(data) {
        this.form.$Qitems = data
    },
    typeChange(data) {
        if(data == 0) {
            this.form.$MStartDate = undefined
            this.form.$MEndDate = undefined
        }
        if(data == 1) {
            this.form.$EndDate = undefined
            this.form.$StartDate = undefined
        }
    },
    addOrder() {
        var _this = this
        var proData = {
            type: 0
        }
        Util.openNewPage(_this, 'placeTheOrder' , undefined, proData);
        _this.$router.push({
            name: 'placeTheOrder',
            params: proData
        });
    }
},
mounted () {
            // 可在此从服务端获取表格数据
            Util.initButton(this)
            this.getData()
        }
    };
</script>
