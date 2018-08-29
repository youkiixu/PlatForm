<style lang="less">
	@import '../../styles/common.less';
	@import './components/table.less';
	

</style>

<template>
	<div>
		<Row >
			<Col span="24">
				<Card>
					<Row v-if="pageType">
						<Steps :current="stepStatus" size="small">
							<Step v-for="item in Status" :title="item.Title"></Step>
						</Steps>
					</Row>
					<Row v-if="buttonGroup.length != 0"  class="margin-top-10">
						<span style="margin: 0 10px;" v-for="item in buttonGroup">
							<Button :type="item.strValue" :icon="item.strImg" @click='buttonEvent(item.strEventMethod)'>{{item.strText}}</Button>
						</span>
					</Row>
					<div  class="margin-top-10">
						<header-form ref="headerForm" :pageType="pageType"></header-form>
					</div>
				</Card>
			</Col>
			
		</Row>
		
		<Row class="margin-top-10">
			<Col span="24">
				<Card>
					<p slot="title">
						单品信息
					</p>
					<div>
						<can-edit-table 
						ref="table" 
						v-model="editIncellData" 
						:editIncell="false" 
						:columns-list="editIncellColumns"
						:pageType = "pageType"
						@on-change="handleChange"
						@on-delete="handleDel"
						></can-edit-table>
					</div>
				</Card>
			</Col>
		</Row>
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>
<!-- 物流订单下单 -->
<!-- this.$refs.table -->
<script>
	import Util from '@/libs/util'
	import Api from '@/libs/api'
	import canEditTable from './components/canEditTable.vue';
	import headerForm from './components/header-form.vue'
	import tableData from './components/table_data.js';
	import Cookies from 'js-cookie';
	

	export default {
		name: 'placeTheOrder',
		components: {
			canEditTable,
			headerForm
		},
		props: {

		},
		data () {
			return {
				editIncellColumns: tableData.editIncellColumns,
				editIncellData: [],
				buttonGroup: [],
				spinShow: false,
				stepStatus: 0,
				Status: [],
				pageType: false
			};
		},
		methods: {
			buttonEvent(e) {
                // 后端定义的按钮，需要在这里注册
                if(e == 'newForm'){
                	this.newForm()
                }
                if(e == 'saveForm'){
                	this.saveForm()
                }
                if(e == 'addRow'){
                	this.addRow()
                }
                if(e == 'modifyForm') {
                	this.modifyForm()
                }
                if(e == 'cancelOrder') {
                	this.cancelOrder()
                }
            },
            init() {
            	var _this = this;
            	var routerData = this.$route.params

            	if(routerData.type == 0) {
            		// pageType 为false时，可以修改
            		this.pageType = false
            		this.newForm()
            	} else if(routerData.type == 1){
            		// pageType 为true时，不可以修改
            		this.newForm()
            		this.pageType = true
            		// LogisticsNo物流单号
            		this.getData(routerData.LogisticsNo)
            	}
            	


            	
            },
            getData(LogisticsId) {
            	var _this = this;
            	var LogisticsNo = LogisticsId
            	// 打开加载中
            	_this.spinShow = true
            	Api.QueryOrderList(LogisticsNo , _this).then((res)=>{
            		var data = res.dgData
            		return Promise.resolve(data)
            	}).then((data) => {
            		var mainOrder = data[0]
            		if(mainOrder == undefined) {
            			return
            		}
            		Api.QueryOrderItemsList(mainOrder.LogisticsNo , _this).then((res) => {
            			var childOrder = res
            			// 表头的数据
            			var HF = this.$refs.headerForm.formValidate
            			// 读取物流状态列表
            			_this.GetLogisticsStatusList().then((res)=>{
            				_this.Status = res
            				_this.editIncellData = [];
            				var len = childOrder.length;

            				_this.editIncellData = childOrder
            				_this.Status.map((item,index)=>{
            					if(item.Title === mainOrder.stStatus){
            						_this.stepStatus = index
            					}
            				})
			            	// 子订单的数量
			            	HF.Goods_Qty = len


			            	_this.$refs.headerForm.setData(mainOrder)
			            	// 关闭加载中
			            	_this.spinShow = false
			            })


            		})
            	})

            },
            addRow() {
            	var HF = this.$refs.headerForm.formValidate
            	if(this.pageType) {
            		this.$Notice.warning({
            			title: '增行失败',
            			desc: '当前订单状态不能新增一行'
            		})
            		return
            	}
            	if(HF.ContactAddress.length == 0){
            		this.$Notice.error({
            			title: '增行失败',
            			desc: '请先完善寄件人/收件人地址'
            		})
            		return
            	}

            	this.editIncellData.push({
            		LogisticsNo_Key: '',
            		Weight: '',
            		Price: '',
            		Prescription: ''
            	})
            },
            saveForm() {
            	var userInfo = JSON.parse(Cookies.get('userInfo'));
            	var _this = this;
            	var tableData = this.$refs.table.thisTableData;
            	if(this.pageType){
            		_this.$Notice.warning({
            			title: '提交失败',
            			desc: '当前表单状态不能提交保存'
            		})
            		return
            	}
            	if(this.$refs.headerForm.handleSubmit('formValidate')){
            		return
            	}



            	var HF = this.$refs.headerForm.formValidate
            	var receiveAddress = '';
            	HF.ReceiveAddress.map((item , index) => {
            		receiveAddress+=item + '/'
            	})
            	receiveAddress = receiveAddress + HF.ReceiveAddressDetail

            	var contactAddress = '';
            	HF.ContactAddress.map((item) => {
            		contactAddress += item + '/'
            	})
            	contactAddress = contactAddress + HF.ContactAddressDetail

            	var DistributionName = ''
            	HF.DistributionName.map((item) => {
            		if(item.Id == HF.DistributionId){
            			DistributionName = item.RealName
            		}
            	})

            	var newTableData = _this.filterTableData(tableData)

            	var par = {

            		UserId: userInfo.userId,
            		AdminId: userInfo.RoleId,

            		Goods_Qty: HF.Goods_Qty - 0,

            		ContactName: HF.ContactName,
            		ContactTelePhone: HF.ContactTelePhone,
            		ContactAddress: contactAddress,
            		ReceiveName: HF.ReceiveName,
            		ReceiveTelePhone:  HF.ReceiveTelePhone,
            		ReceiveAddress: receiveAddress,
            		Freight: HF.Freight,
            		CollectionMoney: HF.CollectionMoney - 0,
            		NeedingAttention: HF.NeedingAttention,
            		ObjectWeight: HF.ObjectWeight - 0,
            		OrderSumPrice: HF.OrderSumPrice - 0,
            		DistributionId: HF.DistributionId,
            		DistributionName: DistributionName,
            		Prescription: HF.Prescription,
            		Price: HF.Price,
            		ThirdPlatformOrderNo: HF.ThirdPlatformOrderNo ? HF.ThirdPlatformOrderNo - 0 : 0,
            		LogisticsOrder_List: newTableData.newTable
            	}
            	// 如果这个人有ID，添加ID
            	if(HF.ContactId != '' && HF.ContactId) {
            		par = Object.assign(par , {ContactId : HF.ContactId})
            	}
            	if(HF.ReceiveId != '' && HF.ReceiveId) {
            		par = Object.assign(par , {ReceiveId: HF.ReceiveId})
            	}

				// cancel取消订单
				if(HF.LogisticsNo != ''){
					par = Object.assign(par , {type: 'modify'})
					par = Object.assign(par,{LogisticsId : HF.LogisticsNo})
				} else {
					// 如果表单是新增的
					par = Object.assign(par , {type: 'add'})
					par.LogisticsOrder_List = newTableData.newTableInsert
				}
				_this.spinShow = true
				Util.getAjaxData(par , undefined , 'F5E180E1-0A54-4E44-AB56-231315E1B193').then((res) => {
					_this.spinShow = false
					if(res.map.result == 'ok'){
						_this.$Notice.success({
							title: '物流总单保存成功',
							desc: res.map.msg
						})
						if(HF.LogisticsNo != '') {
							
							_this.getData(HF.LogisticsNo)
						}
						_this.pageType = true
					} else {
						_this.$Notice.error({
							title: '物流总单保存失败',
							desc: res.map.errMsg
						})
					}
				})

			},
			filterTableData(oldTable) {
				var table = {
					newTable : [], //新的
					newTableInsert : [] // 追加的
				}
				// 修改
				oldTable.map((item) => {
					if(item.LogisticsNo_Key == ''){
						table.newTableInsert.push({
							Price: item.Price,
							Weight: item.Weight,
							ListPrescription: item.Prescription
						})
					} else {

						table.newTable.push({
							LogisticsNo_Key: item.LogisticsNo_Key,
							Price: item.Price,
							Weight: item.Weight,
							ListPrescription: item.Prescription
						})
					}
				})

				this.newTableInsert(table.newTableInsert)

				return table;

			},
			newTableInsert(newTable) {
				// 追加子单
				var _this = this;
				var userInfo = JSON.parse(Cookies.get('userInfo'));
				var HF = this.$refs.headerForm.formValidate
				if(HF.LogisticsNo == '' || newTable.length == 0){
					// 如果总单没有物流单号，说明不是追加，是新增总单
					return
				}

				var par = {
					type: 'add',
					AdminId: userInfo.RoleId,
					LogisticsId: HF.LogisticsNo,
					LogisticsOrder_List : newTable
				}
				Util.getAjaxData(par , undefined , 'F5E180E1-0A54-4E44-AB56-231315E1B193').then((res) => {
					_this.spinShow = false
					if(res.map.result == 'ok'){
						_this.$Notice.success({
							title: '追加子单成功',
							desc: res.map.msg
						})
						_this.pageType = true
					} else {
						_this.$Notice.error({
							title: '追加子单失败',
							desc: res.map.errMsg
						})
					}
				})

			},
			handleChange(val, index) {
				this.tableBtnEvent()
			},
			handleDel(val, index) {
				this.tableBtnEvent()
			},
			tableBtnEvent() {
				// 保存删除按钮的统一时间
				var quantity = 0;
				var Weight = 0;
				var Price = 0;
				var tableData = this.$refs.table.thisTableData;

				var len = tableData.length;
				var HF = this.$refs.headerForm

				tableData.map((item) => {
					Weight = Weight + (item.Weight - 0)
					Price = Price + (item.Price - 0)
				})
				// HF.formValidate.
				HF.formValidate.ObjectWeight = Weight ? Weight + '' : ''
				HF.formValidate.Goods_Qty = len ? len + '' : ''

				HF.computerFreight(Weight)
				// HF.formValidate.Freight = Freight ? Freight + '' : ''
			},
			newForm() {
				var _this = this;
				
				_this.pageType = false
				_this.$refs.headerForm.handleReset('formValidate')
				_this.editIncellData = []

				
				

			},
			getFormData() {
				return this.$refs.headerForm.formValidate
			},
			modifyForm() {
				this.pageType = !this.pageType
			},
			GetLogisticsStatusList() {
				var _this = this;
				return Util.getAjaxData({},'GetLogisticsStatusList' , undefined).then((res) => {
					return Promise.resolve(res);
				})
			},
			cancelOrder() {
				var _this = this;
				var userInfo = JSON.parse(Cookies.get('userInfo'));
				var HF = this.$refs.headerForm.formValidate
				if(HF.LogisticsNo == ''){
					// 如果总单没有物流单号，不能取消
					_this.$Notice.error({
						title: '取消失败',
						desc: '不能取消新订单或空订单'
					})
					return
				}


				this.$Modal.confirm({
					title: '确定删除？',
					content: `是否确认取消物流号为: ${HF.LogisticsNo} 的这张订单?`,
					onOk: function() {
						var par = {
							type: 'cancel',
							AdminId: userInfo.RoleId,
							LogisticsId: HF.LogisticsNo
						}
						_this.spinShow = true
						Util.getAjaxData(par , undefined , 'F5E180E1-0A54-4E44-AB56-231315E1B193').then((res) => {
							_this.spinShow = false
							if(res.map.result == 'ok'){
								_this.$Notice.success({
									title: '取消成功',
									desc: `取消成功物流号为: ${HF.LogisticsNo} 的订单`
								})
								_this.getData(HF.LogisticsNo)
							} else {
								_this.$Notice.error({
									title: '保存失败',
									desc: res.map.errMsg
								})
							}
						})
					}
				})



				
			}
		},
		mounted () {
			this.init();
			this.$refs.table.setMainComponent(this)
		},
		created () {
			

			Util.initButton(this)
			
		},
		watch :  {
			'$route' (to) {
				if(to.name == 'placeTheOrder'){
					this.init();
				}
				
			}
		},
		destroyed () {
			this.pageType = false
			this.newForm()
		}
	};
</script>
