<style lang="less">
  @import '../../../styles/common.less';
</style>

<template>
  <span style="margin: 0 10px;">
    <Button type="primary" icon="printer" @click="editReplaceCouriered()">修改快递单号</Button>
    <Modal
    v-model="showForm"
    width="350" 
    title="修改快递单号"
    @on-ok="ok">
    <Form :label-width="100">
      <FormItem label="订单号:">
        <Input v-model="txtOrdeId "  placeholder="" readonly />
      </FormItem>
      <FormItem label="付款方式:">
        <Input v-model="txtPaymentType" placeholder="" readonly />
      </FormItem>
      <FormItem label="快递公司:">
        <carrierCompany :clearable="false" :selectedValue="selectExpressCompanyName" @on-change="carrierCompanyChange"></carrierCompany>
      </FormItem>
      <FormItem label="快递单号:">
        <Input v-model="txtCourierNumber" placeholder="" :readonly="txtCourierNumberReadonly" />
      </FormItem>
      <FormItem label="实际重量:">
        <Input v-model="txtIntFactWeight" @on-change="txtIntFactWeightChange" :readonly="txtIntFactWeightReadonly" />
      </FormItem>
      <FormItem label="预测重量:">
        <Input v-model="txtWeight" placeholder="" readonly />
      </FormItem>
      <FormItem label="实际运费(元):">
        <Input v-model="txtInfactExpressFee" placeholder="" :readonly="txtInfactExpressFeeReadonly" />
      </FormItem>
      <FormItem label="预测运费(元):">
        <Input v-model="txtExpressFee" placeholder="" readonly />
      </FormItem>
      <FormItem label="是否取消:">
       <i-switch v-model="IsCancel" :disabled="IsCancelReadonly"></i-switch>
     </FormItem>
     <FormItem label="取消原因:" v-if="IsCancel">
      <Input v-model="CancelReason" placeholder="" :readonly="CancelReasonReadonly" />
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

  function getExpressFee(ReplaceCourieredId,txtIntFactWeight , selectExpressCompanyName , vm) {
    var weigth = txtIntFactWeight;
    var selectExpressCompanyName = selectExpressCompanyName;
    if (parseFloat(weigth) <= 0) {
      alertDialog("重量不能为小于0", 0);
      return false;
    }
    var param = {
     $KeyValue : ReplaceCourieredId + '',
     $Weight: weigth ,
     $ExpressCompanyName : selectExpressCompanyName,
     strMethod: 'UpdateExpressIScreate'
   }
   return Util.getAjaxData( param, undefined, "38f5350f-d3b2-4bc2-b196-cd1118f48685" , vm).then((data) => {
      
     return Promise.resolve(data)
   })


 }


 export default {
  name: 'editReplaceCourieredComponent', 
  components: {
   carrierCompany
 },
 props: {
  selectGroupArray: Array
},
data () {
  return {
   form: {
     $OrderId : '',
     $txtPaymentType : '',
     $ExpressCompanyName : '',
     $CourierNumber : '',
     $intFactWeight  : '',
     $IntFactExpressFee: '',
     $IsCancel: 0,
     $CancelReason: '',
     strMethod: 'UpdateExpressIScreate'
   },
   txtOrdeId : '',
   txtPaymentType : '',
   selectExpressCompanyName : '',
   txtCourierNumber: '',
   txtIntFactWeight: '',
   txtWeight: '',
   txtInfactExpressFee: '',
   txtExpressFee: '',
   CancelReason: '',

   ReplaceCourieredId : '',
   ptype : '',
   showForm: false,
   IsCancel: false,
   txtIntFactWeightReadonly: false,
   txtInfactExpressFeeReadonly: false,
   txtCourierNumberReadonly: false,
   CancelReasonReadonly: false,
   IsCancelReadonly: false
 };
},
methods: {
 reset () {
   this.txtIntFactWeight= ''
 },
 carrierCompanyChange(key) {
  this.selectExpressCompanyName = key;
},
txtIntFactWeightChange(){
  console.log(this.txtPaymentType)
  if(this.txtPaymentType == '到付') return
    var _this = this;
  getExpressFee(this.ReplaceCourieredId,this.txtIntFactWeight , this.selectExpressCompanyName , this).then((res) => {
    _this.txtInfactExpressFee = res;
  })
},
modifyExPressCompay() {
            // 修改快递单号
            let _this = this;
            _this.showForm = true;
            var obj = this.selectGroupArray[0];
            LoadRoleList(obj , _this).then((res) => {
              this.txtOrdeId = res;
              this.ReplaceCourieredId  = obj.ReplaceCourieredId;
              this.ptype = obj.PaymentType;
              this.txtPaymentType = obj.PaymentType;
              this.selectExpressCompanyName = obj.ExpressCompanyName;
              this.txtWeight = obj.Weight;
              this.txtExpressFee = obj.ExpressFee;
              if(obj.FactPrice){
                this.txtInfactExpressFeeReadonly = true

                this.txtInfactExpressFee = obj.FactPrice;
                this.txtCourierNumber = obj.CourierNumber;
                if (obj.FactWeight != 0) {
                  // 不能修改
                  this.txtIntFactWeight = obj.FactWeight
                  this.txtIntFactWeightReadonly = true
                } else {
                  // 可以修改
                  this.txtIntFactWeight = obj.FactWeight
                }


              }else {
                this.txtIntFactWeightReadonly = false
                this.txtInfactExpressFeeReadonly = false
                this.txtCourierNumberReadonly = false
                // $("#txtInFactExpressFee").val("").removeAttr("readonly");
                // $("#txtCourierNumber").val("").removeAttr("readonly");
                // $("#txtIntFactWeight").val("").removeAttr("readonly");

              }
              // IsCancel
              this.IsCancelReadonly = obj.IsCancel == 1 ? true : false
              this.CancelReasonReadonly = obj.IsCancel == 1 ? true : false
              this.IsCancel = obj.IsCancel == 1 ? true : false
              this.CancelReason = obj.CancelReason ? obj.CancelReason : ''

            })
          },
          ok() {
            if(this.IsCancelReadonly){
              this.$Notice.warning({
                title: '禁止操作',
                desc: '这张单已经取消，禁止再次修改'
              })
              return
            }
            var _this = this;
            if(this.IsCancel){
              this.form.$IsCancel = 1

              if(this.CancelReason == ''){
                this.$Notice.warning({
                  title: '禁止提交',
                  desc: '亲补充取消原因'
                })
                return
              }
              // 取消代发快递
              this.cancelReplaceCouriered(this.txtOrdeId , this.IsCancel , this.CancelReason)
              return

            } else {
              this.form.$IsCancel = 0
            }
            this.form.$KeyValue = this.ReplaceCourieredId;
            this.form.$OrderId = this.txtOrdeId;
            this.form.$CourierNumber = this.txtCourierNumber;
            this.form.$ExpressCompanyName = this.selectExpressCompanyName;
            this.form.$intFactWeight = this.txtIntFactWeight;
            this.form.$IntFactExpressFee = this.txtInfactExpressFee;
            this.form.$txtPaymentType = this.txtPaymentType;
            this.form.$CancelReason = this.CancelReason

            // console.log(this.form.$IntFactExpressFee , this.txtInfactExpressFee)
            // return
            for(var key in this.form) {
              this.form[key] = this.form[key] + '';
            }
            if(this.form['$IntFactExpressFee'] == '') {
              this.form['$IntFactExpressFee'] = '0'
            }
            if(this.form['$intFactWeight'] == '') {
              this.form['$intFactWeight'] = '0' 
            }
            if(this.form['$CourierNumber'] == '') {
              this.form['$CourierNumber'] == '0'
            }
            Util.getDataGrid(this.form , undefined , "cd8e4c14-5e9e-41db-b40f-e59a8714f479",this).then((res) => {
              if(res.data == 2){
                _this.$Notice.success({
                  title: '操作成功',
                  desc: res.msg
                })
              } else {
                _this.$Notice.warning({
                  title: '操作失败',
                  desc:  res.errMsg
                })
              }

              _this.$emit('on-success',res.result);
            })
          },
          editReplaceCouriered() {
           var _this = this;
           if(this.selectGroupArray.length != 1){
            this.$Notice.warning({
              title: '操作失败',
              desc: '请选择一行进行修改'
            })
            return
          }

          this.form = {
           $OrderId : '',
           $txtPaymentType : '',
           $ExpressCompanyName : '',
           $CourierNumber : '',
           $intFactWeight  : '',
           $IntFactExpressFee: '',
           $IsCancel: 0,
           $CancelReason: '',
           strMethod: 'UpdateExpressIScreate'
         }

         this.txtOrdeId = '',
         this.txtPaymentType = '',
         this.selectExpressCompanyName = '',
         this.txtCourierNumber= '',
         this.txtIntFactWeight= '',
         this.txtWeight= '',
         this.txtInfactExpressFee= '',
         this.txtExpressFee= '',
         this.CancelReason= '',

         this.ReplaceCourieredId = '',
         this.ptype = '',

         _this.showForm = true;
         _this.modifyExPressCompay()
       },
       cancelReplaceCouriered (ordeId , IsCancel, reason) {
          var _this = this;
          var par = {
            'OrderId' : ordeId,
            'Remark' : reason,
            'type' : 'cancel',
            'BackStage': 'true',
            'strAuthor': 'YJ'
          }
          Util.getDataGrid(par , undefined , "D295A56A-4AD1-4FB1-A498-A068B6C42EEB",this)
          .then(res => {
            var data = res
            if(data.result == 'ok'&& data.PayMoney != 0) {
                _this.recordFinance(ordeId , data.PayMoney)
            }
          })
       },
       // 插入财务记录
       recordFinance (ordeId , PayMoney) {
          var params = {
              OrderId: ordeId,
              DaiFaFreight: PayMoney,
              Remark: `取消代发快递退运费，金额：${PayMoney}元`
          }
          Util.postOtherApi( params , 'http://www.kiy.cn/webapi/Himall.NewShop.DaifaDiscountAmount')
          .then(res => {
            console.log(res)
          })
       }
     },
     created () {

     },
     watch: {
      selectGroupArray() {
        this.reset()
      }
    }
  };
</script>
