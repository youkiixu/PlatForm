<style lang="less">
@import "../../styles/common.less";
</style>

<template>
    <div @keyup.enter="getData()">

        <Card>
            <Row>
                <Col span="6"> 关键词:
                <Input v-model="form.OrderId" placeholder="输入平台单号" style="width: 150px" />
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="2">
                    <span style="margin: 0 10px;">
                        <Button type="info" @click="toRefund">转到售后</Button>
                    </span>
                 </Col>
                 <Col span="2">
                    <span style="margin: 0 10px;">
                        <Button type="warning" @click="cancelRefundAbnormal">取消异常</Button>
                    </span>
                 </Col>

                <Col span="2">
                    <span style="margin: 0 10px;">
                        <Button type="primary" icon="search" @click="getData()">搜索</Button>
                    </span>
                </Col>

            </Row>
        </Card>
        <Card  class="margin-top-10">
            <Table stripe :columns="refundListHead" :data="refundListData" @on-row-click="clickRow" :highlight-row="true" :loading="loading"></Table>
            <div class="pagination">
                <Page :total="Total"  @on-change="pageChange"/>
            </div>
        </Card>
        <Modal
            v-model="transfer"
            title="转到售后"
            @on-ok="updateIsYJRefund">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="新商城单号" prop="OrderId">
                    <Input v-model="formValidate.OrderId" placeholder="请输入订单号" disabled></Input>
                </FormItem>
                
                <FormItem label="售后联系人" prop="ContactPerson">
                    <Input v-model="formValidate.ContactPerson" placeholder="请输入售后联系人"></Input>
                </FormItem>
                <FormItem label="联系电话" prop="ContactCellPhone">
                    <Input v-model="formValidate.ContactCellPhone" placeholder="请输入联系电话"></Input>
                </FormItem>
                <FormItem label="理由" prop="Reason">
                    <Input v-model="formValidate.Reason" placeholder="请输入售后理由"></Input>
                </FormItem>
                <FormItem label="备注" prop="ReasonRemarks">
                    <Input v-model="formValidate.ReasonRemarks" placeholder="请输入备注"></Input>
                </FormItem>
                <FormItem label="退货数量" prop="ReturnQuantity">
                    <Input v-model="formValidate.ReturnQuantity" placeholder="请输入退货数量"></Input>
                </FormItem>
                <FormItem label="售后类型" prop="RefundTypeString">
                    <RadioGroup v-model="formValidate.RefundTypeString" @on-change="RefundTypeChange">
                        <Radio label="退货/退款" v-if="selectRowData.IsCleared"></Radio>
                        <Radio label="补印" v-if="selectRowData.IsCleared"></Radio>
                        <Radio label="未付款减款" v-if="!selectRowData.IsCleared"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="退款方式" prop="RefundPayTypeString">
                    <RadioGroup v-model="formValidate.RefundPayTypeString"  @on-change="RefundPayTypeChange">
                        <Radio label="退到预付款" v-if="selectRowData.IsCleared"></Radio>
                        <Radio label="减订单款" v-if="!selectRowData.IsCleared"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="退款金额" prop="Amount" v-if="formValidate.RefundTypeString=='退货/退款'">
                    <Input v-model="formValidate.Amount" placeholder="请输入退款金额"></Input>
                </FormItem>
                <FormItem label="图片">
                    <img :src="kiyUrl + formValidate.CertPic1" v-if="formValidate.CertPic1 != ''" @click="open(formValidate.CertPic1)" style="width: 40px;height: 40px;border-radius: 2px;cursor:hand;">
                    <img :src="kiyUrl + formValidate.CertPic2" v-if="formValidate.CertPic2 != ''"  @click="open(formValidate.CertPic2)" style="width: 40px;height: 40px;border-radius: 2px;cursor:hand;">
                    <img :src="kiyUrl + formValidate.CertPic3" v-if="formValidate.CertPic3 != ''"  @click="open(formValidate.CertPic3)" style="width: 40px;height: 40px;border-radius: 2px;cursor:hand;">
                </FormItem>
            </Form>
        </Modal>
    </div>          
</template>
<!-- 物流订单列表 -->
<script>
import Util from "../../libs/util";
import Cookies from 'js-cookie';
var kiyapi = 'http://kiy.cn/'
// kiyapi = 'http://192.168.0.91:8008/'
// kiyUrl = 'http://192.168.0.91:8008/'
// kiyapi = '/kiyapi/'
var format = function(data) {
    var obj = data.Data
    obj = JSON.parse(obj)
    return obj
}

export default {
  data() {
    return {
      form: {
          OrderId: '', 
          page_no: 1,
          page_size: 10
      },
      refundListHead: [
          {
              title: '平台单号',
              key: 'OrderId'
          },
          {
              title: '发起人',
              key: 'ContactPerson'
          },
          {
              title: '发起人电话',
              key: 'ContactCellPhone'
          },
          {
              title: '店铺',
              key: 'ShopName'
          },
          {
              title: '商品',
              key: 'name'
          },
          {
              title: '订单总额',
              key: 'OrderAmount'
          },
          {
              title: '已收金额',
              key: 'ReceivedAmount'
          },
          {
              title: '申请日期',
              key: 'ApplyDate'
          },
          {
              title: '售后原因',
              key: 'Reason'
          },
          {
              title: '备注',
              width: 300,
              key: 'ReasonRemarks'
          },
          {
              title: '异常状态',
              key: 'SellerRemark'
          }
      ],
      refundListData: [],
      formValidate: {
        Id: '',//售后单号 必填
        OrderId: '',//新商城订单号
        Amount: 0,//退款金额 （退款、退货退款 ）异常，补印 可以为0
        ContactPerson: '',//售后联系人
        ContactCellPhone: '',//售后联系电话
        Reason : '',//退款理由
        ReasonRemarks: '',//备注
        ReturnQuantity: '',//退货数量：（退货退款） 必填
        RefundPayType: '',// 退款方式: 3.退到预付款 4.减订单款  注：（未付款： 减订单款 ,已付款：退到预存款）给个默认值
        RefundType: '',//1. 仅退款   2. 退货退款  3. 补印  5. 未付款减款  6.异常
        RefundPayTypeString: '',
        RefundTypeString: '',
        CertPic1: '',//图片路径1 （可选填）///temp/201807021617471937000.jpg
        CertPic2: '',//图片路径2 （可选填）
        CertPic3: '',//图片路径3（可选填）
        CreatorBy: '',//申请人ID
        Applicant: '' //申请人
      },
      ruleValidate: {
            ContactPerson: [
                { required: true, message: '请补充完整', trigger: 'blur' }
            ],
            ContactCellPhone: [
                { required: true, message: '请补充完整', trigger: 'blur' },
            ],
            Reason: [
                { required: true, message: '请补充完整', trigger: 'blur' },
            ],
            ReasonRemarks: [
                { required: true, message: '请补充完整', trigger: 'blur' },
            ]
      },
      searchkey: "",
      transfer: false,
      loading: false,
      Total: 0,
      selectRowData: {}
    //   kiyUrl : 'http://kiy.cn/'
    };
  },
  computed: {
    userInfo () {
        var userInfo = Cookies.get('userInfo')
        return JSON.parse(userInfo)
    },
    kiyUrl () {
        return kiyapi
    }
  },
  methods: {
    getData() {
        var _this = this;
        _this.loading = true
      Util.postKiyApi(
            this.form,
            kiyapi + '/webapi/Himall.OrderRefund.GetRefundAbnormal'
      )
      .then(res => {
          res = JSON.parse(res)
            console.log(res)
            var data = format(res)
            data = data.data
            
            _this.refundListData = data.Models
            _this.Total = data.Total
            _this.loading = false
      }).catch(ex => {
          _this.loading = false
      })
    },
    clickRow(data) {
      this.selectRowData = data;
    },
    toRefund() {
        this.transfer = true
        var selectRowData = this.selectRowData
        this.formValidate = {
            Id: selectRowData.OrderRefundId,//售后单号 必填
            OrderId: selectRowData.OrderId,//新商城订单号
            Amount: 0,//退款金额 （退款、退货退款 ）异常，补印 可以为0
            ContactPerson: selectRowData.ContactCellPhone,//售后联系人
            ContactCellPhone: selectRowData.ContactPerson,//售后联系电话
            Reason : selectRowData.Reason,//退款理由
            ReasonRemarks: selectRowData.ReasonRemarks,//备注
            ReturnQuantity: 0,//退货数量：（退货退款） 必填
            RefundPayType: '',// 退款方式: 3.退到预付款 4.减订单款  注：（未付款： 减订单款 ,已付款：退到预存款）给个默认值
            RefundType: '',//1. 退款/退货   2. 退货退款  3. 补印  5. 未付款减款  6.异常
            RefundPayTypeString: '',
            RefundTypeString: '',
            CertPic1: selectRowData.CertPic1,//图片路径1 （可选填）/`/temp/201807021617471937000.jpg
            CertPic2: selectRowData.CertPic2,//图片路径2 （可选填）
            CertPic3: selectRowData.CertPic3,//图片路径3（可选填）
            CreatorBy: this.userInfo.userId,//申请人ID
            Applicant: this.userInfo.TrueName //申请人
        }
    },
    pageChange(e) {
        this.form.page_no = e
        this.getData()
    },
    RefundPayTypeChange(key) {
        switch (key) {
            case '退到预付款':
                this.formValidate.RefundPayType = 1
                break;
            case '减订单款':
                this.formValidate.RefundPayType = 4
                break;
            default:
                break;
        }
    },
    RefundTypeChange(key) {
        switch (key) {
            case '退货/退款':
                this.formValidate.RefundType = 1
                break;
            case '补印':
                this.formValidate.RefundType = 3
                break;
            case '未付款减款':
                this.formValidate.RefundType = 5
                break;
            default:
                break;
        }
    },
    updateIsYJRefund() {
        // 异常转到正式售后
        var _this = this;
        var formValidate = this.formValidate
        if(formValidate.RefundType === '') {
            this.errosMessage('售后类型必须选择')
            return
        }
        if(formValidate.RefundPayType === '') {
            this.errosMessage('退款方式必须选择')
            return
        }
        this.$refs['formValidate'].validate((valid) => {
            if (valid) {
                var par = {
                        Id: formValidate.Id,//售后单号 必填
                        OrderId: formValidate.OrderId,//新商城订单号
                        ContactPerson: formValidate.ContactCellPhone,//售后联系人
                        ContactCellPhone: formValidate.ContactPerson,//售后联系电话
                        Reason : formValidate.Reason,//退款理由
                        ReasonRemarks: formValidate.ReasonRemarks,//备注
                        ReturnQuantity: formValidate.ReturnQuantity,//退货数量：（退货退款） 必填
                        RefundPayType: formValidate.RefundPayType,// 退款方式: 3.退到预付款 4.减订单款  注：（未付款： 减订单款 ,已付款：退到预存款）给个默认值
                        RefundType: formValidate.RefundType,//1. 退款/退货   2. 退货退款  3. 补印  5. 未付款减款  6.异常
                        CertPic1: formValidate.CertPic1,//图片路径1 （可选填）/`/temp/201807021617471937000.jpg
                        CertPic2: formValidate.CertPic2,//图片路径2 （可选填）
                        CertPic3: formValidate.CertPic3,//图片路径3（可选填）
                        CreatorBy: formValidate.userId,//申请人ID
                        Applicant: formValidate.TrueName //申请人
                    }
                if(par.RefundType != 5) {
                    par = Object.assign(par , {Amount : formValidate.Amount})
                }
                if(par.RefundType == 5) {
                    par = Object.assign(par , {Amount : this.selectRowData.OrderAmount})
                }
                 Util.postKiyApi(
                    par,
                    kiyapi + '/webapi/Himall.OrderRefund.UpdateIsYJRefund'
                )
                .then(res => {
                    res = JSON.parse(res)
                    _this.getData()
                    _this.errosMessage(res.Message)
                }).catch(ex => {

                })
            } else {
                this.$Message.error('请补充完整信息!');
            }
        })
       
    },
    errosMessage(nodesc) {
        this.$Notice.open({
            title: '消息警告',
            desc: nodesc
        });
    },
    cancelRefundAbnormal() {
        var _this = this;
        var selectRowData = this.selectRowData;
        this.$Modal.confirm({
            title: '确认?',
            content: `您将取消${selectRowData.OrderId}这条异常单，请确认`,
            onOk: function() {
                 Util.postKiyApi(
                    {
                        Id: selectRowData.OrderRefundId,
                        OrderId: selectRowData.OrderId
                    },
                    kiyapi + '/webapi/Himall.OrderRefund.CancelRefundAbnormal'
                )
                .then(res => {
                    res = JSON.parse(res)
                    _this.getData()
                    _this.errosMessage(res.Message)
                }).catch(ex => {

                })
            }
        })
       
    },
    open(src) {
        window.open(this.kiyUrl + src)
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style scoped>
    
</style>
