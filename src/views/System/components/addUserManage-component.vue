<style lang="less">
	@import '../../../styles/common.less';

</style>

<template>
	<Modal
	v-model="showEdit"
	title="新增/修改用户"
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
    <FormItem label="密码"  label-position="right" :label-width="100">
        <Input v-model="pubForm.Password" placeholder="密码"></Input>
    </FormItem>
    <FormItem label="电话"  label-position="right" :label-width="100" prop="Mobile">
        <Input v-model="pubForm.Mobile" placeholder="电话"></Input>
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
      name: 'addUserManageComponent',
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
        pubForm: {
           Account: '',
           RealName: '',
           Password: '',
           Mobile: '',
           RoleId: 1,
           Enabled: '0'
       },
       showEdit: false,
       type: 0,
       inforValidate: {
        Mobile: [
        { required: true, message: '请输入手机号码' },
        { validator: validePhone }
        ]
    },
};
},
methods: {
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
},
showModal(type) {
                    // type为0是新增，type为1是修改
                    this.pubForm.Password = ''
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
                	var QueryAdminPar = {
                        "$key": _this.pubForm.Account
                    }
                    Util.getAjaxData(QueryAdminPar , 'QueryAdminList' , undefined).then((data)=> {
                        if(data.length >= 1){
                            _this.$Message.error('该电话号或姓名已经存在，无法再次添加!')
                            return
                        } else {
                            var par = {
                                Account: _this.pubForm.Account,
                                RealName: _this.pubForm.RealName,
                                Password: _this.pubForm.Password,
                                Mobile: _this.pubForm.Mobile,
                                RoleId: _this.pubForm.RoleId,
                                Enabled: _this.pubForm.Enabled,
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
                     }
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
                        Mobile: _this.pubForm.Mobile,
                        RoleId: _this.pubForm.RoleId,
                        Enabled: _this.pubForm.Enabled,
                        ModifyDate: Util.nowTime().formatnowdate
                    }
                    if(_this.pubForm.Mobile != ''){
                        putData = Object.assign({Password: _this.pubForm.Password} , putData)
                    }
                //     for(var key in putData){
                //         if(putData[key] === ''){
                //          _this.$Message.error('必须填满信息')
                //          return
                //      }
                //  }
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
