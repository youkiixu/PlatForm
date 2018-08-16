<style lang="less">
    @import '../../styles/common.less';
    .pagination {
        margin: 20px auto 0;
        text-align: center;
    }
    
</style> 
<template>
    <div id="initDataGrid">
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
            <Button type="primary" size="large" @click="exportData(3)"><Icon type="ios-download-outline"></Icon>导出表格数据</Button>
        </div>
        <Table 
        :columns="columnsList" 
        :data="tableData" 
        @on-current-change = "currentChange"
        @on-row-dblclick = "dbClickRow"
        @on-selection-change="selectStatu"
        highlight-row
        ref="table"
        :loading="spinShow"
        :border="showBorder" :stripe="showStripe" :show-header="showHeader" :height="fixedHeader ? gridHeight : ''" :size="tableSize" 
        ></Table>
    </div>
</template>

<script>
    import Util from '../../libs/util';
    import table2excel from '@/libs/table2excel.js';

    function initCol(GridInfo , vm) {
        var newGridInfo = []
        if(vm.selection) {
            newGridInfo.push({
                type: 'selection',
                width: 60,
                align: 'center'
            })
        }
        var colRow = {
            type: 'index',
            width: 50,
            align: 'center'
        }
        newGridInfo.push(colRow)    

        GridInfo.map((item,index) => {
            if(!item.hidden){
                newGridInfo.push({
                    title: item.title,
                    key: item.field,
                    height: item.height,
                    sortable: item.sortable
                }) 
            }
        })
        return newGridInfo;
    }

    function initWidthCol(GridInfo , vm) {
     var newGridInfo = []
     if(vm.selection) {
        newGridInfo.push({
            type: 'selection',
            width: 60,
            align: 'center'
        })
    }
    var colRow = {
        type: 'index',
        width: 50,
        align: 'center'
    }
    newGridInfo.push(colRow)

    GridInfo.map((item,index) => {
        if(!item.hidden){
            newGridInfo.push({
                title: item.title,
                key: item.field,
                width: item.width,
                height: item.height
            })
        }
    })
    return newGridInfo;       
}
function trimStr(str){
    return str.replace(/(^\s*)|(\s*$)/g,"");
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
        selection: {
            type: Boolean,
            default: false
        },
        nowGetData: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            columnsList: [],
            tableData: [],
            intCount: 0,
            size: null,
            spinShow: true,
            showBorder: true,
            showStripe: true,
            showHeader: true,
            fixedHeader: true,
            tableSize: 'small',
            gridHeight: 1000
        }
    },
    methods: {
        initDataGrid (filterColCallBack,filterDataCallBack , pageRow , pageSize) {
            var _this = this;
            var par = {};
            if(_this.filterColFunction == undefined && filterColCallBack != undefined) {
                _this.filterColFunction = filterColCallBack;
            }
            _this.spinShow = true;
            if(_this.param.$key != undefined) {
                _this.param.$key = trimStr(_this.param.$key)
            }
            Util.getDataGrid(_this.param , undefined , undefined , this).then((res) => {
                var data = res
                if(_this.filterColFunction != undefined && typeof(_this.filterColFunction) == 'function') {
                    // 这些方法交由前端控制
                    _this.columnsList = _this.filterColFunction(data.GridInfo.dgColumns , _this)
                } else {
                    if(_this.autoWidth){
                        _this.columnsList = initCol(data.GridInfo.dgColumns , _this)
                    } else {
                        _this.columnsList = initWidthCol(data.GridInfo.dgColumns , _this)
                    }
                }
                
                _this.tableData = data.dgData
                _this.intCount = data.intCount - 0
                _this.spinShow = false;
            })
        },
        resizePage(row,size) {
            this.row = row ? row : 1
            this.size = size ? size : 10
        },
        currentChange(currentRow , oldCurrentRow) {
            this.$emit('selectRow', currentRow);
        },
        dbClickRow(data,index) {
            this.$emit('dbClickRow', data);
        },
        exportData(type) {
            let app = this.$store.state.app;
            let currentPageName = app.currentPageName;
            let currentPath = app.currentPath;
            let filename = ''
            currentPath.map((item) => {
                if(item.name === currentPageName){
                    filename = item.title
                }
            })
            table2excel.transform(this.$refs.table, 'hrefToExportTable', filename);

        },
        selectStatu(data) {
            this.$emit('selectGroup' , data )
        }
    },
    computed: {

    },
    mounted () {
        
      if(this.nowGetData){
        this.initDataGrid()
    }

    this.gridHeight = Util.dataGridHeight() + 120
},
created () {

}
};
</script>
