<style lang="less">
    @import '../../../styles/common.less';

</style>

<template>
    <Modal
    v-model="showEdit"
    :title="title"
    :width="450"
    @on-ok="ok"
    @on-cancel="cancel">
    <!-- 新增修改仓库 -->
    <Form :model="pubForm" label-position="right" :label-width="100" v-if="type == 0 || type == 1">
		<FormItem label="线路名称"  label-position="right" :label-width="100">
			<Input v-model="pubForm.RouteName" placeholder="线路名称"></Input>
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
        :titles ="titles"
        :list-style="listStyle"
        @on-change="handleChange"
        filterable
        v-if="type == 2 || type == 3"></Transfer>
	
</Modal>
</template>

<script>
    import Util from '@/libs/util'
    import Cookies from 'js-cookie';
    import toolMap from '@/libs/map'

    export default {
        name: 'addRouteManagentComponent',
        props: {
            param: Object

        },
        data () {
            return {
                pubForm: {
	                    RouteName: '',
	                    Enabled: '0'
	                },
	                selectPoint: [],
	                index: 1,
	                showEdit: false,
	                type: 0, //0是新增，1是修改
	                title: '新增路线名称',
	                target: [],
                	targetKeys: [],
                    listStyle: {height: '600px'},
                	titles: ['未分配','已分配']
                };
            },
            methods: {
                handleReset (name) {
                    this.pubForm.RouteName = ''
                    this.pubForm.Enabled =  '0'

                },
                loadForm() {
                    var row = this.param
                    this.pubForm.RouteName = row.RouteName
                    this.pubForm.Enabled = row.Enabled ? '1' : '0'
                },
                loadRoute() {
                	var _this = this;
                	this.target = []
                	this.targetKeys = []
                	// GetWarhoursList
                	Promise.all([Util.getAjaxData({} , 'GetWarhoursList' , undefined) , Util.getAjaxData({$RouteId : this.param.Id } , 'QueryWarhoursRouteMapInfo' , undefined)]).then((res)=> {
                        console.log(res)
			           res[0].map((item) => {
			           		_this.target.push({
			           			key: item.Id,
			           			label: item.WarhoursName,
			           			description: item.WarhoursCode,
			           			disabled: false
			           		})
			           })
			           res[1].map((item) => {
			           		_this.targetKeys.push(item.WarhoursId)
			           })
			        })
                },
                setUsers() {
                	var _this = this;
                	this.target = []
                	this.targetKeys = []
                	Promise.all([Util.getAjaxData({$RoleId: '9'} , 'GetDeliveryList' , undefined) , Util.getAjaxData({$RouteId : this.param.Id } , 'QueryRouteUserMapInfo' , undefined)]).then((res)=> {
	                		res[0].map((item) => {
				           		_this.target.push({
				           			key: item.Id,
				           			label: item.RealName,
				           			description: item.RealName,
				           			disabled: false
				           		})
				           })
				           res[1].map((item) => { 
				           		_this.targetKeys.push(item.Id)
				           })
			        })

                },
                showModal(type) {
                    // type为0是新增，type为1是修改
                    this.type = type
                    if(type == 0){
                    	this.title = '新增路线名称'
                        this.handleReset()
                    } else if(type == 1) {
                    	this.title = '修改路线名称'
                        this.loadForm()
                    } else if(type == 2) {
                    	this.title = '设置仓库路线'
                    	this.loadRoute()

                    } else  if(type == 3) {
                    	this.title = '分配大车司机'
                    	this.setUsers()
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
                    	// 设置仓库路线
                    	this.setWarhoursBox()
                    }
                    if(this.type == 3) {
                    	// 分配大车司机
                    	this.setUsersBox()
                    }
                    this.showEdit = false
                },
                addRow() {
                    var _this = this;
                    var userInfo = JSON.parse(Cookies.get('userInfo'));
                    var par = {
                        RouteName: _this.pubForm.RouteName,
                        Enabled: _this.pubForm.Enabled,
                        CreateDate: Util.nowTime().formatnowdate,
                        CreateBy: userInfo.userId
                    }
                    Util.getAjaxData(par , undefined , '94df93b2-699b-45a0-8e63-5eaae9ccabaa').then((data) => {
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
                    var row = this.param;
                    var par = {
                        rowState: 'M',
                        Id: _this.param.Id,
                        RouteName: _this.pubForm.RouteName,
                        Enabled: _this.pubForm.Enabled,
                        UpdateDate: Util.nowTime().formatnowdate,
                        UpdateBy: userInfo.userId
                    }
                    Util.getAjaxData(par , undefined , '94df93b2-699b-45a0-8e63-5eaae9ccabaa').then((data) => {
                        if (data.errMsg || data.result != 'ok') {
                            _this.$Message.error(data.errMsg);
                            return false;
                        }
                        _this.$Message.success('修改成功！');
                        _this.$emit('onSuccess' , '')
                    })

                },
                setWarhoursBox() {
                    var userInfo = JSON.parse(Cookies.get('userInfo'));
                	var par = {
                		Id : this.param.Id,
                		array: this.targetKeys,
                		OperBy: userInfo.userId //创建人
                	}
                	Util.getAjaxData(par , undefined , '343d6f90-a599-4d36-a498-9b5dd891c057').then((data) => {
                        if (data.errMsg || data.result != 'ok') {
                            _this.$Message.error(data.errMsg);
                            return false;
                        }
                        _this.$Message.success('修改成功！');
                        _this.$emit('onSuccess' , '')
                    })
                },
                setUsersBox() {
                    var _this = this;
                    var userInfo = JSON.parse(Cookies.get('userInfo'));
                	var par = {
                		Id : this.param.Id,
                		array: this.targetKeys,
                		OperBy: userInfo.userId //创建人
                	}
                	Util.getAjaxData(par , undefined , '55490e78-9908-4b9a-9895-96ed1a34cb45').then((data) => {
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
                filterMethod (data, query) {
                	return data.label.indexOf(query) > -1;
                },
                handleChange(newTargetKeys) {
                	this.targetKeys = newTargetKeys;
                }
            },
            created () {
        // 可在此从服务端获取表格数据
    }
};
</script>
