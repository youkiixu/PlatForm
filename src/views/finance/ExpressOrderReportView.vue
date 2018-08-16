
<style lang="less">
	@import '../../styles/common.less';
</style>

<template>
	<div @keyup.enter="getData()">

		<Card>
			<Row>
				<Col span="8">
					关键词:
					<Select v-model="selectKeyType" @on-change="selectKeyTypeChange" style="width:100px">
						<Option v-for="item in selectKeyTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
					<Input v-model="keyVal" placeholder="请输入关键字..." style="width: 150px" />
				</Col>
				<Col span="16">
					时间日期:
					<datePickerCompoent
					:showSelect="false"
					@startDateChange="startDateChange"
					@endDateChange="endDateChange"
					></datePickerCompoent>
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
			<initDataGridCompoent ref="dataGrid" :param="form" :exportAll="true" :showControl="showControl" @selectRow="selectRow" @dbClickRow="dbClickRow"></initDataGridCompoent>
		</Card>
	</div>
</template>
<!-- 代发快递报表 -->
<script>
	import Util from '../../libs/util';
    // 头部组件
    import datePickerCompoent from '../toolbar-components/datePicker-component';   

    // dataGrid组件
    import initDataGridCompoent from '../toolbar-components/initDataGrid-noPage-component';
    

    export default {
    	name: 'ExpressOrderReportView',
    	components: {
    		datePickerCompoent,

    		initDataGridCompoent
    	},
    	data () {
    		return {
    			form: {
    				$OrderId: '',
    				$CourierNumber: '',
    				$ExpressOrderId: '',
    				$UserId: '',


    				$StartDate: '',
    				$EndDate: '',

    				isLoad: true,
                    // $pageRecord: 10,
                    // $rowIndex : 1,
                    strMethod: 'QueryReplaceCourieredReport'

                },
                selectKeyTypes: [{
                	label: '物流单号',
                	value: '0'
                },{
                	label: '快递单号',
                	value: '1'
                },{
                	label: '第三方单号',
                	value: '2'
                },{
                	label: '会员号',
                	value: '3'
                }],
                selectKeyType: '0',
                keyVal: '',
                showControl: false,
                selectRowData: undefined,
            };
        },
        methods: {
        	getData () {
        		if(this.selectKeyType == '0') {
        			this.form.$OrderId = this.keyVal;
        		}
        		if(this.selectKeyType == '1') {
        			this.form.$CourierNumber = this.keyVal;
        		}
        		if(this.selectKeyType == '2') {
        			this.form.$ExpressOrderId = this.keyVal;
        		}
        		if(this.selectKeyType == '3') {
        			this.form.$UserId = this.keyVal;
        		}
        		for(var key in this.form) {
        			if(this.form[key] === ''){
        				this.form[key] = undefined;
        			}
        		}
        		
        		this.$refs.dataGrid.resizePage(1,10)
        		this.$refs.dataGrid.initDataGrid()
        	},
        	selectRow(data) {
        		this.selectRowData = data
        	},
        	dbClickRow(data) {
        		this.selectRowData = data
        	},
        	startDateChange(data) {
        		this.form.$StartDate = data
        	},
        	endDateChange(data) {
        		this.form.$EndDate = data
        	},
        	selectKeyTypeChange(data) {
        			this.form.$OrderId =  ''
    				this.form.$CourierNumber = ''
    				this.form.$ExpressOrderId = ''
    				this.form.$UserId = ''
    				this.selectKeyType = data;
        	}
        },
        mounted () {
            // 可在此从服务端获取表格数据
            var date = Util.nowTime(this);
            this.form.$StartDate = date.forweek;
            this.form.$EndDate = date.formatnowdate;
            this.getData()
        }
    };
</script>
