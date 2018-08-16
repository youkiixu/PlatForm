<style lang="less">
    @import '../../styles/common.less';
</style>
 
<template>  
    <div @keyup.enter="getData()">
 
        <Card>
            <Row v-if="buttonGroup.length != 0">
                <span style="margin: 0 10px;" :key="item.strName" v-for="item in buttonGroup">
                    <Button :type="item.strValue" :icon="item.strImg" @click='buttonEvent(item.strEventMethod)'>{{item.strText}}</Button>
                </span>
            </Row>
            <Row class="margin-top-10">
                <span style="margin: 0 10px;">
                仓库名称:
                <Input v-model="form.$key" placeholder="请输入仓库名称..." style="width: 150px" />
                </span>
                <span style="margin: 0 10px;">
                    区域: 
                    <Select v-model="form.$LogisticsType" clearable style="width: 150px">
                        <Option value="0">内区</Option>
                        <Option value="1">外区</Option>
                        <Option value="2">外省</Option>
                    </Select>
                </span>
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
            <initDataGridCompoent ref="dataGrid" :param="form" :showControl="showControl" @selectRow="selectRow" @dbClickRow="dbClickRow" ></initDataGridCompoent>
        </Card>
 
        <addWarehouseManagentComponent ref="showEdit" :param="selectRowData" @onSuccess="getData()"></addWarehouseManagentComponent>
    </div>
</template>
<!-- 第三方公司管理 -->
<script>
    import Util from '../../libs/util';
    // 头部组件
    import datePickerCompoent from '../toolbar-components/datePicker-component';

    // dataGrid组件
    import initDataGridCompoent from '../toolbar-components/initDataGrid-component';
    import addWarehouseManagentComponent from './components/addWarehouseManagent-component'

    export default {
        name: 'WarehouseManagentView',
        components: {
            datePickerCompoent,
            addWarehouseManagentComponent,
            initDataGridCompoent 
        },
        data () {
            return {
                form: {
                    $key: '',
                    
                    $LogisticsType: '',

                    isLoad: true, 
                    $pageRecord: 15,
                    $rowIndex : 1,
                    strMethod: 'QueryWarhoursList'

                },
                showControl: false,
                selectRowData: undefined,
                buttonGroup:[]
            };
        },
        methods: {
            buttonEvent(e) {
                 
                // 后端定义的按钮，需要在这里注册
                if(e === 'add'){
                    this.addProduct(0)
                }
                if(e === 'modify') {
                    this.addProduct(1)
                }
                if(e === 'loadRoute') {
                    this.addProduct(2)
                }
                if(e === 'setUsers'){
                    this.addProduct(3)
                }
                if(e === 'setAdmin'){
                    this.addProduct(4)
                }
            },
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
                this.selectRowData = data
            },
            startDateChange(data) {
                this.form.$StartDate = data
            },
            endDateChange(data) {
                this.form.$EndDate = data
            },
            exportAllDataChange(data){
                allexcel.tranformAll(data)
            },
            addProduct(val) {
                if(val === 1 || val === 2 || val ===3){
                    if(this.selectRowData == undefined) {
                        this.$Message.warning('请选择一行内容!');
                        return
                    }
                }
                this.$refs.showEdit.showModal(val)
            }
        },
        mounted () {
            // 可在此从服务端获取表格数据
            Util.initButton(this) 
            this.getData()
        }
    };
</script>
