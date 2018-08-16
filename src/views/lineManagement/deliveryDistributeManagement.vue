<style lang="less">
	@import '../../styles/common.less';
</style>

<template>
	<div @keyup.enter="getData()">
        <Row>
            <Col style="width:500px; float: left;" >
        		<Card style="height:800px;"> 
        			<Row>
        				<span style="margin: 0 10px;">
        					关键词:<Input v-model="form.$key" placeholder="物流单/订单号/会员号" style="width: 150px" />
        				</span>
                        <span style="margin: 0 10px;"><Button type="primary" icon="search" @click="getData()">搜索</Button></span>
        			</Row>
                    <Row class="margin-top-10">
                        <areaIndex
                          ref="areaComponent"
                          @on-change="searchUser"
                          :readonly="true"
                          ></areaIndex>
                    </Row>
        		</Card> 
            </Col>
    		  <Col span="14" offset="1" >
                <Card>
                    <span style="margin: 0 10px;">
                        <Button   @click='otherDistribute()'>将当前业务员的区域分配给他人</Button>
                    </span>
                </Card>
                <Card class='margin-top-10' >
                    <initDataGridCompoent ref="dataGrid" :param="form" :showControl="showControl" @selectRow="selectRow" @dbClickRow="dbClickRow"></initDataGridCompoent>
                </Card>
              </Col>
        </Row>
		<Modal
		v-model="showForm"
		title="新增道路"
		:width="1500"
		:mask-closable = 'false'
		@on-cancel="cancel">
		<addDeliveryDistributeComponent 
        v-model="selectUser"
        ref='areaDistribute'
        saveUid="4b04d795-13d2-4b9a-b650-f6ce4e2d3117"
        selectedListMethod="DeliveryAddressByUser"
        selectedParam="$userId"
        queryRoadMethod="QueryDeliveryAddressMap"
        :transfer="true"
        @on-transfer-left="onTransferLeft"
        @on-transfer-right="onTransferRight"
        ></addDeliveryDistributeComponent>
        <div slot="footer">
            <Button size="large" @click="cancel">取消</Button>
            <Button type="primary" size="large" :loading="loading" @click="ok">保存</Button>
        </div>
    </Modal>
    <Modal
        v-model="showFormTwo"
        title="将当前业务员的区域分配给他人"
        :width="500"
        :mask-closable = 'true'>
        <Form ref="formCustom"  :label-width="80">
            
            <FormItem label="当前选中" >
                <Input v-model="oldName.realName" placeholder="当前选中" ></Input>
            </FormItem>
            <FormItem label="分配给" >
                <Select v-model="newName" filterable @on-change="changeName">
                    <Option v-for="item in userList" :value="item.userId" :key="item.userId">{{ item.realName }}</Option>
                </Select> 
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="primary" size="large" @click="saveForm">保存</Button>
        </div>
    </Modal>
</div>
</template>
<!-- 快递订单列表 -->
<script>
	import Util from '../../libs/util';
    import Cookies from 'js-cookie';
    // dataGrid组件
    import initDataGridCompoent from '../toolbar-components/initDataGrid-component';
    import addDeliveryDistributeComponent from '@/components/areaDistribute/areaDistribute-component'
    import areaIndex from '@/components/area-component/area-index'
    

    export default {
    	name: 'QueryOverTimeOrderView',
    	components: {
    		addDeliveryDistributeComponent,
    		initDataGridCompoent,
            areaIndex
    	},
    	data () {
    		return {
    			form: {
    				$key: '',
    				isLoad: 'true',
    				$pageRecord: 15,
    				$rowIndex : 1,
    				$roleId : '8,9,13',
    				strMethod: 'QueryDeliveryUserList'
    			},
    			showControl: false,
    			selectRowData: undefined,
    			showForm: false,
    			selectUser : 0,
                transferLeftData: [],
                loading: false,
                buttonGroup:[],
                userList : [],
                showFormTwo: false,
                newName: '',
                oldName: ''
    		};
    	},
    	methods: {
    		getData () {
    			for(var key in this.form) {
    				if(this.form[key] === ''){
    					this.form[key] = undefined;
    				}
    			}
    			this.form.$rowIndex = 1; 
    			this.$refs.dataGrid.initDataGrid()
    		},
    		selectRow(data) {
    			this.selectRowData = data
    		},
    		dbClickRow(data) {
    			this.showForm = true
                // 清空缓存在transferLeftData的数据
    			this.selectUser = data.userId
                this.areaDistributeGetList()
    		},
    		ok() {
                var _this = this;
    			
                var selectedList = _this.$refs.areaDistribute.selectedList
                var userInfo = JSON.parse(Cookies.get('userInfo'));
                var arr = []
                selectedList.map((item) => {
                    if(item.id == '' || item.id == null){
                        var pItem = {
                            wayId: item.strCode
                        }
                        arr.push(pItem)
                    }
                })
                _this.$refs.areaDistribute.transferLeftData.map((item)=>{
                    if(item.id != undefined ){
                        var pItem = {rowState: "D" , wayId: item.strCode , id: item.id}
                        arr.push(pItem)
                    }
                })

                if(arr.length == 0){
                    this.$Notice.error({
                        title: '操作失败',
                        desc: '没有变更操作'
                    });
                    return
                }

                var head = {
                  userId: this.selectUser,
                  createBy: userInfo.userId
                }
                // 加载动画
                _this.$refs.areaDistribute.spinShow = true
                _this.loading =true
                Util.tbSave( head , arr , '4b04d795-13d2-4b9a-b650-f6ce4e2d3117' , this).then((res) => {

                  _this.areaDistributeGetList()
                  // _this.showForm = false
                }).catch((res) => {
                    // 清空缓存在transferLeftData的数据
                    _this.areaDistributeGetList()
                  
                })
    		},
    		cancel() {
    			this.showForm = false
    		},
            onTransferLeft(data) {
                var _this = this;
                var arr = []
                data.map((item)=> {
                    if(!item.selected){
                        arr.push(item)
                    } else {
                        _this.transferLeftData.push(item)
                    }
                })
                _this.$refs.areaDistribute.selectedList = arr;

            },
            onTransferRight(data) {
                var _this =this;
                data.map((item)=> {
                    if(item.selected){
                        item.selected =false
                        _this.$refs.areaDistribute.selectedList.push(item)
                    }
                })
            },
            areaDistributeGetList() {
                var _this = this;
                _this.loading = false
                _this.$refs.areaDistribute.transferLeftData = []
                _this.$refs.areaDistribute.getSelectList()
                  _this.$refs.areaDistribute.getRoadList()
                  _this.$refs.areaDistribute.spinShow = false
            },
            searchUser(code) {
                var _this = this;
                var par = {
                    $wayId: code.strCode
                }
                Util.getAjaxData(par, 'WayIsAllot' , undefined).then((res)=>{
                    if(res.length > 0){
                        var user = res[0];
                        _this.form.$userId = user.AdminId;
                        _this.getData()
                    } else {
                        _this.form.$userId = undefined
                        _this.getData()
                    }
                })
            },
            loadUser () {
                var _this = this;
                var par = this.form;
                par.$pageRecord = 1000;
                Util.getDataGrid(par, undefined , undefined , this).then((res)=>{
                    _this.userList = res.dgData
                })
            },
            otherDistribute() {
                var _this = this;
                this.oldName = this.selectRowData;
                _this.showFormTwo = true;

            },
            saveForm () {
                var _this = this;
                var oldUserId = this.oldName.userId;
                var newUserId = this.newName;
                var userInfo = JSON.parse(Cookies.get('userInfo'));
                if(newUserId == ''){
                    this.$Notice.error({
                        title: '操作失败',
                        desc: '没有选择分配给哪位业务员'
                    });
                    return
                }
                var par = {
                    oldUserId: oldUserId,
                    newUserId: newUserId,
                    modifyBy: userInfo.userId
                }

                Util.getAjaxData( par , undefined , '5acfb8a5-dce9-488f-9ae7-49eead41bf6f').then((res) => {
                    if(res.result == 'ok'){
                        _this.$Notice.success({
                            title: '操作成功',
                            desc: '已经分配给选中的业务员'
                        });
                    } else {
                        _this.$Notice.error({
                            title: '操作失败',
                            desc: '操作失败'
                        });
                    }
                    _this.newName = ''
                })
            },
            changeName(userId) {
                // console.log(userId)
            }
        },
        mounted () {
          Util.initButton(this)
          this.getData()
          this.loadUser()
      }
  };
</script>
