<style lang="less">
    @import '../../../styles/common.less';
</style>

<template>
    <span style="margin: 0 10px;">
        <Button type="primary" icon="printer" @click="modifyExPressCompay()">修改快递公司</Button>
        <Modal
            v-model="showForm"
            width="350"
            title="修改快递公司"
            @on-ok="ok">
            <Form :label-width="80">
                <FormItem label="订单号:">
                    <Input v-model="ReplaceCourieredId"  placeholder="Enter something..." readonly></Input>
                </FormItem>
                <FormItem label="付款方式:">
                    <Input v-model="ptype" placeholder="Enter something..." readonly></Input>
                </FormItem>
                <FormItem label="快递公司:">
                    <carrierCompany :clearable="false" :selectedValue="ExpressCompanyName" @on-change="carrierCompanyChange"></carrierCompany>
                </FormItem>
            </Form>
        </Modal> 
    </span>

</template>

<script>
import Util from '@/libs/util';
import carrierCompany from '../../toolbar-components/CarrierCompany-component';

   function LoadRoleList(obj, vm) {
        let param = {
            ThirdPlatformOrderNo: obj.OrderId,
            strMethod: 'getExpressOrderRelation'
        }

        return Util.getDataGrid( param, undefined, "94257d04-a8cb-4cf7-a3f1-49de7e34ff54" , vm).then((data) => {
                var orderIdGroup = '';
                if (data && data.length > 0) {
                    var orderIds = "";
                    for (var i = 0; i < data.length; i++) {
                        orderIds += data[i].Orderid + ",";
                    }
                    orderIdGroup = orderIds.substr(0, orderIds.length - 1)
                } else {
                    orderIdGroup =  data[0].OrderId;
                }

                return Promise.resolve(orderIdGroup)

            })
        }


export default {
    name: 'modifyExPressCompayComponent',
    components: {
    	carrierCompany
    },
    props: {
        selectGroupArray: Array
    	
    },
    
    data () {
        return {
        	carrierCompanySelected:undefined,
            ReplaceCourieredId: 0,
            ptype: '',
            ExpressCompanyName: '',
            OrderId: '',
            showForm: false
        };
    },
    methods: {
    	carrierCompanyChange(key) {
    		this.carrierCompanySelected = key;
    	},
    	getSelectedData() {
    		return this.carrierCompanySelected;
    	},
        modifyExPressCompay() {
            // 修改快递公司
            if(this.selectGroupArray.length != 1){
                this.$Notice.warning({
                    title: '操作失败',
                    desc: '请选择一行进行修改'
                })
                return
            }
            let _this = this;
            _this.showForm = true;
            var selectObject = this.selectGroupArray[0];
            LoadRoleList(selectObject , _this).then((res) => {
                _this.ReplaceCourieredId = res;
                _this.ptype = selectObject.PaymentType;
                _this.ExpressCompanyName = selectObject.ExpressCompanyName;
                _this.OrderId = selectObject.ReplaceCourieredId;
            })
        },
        ok() {
            var _this = this;
            if(this.ExpressCompanyName === this.carrierCompanySelected) {
                this.$Notice.warning({
                    title: '保存失败',
                    desc: '您没有重新选择快递公司'
                })
                this.showForm = false
                return
            }
            var param = {
                $KeyValue: _this.OrderId + '',
                $OrderId: _this.ReplaceCourieredId + '',
                $ExpressCompanyName: _this.carrierCompanySelected,
                $txtPaymentType: _this.ptype,
                EditExpressCompay: 'EditExpressCompay',
                strMethod: 'UpdateExpressIScreate'
            }
            Util.getDataGrid(param , undefined , 'cd8e4c14-5e9e-41db-b40f-e59a8714f479' , this).then((res)=> {
                if(res.result == 'ok'){
                    _this.$Notice.success({
                        title: res.msg,
                        desc: '成功修改快递公司'
                    })
                    _this.showForm = false
                    _this.$emit('on-success',res.result);
                }
            })
        }
    },
    created () {
        // 可在此从服务端获取表格数据
        
    }
};
</script>
