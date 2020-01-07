
<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div @keyup.enter="getData()">

        <Card>
            <Row>
                <baseTop
                @add="add"
                @modify="modify"
                @del="del"
                ></baseTop>
            </Row>
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

        <Modal v-model="modal1" title="修改名片信息">
            <Steps :current="current" style="margin-bottom:10px;">
                <Step title="填写更新资料"></Step>
                <Step title="上传文件"></Step>
            </Steps>
            <Form :model="selectRowData"  ref="formValidate" :label-width="80" >
                <FormItem v-if="current===2" label="文件" label-position="right" :label-width="100">
                    <Upload :action="actionUrl" :data="selectRowData" @on-success="cancel">
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                    </Upload>
                </FormItem>
                <FormItem v-if="current===1" label="APP名称">
                    <Input v-model="selectRowData.appName" ></Input>
                </FormItem>
                <FormItem v-if="current===1" label="MD5">
                    <Input v-model="selectRowData.jsVersion" ></Input>
                </FormItem>
                <FormItem v-if="current===1" label="安卓版本号">
                    <Input v-model="selectRowData.android" ></Input>
                </FormItem>
                <FormItem v-if="current===1" label="iOS版本号">
                    <Input v-model="selectRowData.iOS" ></Input>
                </FormItem>
            </Form>
            <Button type="primary" @click="next" v-if="current === 1">下一步</Button>
            <Button type="primary" @click="pre" v-if="current === 2">上一步</Button>
            <div slot="footer">
                <Button type="error" size="large" @click="cancel">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<!-- 第三方公司管理 -->
<script>
    import Util from '../../libs/util';
    import baseTop from "@/components/baseTop-component/baseTop-component";
    import initDataGridCompoent from '../toolbar-components/initDataGrid-noPage-component';
    

    export default {
        name: 'GetHotUpdate',
        components: {
            initDataGridCompoent,
            baseTop
        },
        data () {
            return {
                form: {
                    $key: '',
                    isLoad: true, 
                    $pageRecord: 15,
                    strMethod: 'GetHotUpdate'
                    
                },
                showControl: false,
                selectRowData: {
                    appName: '',
                    jsVersion: '',
                    iOS: '',
                    android: ''
                },
                modal1: false,
                current: 1,
                actionUrl: '//localhost:8089/api/Global/HotUpdate/HotUpdate'
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
            },
            add() {
                this.modal1 = true
            },
            modify() {

            },
            del() {
                let _this = this;
                let row = this.selectRowData
                if(row == undefined) {
                    _this.$Message.warning('请选择一行内容!');
                }
                this.$Modal.confirm({
                    title: '确定删除？',
                    content:  '是否确认删除？',
                    onOk: function() {
                        var par = {
                            'Id': row.id,
                            'rowState' : 'D'
                        }
                        Util.getAjaxData(par , 'GetHotUpdate').then((data) => {
                            if (data.errMsg || data.result != 'ok') {
                                _this.$Message.error(data.errMsg);
                                return false;
                            }
                            _this.$Message.success("删除！");
                            _this.getData()
                        })
                    }
                })
            },
            ok() {

            },
            cancel() {
                this.modal1 = false
            },
            next() {
                for (const key in this.selectRowData) {
                    if(this.selectRowData[key] === ''){
                        this.$Notice.error({
                            title: '提交失败',
                            desc: '资料要补充完整'
                        });
                        return
                    }
                }
                this.current = 2
            },
            pre() {
                this.current = 1
            }
        },
        mounted () {
            this.getData()
            if(Util.env === 'development'){
                this.actionUrl = '//localhost:8089/api/Global/HotUpdate/HotUpdate'
            } else {
                this.actionUrl = '/Global/HotUpdate/HotUpdate'
            }
        },
        created () {

        }
    };
</script>
