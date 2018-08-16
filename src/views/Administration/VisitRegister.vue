
<style lang="less">
	@import '../../styles/common.less';
</style>

<template>
	<div @keyup.enter="getData()">

		<Card>
			<Row>
				<Col span="4">
					签到人:
					<Input v-model="form.$myName" placeholder="请输入关键字..." style="width: 150px" />
				</Col>
				<Col span="16">
					<Col span="15">
                        <selectTime @on-change="selectTimeChange"></selectTime>
                    </Col>
				</Col>
			</Row>
			<Row class="margin-top-10">
				<Col span="3" style="padding-top: 6px;">
					表格样式:
					<i-switch v-model="showControl"  size="large"></i-switch>
				</Col>
				<Col span="3">
					<span style="margin: 0 10px;"><Button type="primary" icon="search" @click="getData()">搜索</Button></span>
				</Col>
			</Row>
		</Card>

		<Card class="margin-top-10">
			<initDataGridCompoent 
            ref="dataGrid" 
            :param="form" 
            :exportAll="true" 
            :showControl="showControl"
            @selectRow="selectRow" 
            @dbClickRow="dbClickRow"
            @exportAllData="exportAllDataChange"
            ></initDataGridCompoent>
		</Card>
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
    

    export default {
    	name: 'VisitRegister',
    	components: {
    		datePickerCompoent,
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
                    strMethod: 'GetVisitRegisterList'

                },
                showControl: false,
                selectRowData: undefined,
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
        		this.$refs.dataGrid.initDataGrid(this.filterCol , this.filterImage)
        	},
            filterImage(GridData) {
                GridData.map((item) => {
                    item['客户图片'] = item['客户图片'].split('"')[1]
                })

                return GridData;
            },
            filterCol(GridInfo , vm) {
                var newGridInfo = []
                vm.tableColumnsFilter = []
                vm.oldColumnsList = []
                vm.oldData = []
                

                    GridInfo.map((item,index) => {
                        if(!item.hidden){
                            if(item.field == '客户图片'){
                                var colRow = {
                                    title: item.title, 
                                    key: item.field,
                                    width: 85,
                                    render: (h, params) => {
                                        var imgUrl = params.row['客户图片'];

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
                                };
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
             exportAllDataChange(vm){
                var _this = this;
                var allData = _this.form;
                vm.spinShow = true;
                allData.$rowIndex = 1;
                allData.$pageRecord = 100000;
                Util.getDataGrid(allData , undefined , undefined , this).then((res) => {
                    vm.spinShow = false;
                    allexcel.tranformAll(res)
                })
            }
        },
        mounted () {
            // 可在此从服务端获取表格数据
            // var date = Util.nowTime(this);
            // this.form.$startTime = date.formatwdate;
            // this.form.$endTime = date.formatnowdate;
            this.getData()
        }
    };
</script>
