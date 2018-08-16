
<style lang="less">
    @import '../../styles/common.less';
</style>
 
<template>
    <div @keyup.enter="getData()">

        <Card>
            <Row>
                <Col span="4">
                <Select v-model="keyIdSelected" style="width:100px" @on-change="keyIdChange">
                    <Option v-for="item in keyid" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Input v-model="searchkey" placeholder="" style="width: 150px" />
                </Col>
                <Col span="16">
                时间日期:
                <datePickerCompoent
                        :showSelect="false"
                        @startDateChange="startDateChange"
                        @endDateChange="endDateChange"
                ></datePickerCompoent>
                </Col>
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
            <initDataGridCompoent ref="dataGrid" :showWinTable="true" :param="form" :exportAll="true" :showControl="showControl" @selectRow="selectRow" @dbClickRow="dbClickRow" @exportAllData="exportAllDataChange"></initDataGridCompoent>
        </Card>
    </div>
</template>
<!-- 快递订单列表 -->
<script>
    import Util from '../../libs/util';
    import allexcel from '@/libs/allexcel'
    // 头部组件
    import datePickerCompoent from '../toolbar-components/datePicker-component';

    // dataGrid组件
    import initDataGridCompoent from '../toolbar-components/initDataGrid-component';


    export default {
        name: 'PaymentList',
        components: {
            datePickerCompoent,

            initDataGridCompoent
        },
        data () {
            return {
                form: {
                    $StartDate: '',
                    $EndDate: '',
                    
                    isLoad: true,
                    $pageRecord: 15,
                    $rowIndex : 1,
                    strMethod: 'YJAPP_PaymentList'

                },
                searchkey: '',
                keyIdSelected: "0",
                keyid: [
                    {
                    value: '0',
                    label: '订单号'
                    },
                    {
                    value: "1",
                    label: "流水号"
                    },
                    {
                    value: "2",
                    label: "操作人id"
                    },
                    {
                    value: "3",
                    label: "操作人姓名"
                    }
                ],
                showControl: false,
                selectRowData: undefined,
            };
        },
        methods: {
            getData () {
                switch (this.keyIdSelected) {
                    case "1":
                        this.form = Object.assign(this.form, { $payNo: this.searchkey });
                    break;
                    case "2":
                        this.form = Object.assign(this.form, {
                            $realName: this.searchkey
                        });
                    break;
                    case "3":
                     this.form = Object.assign(this.form, { $realName: this.searchkey });
                    break;
                    default:
                        this.form = Object.assign(this.form, { $orderId: this.searchkey });
                    break;
                }
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
            keyIdChange(key) {
                this.form.$realName = "";
                this.form.$payNo = "";
                this.form.$adminId = "";
                this.form.$orderId = "";
                this.keyIdSelected = key;
            }
        },
        mounted () {

            this.getData()
        }
    }; 
</script>
