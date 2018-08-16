<style lang="less">
    @import '../../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-10" v-show="true">
            <Col span="7">
                订单号：
                <Input v-model="windowData.Orders"  placeholder="请选择订单" style="width: 200px"  readonly></Input>
            </Col>
            
            
        </Row>
        <Row class="margin-top-10">
            <Col span="6">
                大车司机:
                <selectDeliveryComponent :RoleId="'9'" @on-change="selectDeliveryChange"></selectDeliveryComponent>
            </Col>
            <Col span="3">
                <span  ><Button type="primary" icon="search" @click="ok()">委派</Button></span>
            </Col>
        </Row>
        <Row class="margin-top-10">
            
        </Row>
        <Row class="margin-top-10">
            <initDataGridCompoent ref="table" :param="form"  @selectGroup="selectGroup" :selection="true"></initDataGridCompoent>
        </Row>
    </div>
</template>

<script>
import baseData from '@/libs/baseData'
import Util from '@/libs/util';
 // dataGrid组件
import initDataGridCompoent from '../../toolbar-components/initDataGrid-noPage-component';
import selectDeliveryComponent from '../../toolbar-components/selectDelivery-component'

export default {
    name: 'consignmentDeliveryDetailsComponent',
    components: {
        initDataGridCompoent,
        selectDeliveryComponent
    },
    props: {
        param: Object
    },
    data () {
        return {
            form: {
                isLoad:  true,
                $pageRecord: 30,
                $Status: 5,
                $WarhoursCode: '',
                $StartDate: '',
                $EndDate: '',
                $key: '',
                $DriverId: '',

                strMethod: 'QueryConsignmentDeliveryDetailsList'

            },
            windowData:{
                DeliveryId: '',
                Orders: '',
                WarhoursName: '',
                LogisticsNos: ''
            },
            showForm: false,
            selectRowData: []
        };
    },
    methods: {
        getData() {
             for(var key in this.form) {
                    if(this.form[key] === ''){
                        this.form[key] = undefined;
                    }
                } 
            this.$refs.table.initDataGrid()
        },
        selectGroup(data) {
            this.selectRowData = data
            let objList = data;
            var Ids = '';
            var LogisticsNos = '';
            for (var i = 0; i < objList.length; i++) {
                if(i == (objList.length - 1)){
                    Ids += objList[i].Id;
                    LogisticsNos += objList[i].LogisticsNo;
                } else {
                    Ids += objList[i].Id + ',';
                    LogisticsNos += objList[i].LogisticsNo + ',';
                }
                
            }
            this.windowData.WarhoursName = objList[0].WarhoursName
            this.windowData.LogisticsNos = LogisticsNos;
            this.windowData.Orders = Ids;
        },
        tbAddRow() {
            var selectRowData = this.selectRowData;
            var _this = this;
            this.showForm = true;
        },
        selectDeliveryChange(data) {
            this.windowData.DeliveryId = data
        },
        ok() {
            console.log(this.windowData)
            var _this =this;
            if(this.selectRowData.length == 0) {
                _this.$Notice.warning({
                    title: '操作失败',
                    desc: '请选择一项'
                })
                return
            }
            if(this.windowData.DeliveryId == '') {
                _this.$Notice.warning({
                    title: '操作失败',
                    desc: '请选择要委派的大车司机'
                })
                return
            }
            Util.getAjaxData(_this.windowData , undefined , '0A71BF01-F6E5-46D9-8D5E-9CD1F285395C' , this).then((res) => {
                if (data.errMsg || data.result != 'ok') {
                    _this.$Notice.warning({
                        title: '操作失败',
                        desc: data.errMsg
                    })
                    return false;
                }

            })
            _this.getData()
        }
    },
    mounted () {
        // 可在此从服务端获取表格数据
        this.form.$WarhoursCode = this.param.WarhoursCode
        this.form.$StartDate = this.param.CreateDate + ' 00:00:00'
        this.form.$EndDate = this.param.CreateDate + ' 23:59:59'
        this.form.$key = this.param.UserId
        this.form.$DriverId = this.param.DriverId
        this.getData()
    }
};
</script>
