<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div @keyup.enter="getData()">

        <Card>
            <Row>

                <Col span="4"> 扫描业务员:
                <selectDelivery @on-change="selectDeliveryChange"></selectDelivery>
                </Col>

            </Row>
            <Row class="margin-top-10">
                <Col span="6"> 关键词:
                <Input v-model="form.$key" placeholder="请输入关键字..." style="width: 150px" />
                </Col>
                <Col span="16"> 时间日期
                <datePickerCompoent ref="datePicker" @typeChange="typeChange" @startDateChange="startDateChange" @endDateChange="endDateChange"></datePickerCompoent>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="3" style="padding-top: 6px;"> 表格样式
                <i-switch v-model="showControl" size="large"></i-switch>
                </Col>
                <Col span="3">
                <span style="margin: 0 10px;"><Button type="primary" icon="search" @click="getData()">搜索</Button></span>
                </Col>
            </Row>
        </Card>

        <Card class="margin-top-10">
            <initDataGridCompoent ref="dataGrid" :param="form" :showControl="showControl" @selectRow="selectRow" @dbClickRow="dbClickRow"></initDataGridCompoent>
        </Card>
    </div>
</template>
<!-- 委派发货列表 -->
<script>
    import Util from '../../libs/util';
    import Cookies from 'js-cookie';
    // 头部组件
    import selectDelivery from '../toolbar-components/selectDelivery-component';
    import datePickerCompoent from '../toolbar-components/selectDatePicker-component';
    // dataGrid组件
    import initDataGridCompoent from '../toolbar-components/initDataGrid-component';

    export default {
        name: 'ConsignmentDeliveryView',
        components: {
            datePickerCompoent,
            selectDelivery,
            initDataGridCompoent
        },
        data() {
            return {
                form: {
                    $key: '',
                    $StartDate: '',
                    $EndDate: '',

                    isLoad: true,
                    $pageRecord: 15,
                    $rowIndex: 1,
                    strMethod: 'QueryDeliveryPersonnelList',

                    $DistributorId: '',
                    $rId: '',
                    $MStartDate: '',
                    $MEndDate: ''
                },
                showControl: false,
                selectRowData: undefined,
                dateType: 0

            };
        },
        methods: {
            getData() {
                var userInfo = JSON.parse(Cookies.get('userInfo'));
                if(userInfo.RoleId == 21) //代理商为21
                {
                    var par = {
                        strAddress: userInfo.address
                    }
                    Util.getAjaxData(par, undefined, '18c6f7e0-ef20-4088-b034-50c1ef577e39').then((res) => {
                        this.form.$rId = res.Code;
                        this.firstGetData()
                    })
                } else
                    this.firstGetData()

            },
            firstGetData() {
                for(var key in this.form) {
                    if(this.form[key] === '') {
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
                var row = this.selectRowData
                var _this = this;
                // this.selectRowData = data
                let proData = {
                    isLoad: true,
                    $WarhoursCode: row.WarhoursCode,
                    $LinCode: row.LinCode,
                    $DistributorId: row.DistributorId,

                    $StartDate: this.form.$StartDate,
                    $EndDate: this.form.$EndDate,
                    $DisStartDate: this.form.$MStartDate,
                    $DisEndDate: this.form.$MEndDate,
                    strMethod: 'QueryDeliveryPersonnelDetailsList'
                }
                for(var key in proData) {
                    if(proData[key] === "") {
                        proData[key] = undefined;
                    }
                }
                Util.openNewPage(_this, 'DeliveryPersonnelListDetailsView', undefined, proData);
                _this.$router.push({
                    name: 'DeliveryPersonnelListDetailsView',
                    params: proData
                });
            },
            startDateChange(data) {
                this.dateSetting(data)
            },
            endDateChange(data) {
                this.dateSetting(data)
            },
            typeChange(data) {
                this.dateSetting(data)
            },
            dateSetting(data) {
                this.form.$EndDate = undefined
                this.form.$MEndDate = undefined
                this.form.$StartDate = undefined
                this.form.$MStartDate = undefined

                if(data.selectType == 0) {
                    this.form.$StartDate = data.startDateValue
                    this.form.$EndDate = data.endDateValue
                } else if(data.selectType == 1) {
                    this.form.$MStartDate = data.startDateValue
                    this.form.$MEndDate = data.endDateValue
                }
            },
            selectDeliveryChange(data) {
                this.form.$DistributorId = data
            }
        },
        mounted() {
            // 可在此从服务端获取表格数据
            var datePickValue = this.$refs.datePicker.getData(0, Util.nowTime().forweek, Util.nowTime().formatnowdate)
            this.dateSetting(datePickValue)
            this.getData()
        },
        created() {

        }
    };
</script>
