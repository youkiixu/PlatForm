<style lang="less">
    @import '../../../styles/common.less';

</style>

<template>
    <Modal
    v-model="showEdit"
    title="新增/修改会员"
    :width="400"
    @on-ok="ok"
    @on-cancel="cancel">
    <Form :model="pubForm" label-position="right" :label-width="100" :rules="inforValidate">
     <FormItem label="帐号名称"  label-position="right" :label-width="100">
        <Input v-model="pubForm.Account" placeholder="帐号名称"></Input>
    </FormItem>
    <FormItem label="真实姓名"  label-position="right" :label-width="100">
        <Input v-model="pubForm.RealName" placeholder="真实姓名"></Input>
    </FormItem>
    <FormItem label="昵称"  label-position="right" :label-width="100">
        <Input v-model="pubForm.NickName" placeholder="昵称"></Input>
    </FormItem>
    <FormItem label="密码"  label-position="right" :label-width="100">
        <Input v-model="pubForm.Password" placeholder="密码"></Input>
    </FormItem>
    <FormItem label="电话"  label-position="right" :label-width="100" prop="Mobile">
        <Input v-model="pubForm.Mobile" placeholder="电话"></Input>
    </FormItem>
    <FormItem label="分配给" >
        <Select v-model="pubForm.DistributorId" filterable @on-change="changeName" clearable>
            <Option v-for="item in userList" :value="item.userId" :key="item.userId">{{ item.realName }}</Option>
        </Select> 
    </FormItem>
    <FormItem label="权限组"  label-position="right" :label-width="100">
        <selectRoleComponent :role="pubForm.RoleId" @on-change="selectRoleChange"></selectRoleComponent>
    </FormItem>
    <FormItem label="是否启用"> 
        <RadioGroup v-model="pubForm.Enabled">
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

    import selectRoleComponent from '@/views/toolbar-components/selectRole-component';

    export default {
      name: 'addMemberrManageComponent',
      components: {
        selectRoleComponent

    },
    props: {
     param: Object

 },
 data () {
    const validePhone = (rule, value, callback) => {
        var re = /^1[0-9]{10}$/;
        if (!re.test(value)) {
            callback(new Error('请输入正确格式的手机号'));
        } else {
            callback();
        }
    };
    return {
        form: {
            $key: '',
            isLoad: 'true',
            $pageRecord: 15,
            $rowIndex : 1,
            $roleId : '8,9,13',
            strMethod: 'QueryDeliveryUserList'
        },
        pubForm: {
           Account: '',
           RealName: '',
           NickName: '',
           Password: '',
           Mobile: '',
           RoleId: 1,
           DistributorId: '',
           Enabled: '0'
       },
       showEdit: false,
       type: 0,
       userList: [],
       inforValidate: {
        Mobile: [
        { required: true, message: '请输入手机号码' },
        { validator: validePhone }
        ]
    },
};
},
methods: {
    changeName () {

    },
    selectRoleChange(data) {
        this.pubForm.RoleId = data
    },
    handleReset (name) {
      for(var key in this.pubForm){
         if(typeof(this.pubForm[key]) == 'boolean'){
            this.pubForm[key] = '0';
        } else if(typeof(this.pubForm[key]) == 'number'){
            this.pubForm[key] = 1 ;
        } else if(typeof(this.pubForm[key]) == 'string') {
            this.pubForm[key] = '';
        }
    }
    this.pubForm.DistributorId = ''
    this.pubForm.Password = ''
    this.pubForm.Enabled = '0'
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
this.pubForm.Password = ''

setTimeout(() => {
    if(this.pubForm.DistributorId) {
        this.pubForm.DistributorId= this.pubForm.DistributorId
    } else {
        this.pubForm.DistributorId= ''
    }
   
}, 200);
},
showModal(type) {
    this.type = type
    if(type == 0){
        this.handleReset()
    } else {
        this.loadForm()
    }
    this.loadUser()
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
        Account: _this.pubForm.Account,
        RealName: _this.pubForm.RealName,
        NickName: _this.pubForm.NickName,
        Password: _this.pubForm.Password,
        Mobile: _this.pubForm.Mobile,
        RoleId: _this.pubForm.RoleId,
        Enabled: _this.pubForm.Enabled,
        CreateDate: Util.nowTime().formatnowdate
    }
    if(_this.pubForm.DistributorId != '') {
        par = Object.assign(par , {'DistributorId' : _this.pubForm.DistributorId})
    } else {
        par = Object.assign(putData , {'DistributorId' : 0})
    }
//     for(var key in par){
//         if(par[key] === ''){
//          _this.$Message.error('必须填满信息')
//          return
//      }
//  }
 
 Util.getAjaxData(par , undefined , '5fac259a-ca06-4a8b-9554-bd67e20f1697').then((data)=> {
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
    var par = undefined
    var putData = {
        Id: _this.param.Id,
        rowState : 'M',
        Account: _this.pubForm.Account,
        RealName: _this.pubForm.RealName,
        NickName: _this.pubForm.NickName,
        Mobile: _this.pubForm.Mobile,
        RoleId: _this.pubForm.RoleId,
        Enabled: _this.pubForm.Enabled,
        ModifyDate: Util.nowTime().formatnowdate
    }
    if(_this.pubForm.Password != ''){
        putData = Object.assign({Password: _this.pubForm.Password} , putData)
    }
    if(_this.pubForm.DistributorId != '') {
     par = Object.assign(putData , {'DistributorId' : _this.pubForm.DistributorId})
 } else {
     par = Object.assign(putData , {'DistributorId' : 0})
 }
    for(var key in putData){
        if(putData[key] === ''){
         _this.$Message.error('必须填满信息')
         return
     }
 }
 
 Util.getAjaxData(putData , undefined , '5fac259a-ca06-4a8b-9554-bd67e20f1697').then((data)=> {
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
},
loadUser () {
    var _this = this;
    var par = this.form;
    par.$pageRecord = 1000;
    Util.getDataGrid(par, undefined , undefined , this).then((res)=>{
        _this.userList = res.dgData
    })
}
},
created () {
        // 可在此从服务端获取表格数据
    }
};
</script>
