<style lang="less">
@import "../../styles/common.less";
</style>

<template>
    <div @keyup.enter="getData()">

        <Card>
            <Row>
                <Col span="6"> 关键词:
                <Input v-model="form.$key" placeholder="" style="width: 150px" />
                </Col>
                <Col span="4"> 扫描业务员:
                <selectDelivery @on-change="selectDeliveryChange"></selectDelivery>
                </Col>
                <Col span="4"> 订单状态:
                <selectStatu @on-change="selectStatuChange"></selectStatu>
                </Col>

            </Row>
            <Row class="margin-top-10">
                <Col span="4">
                <span style="margin: 0 10px;">
                    付款状态:
                    <Select clearable v-model="form.$bPay"  style="width:150px">
                        <Option v-for="item in isPay" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </span>
                </Col>
                <Col span="12"> 时间日期:
                <datePickerCompoent :showSelect="false" @typeChange="typeChange" @startDateChange="startDateChange" @endDateChange="endDateChange"></datePickerCompoent>
                </Col>
            </Row>
            <Row class="margin-top-10">

                <Col span="3" style="padding-top: 6px;"> 表格样式
                <i-switch v-model="showControl" size="large"></i-switch>
                </Col>
                <Col span="3">
                <span style="margin: 0 10px;">
                    <Button type="primary" icon="search" @click="getData()">搜索</Button>
                </span>
                </Col>

            </Row>
        </Card>

        <Card class="margin-top-10">
            <initDataGridCompoent ref="dataGrid" @exportAllData="exportAllDataChange" :param="form" :showControl="showControl" @selectRow="selectRow" @dbClickRow="dbClickRow" :exportAll='true'></initDataGridCompoent>
        </Card>
    </div>
</template>
<!-- 物流订单列表 -->
<script>
import Util from "../../libs/util";
import toolMap from "@/libs/map";
import Cookies from "js-cookie";
import expandRow from "./components/invoice-expand-row";
import allexcel from '@/libs/allexcel'
// 头部组件
import selectStatu from "../toolbar-components/selectStatu-component";
import selectQitems from "../toolbar-components/selectQitems-component";
import datePickerCompoent from "../toolbar-components/datePicker-component";
import selectDelivery from "../toolbar-components/selectDelivery-component";
// dataGrid组件
import initDataGridCompoent from "../toolbar-components/initDataGrid-component";

export default {
  name: "QueryOrderView",
  components: {
    datePickerCompoent,
    selectStatu,
    selectQitems,
    selectDelivery,
    expandRow,

    initDataGridCompoent
  },
  data() {
    return {
      searchkey: "",
      form: {
        $key: "",
        $StartDate: "",
        $EndDate: "",

        $IsExpress: 0,

        isLoad: true,
        $pageRecord: 15,
        $rowIndex: 1,
        strMethod: "getFahuoList",
        $rId: "",
        $Status: "",
        $LinCode: "",
        $WarhoursCode: "",
        $DistributorId: "",
        $ThirdPlatformId: "",
        $Qitems: "",
        $IsCollection: "",

        $MStartDate: "",
        $MEndDate: ""
      },
      keyIdSelected: "0",
      isPay: [{
            value: '0',
            label: '未付款'
        },{
            value: '1',
            label: '已付款'
        }],
      keyid: [
        {
          value: '0',
          label: '物流单号'
        },
        {
          value: "1",
          label: "新商城单号"
        },
        {
          value: "2",
          label: "旧商城单号"
        },
        {
          value: "3",
          label: "会员号"
        }
      ],
      showControl: false,
      selectRowData: undefined
    };
  },
  methods: {
    getData() {
      this.firstGetData()
    },
    firstGetData() {
      for (var key in this.form) {
        if (this.form[key] === "") {
          this.form[key] = undefined;
        }
      }
      this.form.$rowIndex = 1;
      this.$refs.dataGrid.initDataGrid(this.filterCol);
    },
    // 自定义过滤表头,不需要可以不写
    filterCol(GridInfo, vm) {
      var newGridInfo = [];
      vm.tableColumnsFilter = [];
      vm.oldColumnsList = [];
      vm.oldData = [];
      var colRow = {
        type: "expand",
        key: "expand",
        width: 50,
        render: (h, params) => {
          return h(expandRow, {
            props: {
              row: params.row
            }
          });
        }
      };
      newGridInfo.push(colRow);
      // 筛选操作需要执行此操作
      Util.autoPushCol(colRow, vm);

      GridInfo.map((item, index) => {
        if (!item.hidden) {
            var colRow = {
              title: item.title,
              key: item.field,
            //   width: item.width,
              height: item.height,
              sortable: item.sortable
            };
            newGridInfo.push(colRow);
            // 筛选操作需要执行此操作
            Util.autoPushCol(colRow, vm);
          }
      });
      return newGridInfo;
    },
    selectRow(data) {
      this.selectRowData = data;
    },
    dbClickRow(data) {
      this.selectRowData = data;
    },
    startDateChange(data) {
      this.form.$StartFDate = data;
    },
    endDateChange(data) {
      this.form.$EndFDate = data;
    },
    selectCollectionChange(data) {
      this.form.$IsCollection = data;
    },

    selectRouteChange(data) {
      this.form.$LinCode = data;
    },
    selectWarhoursChange(data) {
      this.form.$WarhoursCode = data;
    },
    selectDeliveryChange(data) {
      this.form.$DistributorId = data;
    },
    selectStatuChange(data) {
      this.form.$Status = data + "";
    },
    selectThirdPlatformChange(data) {
      this.form.$ThirdPlatformId = data;
    },
    selectQitemsChange(data) {
      this.form.$Qitems = data;
    },
    typeChange(data) {
      // 根据数值类型修改
      if (data == 0) {
        this.form.$MStartDate = undefined;
        this.form.$MEndDate = undefined;
      }
      if (data == 1) {
        this.form.$EndDate = undefined;
        this.form.$StartDate = undefined;
      }
    },
    exportAllDataChange(data) {
      allexcel.tranformAll(data)
    } 
  },
  mounted() {
    // 可在此从服务端获取表格数据
    // var date = Util.nowTime(this);
    // this.form.$StartDate = date.forweek;
    // this.form.$EndDate = date.formatnowdate;
    this.getData();
  }
};
</script>