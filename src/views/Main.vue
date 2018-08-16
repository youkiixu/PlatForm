<style lang="less">
    @import "./main.less";
    
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <shrinkable-menu 
            :shrink="shrink"
            @on-change="handleSubmenuChange"
            :theme="menuTheme" 
            :before-push="beforePush"
            :open-names="openedSubmenuArr"
            :menu-list="menuList">
            <div slot="top" class="logo-con">
                <img v-show="!shrink" @click="showLabModalChange"   src="../images/20171125113948.png" key="max-logo" />
                <img v-show="shrink" @click="showLabModalChange" class="min-logo" src="../images/20171125113942.png" key="min-logo" />
            </div>
        </shrinkable-menu>
    </div>
    <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
        <div class="main-header">
            <div class="navicon-con">
                <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                    <Icon type="navicon" size="32"></Icon>
                </Button>
            </div>
            <div class="header-middle-con">
                <div class="main-breadcrumb">
                    <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                </div>
            </div>
            <div class="header-avator-con">
                <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
                <lock-screen></lock-screen>
                <message-tip v-model="mesCount"></message-tip>
                <theme-switch></theme-switch>

                <div class="user-dropdown-menu-con">
                    <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                        <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                            <a href="javascript:void(0)">
                                <span class="main-user-name">{{ userName }}</span>
                                <Icon type="arrow-down-b"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="ownSpace">个人中心</DropdownItem>
                                <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>
                    </Row>
                </div>
            </div>
        </div>
        <div class="tags-con">
            <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
        </div>
    </div>
    <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
        <div class="single-page">
            <keep-alive :include="cachePage">
                <router-view></router-view>
            </keep-alive>
        </div>
    </div>
    <!-- <modalLabComponent :showLabModal = "showLabModal"></modalLabComponent> -->
</div>
</template>
<script>
    import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
    import tagsPageOpened from './main-components/tags-page-opened.vue';
    import breadcrumbNav from './main-components/breadcrumb-nav.vue';
    import fullScreen from './main-components/fullscreen.vue';
    import lockScreen from './main-components/lockscreen/lockscreen.vue';
    import messageTip from './main-components/message-tip.vue';
    import themeSwitch from './main-components/theme-switch/theme-switch.vue';

    // import modalLabComponent from './laboratory/modal-lab/modal-lab-component';
    import Cookies from 'js-cookie';
    import util from '@/libs/util.js';
    import io from 'socket.io-client';
    export default {
        components: {
            shrinkableMenu,
            tagsPageOpened,
            breadcrumbNav,
            fullScreen,
            lockScreen,
            messageTip,
            themeSwitch, 
            // modalLabComponent
        },
        data () {
            return {
                shrink: false,
                userName: '',
                mesCount: 0,
                isFullScreen: false,
                openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
                showLabModal: false
            };
        },
        computed: {
            menuList () {
                return this.$store.state.app.menuList;
            },
            pageTagsList () {
                return this.$store.state.app.pageOpenedList;  // 打开的页面的页面对象
            },
            currentPath () {
                return this.$store.state.app.currentPath;  // 当前面包屑数组
            },
            avatorPath () {
                return localStorage.avatorImgPath;
            },
            cachePage () {
                return this.$store.state.app.cachePage;
            },
            lang () {
                return this.$store.state.app.lang;
            },
            menuTheme () {
                return this.$store.state.app.menuTheme;
            }
        },
        methods: {
            init () {
                let pathArr = util.setCurrentPath(this, this.$route.name);
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.userName = Cookies.get('user');
                let messageCount = 3;
                this.messageCount = messageCount.toString();
                this.checkTag(this.$route.name);


            },
            toggleClick () {
                this.shrink = !this.shrink;
            },
            handleClickUserDropdown (name) {
                if (name === 'ownSpace') {
                    util.openNewPage(this, 'ownspace_index');
                    this.$router.push({
                        name: 'ownspace_index'
                    });
                } else if (name === 'loginout') {
                    // 退出登录
                    this.$store.commit('logout', this);
                    this.$store.commit('clearOpenedSubmenu');
                    // this.reRoadMenu()
                    this.$router.push({
                        name: 'login'
                    });
                    Cookies.remove('hasGreet');
                    window.location.reload();

                }
            },
            checkTag (name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                if (!openpageHasTag) {  //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                    
                }
            },
            handleSubmenuChange (val) {
                // console.log(val)
            },
            beforePush (name) {
                if (name === 'accesstest_index') {
                    return false;
                } else {
                    return true;
                }
            },
            fullscreenChange (isFullScreen) {
                // console.log(isFullScreen);
            },
            showLabModalChange(){
                if(this.showLabModal){
                    this.showLabModal = false
                } else {
                    this.showLabModal = true
                }
            },
            setAccessMenu() {
                this.webSocketOpen()
                var access = Cookies.get('access');
                var userInfo = JSON.parse(Cookies.get('userInfo'));
                var _this = this;
                var tagsList = this.$store.state.app.tagsList;
                var menuList = this.$store.state.app.routers;
                var param  = {
                    Id: userInfo.userId
                }
                util.postApiData(param , 'BackStage/Administration/YJMenuAuthor').then((res) => {
                    res.map((item) => {
                        tagsList.map((tag)=> {
                            if(item.strText == tag.title) {
                                tag['access'] = parseInt(access)
                                tag['icon'] = item.icon ? item.icon : 'android-send'
                                tag['strCode'] = item.strCode
                            }
                        })
                        menuList.map((menu) => {
                            if(item.strText == menu.title){
                                menu['access'] = parseInt(access)
                                menu['icon'] = item.icon ? item.icon : 'document-text'
                            }
                        })
                    })
                    _this.$store.commit('updateMenulist');
                    localStorage.menuList = JSON.stringify(tagsList)            
                    
                })
            },
            getRealRouter() {
                var routerName = 'home_index'
                var routerArr =  window.location.hash.split('#')[1];
                var routerObj = routerArr.split('/')
                var len = routerObj.length
                routerName = routerObj[len -1]
            },
            sayHi() {
                    // 问候信息相关
                    if (!Cookies.get('hasGreet')) {
                        let now = new Date();
                        let hour = now.getHours();
                        let greetingWord = {
                            title: '',
                            words: ''
                        };
                        let userName = Cookies.get('user');
                        if (hour > 5 && hour < 6) {
                            greetingWord = {title: '凌晨好~' + userName, words: '早起的鸟儿有虫吃~'};
                        } else if (hour >= 6 && hour < 9) {
                            greetingWord = {title: '早上好~' + userName, words: '来一杯咖啡开启美好的一天~'};
                        } else if (hour >= 9 && hour < 12) {
                            greetingWord = {title: '上午好~' + userName, words: '工作要加油哦~'};
                        } else if (hour >= 12 && hour < 14) {
                            greetingWord = {title: '中午好~' + userName, words: '午饭要吃饱~'};
                        } else if (hour >= 14 && hour < 17) {
                            greetingWord = {title: '下午好~' + userName, words: '下午也要活力满满哦~'};
                        } else if (hour >= 17 && hour < 19) {
                            greetingWord = {title: '傍晚好~' + userName, words: '下班没事问候下爸妈吧~'};
                        } else if (hour >= 19 && hour < 21) {
                            greetingWord = {title: '晚上好~' + userName, words: '工作之余品一品书香吧~'};
                        } else {
                            greetingWord = {title: '深夜好~' + userName, words: '夜深了，注意休息哦~'};
                        }
                        this.$Notice.config({
                            top: 130
                        });
                        this.$Notice.info({
                            title: greetingWord.title,
                            desc: greetingWord.words,
                            duration: 4,
                            name: 'greeting'
                        });
                        Cookies.set('hasGreet', 1);
                    }
                },
                webSocketOpen() {
                    // 连接socket
                    // util.WebSocket(this)
                }
            },
            watch: {
                '$route' (to) {

                // var name = to.name || this.getRealRouter
                this.$store.commit('setCurrentPageName', to.name);
                let pathArr = util.setCurrentPath(this, to.name);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.checkTag(to.name);
                localStorage.currentPageName = to.name;
            },
            lang () {
                util.setCurrentPath(this, this.$route.name);  // 在切换语言时用于刷新面包屑
            }
        },
        mounted () {
            this.init();
            this.sayHi();
        },
        created () {
            // 显示打开的页面的列表
            this.setAccessMenu();
            this.$store.commit('setOpenedList');
        }
    };
</script>
