<style lang="less">
    @import '../../../styles/common.less';

</style>

<template>
    <Modal
    v-model="showEdit"
    title="新增/修改回仓"
    :width="400"
    @on-ok="ok"
    @on-cancel="cancel">
    <Form :model="pubForm" label-position="right" :label-width="100" >
        <FormItem label="起点">
            <Select v-model="pubForm.selectStartPoint" filterable>
                <Option v-for="item in selectPoint" :value="item.Text">{{item.Text}}</Option>
            </Select>
        </FormItem>
        <FormItem label="终点" label-position="right" :label-width="100"> 
            <Select v-model="pubForm.selectEndPoint" filterable>
                <Option v-for="item in selectPoint" :value="item.Text">{{item.Text}}</Option>
            </Select>
        </FormItem>
        <FormItem label="提点数"  label-position="right" :label-width="100">
            <InputNumber :min="0" v-model="pubForm.Remind"></InputNumber >
        </FormItem>
        <FormItem label="是否启用"> 
            <RadioGroup v-model="pubForm.selectEnabled">
                <Radio label="0">否</Radio>
                <Radio label="1">是</Radio>
            </RadioGroup>
        </FormItem>
    </Form>

</Modal>
</template>

<script>
    import Util from '@/libs/util'
    import Cookies from 'js-cookie';
    import toolMap from '@/libs/map'

    export default {
        name: 'addProjectProductsManagentComponent',
        props: {
            param: Object

        },
        data () {
            return {
                pubForm: {
                    selectStartPoint: '南海总仓',
                    selectEndPoint: '南海总仓',
                    selectEnabled: '0',
                    Remind: 0
                },
                selectPoint: [],
                index: 1,
                showEdit: false,
                    type: 0 //0是新增，1是修改
                };
            },
            methods: {
                handleReset (name) {
                    this.pubForm.selectStartPoint = '南海总仓'
                    this.pubForm.selectEndPoint =  '南海总仓'
                    this.pubForm.selectEnabled = '0'
                    this.pubForm.Remind = 0

                },
                loadForm() {
                    var row = this.param
                    this.pubForm.selectStartPoint = row.StartPoint
                    this.pubForm.selectEndPoint = row.EndPoint
                    this.pubForm.selectEnabled = row.EndPoint ? '1' : '0'
                    this.pubForm.Remind = row.Remind
                },
                showModal(type) {
                    // type为0是新增，type为1是修改
                    this.type = type
                    if(type == 0){
                        this.handleReset()
                    } else {
                        this.loadForm()
                    }
                    this.showEdit = true
                },
                ok () {
                    if(this.type == 0) {
                        this.addRow()
                    }
                    if(this.type == 1) {
                        this.modifyRow()
                    }
                    this.showEdit = false
                },
                addRow() {
                    var _this = this;
                    var userInfo = JSON.parse(Cookies.get('userInfo'));
                    var selectGroup = this.selectPoint;
                    var startItem = {};
                    var endItem = {};
                    selectGroup.map((item) => {
                        if(item.Text === _this.pubForm.selectStartPoint){
                            startItem = item
                        }
                        if(item.Text === _this.pubForm.selectEndPoint) {
                            endItem = item
                        }
                    })
                    var par = {
                        StartPoint: startItem.Text,
                        StartPointId: startItem.Id,
                        EndPoint: endItem.Text,
                        EndPointId: endItem.Id,
                        Remind: _this.pubForm.Remind,
                        // 起点是不是供应商
                        IsManufactor:  startItem.IsManufactor, 
                        Enabled: _this.pubForm.selectEnabled,
                        CreateDate: Util.nowTime().formatnowdate,
                        CreateId: userInfo.userId
                    }
                    Util.getAjaxData(par , undefined , '5415EBC3-83FA-41DE-954A-FF1C1A522B30').then((data) => {
                        if (data.errMsg || data.result != 'ok') {
                            _this.$Message.error(data.errMsg);
                            return false;
                        }
                        _this.$Message.success('设置成功！');
                        _this.$emit('onSuccess' , '')
                    })

                },
                modifyRow() {
                    var _this = this;
                    var userInfo = JSON.parse(Cookies.get('userInfo'));
                    var selectGroup = this.selectPoint;
                    var startItem = {};
                    var endItem = {};
                    selectGroup.map((item) => {
                        if(item.Text === _this.pubForm.selectStartPoint){
                            startItem = item
                        }
                        if(item.Text === _this.pubForm.selectEndPoint) {
                            endItem = item
                        }
                    })
                    var par = {
                        rowState: 'M',
                        Id: _this.param.Id,
                        StartPoint: startItem.Text,
                        StartPointId: startItem.Id,
                        EndPoint: endItem.Text,
                        EndPointId: endItem.Id,
                        Remind: _this.pubForm.Remind,
                        // 起点是不是供应商
                        IsManufactor:  startItem.IsManufactor, 
                        Enabled: _this.pubForm.selectEnabled,
                        ModifyDate: Util.nowTime().formatnowdate,
                        ModifyId: userInfo.userId
                    }
                    Util.getAjaxData(par , undefined , '5415EBC3-83FA-41DE-954A-FF1C1A522B30').then((data) => {
                        if (data.errMsg || data.result != 'ok') {
                            _this.$Message.error(data.errMsg);
                            return false;
                        }
                        _this.$Message.success('修改成功！');
                        _this.$emit('onSuccess' , '')
                    })

                },
                cancel () {
                    this.showEdit = false
                }
            },
            created () {
        // 可在此从服务端获取表格数据
        var _this = this;
        Promise.all([Util.getAjaxData({} , 'GetWarhoursList' , undefined) , Util.getAjaxData({} , 'GetThirdPlatformList' , undefined)]).then((res)=> {
            // _this.selectPoint.push(())
            res[0].map((item) => {
                _this.selectPoint.push({
                    Id: item.Id,
                    Text: item.WarhoursName,
                    IsManufactor: false
                })
            })
            res[1].map((item) => {
                _this.selectPoint.push({
                    Id: item.Id,
                    Text: item.Name,
                    IsManufactor: true
                })
            })
        })
    }
};
</script>
