<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div @keyup.enter="getData()">

        <Card>
            <Row v-if="buttonGroup.length != 0">
                <span style="margin: 0 10px;" v-for="item in buttonGroup">
                    <Button :type="item.strValue" :icon="item.strImg" @click='buttonEvent(item.strEventMethod)'>{{item.strText}}</Button>
                </span>
            </Row>
            <!-- <Row >
                <span style="margin: 0 10px;">
                    <Button type="success" icon="android-add" @click="addProduct(0)">添加会员</Button>
                </span>
                <span style="margin: 0 10px;">
                    <Button type="warning" icon="wrench" @click="addProduct(1)">修改</Button>
                </span>
                <span style="margin: 0 10px;">
                    <Button type="error" icon="minus" @click="delRow()">删除</Button>
                </span>
            </Row> -->
            <Row class="margin-top-10">
                <span style="margin: 0 10px;">
                    表格样式:
                    <i-switch v-model="showControl"  size="large"></i-switch>
                </span>
                <span style="margin: 0 10px;">
                    角色:
                    <selectRoleComponent @on-change="selectRoleChange"></selectRoleComponent>
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
            <initDataGridCompoent ref="dataGrid" :param="form" :showControl="showControl" @selectRow="selectRow" @dbClickRow="dbClickRow"></initDataGridCompoent>
        </Card>
        <addMemberManageComponent ref="showEdit" :param="selectRowData" @onSuccess="getData()"></addMemberManageComponent>
    </div>
</template>
<!-- 第三方公司管理 -->
<script>
    import Util from '../../libs/util';
    import allexcel from '@/libs/allexcel'
    // 头部组件
    import datePickerCompoent from '../toolbar-components/datePicker-component';
    import selectRoleComponent from '@/views/toolbar-components/selectRole-component';

    // dataGrid组件
    import initDataGridCompoent from '../toolbar-components/initDataGrid-component';
    import addMemberManageComponent from './components/addMemberManage-component'


    export default {
        name: 'MemberManagementView',
        components: {
            datePickerCompoent,
            addMemberManageComponent,
            selectRoleComponent,
            initDataGridCompoent
        },
        data () {
            return {
                form: {
                    $key: '',

                    isLoad: true, 
                    $pageRecord: 15,
                    $rowIndex : 1,
                    strMethod: 'QueryUserInfoList'

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
                if(e === 'delete') {
                    this.delRow()
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
            selectRoleChange(data) {
                this.form.$RoleId = data
            },
            addProduct(val) {
                if(val === 1 && this.selectRowData == undefined){
                    this.$Message.warning('请选择一行内容!');
                    return
                }
                this.$refs.showEdit.showModal(val)
            },
            delRow() {
                let _this = this;
                let row = this.selectRowData
                if(row == undefined) {
                    _this.$Message.warning('请选择一行内容!');
                }
                this.$Modal.confirm({
                    title: '确定删除？',
                    content:  '是否确认删除 编号为：【' + row.Id + '】的提点' + row.Operation + '地址信息？',
                    onOk: function() {
                        var par = {
                            'Id': row.Id,
                            'rowState' : 'D'
                        }
                        Util.getAjaxData(par , undefined , '5fac259a-ca06-4a8b-9554-bd67e20f1697').then((data) => {
                            if (data.errMsg || data.result != 'ok') {
                                _this.$Message.error(data.errMsg);
                                return false;
                            }
                            _this.$Message.success("删除！");
                            _this.getData()
                        })
                    }
                })
            }
        },
        mounted () {
            // 可在此从服务端获取表格数据
            Util.initButton(this)
            this.getData()
        }
    };
</script>
