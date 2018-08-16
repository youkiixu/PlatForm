<style lang="less">
    @import '../../../styles/common.less';
    
</style>
<template>
    <Form class="header-form" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100"  inline>
        <FormItem label="物流单号" v-if="formValidate.LogisticsNo">
            <Input v-model="formValidate.LogisticsNo" placeholder="系统自动生成物流单号" readonly :disabled="pageType"></Input>
        </FormItem>
        <br />
        <FormItem label="寄件人" prop="ContactName">
            <autoSearchUserComponent
            v-model="formValidate.ContactName"
            :disabled="pageType"
            @on-select="contactSelect" 
            @on-enter = "resetContanct"
            ></autoSearchUserComponent>
        </FormItem>
        <FormItem label="寄件电话" prop="ContactTelePhone">
            <Input v-model="formValidate.ContactTelePhone" placeholder="请输入寄件人电话" :disabled="pageType"></Input>
        </FormItem>
        <FormItem label="寄件地址"  prop="ContactAddress">
         <area-select
         ref="contachAddress"
         :showSelect="showSelect"
         @input-click="inputClick"
         ></area-select>
     </FormItem>
     <FormItem label="街道地址" prop="ContactAddressDetail">
        <Input v-model="formValidate.ContactAddressDetail"  placeholder="请输入详细地址..." style="width: 300px;" :disabled="pageType"></Input>
    </FormItem>

    <span>
        <br/>
        <FormItem label="收件人" prop="ReceiveName">
            <autoSearchUserComponent
            v-model="formValidate.ReceiveName"
            :disabled="pageType"
            @on-select="receiveSelect"
            @on-enter = "resetReceive"
            ></autoSearchUserComponent>
        </FormItem>
        <FormItem label="收件电话" prop="ReceiveTelePhone">
            <Input v-model="formValidate.ReceiveTelePhone" placeholder="请输入收件人电话" :disabled="pageType"></Input>
        </FormItem>
        <FormItem label="收件人地址" prop="ReceiveAddress">
            <al-cascader 
            v-model="formValidate.ReceiveAddress" 
            level="3" 
            @on-change="areaChange" 
            v-if="resetCascader" 
            data-type="name"
            :disabled="pageType" 
            style="width: 300px;" />
        </FormItem>
        <FormItem label="街道地址" prop="ReceiveAddressDetail">
            <Input v-model="formValidate.ReceiveAddressDetail"   placeholder="请输入详细地址..." style="width: 300px;" :disabled="pageType"></Input>
        </FormItem>
        
        <span v-if="formValidate.ReceiveAddress.length != 0">
            <br/>

            <FormItem label="代收金额" prop="CollectionMoney">
                <Input v-model="formValidate.CollectionMoney"  placeholder="请输入代收金额..." :disabled="pageType"></Input>
            </FormItem>
            <FormItem label="订单价值" prop="OrderSumPrice">
                <Input v-model="formValidate.OrderSumPrice"  placeholder="请输入订单价值..." :disabled="pageType"></Input>
            </FormItem>
            <br/>
            <FormItem label="重量" prop="ObjectWeight">
                <Input v-model="formValidate.ObjectWeight" @on-change="ObjectWeightChange" placeholder="请输入重量..." :disabled="pageType"></Input>
            </FormItem>
            <FormItem label="运费" prop="Freight">
                <Input v-model="formValidate.Freight"  placeholder="请输入运费..." :disabled="pageType"></Input>
            </FormItem>
            <FormItem label="货物数量" prop="Goods_Qty">
                <Input v-model="formValidate.Goods_Qty"  placeholder="请输入货物数量..." readonly :disabled="pageType"></Input>
            </FormItem>
            <FormItem label="参考时效:" prop="Prescription">
                <Input v-model="formValidate.Prescription"  placeholder="时效" :disabled="pageType"></Input>
            </FormItem>
            
            <br/>
            <FormItem label="发货备注">
                <Input v-model="formValidate.NeedingAttention" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注" style="width: 800px;" :disabled="pageType"></Input>
            </FormItem>
        </span>
    </span>
</Form>
</template>
<script>
    import deliveryComponent from '@/components/delivery-component';
    import warhoursComponent from '@/components/warhours-component';
    import areaComponent from '@/components/area-component';
    import routeComponent from '@/components/route-component'
    import autoSearchUserComponent from '@/components/autoSearchUser-component'
    import areaSelect from '@/components/area-component/area-index'

    // import areaIndexComponent from '@/components/area-component/area-index'
    import Util from '@/libs/util'
    import Api from '@/libs/api'

    import Vue from 'vue';
    import iviewArea from 'iview-area';
    Vue.use(iviewArea);

    const validateMobile = (rule, value, callback) => {

        if (!Number.isInteger(+value)) {
            callback(new Error('请输入数字值'));
        } else {
            callback();
        }
    };


    export default {
     components :  {
      deliveryComponent,
      warhoursComponent,
      areaComponent,
      routeComponent,
      autoSearchUserComponent,
      areaSelect
  },
  props : {
    pageType: {
        type: Boolean,
        default: false
    }
},
data () {
    return {
        formValidate: {
            LogisticsNo: '',

            ContactName: '',
            ContactId: '',
            ContactTelePhone: '',
            ContactAddress: [],
            ContactAddressDetail: '',

            ReceiveName: '',
            ReceiveId: '',
            ReceiveTelePhone: '',
            ReceiveAddress: [],

            ReceiveAddressDetail: '',

            Warehouse: '',
            Freight : '',
            OrderSumPrice : "",
            CollectionMoney: '',
            ObjectWeight: '',
            Goods_Qty: '',
            ThirdPlatformOrderNo: '',

            RouteName: '',
            DistributionId: '',
            DistributionName: [],
            NeedingAttention: ''
        },

        ruleValidate: {
            ContactName: [
            { required: true , message: '必须输入寄件人姓名', trigger: 'change' }
            ],
            ContactTelePhone: [
            {required: true, message: '电话号码不能为空', trigger: 'blur'},
            {validator: validateMobile, trigger: 'blur'}
            ],
            ContactAddress: [
            { required: true,  type: 'array', len: 4, message: '请选择寄件地址', trigger: 'change' }
            ],
            ReceiveName: [
            { required: true , message: '必须输入收件人姓名', trigger: 'change' }
            ],
            ReceiveTelePhone: [
            {required: true, message: '电话号码不能为空', trigger: 'blur'},
            {validator: validateMobile, trigger: 'blur'} 
            ],
            ReceiveAddress: [
            { required: true ,  type: 'array', len: 4, message: '请选择寄件地址', trigger: 'change' }
            ],
            ReceiveAddressDetail: [
            { required: true , message: '必须输入收件人的详细地址', trigger: 'change' }  
            ],
            Warehouse: [
            { required: true , message: '当前收货地址还没有设立仓库', trigger: 'change' }  
            ],
            RouteName: [
            { required: true , message: '当前收货地址还没有设立路线', trigger: 'change' }  
            ],
            DistributionId: [
            { required: true , type: 'number' , message: '请选择配送人员', trigger: 'change' }  
            ],
            Freight: [
            {validator: validateMobile, trigger: 'blur'}
            ],
            CollectionMoney: [
            {validator: validateMobile, trigger: 'blur'}
            ],
            OrderSumPrice: [
            {validator: validateMobile, trigger: 'blur'}
            ],
            Price: [
            {validator: validateMobile, trigger: 'blur'}
            ],
            Goods_Qty: [
            {validator: validateMobile, trigger: 'change'}
            ],
            ObjectWeight: [
            {validator: validateMobile, trigger: 'change'}    
            ]
        },
        resetCascader: true,
        showSelect: false
    }
},
methods: {
    handleSubmit (name) {
            	// 表单验证
            	var isCheck = true;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        isCheck = false
                    } else {
                        isCheck = true
                    }
                })
                return isCheck;
            },
            handleReset (name) {
                var _this = this
                this.$refs[name].resetFields();
                this.formValidate.ContactAddress = []
                this.formValidate.ReceiveAddress = []
                this.formValidate.LogisticsNo = ''
                this.resetCascader = false;
                setTimeout(function() {
                    _this.resetCascader = true
                } , 20)
            },
            dateSelect(date) {
            	
            },
            areaChange(data) {
                var _this = this;
                var par = {
                    'City': data[1],
                    'Area': data[2]
                }   
                Util.getAjaxData(par , undefined , 'EC1D3AF6-8299-49EC-B523-BADA8EAE98F1' , this).then((res)=>{
                   // var res = res;
                    if(res.result == 'err'){
                        _this.$Message.warning(res.errMsg);
                        _this.formValidate.DistributionName = []
                        _this.formValidate.Warehouse = ''
                        _this.formValidate.RouteName = ''

                    } else {
                        // var arr = []
                        // res.DistributionName.map((item) => {
                        //     arr.push(item)
                        // })

                        _this.formValidate.DistributionName = res.DistributionName;
                        _this.formValidate.Warehouse = res.WarhoursName
                        _this.formValidate.RouteName = res.RouteName
                    }
                    
                })

            },
            setData(mainOrder) {
                var _this = this
                for(var key in _this.formValidate){
                    for(var j in mainOrder){
                        if(j === key){
                            _this.formValidate[key] = mainOrder[j]
                        }
                    }
                }
                var ReceiveAddress = mainOrder.ReceiveAddress.split(' ')
                var ReceiveAddressSelect = ReceiveAddress.slice(0,4)
                var ContactAddress = mainOrder.ContactAddress.split('/')
                var ContactAddressSelect = ContactAddress.slice(0,4)
                _this.formValidate.ContactAddress = ContactAddressSelect
                _this.formValidate.ContactAddressDetail = ContactAddress[4]
                _this.formValidate.ReceiveAddress = ReceiveAddressSelect
                _this.formValidate.ReceiveAddressDetail = ReceiveAddress[4]

                _this.formValidate.DistributionId = mainOrder.DistributorId

                _this.formValidate.Prescription = mainOrder.Prescription

            },
            ObjectWeightChange(data) {
                this.computerFreight(data.data)
            },
            computerFreight(weightVal) {
                var _this = this;
                var startCity = _this.formValidate.ContactAddress[1]
                var endCity = _this.formValidate.ReceiveAddress[1]
                var par = {
                    StartPoint: startCity,
                    EndPoint: endCity,
                    Weight: weightVal
                }
                Util.getAjaxData(par , undefined , '70ec62b0-8a29-4d2f-81b9-1c77a14c749b').then((res) => {
                    var data = res;
                    if(res.result == 'err'){
                        _this.$Notice.error({
                            title: '获取失败',
                            desc: res.errMsg
                        });
                    } else {
                        _this.formValidate.Freight = data.Freight
                        _this.formValidate.Prescription = data.Prescription
                        // Prescription时效
                    }
                    
                })
            },
            contactSelect(value) {
                var _this = this;
                 _this.formValidate.ContactName = value.RealName ? value.RealName : ''
                
                _this.formValidate.ContactId = value.Id ? value.Id : ''
                _this.formValidate.ContactTelePhone = value.Mobile ? value.Mobile : ''
            
            },
            receiveSelect(value) {
                var _this = this;
                _this.formValidate.ReceiveTelePhone = value.Mobile ? value.Mobile : ''
                _this.formValidate.ReceiveId = value.Id ? value.Id : ''
            },
            resetContanct(value) {
                var _this = this;
                // 原生的点击事件
                if(value == '') {
                    _this.formValidate.ContactTelePhone = ''
                    _this.formValidate.ReceiveId = ''
                }
            },
            resetReceive(value) {
                var _this = this;
                // 原生的点击事件
                if(value == '') {
                    _this.formValidate.ReceiveTelePhone = ''
                    _this.formValidate.ReceiveId = ''
                }
            },
            inputClick() {
                console.log(this.$refs.contachAddress)
                this.showSelect = true
            }
        },
        watch: {
           
        }
    }
</script>