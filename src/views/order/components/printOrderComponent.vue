<style lang="less">
    @import '../../../styles/common.less';
</style>

<template>
        <span style="margin: 0 10px;">
            <Button type="primary" icon="printer" @click="printOrder()">打印订单</Button>
            <Modal
            v-model="showHtml"
            width="800"
            ok-text="打印"
            title="打印订单"
            @on-ok="printHtml">
                <div style="margin-bottom: 10px;">
                    <span style="margin: 0 10px;"><Input v-model="sendName" placeholder="寄件人姓名" style="width: 150px" /></span>
                    <span style="margin: 0 10px;"><Input v-model="sendPhone" placeholder="寄件人电话" style="width: 150px" /></span>
                    <span style="margin: 0 10px;"><Button type="primary" icon="search" @click="printOrder()" >重新生成</Button></span>
                </div>
                <div v-html="htmlString">
                    
                </div>
            </Modal>
        </span>
</template>

<script> 
    import Util from '@/libs/util';
    import print from '@/libs/printOrder';

function getObject(val , printData) {
        for (var i = 0; i < printData.length; i++) {
            var orderId = printData[i].OrderId;
            val += "";
            if (val.indexOf(",") > 0) {
                var arr = val.split(",");
                for (var j = 0; j < arr.length; j++) {
                    if (orderId == arr[j]) {
                        return printData[i];
                    }
                }
            } else {
                if (val == orderId) {
                    return printData[i];
                }
            }
        }
    }



export default {
    name: 'PrintOrderComponent',
    props: {
        selectGroupArray: {
            type: Array,
            default: []
        }
    },
    data () {
        return {
            showHtml: false,
            htmlString: '',
            sendName: '',
            sendPhone: ''
        };
    },
    methods: {
        printOrder() {
            
            this.htmlString = '';
            var num = 0;
            var senderInfo = undefined;
            var collectionMoney = 0;
                var html = '';
                let _this = this;
                var selectGroupLength = this.selectGroupArray.length;
                if(selectGroupLength == 0){
                    _this.$Notice.warning({
                        title: '提示',
                        desc: '必须选择至少一项打印'
                    })

                    return
                }
                this.showHtml = true;
                this.selectGroupArray.map((row , index) => {
                    num++
                    var money = row.CollectionMoney == null ? 0 : row.CollectionMoney - 0;
                    var par = {
                        ThirdPlatformOrderNo: row.OrderId,
                        CollectionMoney: money,
                        strMethod: 'getExpressOrderRelation'
                    }
                    Util.getDataGrid( par, undefined , "94257d04-a8cb-4cf7-a3f1-49de7e34ff54" , this).then((data) => {
                        var orderIds = "";
                        var obj = "";

                        if (data && data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                orderIds += data[i].Orderid;
                                if (data.length > 1) {
                                    collectionMoney += data[i].CollectionMoney;
                                } else {
                                    collectionMoney = data[i].CollectionMoney;
                                }
                                if (i != data.length - 1) {
                                    orderIds += ",";
                                }
                            }
                            obj = getObject(orderIds , _this.selectGroupArray);
                        } else {//暂时用不到
                            orderIds = data[0].OrderId;
                            collectionMoney = data[0].CollectionMoney;
                            obj = getObject(orderIds , _this.selectGroupArray);
                        }
                        if(_this.sendName != '' || _this.sendPhone != ''){
                            senderInfo = {
                                sendName : _this.sendName,
                                sendPhone: _this.sendPhone
                            }
                        } else {
                            senderInfo = undefined
                        }
                        html += print.getHtml(obj , collectionMoney , senderInfo)
                        // print.printPdf(html)
                        if(selectGroupLength == num){
                            _this.innerHtml(html , _this.selectGroupArray)
                        }
                    })
                })

            },
            innerHtml(html) {
                this.htmlString = html
            },
            printHtml(html , printGroup) {
                print.printPdf(this.htmlString)
                // var ids = ''
                // printGroup.map((item) => {
                //     ids += item.Orderid + ',';
                // })
                // ids = ids.substring(0, ids.length - 1);
                // var par = {
                //     orderId: ids,
                //     isLoad: true,
                //     strMethod: 'UpdateExpressIScreate'
                // }
                // Util.getDataGrid(par,undefined,'b8f2d8e2-9b23-4f6e-9ae6-e1ff2da62683',this).then((res) => {
                //     print.printPdf(html)
                // })
            }
    },
    created () {
        // 可在此从服务端获取表格数据
        
    },
    watch: {
        selectGroupArray: function(newData) {

        }
    }
};
</script>
