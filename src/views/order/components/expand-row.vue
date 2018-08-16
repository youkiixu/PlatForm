<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div style="position: relative">
     <Table border :columns="col" :data="colData"></Table>
     <Spin size="large" fix v-if="spinShow"></Spin>
     <Modal
     v-model="modal1"
     title="更多信息"
     >
     <Table border :columns="col2" :data="colData2"></Table>
     <Spin size="large" fix v-if="spinShow2"></Spin>
 </Modal>
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
                col: [{
                    title: '操作',
                    key: 'action',
                    width: 150,
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
                                    this.show(params.index)
                                }
                            }
                        }, '查看状态')]
                        if(row.Logistics_status == 51 || row.Logistics_status == 50 || row.isAbnormal != null) {
                           
                        } else {
                            //  buttonGroup.push(h('Button', {
                            //     props: {
                            //         type: 'error',
                            //         size: 'small'
                            //     },
                            //     on: {
                            //         click: () => {
                            //             this.remove(params.index)
                            //         }
                            //     }
                            // }, '反馈'))
                        }

                        return h('div', buttonGroup);
                    }
                },{
                    key: 'LogisticsNo_Key',
                    title: '物流单号',
                    width: 150
                },
                {
                    key: 'Title',
                    title: '子订单状态',
                    width: 150
                },
                {
                    key: 'InsertTime',
                    title: '日期',
                    width: 150
                },
                {
                    key: 'RealName',
                    title: '当前操作员',
                    width: 150
                },
                {
                    key: 'dvRealName',
                    title: '司机'
                }
                
                ],
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
                $oId : this.row.LogisticsNo,
                strMethod: 'QueryOrderItemsList'
            }
            let _this = this;
            _this.spinShow = true;
            Util.getDataGrid(param , undefined , undefined , this).then((res) => {
                _this.colData = res.dgData
                _this.spinShow = false
            })
        }
    };
</script>