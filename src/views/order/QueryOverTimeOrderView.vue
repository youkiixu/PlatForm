<style lang="less">
@import "../../styles/common.less";
</style>

<template>
    <div @keyup.enter="getData()">

        <Card>
            <Row>
                <Col span="6"> 关键词:
                <Select v-model="keyIdSelected" style="width:100px" @on-change="keyIdChange">
                    <Option v-for="item in keyid" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Input v-model="searchkey" placeholder="" style="width: 150px" />
                </Col>
                <Col span="6"> 第三方公司:
                <selectThirdPlatform @on-change="selectThirdPlatformChange"></selectThirdPlatform>
                </Col>
                <Col span="6"> 项目产品:
                <selectQitems @on-change="selectQitemsChange"></selectQitems>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="6"> 是否代收款:
                <selectCollection @on-change="selectCollectionChange"></selectCollection>
                </Col>

                <Col span="12"> 时间日期:
                <!-- <DatePicker :value="dateTime" @on-change="dateChange" type="date" placeholder="Select date" style="width: 200px"></DatePicker> -->
                <datePickerCompoent :showSelect="showSelect" @typeChange="typeChange" @startDateChange="startDateChange" @endDateChange="endDateChange"></datePickerCompoent>
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
// import expandRow from "./components/expand-row";
import allexcel from "@/libs/allexcel";
// 头部组件
import selectCollection from "../toolbar-components/selectCollection-component";
import selectRoute from "../toolbar-components/selectRoute-component";
import selectWarhours from "../toolbar-components/selectWarhours-component";
import selectDelivery from "../toolbar-components/selectDelivery-component";
import selectStatu from "../toolbar-components/selectStatu-component";
import selectThirdPlatform from "../toolbar-components/selectThirdPlatform-component";
import selectQitems from "../toolbar-components/selectQitems-component";
import datePickerCompoent from "../toolbar-components/datePicker-component";

// dataGrid组件
import initDataGridCompoent from "../toolbar-components/initDataGrid-component";

export default {
  name: "QueryOrderView",
  components: {
    datePickerCompoent,
    selectCollection,
    selectRoute,
    selectWarhours,
    selectDelivery,
    selectStatu,
    selectThirdPlatform,
    selectQitems,

    // expandRow,

    initDataGridCompoent
  },
  data() {
    return {
      searchkey: "",
      form: {
        $key: "",
        $StartDate: "",
        $EndDate: "",

        // $IsExpress: 0,

        isLoad: true,
        $pageRecord: 15,
        $rowIndex: 1,
        strMethod: "QueryNonPayOrderList",
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
      keyid: [
        {
          value: "0",
          label: "物流单号"
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
      selectRowData: undefined,
      dateTime: "",
      showSelect:false
    };
  },
  methods: {
    getData() {
      var userInfo = JSON.parse(Cookies.get("userInfo"));
      // this.setDate();
      if (userInfo.RoleId == 21) {
        //代理商为21
        var par = {
          strAddress: userInfo.address
        };
        Util.getAjaxData(
          par,
          undefined,
          "18c6f7e0-ef20-4088-b034-50c1ef577e39"
        ).then(res => {
          this.form.$rId = res.Code;
          this.firstGetData();
        });
      } else this.firstGetData();
    },
    setDate() {
      if (this.dateTime === "") {
        this.dateTime = Util.nowTime().formatnowdate;
      }
      var datt = this.dateTime.split("-");;
      var newDate = new Date(datt[0], datt[1] - 1, datt[2]);
      var befminuts = newDate.getTime() - 1000 * 60 * 60 * 24 * parseInt(3); //计算前几天用减，计算后几天用加，最后一个就是多少天的数量
      var beforeDat = new Date();
      beforeDat.setTime(befminuts);
      var befMonth = beforeDat.getMonth() + 1;
      var mon = befMonth >= 10 ? befMonth : "0" + befMonth;
      var befDate = beforeDat.getDate();
      var da = befDate >= 10 ? befDate : "0" + befDate;
      var newDate = beforeDat.getFullYear() + "-" + mon + "-" + da;
      this.form.$StartDate = newDate;
      this.form.$EndDate = this.dateTime;

      this.$Notice.open({
          title: '提示',
          desc: `正在查询${this.form.$StartDate}到${this.form.$EndDate}三天的数据`
      })
    },
    keyIdChange(key) {
      this.form.$cytMallId = "";
      this.form.$userId = "";
      this.form.$ThirdPlatformOrderNo = "";
      this.form.$LogisticsNo = "";
      this.keyIdSelected = key;
    },
    firstGetData() {
      switch (this.keyIdSelected) {
        case "1":
          this.form = Object.assign(this.form, { $cytMallId: this.searchkey });
          break;
        case "2":
          this.form = Object.assign(this.form, {
            $ThirdPlatformOrderNo: this.searchkey
          });
          break;
        case "3":
          this.form = Object.assign(this.form, { $userId: this.searchkey });
          break;
        default:
          this.form = Object.assign(this.form, {
            $LogisticsNo: this.searchkey
          });
          break;
      }
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

      GridInfo.map((item, index) => {
        if (!item.hidden) {
          if (index == 8) {
            var colRow = {
              title: item.title,
              key: item.field,
              width: item.width,
              // fixed: 'right',
              height: item.height,
              sortable: item.sortable
            };
            newGridInfo.push(colRow);
            // 筛选操作需要执行此操作
            Util.autoPushCol(colRow, vm);
          } else if (item.field === "stStatus") {
            var colRow = {
              title: item.title,
              key: item.field,
              width: item.width,
              align: "center",
              render: (h, params) => {
                const row = params.row;
                const color = toolMap.statusColor(row.stStatus);
                const text =
                  row.stStatus === null
                    ? "无状态"
                    : row.stStatus === "配送完成" ? row.stStatus : row.stStatus;
                return h(
                  "Tag",
                  {
                    props: {
                      type: "dot",
                      color: color
                    }
                  },
                  text
                );
              }
            };
            newGridInfo.push(colRow);
            Util.autoPushCol(colRow, vm);
          } else {
            var colRow = {
              title: item.title,
              key: item.field,
              width: item.width,
              height: item.height,
              sortable: item.sortable
            };
            newGridInfo.push(colRow);
            // 筛选操作需要执行此操作
            Util.autoPushCol(colRow, vm);
          }
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
    dateChange(data) {
        this.dateTime = data
    },
    startDateChange(data) {
      this.form.$StartDate = data;
      
    },
    endDateChange(data) {
      this.form.$EndDate = data;
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
      allexcel.tranformAll(data);
    }
  },
  mounted() {
    // 可在此从服务端获取表格数据

    // this.form.$StartDate = date.forweek;
    // this.form.$EndDate = date.formatnowdate;
    this.getData();
  }
};
</script>