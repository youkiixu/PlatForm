<style lang="less">
    @import '../../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <initDataGridCompoent ref="table" :param="form" :showControl="true" @selectGroup="selectGroup" ></initDataGridCompoent>
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
            param: Object,
            param_key:Object
        },
        data () {
            return {
                form: {
                    isLoad:  true,
                    $pageRecord: 30,
                    strMethod: 'QueryTransitSummaryDetailedList'
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
            this.form.$LinCode = this.param.LinCode
            this.form.$StartDate = this.param_key.$StartDate
            this.form.$EndDate = this.param_key.$EndDate
            this.form.$MStartDate = this.param_key.$MStartDate
            this.form.$MEndDate = this.param_key.$MEndDate
            this.form.$key = this.param_key.$key
            this.getData()
        }
    };
</script>
