<style lang="less">
	@import '../../../styles/common.less';

</style>

<template>
	<Modal
	v-model="showEdit"
	title="新增/修改重量"
	:width="400"
	@on-ok="ok"
	@on-cancel="cancel">
	<Form :model="pubForm" label-position="right" :label-width="100" >
       <FormItem label="重量数"  label-position="right" :label-width="100">
        <InputNumber :min="0" v-model="pubForm.ObjectWeighNumber" style="width:100%"></InputNumber >
        </FormItem>
        <FormItem label="基础价格"  label-position="right" :label-width="100">
            <InputNumber :min="0" v-model="pubForm.Price" style="width:100%"></InputNumber >
            </FormItem>
            <FormItem label="每斤价格"  label-position="right" :label-width="100">
                <InputNumber :min="0" v-model="pubForm.CattyPrice" style="width:100%"></InputNumber >
                </FormItem>
                <FormItem label="每立方金额"  label-position="right" :label-width="100" prop="Mobile">
                    <InputNumber :min="0" v-model="pubForm.CubePrice" style="width:100%"></InputNumber >
                    </FormItem>
                    <FormItem label="承运公司"  label-position="right" :label-width="100">
                        <CarrierCompany :selectedNumber="pubForm.CarrerCompanyId" @on-change="carrierCompanyChange"></CarrierCompany>
                    </FormItem>
                    <FormItem label="折扣"  label-position="right" :label-width="100" prop="Mobile">
                        <InputNumber :min="0" v-model="pubForm.Discount" style="width:100%"></InputNumber >
                        </FormItem>
                        <FormItem label="是否折扣"> 
                            <RadioGroup v-model="pubForm.IsDiscount">
                             <Radio label="0">否</Radio>
                             <Radio label="1">是</Radio>
                         </RadioGroup>
                     </FormItem>
                 </Form>

             </Modal>
         </template>

         <script>
             import Util from '@/libs/util'
             import Cookies from 'js-cookie';

             import CarrierCompany from '@/views/toolbar-components/idCarrierCompany-component';


             export default {
              name: 'addWeightPriceManagentComponent',
              components: {
                CarrierCompany
            },
            props: {
             param: Object

         },
         data () {
            return {
                pubForm: {
                   ObjectWeighNumber: 0,
                   Price: 0,
                   CattyPrice: 0,
                   CubePrice: 0,
                   Discount: 0,
                   IsDiscount: 0,
                   CarrerCompanyId: 6
               },
               showEdit: false,
               type: 0
           };
       },
       methods: {
        carrierCompanyChange(data) {
            this.pubForm.CarrerCompanyId = data;
        },
        handleReset (name) {
          for(var key in this.pubForm){
             if(typeof(this.pubForm[key]) == 'boolean'){
                this.pubForm[key] = '0';
            } else if(typeof(this.pubForm[key]) == 'number'){
                this.pubForm[key] = 0 ;
            } else if(typeof(this.pubForm[key]) == 'string') {
                this.pubForm[key] = '';
            }
        }
        this.pubForm.IsDiscount = '0'
    },
    loadForm() {
      var row = this.param
      for(var key in row){
         if(typeof(row[key]) == 'boolean'){
            this.pubForm[key] = row[key] ? '1' : '0';
        } else if(typeof(row[key]) == 'number'){

            this.pubForm[key] = row[key] - 0 ;
        } else if(typeof(row[key]) == 'string') {
            this.pubForm[key] = row[key] ;
        }
    }
},
showModal(type) {
    this.type = type
    if(type == 0){
     this.handleReset()
 } else {
     this.loadForm()
 }
 this.showEdit = true
},
ok () {
 if(this.type == 0) {
  this.addRow()
}
if(this.type == 1) {
  this.modifyRow()
}
this.showEdit = false
},
addRow() {
 var _this = this;
 var par = {
    ObjectWeighNumber: _this.pubForm.ObjectWeighNumber,
    Price: _this.pubForm.Price,
    CattyPrice: _this.pubForm.CattyPrice,
    CubePrice: _this.pubForm.CubePrice,
    Discount: _this.pubForm.Discount,
    IsDiscount: _this.pubForm.IsDiscount,
    CarrerCompanyId: _this.pubForm.CarrerCompanyId,
    CreateDate: Util.nowTime().formatnowdate
}
for(var key in par){
    if(par[key] === ''){
     _this.$Message.error('必须填满信息')
     return
 }
}
Util.getAjaxData(par , undefined , '6516cea0-ce77-43f3-9412-a813ca0420cd').then((data)=> {
    if (data.errMsg || data.result != 'ok') {
        _this.$Message.error(data.errMsg);
        return false;
    }
    _this.$Message.success('修改成功！');
    _this.$emit('onSuccess' , '')
})
},
modifyRow() {
 var _this = this;
 var userInfo = JSON.parse(Cookies.get('userInfo'));
 var par = undefined
 var putData = {
    Id: _this.param.Id,
    rowState : 'M',
    ObjectWeighNumber: _this.pubForm.ObjectWeighNumber,
    Price: _this.pubForm.Price,
    CattyPrice: _this.pubForm.CattyPrice,
    CubePrice: _this.pubForm.CubePrice,
    Discount: _this.pubForm.Discount,
    IsDiscount: _this.pubForm.IsDiscount,
    CarrerCompanyId: _this.pubForm.CarrerCompanyId,
    ModifyerId: userInfo.userId,
    Modifyer: userInfo.TrueName,
    ModifyDate: Util.nowTime().formatnowdate
}
for(var key in putData){
    if(putData[key] === ''){
     _this.$Message.error('必须填满信息')
     return
 }
}
Util.getAjaxData(putData , undefined , '6516cea0-ce77-43f3-9412-a813ca0420cd').then((data)=> {
    if (data.errMsg || data.result != 'ok') {
        _this.$Message.error(data.errMsg);
        return false;
    }
    _this.$Message.success('修改成功！');
    _this.$emit('onSuccess' , '')
})

},
cancel () {
   this.showEdit = false
}
},
created () {
        // 可在此从服务端获取表格数据
    }
};
</script>
