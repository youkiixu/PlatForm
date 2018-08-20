<template>
  <!-- <Card> -->
  <div class="manyAreaSelect">
    <div class="item">
      <div class="item-title" style="margin-bottom: 10px;">
        <span>选择地区</span>
      </div>
      <areaIndex
      @on-change="areaChange"
      ></areaIndex>
    </div>
    <div class="item">
      <div class="item-title">
        <span>选择道路</span>
      </div>
      <div class="item-content">
        <ul v-show="roadList.length===0"> 
          <li>
            <<暂无区域信息,请返回重新选择</li>
          </ul>
          <ul v-show="roadList.length!==0">
            <li v-for="(item,index) in roadList" @click="getAreaCombineID(item)" >
              <Tag type="dot" :color="item.selected ? 'yellow' : item.status == 0 ? 'green' : 'red'"  @click.native="getAreaCombineID(item)">
                {{item.strText}}
              </Tag>
            </li> 
          </ul>
        </div>
        <div class="item-footer">
          <button type="button" class="button" @click="selectedAllRoadList()"  :class="selectedAllRoadListButtonStatus?'success':''">{{selectedAllRoadListButtonStatus?'反选':'全部'}}</button>
        </div>
      </div>
      <div class="trangle">
        <div class="trangle-wrap">
          <div class="left">
            <button type="button" class="button" @click="transferToLeft">
              <Icon type="ios-arrow-back"></Icon>
            </button>
          </div>
          <div class="right">
            <button type="button" class="button" @click="transferToRight">
              <Icon type="ios-arrow-forward"></Icon>
            </button>
          </div>
        </div>
      </div>
      <div class=" item ">
        <div class="item-title ">
          <span>已选的地区</span>
        </div>
        <div class="item-content ">
          <ul class="selectedContent">
            <li v-for="(item,index) in selectedList" :class="item.selected ? 'active' : ''" @click="selectedListEvent(item)">
              {{item.strText}}
            </li>
          </ul>
        </div>
        <div class="item-footer">
          <button type="button" class="button" @click="selectedAllArea()"  :class="selectedAllButtonStatus?'success':''">{{selectedAllButtonStatus?'反选':'全部'}}</button>
        </div>
      </div>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
    <!-- </Card> -->
  </template>

  <script>
    import Util from '@/libs/util';
    import Cookies from 'js-cookie';
    import areaIndex from '@/components/area-component/area-index'

    export default {
      name: 'addDeliveryDistributeComponent',
      components: {
        areaIndex
      },
      data: function () {
        return {
        chinaArea: JSON.parse(window.localStorage.getItem('chinaArea')) || [], // 这是地区联动的JSON
        notLimitButton: {
          notLimitCity: false,  // 城市不限
          notLimitDistrict: false,  // 地区不限
        },
        selectedAllButtonStatus: false, // 已选位置列表全部按钮的状态
        selectedAllRoadListButtonStatus: false,
        selectItem: {
          province: {},
          city: {},
          distric: {},
          street : {}
        },
        cityList: [], // 城市列表
        districList: [], // 区域列表
        streetList: [],//街道列表
        roadList: [],//道路列表
        rightDataList: [], // 选中项目组合成的渲染列表
        rightData: [], // 选中需要移除的
        leftData: [], // 左边选中的转发
        selectedList: [],
        treeNode: [],
        thatId: '',
        spinShow: false
      }
    },
    props: {
      value: Object,
      saveUid: {
        type: String,
        default: '4b04d795-13d2-4b9a-b650-f6ce4e2d3117'
      },
      selectedListMethod: {
        type: String,
        default: 'DeliveryAddressByUser'
      }
    },
    model: {
      prop: 'value',
      event: 'valueChange'
    },
    computed: {

    },
    methods: {
      getSelectList () {
        var _this = this;
        var par = {
          $userId : this.value.userId
        }
        _this.selectedList = []
        _this.roadList = []
        Util.getAjaxData(par, _this.selectedListMethod).then((res) => {
          res.map((item)=>{
            item.selected = false
            _this.selectedList.push(item)
          })
        })

      },
      areaChange(item) {
        if(item.intLevel < 2) return

          this.thatId = item.strCode
        this.getRoadList()
      },
      getRoadList(id) {
        var _this = this;
        var par = {
          $PID : this.thatId
        }
        this.resetList()
        this.$Loading.start();
        Util.getAjaxData(par , 'QueryDeliveryAddressMap').then((res) => {

          res.map((item)=>{
            var litem = {
              intLevel: item.intLevel,
              selected: false,
              status: item.status,
              strCode: item.strCode,
              strParentCode: item.strParentCode,
              strText: item.strText
            }
            _this.roadList.push(litem)
          })
          _this.$Loading.finish();
        })
      },
      resetList() {
        var _this = this;
        // 重置列表和状态
        _this.roadList = []
        this.selectedAllButtonStatus =  false // 已选位置列表全部按钮的状态
        this.selectedAllRoadListButtonStatus = false

        _this.selectedList.map((item) => {
          item.selected = false
        })
      },
      getAreaCombineID(item) {
        if(item.status != 1) {
          item.selected = !item.selected
        }
      },
      selectedListEvent(item) {
        item.selected = !item.selected
      },
      transferToRight() {
        // 添加到右边
        var _this = this;

        var userInfo = JSON.parse(Cookies.get('userInfo'));
        var delivery = this.value
        var arr = []
        _this.roadList.map((item) => {
          // status=1是已经有配送员的区域 selected是已经选中
          if(item.status != 1 && item.selected){

            arr.push({wayId: item.strCode})

          }
        })
        if(arr.length == 0) return;

        var head = {
          userId: delivery.userId,
          createBy: userInfo.userId
        }
        _this.spinShow = true
        Util.tbSave( head , arr ,_this.saveUid , this).then((res) => {
          _this.getSelectList()
          _this.getRoadList()
          _this.spinShow = false
        })

      },
      transferToLeft() {
        // 删除操作
        var _this = this;
        var userInfo = JSON.parse(Cookies.get('userInfo'));
        var delivery = this.value
        var arr = []
        _this.selectedList.map((item) => {
          // status=1是已经有配送员的区域 selected是已经选中
          if(item.selected){
            arr.push({wayId: item.strCode , rowState: "D" , id: item.id})
          }
        })
        if(arr.length == 0) return;
        var head = {
          userId: delivery.userId,
          createBy: userInfo.userId
        }
        _this.spinShow = true
        Util.tbSave( head , arr , _this.saveUid , this).then((res) => {
          _this.getSelectList()
          _this.getRoadList()
          _this.spinShow = false
        })

      },
      selectedAllRoadList() {
        var _this = this;

        this.selectedAllRoadListButtonStatus = !this.selectedAllRoadListButtonStatus
        _this.roadList.map((item)=>{
          // 已经分配人员的道路不执行操作
          if(item.status != 1){

            item.selected = this.selectedAllRoadListButtonStatus

          }
        })

      },
      selectedAllArea() {
        var _this = this;

        this.selectedAllButtonStatus = !this.selectedAllButtonStatus
        _this.selectedList.map((item)=>{
          // 已经分配人员的道路不执行操作
          item.selected = this.selectedAllButtonStatus
        })
      }
      

    },
    mounted () {
      // this.getData()
    },
    created () {

    },
    watch: {
      value (val) {
        this.getSelectList()
      }

    }
  }
</script>





<style scoped lang="less">
  ul {
    padding: 0;
    margin: 0;
    max-height: 100%;
    overflow-y: auto;
    li {
      cursor: pointer;
      // text-align: center;
      padding: 5px;
      &.active,
      &:hover {
        background: #e4e8f1;
        color: #48576a;
      }
    }
  }

  .manyAreaSelect {
    position: relative;
    z-index: 2005;
    overflow:hidden;
    _zoom:1;
    // text-align:center;
    .item {
      border: 1px solid #d1dbe5;
      background: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      // display: inline-block;
      float: left;
      vertical-align: middle;
      min-width: 350px;
      box-sizing: border-box;
      position: relative;
      height: 100%;
      min-height: 260px;
      margin: 5px;
    }
    .area-item {
      float: left;
      margin: 5px;
      position: relative;
    }
    .item-title {
      height: 36px;
      line-height: 36px;
      background: #fbfdff;
      margin: 0;
      border-bottom: 1px solid #d1dbe5;
      box-sizing: border-box;
      color: #1f2d3d;
      text-align: center;
    }
    .trangle {
      background: transparent;
      // display: inline-block;
      // vertical-align: middle;
      float: left;
      width: 40px;
      height: 80px;
      box-sizing: border-box;
      margin-top: 300px;
      // height: 100%;
      position: relative;
      .trangle-wrap {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .left,
      .right {
        margin: 10px 5px;
      }
      ;
    }

    .item-content {
      font-size: 13px;
      height: 600px;
      padding: 8px 2px;
      overflow: auto;
    }
    .item-footer {
      padding: 5px 0;
      height: 40px;
      text-align: center;
    }
  }

  .selectedContent {
    li {
      text-align: left;
      padding-left: 25px;
    }
  }



  .button {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #c4c4c4;
    color: #1f2d3d;
    margin: 0;
    border-radius: 4px;
    padding: 8px;
    font-size: 12px;
    border-radius: 4px;
    -webkit-appearance: button;
    outline: none;
    &:hover {
      background: #2d8cf0;
    }
    &.success {
      background: #42d885;
      border-color: #42d885;
      color: #fff;
    }

    &.disabled {
      color: #bfcbd9;
      cursor: not-allowed;
      background-image: none;
      background-color: #eef1f6;
      border-color: #d1dbe5;
    }
  }
</style>