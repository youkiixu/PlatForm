<style lang="less">
    @import '../styles/common.less';
    .pagination {
        margin: 20px auto 0;
        text-align: center;
    }
</style> 
<template>
    <div id="initDataGrid">
        <div v-if="showControl" style="margin-bottom: 10px;">
            <div>
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
            <div>
                <!-- 筛选项 -->
                <Checkbox-group v-model="tableColumnsFilter" @on-change="changeTableColumns">
                    <Checkbox v-for="item in oldColumnsList" :label="item.key">{{item.title}}</Checkbox>
                </Checkbox-group>
            </div>
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
        :tableColumnsChecked="10"
        :border="showBorder" :stripe="showStripe" :show-header="showHeader" :height="fixedHeader ? gridHeight : ''" :size="tableSize" 
        ></Table>
        <div class="pagination">
            <Page 
            style="postion:relative;"
            :current = "row"
            :total="intCount" 
            @on-change="changeRow"
            @on-page-size-change = "changeSize"
            :page-size-opts = 'pageSizeOpts'
            :page-size = "size"
            :placement = "'top'"
            show-sizer
            show-total></Page>
        </div>
    </div>
</template>

<script>
    import Util from '@/libs/util';
    import table2excel from '@/libs/table2excel.js';

    function initCol(GridInfo , vm) {
        // 根据后端的DGGRID返回的数据，是否选择了定宽高
        var dgGrid = GridInfo.dgGrid[0];
        var GridInfo = GridInfo.dgColumns; 
        var newGridInfo = []
        vm.tableColumnsFilter = []
        vm.oldColumnsList = []
        vm.oldData = []
       // 如果后端返回行数
       if(dgGrid.rownumbers) {
        var colRow = {
            type: 'index',
            width: 50,
            align: 'center'
        }
        newGridInfo.push(colRow)
        vm.oldData.push(colRow)
        vm.tableColumnsFilter.push(colRow.type);
        vm.oldColumnsList.push({
            key: colRow.type,
            title: colRow.type
        });
    }

    GridInfo.map((item,index) => {
        if(!item.hidden){
                // 如果后台返回的fixed是true，说明不需要自适应，根据后端的宽固定框
                if(item.fixed) {
                    var colRow = {
                        title: item.title,
                        key: item.field,
                        height: item.height,
                        width: item.width,
                        sortable: item.sortable
                    }
                } else {
                    var colRow = {
                        title: item.title,
                        key: item.field,
                        height: item.height,
                        sortable: item.sortable
                    }
                }
                newGridInfo.push(colRow)
                vm.oldData.push(colRow)
                vm.tableColumnsFilter.push(item.field);
                vm.oldColumnsList.push({
                    key: item.field,
                    title: item.title
                });
                
            }
        })

    return newGridInfo;
}

function initWidthCol(GridInfo , vm) {
         // 根据后端的DGGRID返回的数据，是否选择了定宽高
         var dgGrid = GridInfo.dgGrid;
         var GridInfo = GridInfo.dgColumns;

         var newGridInfo = [];
         vm.tableColumnsFilter = []
         vm.oldColumnsList = []
         vm.oldData = []

       // 如果后端返回行数
       if(dgGrid.rownumbers) {
        var colRow = {
            type: 'index',
            width: 50,
            align: 'center'
        }
        newGridInfo.push(colRow)
        vm.oldData.push(colRow)
        vm.tableColumnsFilter.push(colRow.type);
        vm.oldColumnsList.push({
            key: colRow.type,
            title: colRow.type
        });
    }

    GridInfo.map((item,index) => {
        if(!item.hidden){
            var colRow = {
                title: item.title,
                key: item.field,
                height: item.height,
                width: item.width,
                sortable: item.sortable
            }
            newGridInfo.push(colRow)
            vm.oldData.push(colRow)
            vm.tableColumnsFilter.push(item.field);
            vm.oldColumnsList.push({
                key: item.field,
                title: item.title
            });
        }
    })
    return newGridInfo;       
}

function trimStr(str){
    return str.replace(/(^\s*)|(\s*$)/g,"");
}

   // var filterColFunction = undefined;
   // var filterDataFunction = undefined;
   export default {
    name: 'initDataGridBase',
    props: {
        value : Object,
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
        exportAllFilter: {
            type:Boolean,
            default: false
        },
        fixedHeader: {
            type: Boolean,
            default: true
        }
    },
    model: {
        prop: 'value',
        event: 'valueChange'
    },
    data () {
        return {
            param: this.value,
            columnsList: [],
            tableData: [],
            pageSizeOpts: [15 , 30,  60, 80 , 100],
            size: 15,
            row: 1,
            intCount: 0,
            upDownSizeSelect: 'top',
            spinShow: true,
            showBorder: true,
            showStripe: true,
            showHeader: true,
            
            tableSize: 'small',
            xlsxName: '报表.xlsx',
            tableColumnsFilter: [],
            oldColumnsList: [],
            oldData: [],
            pageRow: 1,
            gridHeight: 350
        }
    },
    methods: {
        initDataGrid (filterColCallBack,filterDataCallBack , pageRow , pageSize) {
            // 如果有自定义的过滤表头的函数
            var _this = this;
            if(_this.filterColFunction == undefined && filterColCallBack != undefined) {
                _this.filterColFunction = filterColCallBack;
            }
            // 如果有自定的过滤标题的函数
            if(_this.filterDataFunction == undefined && filterDataCallBack != undefined){
                _this.filterDataFunction = filterDataCallBack;
            }
            
            _this.spinShow = true;
            if(pageRow != undefined){
                _this.param.$rowIndex = pageRow
            } else {
                _this.row = _this.param.$rowIndex;
            }
            if(pageSize != undefined) {
                _this.param.$pageRecord = pageSize
            } else {
                _this.size = _this.param.$pageRecord
            }
            if(_this.param.$key != undefined) {
                _this.param.$key = trimStr(_this.param.$key)
            }
            Util.getDataGrid(_this.param , undefined , undefined , this).then((res) => {
                var data = res
                var dgGridInfo = data.GridInfo.dgGrid[0];
                
                // 如果有自定义的过滤表头的函数，进入这个方法，否则进入默认的方法
                if(_this.filterColFunction != undefined && typeof(_this.filterColFunction) == 'function') {
                    // 这些方法交由前端控制
                    _this.columnsList = _this.filterColFunction(data.GridInfo.dgColumns , _this)
                } else {
                    // 默认的方法，这些方法全部交由后台控制
                    if(dgGridInfo.fit){
                        // 这个方法由后端全权控制宽高
                        _this.columnsList = initWidthCol(data.GridInfo , _this);

                    } else {
                        //这个方法后端只能选择控制列的宽高
                        _this.columnsList = initCol(data.GridInfo , _this);
                    }
                }

                // 如果有自定义的过滤标题的函数，进入这个过滤方法，否则进入默认的方法
                if(_this.filterDataFunction != undefined && typeof(_this.filterDataFunction) == 'function') {
                    _this.tableData = _this.filterDataFunction(data.dgData , _this)
                } else {
                    _this.tableData = data.dgData
                }
                
                
                _this.intCount = data.intCount - 0
                _this.spinShow = false
            }) 
        },
        filterColCallBack(col) {

            return col;
        },
        filterDataCallBack(data) {
            return data;
        },
        changeRow(row) {
            this.pageRow = row
            this.initDataGrid(undefined , undefined , row , undefined)
        },
        changeSize(size) {
            this.initDataGrid(undefined , undefined , undefined , size)
        },
        currentChange(currentRow , oldCurrentRow) {
            this.$emit('selectRow', currentRow);
        },
        dbClickRow(data,index) {
            this.$emit('dbClickRow', data);
        },
        changeTableColumns(){
            var list = this.getTable2Columns();
            this.columnsList = list.newColList;
        },
        getTable2Columns() {
            var oldColList = this.oldData;
            var selected = this.tableColumnsFilter;
            var newColList = [];
            selected.map((col)=> {
                oldColList.map((item , index) => {
                    if(col == item.key){
                        newColList.push(item);
                    }
                })
            })
            return {
                newColList: newColList,

            };
        },
        showInfo(index) {
            this.$emit('showInfo' ,this.tableData[index] )
        },
        selectStatu(data) {
            this.$emit('selectGroup' , data )
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
            var allData = _this.param;
            _this.xlsxName = filename + '.xlsx';
             // 如果exportAllFilter是true，则派发出主要组件操作，否则进行常规操作
             if(!_this.exportAllFilter) {
                _this.spinShow = true;
                allData.$rowIndex = 1;
                allData.$pageRecord = 100000;
                Util.getDataGrid(allData , undefined , undefined , this).then((res) => {
                    _this.spinShow = false;
                    this.$emit('exportAllData', res);
                })
            } else {
                _this.$emit('exportAllData', _this);
            }
            
        }
    },
    computed: {

    },
    mounted () {
        this.gridHeight = Util.dataGridHeight()
    },
    created () {

    },
    watch : {
        value (val)  {
            this.param = val
            this.initDataGrid()
        }
    }

};
</script>
