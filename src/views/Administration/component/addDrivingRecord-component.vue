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
            <FormItem label="签到日期"  label-position="right" :label-width="100">
                <DatePicker type="datetime" placeholder="选择签到日期" style="width: 200px"></DatePicker>
            </FormItem>
			<FormItem label="签 到 人"  label-position="right" :label-width="100">
				<Input v-model="pubForm.account" placeholder="签 到 人"></Input>
			</FormItem>
            <FormItem label="公 里 数"  label-position="right" :label-width="100">
                <Input v-model="pubForm.kilometres" placeholder="公 里 数"></Input>
            </FormItem>
			<FormItem label="图片"  label-position="right" :label-width="100">
				<imageUploadComponent ref="imageUpload" @on-change="imageUploadChange"></imageUploadComponent>
			</FormItem>
			<FormItem label="签到/签退"> 
				<RadioGroup v-model="pubForm.RemNote">
					<Radio label="签到">签到</Radio>
					<Radio label="签退">签退</Radio>
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
		data () {
			return {
				pubForm: {
                        account: '',
                        kilometres: '',
                        imgsUrl: '',
                        RemNote: ''
    				},
    				showEdit: false,
                    type: 0 //0是新增，1是修改
                };
            },
            methods: {
                imageUploadChange(res) {
                    this.pubForm.imgsUrl = res
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
            		this.pubForm.IsEnable = '0'
            	},
            	showModal(type) {
                    // type为0是新增，type为1是修改
                    	this.handleReset()
                    this.showEdit = true
                },
                ok () {
                		this.addRow()
                },
                addRow() {
                	var _this = this;
                    var userInfo = JSON.parse(Cookies.get('userInfo'));
                    
                    var par = {
                        $Name: this.pubForm.account
                    }
                    Util.getAjaxData(par , 'GetManagementList' ,undefined).then((res) => {
                        if(res.length != 0){
                            return Promise.resolve(res[0])
                        } else {
                            return false
                        }
                    }).then((res)=>{
                        var par = {
                            startTime: Util.nowTime().formatnowdate + ' ' + Util.nowTime().forTime,
                            bShow: 1,
                            kilometres: _this.pubForm.kilometres,
                            imgsUrl: _this.pubForm.imgsUrl,
                            Path: '/UploadPhoto/'+ Util.nowTime().formatnowdate +'/',
                            AuditingState: 1,
                            ReplaceId: userInfo.userId,
                            AuditingUID: userInfo.userId,
                            AuditingTime: Util.nowTime().formatnowdate + ' ' + Util.nowTime().forTime,
                            CreateBy: userInfo.userId,
                            CreateDate: Util.nowTime().formatnowdate + ' ' + Util.nowTime().forTime,
                            RemNote: _this.pubForm.RemNote,
                            userId: res.Id
                        }
                        var obj;
                        if(_this.pubForm.RemNote == '签到'){
                            obj = {
                                '$userId': res.Id,
                                '$drStartTime': Util.nowTime().formatnowdate
                            }
                        } else {
                            obj = {
                                '$userId': res.Id,
                                '$drEndTime': Util.nowTime().formatnowdate
                            }
                        }
                        return Util.getAjaxData(obj , 'GetDriving_record' , undefined).then((data) => {
                            if(data.length >0){
                                _this.$Message.error('已经有'+_this.pubForm.RemNote);
                                return
                            }else {
                                return Promise.resolve(par)
                            }
                        })



                    }).then((par)=>{
                        this.$refs.imageUpload.saveImage(par).then((data)=> {
                            par.imgsUrl = '~'+data.ImgPath
                            Util.getAjaxData(par , undefined , '644440a2-2805-496b-be41-45ec31e9870d').then((data)=>{
                                if (data.errMsg || data.result != 'ok') {
                                    _this.$Message.error(data.errMsg);
                                    return false;
                                }
                                _this.$Message.success('代签成功!');
                                _this.$emit('onSuccess' , '')
                            })
                        })

                    })



                },
                modifyRow() {
                	var _this = this;
                	
                    // var putData = {
                    //         Id: _this.param.Id,
                    //         rowState : 'M',
                    //         strKey: _this.pubForm.strKey,
                    //         Title: _this.pubForm.Title,
                    //         Formula: _this.pubForm.Formula,
                    //         Enabled: _this.pubForm.Enabled,
                    //         CreateDate: Util.nowTime().formatnowdate
                    //     }
                    //     console.log(putData)
                    //     Util.getAjaxData(putData , undefined , '52f9b039-1003-41e8-a4b3-46b35a4dc267').then((data)=> {
                    //         if (data.errMsg || data.result != 'ok') {
                    //             _this.$Message.error(data.errMsg);
                    //             return false;
                    //         }
                    //         _this.$Message.success('修改成功！');
                    //         _this.$emit('onSuccess' , '')
                    //     })

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
