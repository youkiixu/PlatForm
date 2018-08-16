
<style lang="less">
	@import '../../styles/common.less'; 
</style>

<template>
	<div @keyup.enter="getData()">
		<Card>
            <Row>
                <span style="margin: 0 10px;" v-for="item in buttonGroup">
                    <Button :type="item.strValue" :icon="item.strImg" @click='buttonEvent(item.strEventMethod)'>{{item.strText}}</Button>
                </span>
            </Row>
            <Row class="margin-top-10"> 
                <Col span="4">
                 签到人:
                 <Input v-model="form.$myName" placeholder="请输入关键字..." style="width: 150px" />
             </Col>
             <Col span="4">
                审核状态
                <Select clearable @on-change="auditingStateChange"  style="width:150px">
                    <Option v-for="item in isOk" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Col>
            <Col span="16">
                <selectTime @on-change="selectTimeChange"></selectTime>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <span style="margin: 0 10px;">
             表格样式:
             <i-switch v-model="showControl"  size="large"></i-switch>
         </span>

         <span style="margin: 0 10px;">
            <Button type="primary" icon="search" @click="getData()">搜索</Button>
        </span>
    </Row>
</Card>

<Card class="margin-top-10">
   <initDataGridCompoent 
   ref="dataGrid" 
   :imgText="'imgsUrl'" 
   :param="form" 
   :exportAll="true" 
   :exportAllFilter = 'true'
   :showControl="showControl" 
   @selectRow="selectRow" 
   @dbClickRow="dbClickRow"
   @selectGroup="selectRow"

   @exportAllData="exportAllDataChange"
   ></initDataGridCompoent>
</Card>
<addDrivingRecordComponent  ref="showEdit"  @onSuccess="getData()"></addDrivingRecordComponent>
</div>
</template>
<!-- 业务员里程统计 -->
<script>
	import Util from '../../libs/util';
    import allexcel from '@/libs/allexcel'
    // 头部组件
    import datePickerCompoent from '../toolbar-components/datePicker-component';   
    import selectTime from '../toolbar-components/selectTime-component'
    // dataGrid组件
    import initDataGridCompoent from '../toolbar-components/initDataGrid-component';
    import addDrivingRecordComponent from './component/addDrivingRecord-component'

    export default {
    	name: 'DrivingRecord',
    	components: {
    		datePickerCompoent,
            addDrivingRecordComponent,
            selectTime, 
            initDataGridCompoent
        },
        data () {
          return {
           form: {
                    // $myName: '',

                    // $day: '',
                    // $month: '',
                    // $year: '',

    				// $startTime: '',
    				// $endTime: '',

    				isLoad: true,
                    $pageRecord: 15,
                    $rowIndex : 1,
                    strMethod: 'GetDriving_record'

                },
                isOk: [{
                    value: '0',
                    label: '未审核'
                },{
                    value: '1',
                    label: '已审核'
                }],
                showControl: false,
                selectRowData: [],
                kil: '',
                buttonGroup: []
            };
        },
        methods: {
            buttonEvent(e) {
                // 后端定义的按钮，需要在这里注册
                if(e === 'add'){
                    this.add()
                }
                if(e === 'Auditing') {
                    this.Auditing()
                } 
                if(e === 'UnAuditing') {
                    this.UnAuditing()
                }
                if(e === 'DeleteRed') {
                    this.DeleteRed()
                }
            },
        	getData () {
        		for(var key in this.form) {
        			if(this.form[key] === ''){
        				this.form[key] = undefined;
        			}
        		}
        		
        		this.form.$rowIndex = 1;
        		this.$refs.dataGrid.initDataGrid(this.filterCol , this.filterImage)
        	},
            filterImage(GridData) {
                GridData.map((item) => {
                    item['imgsUrl'] = item['imgsUrl'].split('"')[1]
                })

                return GridData;
            },
            filterCol(GridInfo , vm) {
                // 必须先清空
                var newGridInfo = []
                vm.tableColumnsFilter = []
                vm.oldColumnsList = []
                vm.oldData = []

                var colRow = {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                }
                newGridInfo.push(colRow)
                    // 筛选操作需要执行此操作
                    Util.autoPushCol( colRow , vm)
                    GridInfo.map((item,index) => {
                        if(!item.hidden){
                            if(item.field == 'imgsUrl'){
                                var colRow = {
                                    title: item.title, 
                                    key: item.field,
                                    width: 85,
                                    render: (h, params) => {
                                        var imgUrl = params.row['imgsUrl'];

                                        return h('div', {
                                            attrs: {
                                                style: 'width: 40px;height: 40px;'
                                            },
                                        }, [
                                        h('img', {
                                            props: {
                                                type: 'primary',
                                                size: 'small'
                                            },
                                            attrs: {
                                                src: imgUrl, style: 'width: 40px;height: 40px;border-radius: 2px;'
                                            },
                                            style: {

                                            },
                                            on: {
                                                click: function(){
                                                    vm.$Modal.confirm({
                                                        width: 540,
                                                        render: (h) => {
                                                            return h('img', {
                                                                attrs: {
                                                                    src: imgUrl, style: 'width: 500px;border-radius: 2px;'
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            }
                                        }),
                                        ]);
                                    }
                                }
                                newGridInfo.push(colRow)
                                // 筛选操作需要执行此操作
                                Util.autoPushCol( colRow , vm)
                            } else {
                                var colRow = {
                                    title: item.title,
                                    key: item.field,
                                    height: item.height,
                                    sortable: item.sortable
                                }
                                newGridInfo.push(colRow)
                                // 筛选操作需要执行此操作
                                Util.autoPushCol( colRow , vm)
                            }
                            
                        }
                    })
                    return newGridInfo;
                },
                selectRow(data) {
                  this.selectRowData = data
              },
              dbClickRow(data) {
                  this.selectRowData = data
              },
              selectTimeChange(data , startTime , endTime) {
                this.form.$day = ''
                this.form.$month =  ''
                this.form.$year =  ''
                this.form.$startTime = ''
                this.form.$endTime = ''
                if(data === 1) {
                    this.form.$day = 0
                }
                if(data === 2) {
                    this.form.$day = 1
                }
                if(data === 3) {
                    this.form.$day = 2
                }
                if(data === 4) {
                    this.form.$month = 0
                }
                if(data === 5) {
                    this.form.$month = 1
                }
                if(data === 7) {
                    this.form.$year =  0
                }
                if(data === 8) {
                    if(startTime && endTime) {
                        this.form.$startTime =  startTime
                        this.form.$endTime =  endTime
                    }
                }
            },
            auditingStateChange(val) {
                this.form.$AuditingState = val
            },
            add(){
                // 代签
                var _this = this;
                this.$refs.showEdit.showModal()


            },
            Auditing() {
                // 审核
                var _this = this;
                if(this.selectRowData.length != 1 ) {
                    _this.$Message.warning('请选择一项进行操作!');
                    return
                }
                var row = this.selectRowData[0]
                _this.kil = row.kilometres
                _this.$Modal.confirm({
                    title: `审核<br />签到人:${row.myname}<br />签到时间:${row.startTime}<br />设置公里数:<br />`,
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: row.kilometres,
                                autofocus: true,
                                placeholder: '设置公里数'
                            },
                            on: {
                                input: (val) => {
                                    _this.kil = val;
                                }
                            }
                        })
                    },
                    onOk: function() {
                        var param = {
                            Id: row.Id,
                            kilometres: _this.kil,
                            AuditingState: 1,
                            AuditingUID: 1
                        }
                        return
                        Util.getAjaxData(param,'EditDriving_recordState','b8f2d8e2-9b23-4f6e-9ae6-e1ff2da62683').then((res)=>{
                            if(res == 1){
                                _this.$Message.success('审核成功!');
                            } else {
                                _this.$Message.error('审核失败!');
                            }
                        })
                    }
                })



            },
            UnAuditing() {
                // 反审核
                var _this = this;
                if(this.selectRowData.length != 1 ) {
                    _this.$Message.warning('请选择一项进行操作!');
                    return
                }
                var row = this.selectRowData[0]
                _this.$Modal.confirm({
                    title: '确认',
                    content: `签到人：${row.myname},签到时间:${row.startTime},是否反审核所选中记录?`,
                    onOk: function() {
                        var param = {
                            Id: row.Id,
                            kilometres: row.kilometres,
                            AuditingState: 0,
                            AuditingUID: 1
                        }
                        Util.getAjaxData(param, 'EditDriving_recordState' , "b8f2d8e2-9b23-4f6e-9ae6-e1ff2da62683").then((res)=>{
                            if(res == 1){
                                _this.$Message.success('反审核成功!');
                            } else {
                                _this.$Message.error('反审核失败!');
                            }
                        })
                    }
                })

            },
            DeleteRed() {
                // 删除
                var _this = this;
                if(this.selectRowData.length != 1 ) {
                    _this.$Message.warning('请选择一项进行操作!');
                    return
                }
                var row = this.selectRowData[0]
                this.$Modal.confirm({
                    title: '确定删除？',
                    content:  '是否确认删除 【' + row.myname + '】' + row.startTime + '的打卡记录?',
                    onOk: function() {
                        var par = {
                            Id: row.Id,
                            rowState: 'D'
                        }
                        Util.getAjaxData(par, undefined, '644440a2-2805-496b-be41-45ec31e9870d').then((data)=> {
                            if (data.errMsg || data.result != 'ok') {
                              _this.$Message.error(data.errMsg);
                              return false;
                          }
                          _this.$Message.success('删除成功!');
                      })
                    }
                })
                
            },
            exportAllDataChange(vm){
                var _this = this;
                var allData = _this.form;
                vm.spinShow = true;
                allData.$rowIndex = undefined;
                allData.$pageRecord = '100000';
                allData.strMethod = 'Driving_recordExport';
                Util.getDataGrid(allData , undefined , undefined , this).then((data) => {
                    vm.spinShow = false;
                    var jsono = []
                    for (var i = 0; i < data.dgData.length; i++) {
                        jsono[i] = {
                            "签到时间": data.dgData[i].startTime == null ? '' : data.dgData[i].startTime,//A
                            "备注": data.dgData[i].Remark == null ? '' : data.dgData[i].Remark,//B
                            "公里数": data.dgData[i].kilometres == null ? '' : data.dgData[i].kilometres,//C
                            "坐标": data.dgData[i].point == null ? '' : data.dgData[i].point,//D
                            "签到地址": data.dgData[i].Address == null ? '' : data.dgData[i].Address,//E
                            "审核状态": data.dgData[i].AuditingState == null ? '' : data.dgData[i].AuditingState,//F
                            "审核时间": data.dgData[i].AuditingTime == null ? '' : data.dgData[i].AuditingTime,//G
                            "签到人": data.dgData[i].myname == null ? '' : data.dgData[i].myname,//G
                            //"审核人": data.dgData[i]["创建时间"] == null ? '' : data.dgData[i]["创建时间"],//G
                        }
                    }
                    allexcel.tranformAll(undefined ,jsono )
                })

                
            }
        },
        mounted () {
            // 可在此从服务端获取表格数据
            var date = Util.nowTime(this , '最近一个月的数据');
            this.form.$startTime = date.formatwdate;
            this.form.$endTime = date.formatnowdate;
            this.getData()
            Util.initButton(this)
        },
        created () {
             
        }
    };
</script>
