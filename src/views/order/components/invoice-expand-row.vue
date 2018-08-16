<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div style="position: relative;background-color: #ffe48d;">
        <Card :bordered="false" style="margin-bottom: 10px;">
            <Table border :columns="colHead" :data="colHeadData"></Table>
        </Card>
            <Table border :columns="col" :data="colData"></Table>
        <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
</template>
<script>
    import Util from '../../../libs/util';
    export default {
        props: {
            row: Object
        },
        data() {
            return {
                spinShow: true,
                modal1: false,
                spinShow2: true,
                col: [
                    {
                        key: 'Id',
                        title: '订单号',
                        width: 150
                    },
                    {
                        key: 'CytMallId',
                        title: '平台单号',
                        width: 150
                    },
                    {
                        key: 'OrderSumPrice',
                        title: '总价',
                        width: 150
                    },
                    {
                        key: 'intMustPay',
                        title: '应收',
                        width: 150
                    },
                    {
                        key: 'strStatus',
                        title: '状态',
                        width: 150
                    },
                    {
                        key: 'Qitems',
                        title: '货物名称',
                        width: 150
                    },
                    {
                        key: 'Goods_Qty',
                        title: '数量',
                        width: 150
                    }
                ],
                colHead: [
                    {
                        key: 'id',
                        title: '发货单号',
                        width: 100
                    },
                    {
                        key: 'strStatus',
                        title: '状态',
                        width: 100
                    },
                    {
                        key: 'CollectionMoney',
                        title: '合计',
                        width: 100
                    },
                    {
                        key: 'PayCollectionMoney',
                        title: '已收',
                        width: 100
                    },
                    {
                        key: 'intMustPay',
                        title: '应收',
                        width: 100
                    },
                    {
                        key: 'uid',
                        title: '用户ID',
                        width: 100
                    },
                    {
                        key: 'company',
                        title: '公司',
                        width: 100
                    },
                    {
                        key: 'fahuoer',
                        title: '发货人',
                        width: 100
                    },
                    {
                        key: 'fahuoCompany',
                        title: '发货公司',
                        width: 150
                    },
                    {
                        key: 'fahuoArea',
                        title: '发货区域',
                        width: 150
                    },
                    {
                        key: 'fahuoCompanyAddress',
                        title: '发货地址',
                        width: 250
                    },
                    {
                        key: 'fahuoerTel',
                        title: '发货电话',
                        width: 100
                    },
                    {
                        key: 'fahuodate',
                        title: '发货日期',
                        width: 100
                    },
                    {
                        key: 'isPrint',
                        title: '是否已经打印',
                        width: 50
                    },
                    {
                        key: 'strScanner',
                        title: '扫描人',
                        width: 150
                    },
                    {
                        key: 'dScanner',
                        title: '扫描时间',
                        width: 150
                    }
                ],
                colHeadData: [],
                colData: [],
                col2: [{
                    key: 'Remark',
                    title: '信息'
                },{
                    key: 'CreateDate',
                    title: '操作时间'
                },{
                    key: 'RealName',
                    title: '操作人'
                }],
                colData2: []
            }
            
        },
        methods: {
            show (index) {
                return
                this.modal1 = true
                var LogisticsNo_Key = this.colData[index].LogisticsNo_Key;
                var PackNo = this.colData[index].PackNo;
                var _this = this;
                var param = {
                    $PackNo : PackNo,
                    $oId : LogisticsNo_Key,
                    strMethod :'QueryOrderRecordsList' 
                }
                _this.spinShow2 = true;
                Util.getDataGrid(param, undefined , undefined , this).then((res) => {
                    var arrData = res.dgData
                    _this.colData2 = res.dgData
                    _this.spinShow2 = false
                })

            },
            remove (index) {
                console.log(this.colData[index])
            }
        },
        mounted() {
            let param = {
                $groupId : this.row.id,
                strMethod: 'YJApp_GetOrderByGroup'
            }
            let paramHead = {
                $intFahuoID : this.row.id,
                strMethod: 'getFahuoInfo'
            }
            let _this = this;
            _this.spinShow = true;
            Promise.all([Util.getDataGrid(param , undefined , undefined , this) , Util.getDataGrid(paramHead , undefined , undefined , this)]).then(res => {
                _this.colData = res[1].dgData
                _this.colHeadData = res[1].head.Table
                console.log(JSON.stringify(_this.colHeadData[0]))
                _this.spinShow = false
            })
        }
    };
</script>