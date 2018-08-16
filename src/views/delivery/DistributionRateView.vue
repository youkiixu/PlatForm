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
    import initDataGridCompoent from '../toolbar-components/initDataGrid-noPage-component';

    export default {
        name: 'DistributionRateView',
        components: {
            datePickerCompoent,
            selectDelivery,
            initDataGridCompoent
        },
        data() {
            return {
                form: {
                    $StartDate: '',
                    $EndDate: '',

                    isLoad: true,
                    $pageRecord: 15,
                    // $rowIndex : 1,
                    strMethod: 'QueryDistributionRateList',

                    $DistributorId: '',
                    $rId: '',
                    $MStartDate: '',
                    $MEndDate: ''
                },
                showControl: false,
                selectRowData: undefined,
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
                this.$refs.dataGrid.resizePage(1, 10)
                this.$refs.dataGrid.initDataGrid(this.filterCol)
            },
            filterCol(GridInfo, vm) {
                var _this = this;
                var newGridInfo = []
                vm.tableColumnsFilter = []
                vm.oldColumnsList = []
                vm.oldData = []
                var colRow = {
                    type: 'index',
                    width: 50,
                    align: 'center'
                }
                newGridInfo.push(colRow)
                Util.autoPushCol(colRow, vm)
                GridInfo.map((item, index) => {
                    if(!item.hidden) {
                        if(item.field == "未配送数") {
                            var colRow = {
                                title: item.title,
                                key: item.field,
                                align: 'center',
                                render: (h, params) => {
                                    var row = params.row;
                                    var buttonGroup = [h('Button', {
                                        props: {
                                            type: 'ghost',
                                            size: 'small',
                                        },
                                        style: {
                                            marginRight: '5px',
                                            width: '100px',
                                            color: '#ed3f14'
                                        },
                                        on: {
                                            click: () => {
                                                _this.singleClickRow(row, {
                                                    '@nStatus': '50,33'
                                                })
                                            }
                                        }
                                    }, row.未配送数)]

                                    return h('div', buttonGroup);
                                }
                            }
                            newGridInfo.push(colRow)
                            Util.autoPushCol(colRow, vm)
                        } else if(item.field == '已配送数') {
                            var colRow = {
                                title: item.title,
                                key: item.field,
                                align: 'center',
                                render: (h, params) => {
                                    var row = params.row;
                                    var buttonGroup = [h('Button', {
                                        props: {
                                            type: 'ghost',
                                            size: 'small',
                                        },
                                        style: {
                                            marginRight: '5px',
                                            width: '100px',
                                            color: '#19be6b'
                                        },
                                        on: {
                                            click: () => {
                                                _this.singleClickRow(row, {
                                                    '@fStatus': 50
                                                })
                                            }
                                        }
                                    }, row.已配送数)]

                                    return h('div', buttonGroup);
                                }
                            }
                            newGridInfo.push(colRow)
                            Util.autoPushCol(colRow, vm)
                        } else {
                            var colRow = {
                                title: item.title,
                                key: item.field,
                                height: item.height,
                                sortable: item.sortable
                            }
                            newGridInfo.push(colRow)
                            Util.autoPushCol(colRow, vm)
                        }

                    }
                })
                return newGridInfo;
            },
            selectRow(data) {
                this.selectRowData = data
            },
            dbClickRow(data) {
                // this.selectRowData = data
                var row = this.selectRowData
                var _this = this;
                // this.selectRowData = data
                let proData = {
                    isLoad: true,
                    $DistributorId: row.Id,

                    $StartDate: this.form.$StartDate,
                    $EndDate: this.form.$EndDate,
                    $DisStartDate: this.form.$MStartDate,
                    $DisEndDate: this.form.$MEndDate,
                    strMethod: 'QueryBusinessDistributionSummaryDetailsListNew'
                }
                for(var key in proData) {
                    if(proData[key] === "") {
                        proData[key] = undefined;
                    }
                }
                Util.openNewPage(_this, 'newPageDistributionRateView', undefined, proData);
                _this.$router.push({
                    name: 'newPageDistributionRateView',
                    params: proData
                });
            },
            singleClickRow(rowData, singleItem) {
                var row = rowData
                var _this = this;
                // this.selectRowData = data
                let proData = {
                    isLoad: true,
                    $DistributorId: row.Id,

                    $StartDate: this.form.$StartDate,
                    $EndDate: this.form.$EndDate,
                    $DisStartDate: this.form.$MStartDate,
                    $DisEndDate: this.form.$MEndDate,
                    strMethod: 'QueryBusinessDistributionSummaryDetailsListNew'
                }
                if(singleItem != undefined) {
                    proData = Object.assign(proData, singleItem)
                }
                for(var key in proData) {
                    if(proData[key] === "") {
                        proData[key] = undefined;
                    }
                }
                Util.openNewPage(_this, 'newPageDistributionRateView', undefined, proData);
                _this.$router.push({
                    name: 'newPageDistributionRateView',
                    params: proData
                });
            },
            selectDeliveryChange(data) {
                this.form.$DistributorId = data
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
            }

        },
        mounted() {
            // 可在此从服务端获取表格数据
            var datePickValue = this.$refs.datePicker.getData(0, Util.nowTime().formatwdate, Util.nowTime().formatnowdate)
            this.dateSetting(datePickValue)
            this.getData()

        }
    };
</script>

