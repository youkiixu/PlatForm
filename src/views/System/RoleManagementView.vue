
<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div @keyup.enter="getData()">

        <Card>
            <Row class="margin-top-10">
                <span style="margin: 0 10px;">
                    表格样式:
                    <i-switch v-model="showControl"  size="large"></i-switch>
                </span>
                <span style="margin: 0 10px;">
                    关键词:
                    <Input v-model="form.$key" placeholder="请输入关键字..." style="width: 150px" />
                </span>
                <span style="margin: 0 10px;">
                    <Button type="primary" icon="search" @click="getData()">搜索</Button>
                </span>
            </Row>
        </Card>

        <Card class="margin-top-10">
            <initDataGridCompoent ref="dataGrid" :param="form"  :showControl="showControl" @selectRow="selectRow" @dbClickRow="dbClickRow"></initDataGridCompoent>
        </Card>
		<addUserManageComponent ref="showEdit" :param="selectRowData" @onSuccess="getData()"></addUserManageComponent>
    </div>
</template>
<!-- 第三方公司管理 -->
<script>
    import Util from '../../libs/util';
    // 头部组件

    // dataGrid组件
    import initDataGridCompoent from '../toolbar-components/initDataGrid-noPage-component';


    export default {
        name: 'RoleManagementView',
        components: {
            initDataGridCompoent
        },
        data () {
            return {
                form: {
                    $key: '',

                    isLoad: true, 
                    $pageRecord: 15,
                    // $rowIndex : 1,
                    strMethod: 'QueryRoleInfoList'

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
                // this.form.$rowIndex = 1;
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
            selectRoleChange(data) {
            	this.form.$RoleId = data
            },
            endDateChange(data) {
                this.form.$EndDate = data
            },
            addProduct(val) {
                if(val === 1 && this.selectRowData == undefined){
                    this.$Message.warning('请选择一行内容!');
                    return
                }
                this.$refs.showEdit.showModal(val)
            }
        },
        mounted () {
            // 可在此从服务端获取表格数据
            this.getData()
        }
    };
</script>
