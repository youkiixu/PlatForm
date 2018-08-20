<style lang="less">
    @import '../../../styles/common.less';

</style>

<template> 
    <Modal
    v-model="showEdit"
    :title="title"
    :width="modelWidth"
    @on-ok="ok"
    @on-cancel="cancel">
    <!-- 新增修改仓库 -->
    <Form :model="pubForm" label-position="right" :label-width="100" v-if="type == 0 || type == 1">
      <FormItem label="仓库名称"  label-position="right" :label-width="100">
         <Input v-model="pubForm.WarhoursName" placeholder="添加仓库名称..."></Input>
     </FormItem>
     <FormItem label="仓库标识号"  label-position="right" :label-width="100">
         <Input v-model="pubForm.WarhoursCode" placeholder="添加仓库标识号..."></Input>
     </FormItem>
     <FormItem label="仓库标识号"  label-position="right" :label-width="100">
        <Select v-model="pubForm.LogisticsType">
            <Option value="0">内区</Option>
            <Option value="1">外区</Option>
            <Option value="2">外省</Option>
        </Select>
    </FormItem>
    <FormItem label="是否启用"> 
        <RadioGroup v-model="pubForm.Enabled">
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
        </RadioGroup>
    </FormItem>
</Form>
<!-- 穿梭框 -->
<Transfer
:data="target"
:target-keys="targetKeys"
:list-style="listStyle"
:titles ="titles"
@on-change="handleChange"
filterable
v-if="type == 3 || type == 4"></Transfer>

<!-- 分配仓库裤线 --> 
<areaDistributeComponent 
v-model="selectId"
ref="areaDistribute"
saveUid="946224aa-95c4-4614-b286-760196b2dc3a"
selectedListMethod="GetNewAddressWarhoursMapInfo"
selectedParam="$wId"
queryRoadMethod="QueryWarhoursAddressMap"
:transfer="true"
:level="3"
@on-transfer-left="onTransferLeft"
@on-transfer-right="onTransferRight"

v-show="type == 2" ></areaDistributeComponent>

</Modal>
</template>

<script>
    import Util from '@/libs/util';
    import Cookies from 'js-cookie';
    // import manyAreaSelect from '@/components/addD/manyAreaSelect'
    import areaDistributeComponent from '@/components/areaDistribute/areaDistribute-component'

    export default {
        name: 'addWarehouseManagentComponent',
        components: {
            areaDistributeComponent
        },
        props: {
            param: Object

        },
        data () {
            return {
                pubForm: {
                   WarhoursName: '',
                   WarhoursCode: '',
                   LogisticsType: '',
                   Enabled: '0'
               },
               selectPoint: [],
               index: 1,
               selectId: 0,
               showEdit: false,
	                type: 0, //0是新增，1是修改
	                title: '新增仓库名称',
	                target: [],
                   targetKeys: [],
                   listStyle: {height: '600px'},
                   titles: ['未分配','已分配'],
                   modelWidth: 450,
                   areaSelect: []
               };
           },
           methods: {
            handleReset (name) {
                this.pubForm.WarhoursName = ''
                this.pubForm.WarhoursCode = ''
                this.pubForm.LogisticsType = ''
                this.pubForm.Enabled =  '0'

            },
            loadForm() {
                var row = this.param
                var e = ''
                var L = ''
                if(row.Enabled == '启用'){
                   e = '1'
               }
               if(row.Enabled == '禁用'){
                   e = '0'
               }
               if(row.LogisticsType == '内区'){
                   L = '0'
               } else if(row.LogisticsType == '外区'){
                   L = '1'
               } else if(row.LogisticsType == '外省') {
                   L = '2'
               }
               this.pubForm.Enabled = e
               this.pubForm.LogisticsType = L
               this.pubForm.WarhoursName = row.WarhoursName
               this.pubForm.WarhoursCode = row.WarhoursCode
           },
           loadRoute() {
               var _this = this;
               // this.target = []
               // this.targetKeys = []
               this.areaSelect = []
               var par = {
                    $WarhoursId : this.param.Id
               }
               Util.getAjaxData(par , 'GetAddressWarhoursMapInfo ' , undefined).then((res) => {
                    _this.areaSelect = res
               })

           },

           loadDeliveryList(obj) {
            var _this = this;
            this.target = []
            return Util.getAjaxData(obj,'GetDeliveryList',undefined).then((res)=>{
                res.map((item) => {
                    _this.target.push({
                        key: item.Id,
                        label: item.RealName,
                        description: item.RealName,
                        disabled: false
                    })
                })
                return Promise.resolve(res)
            })
        },
        setUsers() {
           var _this = this;

           this.targetKeys = []
           var obj = {
            '$RoleId' : '8,13'
        }
        this.loadDeliveryList(obj).then((res) => {
            var par = {
                $WarhoursId: _this.param.Id
                            // $AdminId: _this.param.Id
                        }
                        
                        Util.getAjaxData( par, 'QueryWarhoursUserMapInfo' , undefined).then((data)=> {
                            data.map((item)=>{
                                _this.targetKeys.push(item.UserId)
                            })
                        })

                    })
    },
    setAdmin() {
        var _this = this;
        this.targetKeys = []
        var obj = {
            '$RoleId' : '2,3,5,13,17'
        }
        this.loadDeliveryList(obj).then((res) => {
            var par = {
                $WarhoursId: _this.param.Id
            }

            Util.getAjaxData( par, 'QueryWarhoursAdminMapInfo' , undefined).then((data)=> {
                data.map((item)=>{
                    _this.targetKeys.push(item.AdminId)
                })
            })

        })
    },
    showModal(type) {
                    // type为0是新增，type为1是修改
                    var row = this.param
                    this.type = type
                     this.modelWidth = 450
                    if(type == 0){
                    	this.title = '添加仓库'
                        this.handleReset()
                    } else if(type == 1) {
                    	this.title = '修改'
                        this.loadForm()
                    } else if(type == 2) {
                    	this.title = '地区设置'
                        this.modelWidth = 1500
                        this.selectId = this.param.Id
                    	// this.loadRoute()

                    } else  if(type == 3) {

                    	this.title = row.WarhoursName + '分配业务员'
                    	this.setUsers()
                    } else if( type == 4) {
                        this.title = row.WarhoursName + '分配登录员'
                        this.setAdmin()
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
                    if(this.type == 2) {
                    	// 地区设置
                        this.saveAreaDistribute()
                    	// this.setWarhoursBox()
                    }
                    if(this.type == 3) {
                    	// 分配业务员
                    	this.setUsersBox()
                    }
                    if(this.type == 4) {
                        // 分配登录员
                        this.setAdminBox()
                    }
                    this.showEdit = false
                },
                addRow() {
                    var _this = this;
                    var userInfo = JSON.parse(Cookies.get('userInfo'));
                    var par = {
                        WarhoursName: _this.pubForm.WarhoursName,
                        WarhoursCode: _this.pubForm.WarhoursCode,
                        LogisticsType: _this.pubForm.LogisticsType,
                        Enabled: _this.pubForm.Enabled,
                        CreateDate: Util.nowTime().formatnowdate + ' ' + Util.nowTime().forTime,
                        CreateBy: userInfo.userId
                    }
                    for(var key in par) {
                    	if(par[key] == ''){
                    		_this.$Message.error('无法获取信息，请填写信息...');
                    		return
                    	}
                    }
                    Util.getAjaxData(par , undefined , '416a9d61-2b5f-4040-b96b-c45b975b5d37').then((data) => {
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
                    var row = this.param;
                    var userInfo = JSON.parse(Cookies.get('userInfo'));
                    var par = {
                        rowState: 'M',
                        Id: _this.param.Id,
                        WarhoursName: _this.pubForm.WarhoursName,
                        WarhoursCode: _this.pubForm.WarhoursCode,
                        LogisticsType: _this.pubForm.LogisticsType,
                        Enabled: _this.pubForm.Enabled,
                        UpdateDate: Util.nowTime().formatnowdate + ' ' + Util.nowTime().forTime,
                        UpdateBy: userInfo.userId
                    }
                    Util.getAjaxData(par , undefined , '416a9d61-2b5f-4040-b96b-c45b975b5d37').then((data) => {
                        if (data.errMsg || data.result != 'ok') {
                            _this.$Message.error(data.errMsg);
                            return false;
                        }
                        _this.$Message.success('修改成功！');
                        _this.$emit('onSuccess' , '')
                    })

                },
                setWarhoursBox() {
                	// 配置仓库地址信息
                    
                },
                setUsersBox() {
                    var _this = this;
                    var userInfo = JSON.parse(Cookies.get('userInfo'));
                	var par = {
                		Id : this.param.Id,
                		array: this.targetKeys,
                		OperBy: userInfo.userId //创建人
                	}
                	Util.getAjaxData(par , undefined , 'c6776b7d-c641-4c3f-a378-56fef2b5c4f8').then((data) => {
                        if (data.errMsg || data.result != 'ok') {
                            _this.$Message.error(data.errMsg);
                            return false;
                        }
                        _this.$Message.success('配置仓库业务员成功！');
                        _this.$emit('onSuccess' , '')
                    })
             },
             setAdminBox() {
                var userInfo = JSON.parse(Cookies.get('userInfo'));
                var par = {
                        Id : this.param.Id,
                        array: this.targetKeys,
                        OperBy: userInfo.userId //创建人
                    }
                    Util.getAjaxData(par , undefined , 'CAA9096C-1AC2-4EB4-9089-F41343668EDA').then((data) => {
                        if (data.errMsg || data.result != 'ok') {
                            _this.$Message.error(data.errMsg);
                            return false;
                        }
                        _this.$Message.success('设置登录员成功！');
                        _this.$emit('onSuccess' , '')
                    })  
                },
                cancel () {
                    this.showEdit = false
                },
                filterMethod (data, query) {
                	return data.label.indexOf(query) > -1;
                },
                handleChange(newTargetKeys) {
                	this.targetKeys = newTargetKeys;
                },
                onTransferLeft(data) {
                    var _this = this;
                    var arr = []
                    data.map((item)=> {
                        if(!item.selected){
                            arr.push(item)
                          }
                    })
                    _this.$refs.areaDistribute.selectedList = arr;

                },
                onTransferRight(data) {
                    var _this =this;
                    var userInfo = JSON.parse(Cookies.get('userInfo'));
                    var arr = []
                    data.map((item)=> {
                        if(item.selected){
                            item.selected =false
                            _this.$refs.areaDistribute.selectedList.push(item)
                          }
                    })
                    
                },
                saveAreaDistribute() {
                    var _this =this;
                    var userInfo = JSON.parse(Cookies.get('userInfo'));
                    var arr = []
                    var selectedList = _this.$refs.areaDistribute.selectedList;

                    selectedList.map((item) => {
                        arr.push(item.strCode)
                    })

                    var par = {
                        Id : this.param.Id,
                        array: arr,
                        OperBy: userInfo.userId //创建人
                    }
                    Util.getAjaxData(par , undefined ,'946224aa-95c4-4614-b286-760196b2dc3a').then((res) => {
                      if(res.errMsg){
                             _this.$Message.error(res.errMsg);
                             return;
                        }
                      _this.$refs.areaDistribute.getSelectList()
                      _this.$refs.areaDistribute.getRoadList()
                      _this.$refs.areaDistribute.spinShow = false
                      _this.$Message.success('设置成功！');
                    })
                }
            },
            created () {
        // 可在此从服务端获取表格数据
    }
};
</script>
