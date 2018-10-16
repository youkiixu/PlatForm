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
			<FormItem label="提点类型"  label-position="right" :label-width="100">
				<Input v-model="pubForm.Type" placeholder="提点类型"></Input>
			</FormItem>
			<FormItem label="提点操作"  label-position="right" :label-width="100">
				<Input v-model="pubForm.Operation" placeholder="提点操作"></Input>
			</FormItem>
			<FormItem label="提点数"  label-position="right" :label-width="100">
				<InputNumber :min="0" v-model="pubForm.RemindNumber" style="width:100%"></InputNumber >
			</FormItem>
			<FormItem label="地区状态"  label-position="right" :label-width="100">
                <Select v-model="pubForm.AddressStatus" style="width:100%">
                    <Option value="本地">本地</Option>
                    <Option value="异地">异地</Option>
                    <Option value="各地">各地</Option>
                </Select>
			</FormItem>
			<FormItem label="比较符"  label-position="right" :label-width="100">
                <Select v-model="pubForm.Symbol" style="width:100%" clearable>
                    <Option v-for="item in SymbolGroup" :value="item.Text">{{item.Text}}</Option>
                </Select>
			</FormItem>
			<FormItem label="货款比价"  label-position="right" :label-width="100">
				<InputNumber :min="0" v-model="pubForm.PriceRatio" style="width:100%"></InputNumber >
			</FormItem>
			<FormItem label="货款比价提点"  label-position="right" :label-width="100">
				<InputNumber :min="0" v-model="pubForm.PriceRatioRemind" style="width:100%"></InputNumber >
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
		name: 'addRemindManagentComponent',
		props: {
			param: Object

		},
		data () {
			return {
				pubForm: {
					Type: '',
					Operation: '',
					RemindNumber: 0,
					AddressStatus: '本地',
					Symbol: '',
					PriceRatio: 0,
					PriceRatioRemind: 0,
					Enabled: '0'
				},
				SymbolGroup: [{
					Text: '小于',
					value: '<'
				},{
					Text: '小于等于',
					value: '<='
				},{
					Text: '等于',
					value: '='
				},{
					Text: '大于等于',
					value: '>='
				},{
					Text: '大于',
					value: '>'
				}],
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
                    var userInfo = JSON.parse(Cookies.get('userInfo'));
                	var SymbolGroup = _this.SymbolGroup;
                	var SymbolItem = {}
                	SymbolGroup.map((item)=> {
                		if(item.Text == _this.pubForm.Symbol){
                			SymbolItem = item
                		}
                	})

                	var par = {
                		Type: _this.pubForm.Type,
                		Operation: _this.pubForm.Operation,
                		RemindNumber: _this.pubForm.RemindNumber,
                		AddressStatus: _this.pubForm.AddressStatus,
                		Symbol: SymbolItem.value,
                		PriceRatio: _this.pubForm.PriceRatio,
                        PriceRatioRemind:  _this.pubForm.PriceRatioRemind, 
                        Enabled: _this.pubForm.Enabled,
                        CreateDate: Util.nowTime().formatnowdate,
                        CreateId: userInfo.userId
                    }
                    Util.getAjaxData(par , undefined , 'DE7E8A2A-DE01-4134-ABCE-97CBC4AA4E22').then((data) => {
                    	if (data.errMsg || data.result != 'ok') {
                    		_this.$Message.error(data.errMsg);
                    		return false;
                    	}
                    	_this.$Message.success('设置成功！');
                    	_this.$emit('onSuccess' , '')
                    })

                },
                modifyRow() {
                	var _this = this;
                    var userInfo = JSON.parse(Cookies.get('userInfo'));
                	var SymbolGroup = _this.SymbolGroup;
                	var SymbolItem = {}
                	SymbolGroup.map((item)=> {
                		if(item.Text == _this.pubForm.Symbol){
                			SymbolItem = item
                		}
                	})
                	var par = {
                		Id: _this.param.Id,
                		rowState: 'M',
                		Type: _this.pubForm.Type,
                		Operation: _this.pubForm.Operation,
                		RemindNumber: _this.pubForm.RemindNumber,
                		AddressStatus: _this.pubForm.AddressStatus,
                		Symbol: SymbolItem.value,
                		PriceRatio: _this.pubForm.PriceRatio,
                        PriceRatioRemind:  _this.pubForm.PriceRatioRemind, 
                        Enabled: _this.pubForm.Enabled,
                        ModifyDate: Util.nowTime().formatnowdate,
                        ModifyId: userInfo.userId
                    }

                    Util.getAjaxData(par , undefined , 'DE7E8A2A-DE01-4134-ABCE-97CBC4AA4E22').then((data) => {
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
