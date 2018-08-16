<style lang="less">
	@import '../../../styles/common.less';
	.pagination {
		margin: 20px auto 0;
		text-align: center;
	}
	.ivu-spin-dot {

	}  
</style>
<template>
	<div>
		<div v-if="showControl" style="margin-bottom: 10px;">
			显示边框 <i-switch v-model="showBorder" style="margin-right: 5px"></i-switch>
			显示斑马纹 <i-switch v-model="showStripe" style="margin-right: 5px"></i-switch>
			显示表头 <i-switch v-model="showHeader" style="margin-right: 5px"></i-switch>
			表格滚动 <i-switch v-model="fixedHeader" style="margin-right: 5px"></i-switch>
			表格尺寸
			<Radio-group v-model="tableSize" type="button">
				<Radio label="large">大</Radio>
				<Radio label="default">中</Radio>
				<Radio label="small">小</Radio>
			</Radio-group> 
			<a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
			<Button type="primary" size="large" @click="exportData(1)"><Icon type="ios-download-outline"></Icon>导出当前页数据</Button>
			<a href="" :download="xlsxName" id="hf"></a>
			<Button type="primary" v-show="exportAll" size="large" @click="exportData(2)"><Icon type="ios-download-outline"></Icon> 导出全部数据</Button>
		</div>
		<Table 
		:columns="columnsList" 
		:data="tableData" 
		@on-current-change = "currentChange"
		@on-row-dblclick = "dbClickRow"
		@on-selection-change="selectStatu"
		highlight-row
		:loading="spinShow"
		ref="table"
		:border="showBorder" :stripe="showStripe" :show-header="showHeader" :height="fixedHeader ? 350 : ''" :size="tableSize" 
		></Table>
		<div class="pagination">
			<Page 
			:current = "row"
			:page-size = "size"
			placement="top"
			:total="intCount" 
			@on-change="changeRow"
			@on-page-size-change = "changeSize"

			show-sizer 
			show-total 
			show-elevator></Page>
		</div>
	</div>
</template>

<script>
	import Util from '@/libs/util';
	import table2excel from '@/libs/table2excel.js';


	function initCol(GridInfo , imgText , vm) {
		var newGridInfo = []
		newGridInfo.push({
			type: 'selection',
			width: 60,
			align: 'center'
		})
		GridInfo.map((item,index) => {
			if(!item.hidden){
				if(item.field == imgText){
					newGridInfo.push({
						title: item.title, 
						key: item.field,
						width: 85,
						render: (h, params) => {
							var imgUrl = params.row[imgText];

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
					})
				} else {
					newGridInfo.push({
						title: item.title,
						key: item.field,
						height: item.height,
						sortable: item.sortable
					})
				}
				
			}
		})
		return newGridInfo;
	}

	function initWidthCol(GridInfo , imgText , vm) {
		var newGridInfo = []
		GridInfo.map((item,index) => {
			if(!item.hidden){
				newGridInfo.push({
					title: item.title,
					key: item.field,
					width: item.width,
					height: item.height,
					sortable: item.sortable
				})
			}
		})
		return newGridInfo;       
	}

	function filterImage(GridData , imgText){

		GridData.map((item) => {
			item[imgText] = item[imgText].split('"')[1]
		})

		return GridData;
	}

	export default {
		name: 'initDataGrid',
		props: {
			param: Object,
			showControl: {
				type: Boolean,
				default: false
			},
			autoWidth: {
				type: Boolean,
				default: true
			},
			isSort: {
				type: Boolean,
				default: true
			},
			showWinTable: {
				type: Boolean,
				default: false
			},
			exportAll: {
				type: Boolean,
				default: false
			},
			imgText: {
				type: String,
				default: '图片'
			}
		},
		data () {
			return {
				columnsList: [],
				tableData: [],
				intCount: 0,
				row : 1,
				size: null,
				spinShow: true,
				showBorder: true,
				showStripe: true,
				showHeader: true,
				fixedHeader: false,
				tableSize: 'small',
				xlsxName: '报表.xlsx'
			}
		},
		methods: {
			initDataGrid () {
				var _this = this;
				var par = {};
				_this.spinShow = true;

				if(this.row != null) {
					_this.param.$rowIndex = _this.row
				}
				if(this.size != null) {
					_this.param.$pageRecord = _this.size
				}

				Util.getDataGrid(_this.param , undefined , undefined , this).then((res) => {
					var data = res
					if(_this.autoWidth){
						_this.columnsList = initCol(data.GridInfo.dgColumns , _this.imgText , _this)
					} else {
						_this.columnsList = initWidthCol(data.GridInfo.dgColumns , _this.imgText , _this)
					}
					_this.tableData = filterImage(data.dgData , _this.imgText)
					_this.intCount = data.intCount - 0
					_this.spinShow = false
				})
			},
			resizePage(row,size) {
				this.row = row ? row : 1
				this.size = size ? size : 10
			},
			changeRow(row) {
				this.row = row
				this.initDataGrid()
			},
			changeSize(size) {
				this.size = size
				this.initDataGrid()
			},
			currentChange(currentRow , oldCurrentRow) {
				this.$emit('selectRow', currentRow);
			},
			dbClickRow(data,index) {
				this.$emit('dbClickRow', data);
			},
			exportData(type) {
				var _this = this;
				let app = this.$store.state.app;
				let currentPageName = app.currentPageName;
				let currentPath = app.currentPath;
				var filename = ''
				currentPath.map((item) => {
					if(item.name == currentPageName){
						filename = item.title
					}
				})
				if(type == 1)  {
					table2excel.transform(_this.$refs.table, 'hrefToExportTable', filename);
				} else if (type == 2){
					_this.exportDataAll(filename)
				}

			},
			exportDataAll(filename) {
				var _this = this;
				_this.xlsxName = filename + '.xlsx';
				this.$emit('exportAllData', _this);
				
			},
			selectStatu(data) {
            	this.$emit('selectGroup' , data )
            }
		},
		computed: {

		},
		mounted () {

		},
		created () {

		}
	};
</script>
