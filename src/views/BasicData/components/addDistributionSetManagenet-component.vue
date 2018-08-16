
<style lang="less">
	@import '../../../styles/common.less';

</style>

<template>
	<Modal
	v-model="showEdit" 
	title="新增/修改"
	:width="400"
	@on-ok="ok"
	@on-cancel="cancel">
	<Form :model="pubForm" label-position="right" :label-width="100" >
		<FormItem label="起点">
			<selectWarhoursPointComponent :selectPointItem="startPoint.Text" @on-change="selectStartPointChange"></selectWarhoursPointComponent>
		</FormItem>	
		<FormItem label="终点" label-position="right" :label-width="100"> 
			<getAreaComponent  ref="mudidi"></getAreaComponent>
		</FormItem>
		<FormItem label="分配"  label-position="right" :label-width="100">
			<CheckboxGroup v-model="AllocationLi" @on-change="allocationLiChange">
				<Checkbox label="Backhaul">回程</Checkbox>
				<Checkbox label="Transfer">中转</Checkbox>
				<Checkbox label="Delivery">配送</Checkbox>
				<Checkbox label="Logistics">物流</Checkbox>
			</CheckboxGroup>
		</FormItem>
		<FormItem label="回程终点" v-show="showBackPonit" label-position="right" :label-width="100"> 
			<selectWarhoursPointComponent :selectPointItem="backPonit.Text" @on-change="selectBackPointChange"></selectWarhoursPointComponent>
		</FormItem>
		<FormItem label="是否默认"> 
			<RadioGroup v-model="pubForm.IsDefault">
				<Radio label="0">否</Radio>
				<Radio label="1">是</Radio>
			</RadioGroup>
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
	import Util from '@/libs/util';
	import Cookies from 'js-cookie';

	import selectWarhoursPointComponent from '@/views/toolbar-components/selectWarhoursPoint-component'
	import getAreaComponent from '@/views/toolbar-components/multiple-getArea-component'



	export default {
		name: 'addDistributionSetManagenetComponent',
		components: {
			selectWarhoursPointComponent,
			getAreaComponent
		},
		props: {
			param: Object

		},
		data () {
			return {
				pubForm: {
					Backhaul: '0',
					Transfer: '0',
					Delivery: '0',
					Logistics: '0',
					IsDefault: '0',
					Enabled: '0',
				},

				startPoint: {
					Text: '',
					Id: ''
				},
				backPonit: {
					Text: '',
					Id: ''	
				},
				AllocationLi: [],
				index: 1,
				showEdit: false,
				type: 0,
				showBackPonit: false
			};
		},
		methods: {
			handleReset (name) {
				this.startPoint = {
					Text: '',
					Id: ''
				}
				this.backPonit = {
					Text: '',
					Id: ''	
				}
				this.pubForm = {
					Backhaul: '0',
					Transfer: '0',
					Delivery: '0',
					Logistics: '0',
					IsDefault: '0',
					Enabled: '0',
				},
				this.AllocationLi = []
			},
			loadForm() {
				var row = this.param
				this.$refs.mudidi.setData(row.EndPoint)
				if(row.Backhaul){
					this.AllocationLi.push('Backhaul')
					this.pubForm.Backhaul = '1'
					this.showBackPonit = true
				}
				if(row.Transfer){
					this.AllocationLi.push('Transfer')
					this.pubForm.Transfer = '1'
				}
				if(row.Delivery){
					this.AllocationLi.push('Delivery')
					this.pubForm.Delivery = '1'
				}
				if(row.Logistics) {
					this.AllocationLi.push('Logistics')	
					this.pubForm.Logistics = '1'
				}
				if(row.IsDefault) {
					this.pubForm.IsDefault = '1'
				}
				if(row.Enabled) {
					this.pubForm.Enabled = '1'
				}

				this.startPoint = {
					Text: row.StartPoint,
					Id: row.StartPointId,
					IsManufactor: row.IsManufactor
				}
				if(row.BackWarhours) {
					this.backPonit = {
						Text: row.BackWarhours,
						Id: row.BackhaulId
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
                		this.multipleAddRow()
                	}
                	if(this.type == 1) {
                		this.modifyRow()
                	}
                	this.showEdit = false
				},
				multipleAddRow() {
					var mudidi = this.$refs.mudidi.getData();
					mudidi.map(item => {
						this.addRow(item)
					})
				},
                addRow(listItem) {
                	var _this = this;
                	var userInfo = JSON.parse(Cookies.get('userInfo'));
                	this.AllocationLi.map((item) => {
                		for(var key in this.pubForm){
                			if(item === key){
                				this.pubForm[key] = '1'
                			}
                		}
					})
                	var par = {
                		'StartPoint' : this.startPoint.Text,
                		'StartPointId': this.startPoint.Id,
                		'EndPoint': listItem.label,
                		'EndPointId': listItem.value,
                		'Backhaul': this.pubForm.Backhaul,
                		'Transfer': this.pubForm.Transfer,
                		'Delivery': this.pubForm.Delivery,
                		'Logistics': this.pubForm.Logistics,
                		'IsManufactor': this.startPoint.IsManufactor,
                		'IsDefault': this.pubForm.IsDefault,
                		'Enabled': this.pubForm.Enabled,
                		'CreateDate': Util.nowTime().formatnowdate,
                		'CreateId': userInfo.userId
                	}
                	if(this.pubForm.Backhaul == '1' && this.backPonit != undefined){
						par = Object.assign(par , {'WarhoursId': this.backPonit.Id})
                		this.queryBackWarhours(undefined , this.startPoint.Id , this.backPonit.Id , this.startPoint.IsManufactor).then((res)=>{
                			if(res){
                				par = Object.assign(par , {'BackhaulId': res.Id})
								_this.addSave(par)
                			} else {
								_this.addSave(par)
							}
                		})
                	} else {
						_this.addSave(par)
					}
                },
				addSave (par) {
					var _this = this;
					if(Util.deVoid(par)) {
                		_this.$Message.error('不能为空') 
                		return;
                	}
					Util.getAjaxData(par , undefined , '339889E5-4D62-4738-B93E-843841BA1B78').then((data) => {
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
                	var mudidi = this.$refs.mudidi.getData()
                	this.AllocationLi.map((item) => {
                		for(var key in this.pubForm){
                			if(item === key){
                				this.pubForm[key] = '1'
                			}
                		}
					})
                	var par = {
                		'Id': this.param.Id,
                		'rowState': 'M',
                		'StartPoint' : this.startPoint.Text,
                		'StartPointId': this.startPoint.Id,
                		'EndPoint': mudidi[0].label,
                		'EndPointId': mudidi[0].value,
                		'Backhaul': this.pubForm.Backhaul,
                		'Transfer': this.pubForm.Transfer,
                		'Delivery': this.pubForm.Delivery,
                		'Logistics': this.pubForm.Logistics,
                		
                		'IsManufactor': this.startPoint.IsManufactor,
                		'IsDefault': this.pubForm.IsDefault,
                		'Enabled': this.pubForm.Enabled,
                		'ModifyDate': Util.nowTime().formatnowdate,
                		'ModifyId': userInfo.userId
					}
                	if(this.pubForm.Backhaul == '1' && this.backPonit != undefined){
						par = Object.assign(par , {'WarhoursId': this.backPonit.Id})
                		this.queryBackWarhours(undefined , this.startPoint.Id , this.backPonit.Id , this.startPoint.IsManufactor).then((res)=>{
                			if(res){
                				par = Object.assign(par , {'BackhaulId': res.Id})
								_this.modifySave(par)
                			} else {
								_this.modifySave(par)
							}
                		})
                	} else {
						_this.modifySave(par)
					}
                },
				modifySave (par) {
					var _this =this;
					if(Util.deVoid(par)) {
                		_this.$Message.error('不能为空') 
                		return;
                	}

                	Util.getAjaxData(par , undefined , '339889E5-4D62-4738-B93E-843841BA1B78').then((data) => {
                		if (data.errMsg || data.result != 'ok') {
                			_this.$Message.error(data.errMsg);
                			return false;
                		}
                		_this.$Message.success('设置成功！');
                		_this.$emit('onSuccess' , '')
                	})
				},
                cancel () {
                	this.showEdit = false
                },
                selectStartPointChange(val) {
                	this.startPoint = val
                },
                selectBackPointChange(val) {
                	this.backPonit = val
                },
                allocationLiChange(data) {
                	this.showBackPonit = false
                	data.map((item)=>{
                		if(item == 'Backhaul'){
                			this.showBackPonit = true
                		}
                	})
                },
                queryBackWarhours(id, SId, EId, Is) {
                	var par = {
                		'isLoad' : true,
                		'$pageRecord': 30,
                		'strMethod': 'QueryBackWarhoursList'
                	}
                	if(id) {
                		par = Object.assign(par , {'$Id' : id})
                	}
                	if(SId) {
                		par = Object.assign(par , {'$StartPointId' : SId})
                	}
                	if (EId) {
                		par = Object.assign(par , {'$EndPointId' : EId})
                	}
                	if  (Is) {
                		par = Object.assign(par , {'$IsManufactor' : Is})	
                	}
                	return Util.getDataGrid(par , undefined , undefined , this).then((data) => {
                		if (data.errMsg || data.result != 'ok') {
                			alert('提交失败')
                		} else {
                			return Promise.resolve(data.dgData[0])
                		}

                		
                	})
                }
            },
            created () {
        // 可在此从服务端获取表格数据
    }
};
</script>
