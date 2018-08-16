<style lang="less">
	@import '../../../styles/common.less';

</style>

<template>
	<Modal
	v-model="showEdit"
	title="新增/修改提点"
	:width="400"
	@on-ok="ok"
	@on-cancel="cancel">
	<Form :model="pubForm" label-position="right" :label-width="100" >
			<FormItem label="标识"  label-position="right" :label-width="100">
				<Input v-model="pubForm.strKey" placeholder="标识"></Input>
			</FormItem>
			<FormItem label="标题"  label-position="right" :label-width="100">
				<Input v-model="pubForm.Title" placeholder="标题"></Input>
			</FormItem>
            <FormItem label="提点操作"  label-position="right" :label-width="100">
                <Input v-model="pubForm.Formula" placeholder="公式"></Input>
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
	import toolMap from '@/libs/map'

	export default {
		name: 'addFormulaManagentComponent',
		props: {
			param: Object

		},
		data () {
			return {
				pubForm: {
    					strKey: '',
    					Title: '',
    					Formula: '',
    					Enabled: '0'
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
                        $Key : _this.pubForm.strKey
                    }

                    Util.getAjaxData(par , 'QueryFormulaManagentList' , undefined).then((data) => {
                         if (data.length > 0) {
                            _this.$Message.error(_this.pubForm.strKey + '已经存在不能再次添加');
                            return false;
                        }
                        var putData = {
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
