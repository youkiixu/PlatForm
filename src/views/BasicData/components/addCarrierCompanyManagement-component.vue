<style lang="less">
	@import '../../../styles/common.less';

</style>

<template>
	<Modal
	v-model="showEdit"
	title="新增/修改快递公司"
	:width="400"
	@on-ok="ok"
	@on-cancel="cancel">
	<Form :model="pubForm" label-position="right" :label-width="100" >
			<FormItem label="承运公司名称"  label-position="right" :label-width="100">
				<Input v-model="pubForm.CarrierCompanyName" placeholder="承运公司名称"></Input>
			</FormItem>
			<FormItem label="承运公司简称"  label-position="right" :label-width="100">
				<Input v-model="pubForm.CarrierCompayCode" placeholder="承运公司简称"></Input>
			</FormItem>
			<FormItem label="图片"  label-position="right" :label-width="100">
				<imageUploadComponent ref="imageUpload"></imageUploadComponent>
			</FormItem>
            <FormItem label="联系电话"  label-position="right" :label-width="100">
                <Input v-model="pubForm.TelePhone" placeholder="联系电话"></Input>
            </FormItem> 
            <FormItem label="副联系电话"  label-position="right" :label-width="100">
                <Input v-model="pubForm.TelePhones" placeholder="副联系电话"></Input>
            </FormItem>
            <FormItem label="座机号码"  label-position="right" :label-width="100">
                <Input v-model="pubForm.Landline" placeholder="座机号码"></Input>
            </FormItem>
            <FormItem label="副座机号码"  label-position="right" :label-width="100">
                <Input v-model="pubForm.Landlines" placeholder="副座机号码"></Input>
            </FormItem>
			<FormItem label="是否启用"> 
				<RadioGroup v-model="pubForm.IsEnable">
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
	import imageUploadComponent from '@/views/toolbar-components/imageUpload-component'

	export default {
		name: 'addCarrierCompanyManagement',
		components: {
			imageUploadComponent
		},
		props: {
			param: Object

		},
		data () {
			return {
				pubForm: {
    					CarrierCompanyName: '',
    					CarrierCompayCode: '',
    					TelePhone: '',
    					TelePhones: '',
    					Landline: '',
    					Landlines: '',
    					NotDistribution: '',
    					IsEnable: '0'
    				},
    				showEdit: false,
                    type: 0 //0是新增，1是修改
                };
            },
            methods: {
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
            		this.pubForm.IsEnable = '0'
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
            		this.$refs.imageUpload.loadImage('http://yj.kiy.cn/' + row.LogoPath)
            	},
            	showModal(type) {
                    // type为0是新增，type为1是修改
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
                		CarrierCompanyName: _this.pubForm.CarrierCompanyName,
                		CarrierCompayCode: _this.pubForm.CarrierCompayCode,
                		TelePhone: _this.pubForm.TelePhone,
                		TelePhones: _this.pubForm.TelePhones,
                		Landline: _this.pubForm.Landline,
                		Landlines: _this.pubForm.Landlines,
                		Path: '/Images/CompanyLogo/',
                		IsEnable: _this.pubForm.IsEnable,
                		CreateDate: Util.nowTime().formatnowdate
                	}
                	if(Util.deVoid(par)) {
                		_this.$Message.error('请补全信息');
                		return
                	}

                	par = Object.assign(par, {NotDistribution: []})

                	this.$refs.imageUpload.saveImage(par).then((res)=> {
                		par = Object.assign(par,{LogoPath:res.ImgPath})
                		Util.getAjaxData(par , undefined , '85d0f776-873d-4b91-ac83-526b9bd35035').then((data)=>{
                			if (data.errMsg || data.result != 'ok') {
                                _this.$Message.error(data.errMsg);
                                return false;
                            }
                            _this.$Message.success('修改成功！');
                            _this.$emit('onSuccess' , '')
                		})
                	})


                },
                modifyRow() {
                	var _this = this;
                	
                    var putData = {
                            Id: _this.param.Id,
                            rowState : 'M',
                            strKey: _this.pubForm.strKey,
                            Title: _this.pubForm.Title,
                            Formula: _this.pubForm.Formula,
                            Enabled: _this.pubForm.Enabled,
                            CreateDate: Util.nowTime().formatnowdate
                        }
                        Util.getAjaxData(putData , undefined , '52f9b039-1003-41e8-a4b3-46b35a4dc267').then((data)=> {
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
