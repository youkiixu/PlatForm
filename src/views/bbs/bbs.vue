<style lang="less">

</style>

<template>
  <div style="position:relative;">
    <div class="news-list-nav">
      <!--     <a  href="javascript:;" :class="listItem.prev ? '' : 'disabled'" @click="prevPage">&lt; 上一页</a><span>{{form.$rowIndex}}/{{listItem.intCount}}</span><a href="javascript:;" :class="listItem.next ? '' : 'disabled'" @click="nextPage" class="">下一页 &gt;</a> -->
      <Page :current="form.$rowIndex" :total="listItem.intCount" simple @on-change="pageChange"></Page>
      <div class="report-btn">
        <Button type="info" @click="report">发表反馈</Button>
      </div>
    </div>

    <div class="news-list"> 

      <ul>
        <li class="news-item" v-for="(item , index) in listView">
          <span class="score">{{index+1}}</span>
          <span class="title" >
            <a href="javascript:;" @click="LinkTo(item)">
              {{item.strTitle}}
              <span class="host"> </span>
            </a>
          </span>
          <br>
          <span class="meta">
            <span class="by">
              by '匿名用户'
            </span>
            <span class="time">
              {{item.createDate}}
            </span>
          </span>
        </li>
      </ul>
    </div>

    <Modal
    v-model="modal6"
    title="发表"
    @on-ok="asyncOK">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
     <FormItem label="标题" prop="title">
      <Input v-model="formValidate.title" placeholder="输入标题..."></Input>
    </FormItem>
    <FormItem label="文本内容" prop="desc">
      <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 10,maxRows: 20}" placeholder="输入内容..."></Input>
    </FormItem>
  </Form>
</Modal>

</div>
</template>

<script>
  import Util from '@/libs/util';
  import publishComponent from './components/bbs-answer'
  import Cookies from 'js-cookie';
  export default {
    name: 'bbs',
    components: {
      publishComponent
    },
    data () {
      return {
        form: {
          'isLoad': true,
          '$rowIndex': 1,
          '$pageRecord': 15,
          'strMethod': 'OutSatisfactionList',
        },
        listView: [],
        listItem: {
          intCount: 1,
          prev: false,
          next: true
        },
        modal6: false,
        formValidate: {
         title: '',
         desc: ''
       },
       ruleValidate: {
        title: [
        { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        desc: [
        { required: true, message: '必须填写内容', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    getData(){
      var _this = this;
      var par = this.form
      Util.getDataGrid(par, undefined , undefined , this).then((res) => {
        console.log(res)
        //var res = res
        _this.listView = res.dgData
        _this.listItem.intCount = res.intCount - 0


      })
    },
    LinkTo(item) {
      var _this = this;
      let argu = { note_id: item.Id };
      this.$router.push({
        name: 'bbs-detail',
        params: argu
      });
    },
    pageChange(val) {
      this.form.$rowIndex = val
      this.getData()

    },
    report() {
     var _this = this;
     var userInfo = JSON.parse(Cookies.get('userInfo'));
     this.modal6 = true
     this.$refs['formValidate'].resetFields();
   },
   asyncOK() {
    var _this = this;
    var userInfo = JSON.parse(Cookies.get('userInfo'));
    this.$refs.formValidate.validate((valid) => {
      if (valid) {
        var par = {
          userId: userInfo.userId,
          title: _this.formValidate.title,
          content: _this.formValidate.desc,
          typeId: '1',
          enabled: true
        }

        Util.getAjaxData(par , undefined , '53517242-f08a-41c0-8bfe-9b13599dafc7').then((res) => {
          _this.getData()
        })

      } else {
        this.$Message.error('必须填写内容!');
      }
    })
  }
},
created () {
        // 可在此从服务端获取表格数据
        this.getData()
      }
    };
  </script>
  <style scope>
    .news-view{padding-top:20px}.news-list,.news-list-nav{background-color:#fff;border-radius:2px}.news-list-nav{padding:15px 30px;position:absolute;text-align:center;left:0;right:0;z-index:998;-webkit-box-shadow:0 1px 2px rgba(0,0,0,.1);box-shadow:0 1px 2px rgba(0,0,0,.1)}.news-list-nav a{margin:0 1em}.news-list-nav .disabled{color:#ccc}.news-list{position:absolute;margin:70px 0;width:100%;-webkit-transition:all .5s cubic-bezier(.55,0,.1,1);-o-transition:all .5s cubic-bezier(.55,0,.1,1);transition:all .5s cubic-bezier(.55,0,.1,1)}.news-list ul{list-style-type:none;padding:0;margin:0}.slide-left-enter,.slide-right-leave-to{opacity:0;-webkit-transform:translate(30px);-ms-transform:translate(30px);transform:translate(30px)}.slide-left-leave-to,.slide-right-enter{opacity:0;-webkit-transform:translate(-30px);-ms-transform:translate(-30px);transform:translate(-30px)}.item-enter-active,.item-leave-active,.item-move{-webkit-transition:all .5s cubic-bezier(.55,0,.1,1);-o-transition:all .5s cubic-bezier(.55,0,.1,1);transition:all .5s cubic-bezier(.55,0,.1,1)}.item-enter,.item-leave-active{opacity:0;-webkit-transform:translate(30px);-ms-transform:translate(30px);transform:translate(30px)}.item-leave-active{position:absolute}@media (max-width:600px){.news-list{margin:10px 0}}
    .news-item{background-color:#fff;padding:20px 30px 20px 80px;border-bottom:1px solid #eee;position:relative;line-height:20px}.news-item .score{color:#f60;font-size:1.1em;font-weight:700;position:absolute;top:50%;left:0;width:80px;text-align:center;margin-top:-10px}.news-item .host,.news-item .meta{font-size:.85em;color:#828282}.news-item .host a,.news-item .meta a{color:#828282;text-decoration:underline}.news-item .host a:hover,.news-item .meta a:hover{color:#f60}

    
    .report-btn {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);

    }


  </style>
