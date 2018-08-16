<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Row>
            <Col span="8">
                <Row>
                    <Card>
                        <Row type="flex" class="user-infor">
                            <Col span="8">
                                <Row class-name="made-child-con-middle" type="flex" align="middle">
                                    <img class="avator-img" :src="avatorPath" />
                                </Row>
                            </Col>
                            <Col span="16" style="padding-left:6px;">
                                <Row class-name="made-child-con-middle" type="flex" align="middle">
                                    <div>
                                        <b class="card-user-infor-name">{{userInfo.TrueName}}</b>
                                        <p>{{userInfo.RoleName}}</p>
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                        <div class="line-gray"></div>
                        <Row class="margin-top-8">
                            <Col span="8"><p class="notwrap">登录时间:</p></Col>
                            <Col span="16" class="padding-left-8">{{userInfo.LoginDate}}</Col>
                        </Row>
                        <Row class="margin-top-8">
                            <Col span="8"><p class="notwrap">个人描述:</p></Col>
                            <Col span="16" class="padding-left-8">{{userInfo.Description ? userInfo.Description : '用户没有填写描述'}}</Col>
                        </Row>
                    </Card>
                </Row>
            </Col>
            <Col span="16" class-name="padding-left-5">
                <Row>
                    <Col span="6">
                        <router-link to="/transitLineManage/TransitSummaryView">
                            <infor-card
                            id-name="user_created_count"
                            :end-val="count.中转中"
                            iconType="loop"
                            color="rgb(20,170,228)"
                            intro-text="今天中转中"
                            ></infor-card>
                        </router-link>
                    </Col>
                    <Col span="6" class-name="padding-left-5">
                        <router-link to="/orderManage/QueryOrderView">
                            <infor-card
                            id-name="visit_count"
                            :end-val="count.已下单"
                            iconType="flag"
                            color="rgb(29,160,43)"
                            :iconSize="50"
                            intro-text="今天已下单"
                            ></infor-card>
                        </router-link>
                    </Col>
                    <Col span="6" class-name="padding-left-5">
                        <router-link to="/orderManage/QueryOrderView">
                            <infor-card
                            id-name="collection_count"
                            :end-val="count.已入仓"
                            iconType="ios-download-outline"
                            color="rgb(156,96,180)"
                            intro-text="今天已入仓"
                            ></infor-card>
                        </router-link>
                    </Col>
                    <Col span="6" class-name="padding-left-5">
                        <router-link to="/transitLineManage/TransitSummaryView">
                            <infor-card
                            id-name="transfer_count"
                            :end-val="count.已卸车"
                            iconType="ios-pricetag"
                            color="#8A8A8A"
                            intro-text="今天已卸车"
                            ></infor-card>
                        </router-link>
                    </Col>
                </Row>
                <Row class="margin-top-10">
                    <Col span="6">
                        <router-link to="/orderManage/QueryOrderView">
                            <infor-card
                            id-name="user_created_count"
                            :end-val="count.订单数"
                            iconType="android-person-add"
                            color="#2d8cf0"
                            intro-text="今天订单数"
                            ></infor-card>
                        </router-link>
                    </Col>
                    <Col span="6" class-name="padding-left-5">
                        <router-link to="/orderManage/QueryOrderView">
                            <infor-card
                            id-name="visit_count"
                            :end-val="count.配送完成"
                            iconType="ios-eye"
                            color="#19be6b"
                            :iconSize="50"
                            intro-text="今天配送完成"
                            ></infor-card>
                        </router-link>
                    </Col>
                    <Col span="6" class-name="padding-left-5">
                        <router-link to="/orderManage/QueryOrderView">
                            <infor-card
                            id-name="collection_count"
                            :end-val="count.待配送"
                            iconType="upload"
                            color="#ff9900"
                            intro-text="今天待配送"
                            ></infor-card>
                        </router-link>
                    </Col>
                    <Col span="6" class-name="padding-left-5">
                        <router-link to="/orderManage/QuerySuggestOrderView">
                            <infor-card
                            id-name="transfer_count"
                            :end-val="count.异常"
                            iconType="information-circled"
                            color="#ed3f14"
                            intro-text="今天异常"
                            ></infor-card>
                        </router-link>
                    </Col>

                </Row>

            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="8">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-map"></Icon>
                        上周每天数据
                    </p>
                    <div class="data-source-row">
                        <visite-volume></visite-volume>
                    </div>
                </Card>
            </Col>
            <Col span="16" class="padding-left-10">
               <Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-shuffle-strong"></Icon>
                    当周每天数据
                </p>
                <div class="data-source-row">
                    <service-requests></service-requests>
                </div>
            </Card>
        </Col>
        
    </Row>
    <Row class="margin-top-10">
        <Col span="8">
            <bbs></bbs>
        </Col>
    </Row>
</div>
</template>

<script>
    import cityData from './map-data/get-city-value.js';
    import homeMap from './components/map.vue';
    import dataSourcePie from './components/dataSourcePie.vue';
    import visiteVolume from './components/visiteVolume.vue';
    import serviceRequests from './components/serviceRequests.vue';
// import userFlow from './components/userFlow.vue';
import countUp from './components/countUp.vue';
import inforCard from './components/inforCard.vue';
import mapDataTable from './components/mapDataTable.vue';
// import toDoListItem from './components/toDoListItem.vue';
import Cookies from 'js-cookie';
import Util from '../../libs/util';
import bbs from '../bbs/bbs.vue'



export default {
    name: 'home',
    components: {
        homeMap,
        dataSourcePie,
        visiteVolume,
        serviceRequests,
        // userFlow,
        countUp,
        inforCard,
        mapDataTable,
        bbs
        // toDoListItem
    },
    data () {
        return {
            toDoList: [],
            count: {
                '中转中': 0,
                '已下单': 0,
                '已入仓': 0,
                '已卸车': 0,
                '订单数': 0,
                '配送完成': 0,
                '待配送': 0,
                '异常': 0
            },
            cityData: cityData,
            showAddNewTodo: false,
            newToDoItemValue: ''
        };
    },
    computed: {
        avatorPath () {
            return localStorage.avatorImgPath;
        },
        userInfo() {
            return JSON.parse(Cookies.get('userInfo'));
        },

    },
    methods: {
        addNewToDoItem () {
            this.showAddNewTodo = true;
        },
        addNew () {
            if (this.newToDoItemValue.length !== 0) {
                this.toDoList.unshift({
                    title: this.newToDoItemValue
                });
                setTimeout(() => {
                    this.newToDoItemValue = '';
                }, 200);
                this.showAddNewTodo = false;
            } else {
                this.$Message.error('请输入待办事项内容');
            }

        },
        cancelAdd () {
            this.showAddNewTodo = false;
            this.newToDoItemValue = '';
        },
        lsSet() {
            var user = this.userInfo.TrueName;
            localStorage.setItem(user+'ToDoItem' , JSON.stringify(this.toDoList))

        },
        lsGet() {
            var user = this.userInfo.TrueName;
            var toDoItemString = localStorage.getItem(user+'ToDoItem')
            if(toDoItemString){
                this.toDoList = JSON.parse(toDoItemString);
            }

        },
        getCountInfoByIndex() {
            var date = Util.nowTime()
            var _this = this;
            var param = {
                $dStartOper: date.formatnowdate,
                $dEndOper : date.formatnowdate,
                $ThirdPlatformId : '',
                $DistributorId : ''
            }
            Util.getAjaxData(param , 'getCountInfoByIndex' , undefined).then((res)=> {
                var data = res[0];
                for(var item in _this.count){
                    for(var key in data){
                        if(key == item){
                            _this.count[item] = data[key]
                        }
                    }
                }
            })
        }
    },
    created() {
        this.getCountInfoByIndex()

        


    }
};
</script>
