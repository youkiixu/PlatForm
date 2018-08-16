<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div @keyup.enter="getData()">

        <Card>
            <Row>
            	
                <Col span="4">
                    仓库:
                    <selectWarhours @on-change="selectWarhoursChange"></selectWarhours>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="4">
                    关键词:<Input v-model="form.$key" placeholder="物流单/订单号/会员号" style="width: 150px" />
                </Col>
                <Col span="16">
                    时间日期
                    <datePickerCompoent
                    :showSelect="false"
                    @startDateChange="startDateChange"
                    @endDateChange="endDateChange"
                    ></datePickerCompoent>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="3" style="padding-top: 6px;">
                    表格样式
                    <i-switch v-model="showControl"  size="large"></i-switch>
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
    // 头部组件
    import selectWarhours from '../toolbar-components/selectWarhours-component';
    import datePickerCompoent from '../toolbar-components/datePicker-component';   
    // dataGrid组件
    import initDataGridCompoent from '../toolbar-components/initDataGrid-component';
    
    // 委派发货组件
    import consignmentDeliveryDetailsComponent from './component/consignmentDeliveryDetailsComponent'

    export default {
        name: 'ConsignmentDeliveryView',
        components: {
            datePickerCompoent,
            selectWarhours,
            initDataGridCompoent,
            consignmentDeliveryDetailsComponent
        },
        data () {
            return {
                form: {
                    $key: '',
                    $StartDate: '',
                    $EndDate: '',

                    $Status: 5,
                    isLoad: true,
                    $pageRecord: 15,
                    $rowIndex : 1,
                    strMethod: 'QueryConsignmentDeliveryList',

                    $WarhoursCode: '',
                },
                showControl: false,
                selectRowData: undefined,
            };
        },
        methods: {
            getData () {
                //  for(var key in this.form) {
                //     if(this.form[key] === ''){
                //         this.form[key] = undefined;
                //     }
                // } 
                this.$refs.dataGrid.initDataGrid()
            },
            selectRow(data) {
                this.selectRowData = data

            },
            dbClickRow(data) {
                var _this = this;
                this.selectRowData = data
                 this.$Modal.info({
                    width: 1000,
                    okText: '关闭',
                    render: (h) => {
                        return h(consignmentDeliveryDetailsComponent ,{
                            name: 'c',
                            props: {
                                param: data
                            }
                        })
                    }
                })
            },
            startDateChange(data) {
                this.form.$StartDate = data
            },
            endDateChange(data) {
                this.form.$EndDate = data
            },
            selectWarhoursChange(data) {
                this.form.$WarhoursCode = data + ''
            }
        },
        mounted () {
            // 可在此从服务端获取表格数据
            var date = Util.nowTime();
            this.form.$StartDate = date.formatwdate;
            this.form.$EndDate = date.formatnowdate;
            this.getData()

        }
};
</script>
