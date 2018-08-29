<style lang="less">
    @import '../../../styles/common.less';
    .formTitle {
        background: #F7F7F7;
        text-align: right;
        border-top: 1px solid #ccc;
        border-left: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        padding: 0px;
        margin: 0px;
        height: 24px;
        white-space: nowrap;
        font-weight: normal;
        padding-right: 5px;
        padding-left: 5px;
        width: 90px;
    }

    .formValue {
        width: auto;
        height: 24px;
        border: 1px solid #ccc;
        text-align: left;
    }

    .form {
        width: 100%;
        margin: 0px;
        padding: 0px;
        border-collapse: collapse;
        border-width: 3px 1px 1px;
        border-right: 1px solid #ccc;
        table-layout: fixed;
    }

    .formValue .txt {
        /*border: none;*/
            /*height: 24px;
            line-height: 24px;
            width: 100%;
            font-family: 微软雅黑,宋体,Arial,Helvetica,Verdana,sans-serif;
            font-size: 9pt;
            color: #000000;*/
        }

        #isdaishous {
            color: #990000;
            font-weight: bold;
        }

        input {
            border: 0;
        }

        table tr {
            height: 35px;
        }

        table tr td {
            padding-left: 3px;
        }

    </style>

    <template>
        <div class="panel-body" style="height:auto;">
            <!--查询 end-->
            <!--列表区域 start-->

            <table id="tb_basic" class="form">
                <tr class="tet">
                    <th class="formTitle">订单号：</th>
                    <td class="formValue">
                        <span id="id">{{param.id}}</span>
                    </td>
                    <th class="formTitle">下单时间：</th>
                    <td id="startdate" class="formValue">{{param.startdate}}</td>
                    <td rowspan="5" class="formValue" align="center" style="width:50%"></td>
                </tr>
                <tr class="tet">
                    <th class="formTitle">会员号：</th>
                    <td id="member" class="formValue">{{param.uid}}</td>
                    <th class="formTitle">审稿时间：</th>
                    <td id="okdate" class="formValue">{{param.okdate}}</td>
                </tr>

                <tr class="tet">
                    <th class="formTitle">印刷项目：</th>
                    <td id="Qitem-title" class="formValue">{{param.qitemTitle}}</td>
                    <th class="formTitle">货&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期：</th>
                    <td id="cuhuodate" class="formValue">{{param.cuhuodate}}</td>
                </tr>
                <tr>
                    <th class="formTitle">订单状态：</th>
                    <td id="FlagTitle" class="formValue">{{param.FlagTitle}}</td>
                    <th class="formTitle">付款情况：</th>
                    <td class="formValue" id="ispays" v-html="isPay"></td>
                </tr>
                <tr>
                    <th class="formTitle">文件名：</th>
                    <td class="formValue" colspan="3" id="filename">{{param.FileName}}</td>
                </tr>
                <tr>
                    <th class="formTitle">文件：</th>
                    <td class="formValue" id="LocalName" colspan="4" style="color:red;font-size:14px; font-weight:600;">{{param.LocalName}}</td>
                </tr>
                <tr>
                    <th class="formTitle">更改备注：</th>
                    <td class="formValue" id="editinfo" colspan="4">{{param.editinfo}}</td>
                </tr>
                <tr style="display:none;" id="cd">
                    <th class="formTitle">备注：</th>
                    <td class="formValue" id="chongdanid" style="color:red;font-size:14px; font-weight:600;" colspan="4">{{param.chongdanid}}</td>
                </tr>
                <tr >
                    <th class="formTitle">合并发货备注：</th>
                    <td class="formValue" id="OrderRelation" style="color:red;font-size:14px; font-weight:600;" colspan="4">{{orderRelation}}</td>
                </tr>
            </table>
            <br />
            <table id='tb_basic2' class='form' border='0'>
                <!-- 生产注意： -->
                <tr style='height:35px;' v-if="param.maderemark">
                    <td class='formTitle'  align='right'>生产注意：</td> 
                    <td class='formValue' style=' color:red;font-size:14px; font-weight:600;'>{{param.maderemark}}</td> 
                </tr>
                <!-- 生产注意： -->
                <tr style='height:35px;' v-if="param.fahuoremark">
                    <td class='formTitle'  align='right'>发货注意：</td> 
                    <td class='formValue' style=' color:red;font-size:14px; font-weight:600;'>{{param.fahuoremark}}</td> 
                </tr>
                <tr style='height:35px;' v-if="param.caiwuremark">
                    <td class='formTitle'  align='right'>财务注意：</td> 
                    <td class='formValue' style=' color:red;font-size:14px; font-weight:600;'>{{param.caiwuremark}}</td> 
                </tr>
                <tr style='height:35px;' v-if="param.CancelReason">
                    <td class='formTitle'  align='right'>代发快递注意：</td> 
                    <td class='formValue' style=' color:red;font-size:14px; font-weight:600;'>{{param.CancelReason}}</td> 
                </tr>
            </table>
            <br />
            <span id="table_problem"></span>
            <!--列表区域 end-->
            <table class="form">
                <tr>
                    <th class="formTitle" align="right">印刷费用：</th>

                    <td class="formValue" id="cbprices">{{param.cbprice}}</td>
                    <th class="formTitle" align="right">总 重 量：</th>

                    <td class="formValue" id="zhongliangs">{{param.zhongliang + 'kg' }}</td>
                    <th class="formTitle" align="right">运费：</th>

                    <td class="formValue" id="Freights">{{param.Freight}}</td>
                    <th class="formTitle" align="right" rowspan="2">结算周期：</th>

                    <td class="formValue" id="Settlements" rowspan="2">{{param.Settlement}}</td>
                </tr>
                <tr>
                    <th class="formTitle" align="right">后加工费用：</th>

                    <td class="formValue" id="hjgprices">{{param.hjgprice}}</td>
                    <th class="formTitle" align="right">最终报价：</th>

                    <td class="formValue" id="prices">{{'￥' + param.price}}</td>
                    <th class="formTitle" align="right">货款：</th>

                    <td class="formValue" id="isdaishous">{{param.isdaishou ? '代收货款' : '月结预存'}}</td>
                </tr>
            </table>
            <br />
            <table class="form">
                <tr>
                    <th class="formTitle" align="right">收货单位：</th>

                    <td class="formValue" id="Company">{{param.Company}}</td>
                    <th class="formTitle" align="right">联系电话：</th>

                    <td class="formValue" id="Tel">{{param.Tel}}</td>
                    <th class="formTitle" align="right">QQ：</th>

                    <td class="formValue" id="QQ">{{param.QQ}}</td>
                </tr>
                <tr>
                    <th class="formTitle" align="right">联 系 人：</th>

                    <td class="formValue" id="Attn">{{param.Attn}}</td>
                    <th class="formTitle" align="right">收货地址：</th>

                    <td class="formValue" id="Address">{{param.address}}</td>
                    <th class="formTitle" align="right">发货方式：</th>
                    <td class="formValue" id="FahuoTitles">{{param.FahuoTitles}}</td>
                </tr>
                <tr>
                    <th class="formTitle" align="right">加盟商：</th>

                    <td class="formValue" id="CompanyName">{{param.CompanyName}}</td>
                    <th class="formTitle" align="right">快递单号：</th>

                    <td class="formValue" id="CourierNumber">{{param.CourierNumber}}</td>
                    <th class="formTitle" align="right">代收货款金额：</th>

                    <td class="formValue" id="CollectionMoney">{{param.CollectionMoney}}</td>

                </tr>
            </table>
            <br />
            <br />
            <Spin size="large" fix v-if="spinShow"></Spin>
        </div>

    </template>
    <!-- 路线下拉框 -->
    <script>
        import Util from '../../../libs/util';

        function filterPay(data) {
            if (data.ispay) {
                var price = data.price;
                var priceed = data.priceed;
                var newprice = data.newprice;
                if (data.priceed > 0) {  //有收款
                    var notPrice = FormatCurrency((price - priceed));
                    if ((priceed - price) == 0) {  //判断是否付了全款
                        return "已付款（<span style='color:red; font-weight: bold;' >" + FormatCurrency(price) + "</span>）元";
                    } else {
                        return "已付款（<span style='color:red; font-weight: bold;' >" + FormatCurrency(data.priceed) + "</span>）元 |  未付款（<span style='color:red; font-weight: bold;' >" + notPrice + "</span>）元 "
                    }
                } else {
                    if (data.ispay) {
                        return "已付款（<span style='color:red; font-weight: bold;' >" + FormatCurrency(price) + "</span>）元"
                    } else {
                        return "未付款（<span style='color:red; font-weight: bold;' >" + FormatCurrency(price) + "</span>）元 "
                    }
                }
            } else { //含未收款
                var notPrice = data.price;
                var newprice = data.newprice;
                if (newprice != 0) {
                    notPrice = newprice;
                }
                if (data.priceed > 0) {
                    notPrice = FormatCurrency(notPrice - data.priceed);  //未收款额
                    return "已付款（<span style='color:red; font-weight: bold;' >" + FormatCurrency(data.priceed) + "</span>）元 |  未付款（<span style='color:red; font-weight: bold;' >" + notPrice + "</span>）元 "
                } else {
                    return "未付款（<span style='color:red; font-weight: bold;' >" + FormatCurrency(notPrice) + "</span>）元 "
                }

            }

        }

     //格式化金额
     function FormatCurrency(num) {
        var num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num))
            num = "0";
        var sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 100 + 0.50000000001);
        var cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10)
            cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' +
        num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + num + '. ' + cents);
    }
    function makerParam(param) {

        if (!param) {
            return "";
        }
        else {
            return param;
        }
    }


    export default {
        name: 'selectDelivery',
        props: {
            param: Object,
            param2: Array
        },
        data () {
            return {
                spinShow : true,
                isPay: '',
                orderRelation: ''
            };
        },
        methods: {
            selected(key) {
                // this.$emit('on-change',key);
            }
        },
        mounted() {
            this.spinShow = false
            console.log(this.param)
            this.isPay = filterPay(this.param)

            var orderIds = "";
            for (var i = 0; i < this.param2.length; i++) {
                orderIds += this.param2[i].Orderid;
                if (i != this.param2.length - 1) {
                    orderIds += ",";
                }
            }
            if (orderIds && orderIds.indexOf(",") > 0) {
                this.orderRelation = info+"一起发快递"
            } else {
                this.orderRelation = "单个订单发货"
            }

            
        },
        created () {
            // 可在此从服务端获取表格数据
        }
    };
</script>
