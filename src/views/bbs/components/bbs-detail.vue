<template>
    <div class="item-view view">
        <div class="item-view-header">
            <h1>{{header.strTitle}}</h1>
            <div style="margin:10px 0;">

                <Alert type="success" show-icon>
                    <Icon type="ios-lightbulb-outline" slot="icon"></Icon>
        <template slot="desc">{{header.strContent}}</template>
                </Alert>
            </div>
            <p class="meta">
                245 points
                | by 
                <a href="/user/proberts" class="">proberts</a>
                {{header.createDate}} 
                | 
                <Button type="primary" shape="circle" @click="render">回复</Button>
            </p>
        </div>
        <div class="item-view-comments">
     <!--        <p class="item-view-comments-header">
              {{ item.kids ? item.descendants + ' comments' : 'No comments yet.' }}
              <spinner :show="loading"></spinner>
          </p> -->
          <ul  class="comment-children">
              <li v-if="comment" class="comment" v-for="(comment , index) in replyList">
                <div class="by">
                    {{index+1}}楼、 
                  <a>{{ comment.intSatisfationId }}</a>
                  {{ comment.replyDate }} ago
                </div>
                <div class="text" v-html="comment.strReplyContent"></div>
                <!-- <div class="toggle" :class="{ open }" v-if="comment.kids && comment.kids.length">
                  <a @click="open = !open">{{
                    open
                        ? '[-]'
                        : '[+] ' + pluralize(comment.kids.length) + ' collapsed'
                  }}</a>
                </div>
                <ul class="comment-children" v-show="open">
                  <comment v-for="id in comment.kids" :key="id" :id="id"></comment>
                </ul> -->
              </li>
          </ul>
      </div>
  </div>
</template>

<script>
    import Util from '@/libs/util.js'
    import Cookies from 'js-cookie';
    export default {
        name: 'order-info',
        components: {

        },
        data () {
            return {
                header: {},
                replyList:[],
                comment: [],
                replyVal: ''
            };
        },
        methods: {
            init () {
                let _this = this;
                let index = parseInt(this.$route.params.note_id.toString().substr(-1, 1));
                if(!index) {
                    return
                }
                var par = {
                    '@Id' : index

                }
                Util.getAjaxData(par , 'OutSatisfactionList' , undefined).then((res) => {
                    var item = res[0]
                    _this.header = item
                    _this.loadReply(item.Id)
                })
            },
            loadReply(id) {
                var _this = this;
                var par = {
                    'sId': id
                }
                Util.getAjaxData(par , undefined , 'cff73fad-235d-427d-8555-a283441bca48').then((res) => {
                    _this.replyList = res.Table
                })

            },
            render () {
                var _this = this;
                var userInfo = JSON.parse(Cookies.get('userInfo'));
                this.$Modal.confirm({
                    title: '回复标题:<< ' + this.header.strTitle + ' >>',
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: '',
                                autofocus: true,
                                placeholder: '输入你的回复...'
                            },
                            style: {
                                marginTop: '10px;'
                            },
                            on: {
                                input: (val) => {
                                    _this.replyVal = val
                                }
                            }
                            
                        })
                    },
                    onOk: function() {

                        var par = {
                            'sId': _this.header.Id,
                            'content': _this.replyVal,
                            'replyUser': userInfo.userId
                        }
                        console.log(par)
                        Util.getAjaxData(par , undefined , '91e7364a-4ac3-42a2-8d3e-87668761f31c').then((res)=>{
                            if(res.result === 'ok') {
                                _this.init()
                            }
                        })
                    }
                })
            }
        },
        mounted () {
            this.init();
        },
        watch: {
            '$route' () {
                this.init();
            }
        }
    };
</script>
<style scope>
    .item-view-header{background-color:#fff;padding:1.8em 2em 1em;-webkit-box-shadow:0 1px 2px rgba(0,0,0,.1);box-shadow:0 1px 2px rgba(0,0,0,.1)}.item-view-header h1{display:inline;font-size:1.5em;margin:0;margin-right:.5em}.item-view-header .host,.item-view-header .meta,.item-view-header .meta a{color:#828282}.item-view-header .meta a{text-decoration:underline}.item-view-comments{background-color:#fff;margin-top:10px;padding:0 2em .5em}.item-view-comments-header{margin:0;font-size:1.1em;padding:1em 0;position:relative}.item-view-comments-header .spinner{display:inline-block;margin:-15px 0}.comment-children{list-style-type:none;padding:0;margin:0}@media (max-width:600px){.item-view-header h1{font-size:1.25em}}
    .spinner{-webkit-transition:opacity .15s ease;-o-transition:opacity .15s ease;transition:opacity .15s ease;-webkit-animation:rotator 1.4s linear infinite;animation:rotator 1.4s linear infinite;-webkit-animation-play-state:paused;animation-play-state:paused}.spinner.show{-webkit-animation-play-state:running;animation-play-state:running}.spinner.v-enter,.spinner.v-leave-active{opacity:0}.spinner.v-enter-active,.spinner.v-leave{opacity:1}.spinner .path{stroke:#f60;stroke-dasharray:126;stroke-dashoffset:0;-webkit-transform-origin:center;-ms-transform-origin:center;transform-origin:center;-webkit-animation:dash 1.4s ease-in-out infinite;animation:dash 1.4s ease-in-out infinite}@-webkit-keyframes rotator{0%{-webkit-transform:scale(.5) rotate(0deg);transform:scale(.5) rotate(0deg)}to{-webkit-transform:scale(.5) rotate(270deg);transform:scale(.5) rotate(270deg)}}@keyframes rotator{0%{-webkit-transform:scale(.5) rotate(0deg);transform:scale(.5) rotate(0deg)}to{-webkit-transform:scale(.5) rotate(270deg);transform:scale(.5) rotate(270deg)}}@-webkit-keyframes dash{0%{stroke-dashoffset:126}50%{stroke-dashoffset:63;-webkit-transform:rotate(135deg);transform:rotate(135deg)}to{stroke-dashoffset:126;-webkit-transform:rotate(450deg);transform:rotate(450deg)}}@keyframes dash{0%{stroke-dashoffset:126}50%{stroke-dashoffset:63;-webkit-transform:rotate(135deg);transform:rotate(135deg)}to{stroke-dashoffset:126;-webkit-transform:rotate(450deg);transform:rotate(450deg)}}
</style>

<style lang="less">
    @import './bbs.less';
  </style>