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
            <Button type="primary" size="large" @click="exportData(3)"><Icon type="ios-download-outline"></Icon>导出表格数据</Button>
        </div>
        <Table 
        :columns="columnsList" 
        :data="tableData" 
        @on-current-change = "currentChange"
        @on-row-dblclick = "dbClickRow"
        highlight-row
        ref="table"
        :loading="spinShow"
        :border="showBorder" :stripe="showStripe" :show-header="showHeader" :height="fixedHeader ? 350 : ''" :size="tableSize" 
        ></Table>
        <div class="pagination">
            <Page 
            :current = "row"
            :total="intCount" 
            @on-change="changeRow"
            @on-page-size-change = "changeSize"
            :page-size = "size"
            placement="top"
            show-sizer 
            show-total 
            show-elevator></Page>
        </div>
    </div>
</template>

<script>
    import Util from '../../../libs/util';
    import expandRow from './expand-row.vue';
    import table2excel from '@/libs/table2excel.js';

    function initCol(GridInfo) {
        var newGridInfo = []
        newGridInfo.push({
            type: 'expand',
            width: 50,
            render: (h, params) => {
                return h(expandRow, {
                    props: {
                        row: params.row
                    }
                })
            }
        })
        GridInfo.map((item,index) => {
            if(!item.hidden){
                if(index == 8){
                    newGridInfo.push({
                        title: item.title,
                        key: item.field,
                        width: item.width,
                        // fixed: 'right',
                        height: item.height,
                        sortable: item.sortable
                    })
                } else {
                    newGridInfo.push({
                        title: item.title,
                        key: item.field,
                        width: item.width,
                        height: item.height,
                        sortable: item.sortable
                    })
                }
                
            }
        })
        return newGridInfo;
    }

    export default {
        name: 'initDataGrid',
        components: { expandRow },
        props: {
            param: Object,
            showControl: {
                type: Boolean,
                default: false
            },
            isSort: {
                type: Boolean,
                default: true
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


                    _this.columnsList = initCol(data.GridInfo.dgColumns)
                    _this.tableData = data.dgData
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
