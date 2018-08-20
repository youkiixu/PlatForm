import axios from 'axios';
import env from '../../build/env';
import semver from 'semver';
import packjson from '../../package.json';
import Cookies from 'js-cookie';

function encode (input) {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
    'QRSTUVWXYZabcdef' +
    'ghijklmnopqrstuv' +
    'wxyz0123456789+/' +
    '=';
    input = escape(input);
    var output = '';
    var chr1, chr2, chr3 = '';
    var enc1, enc2, enc3, enc4 = '';
    var i = 0;

    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
        keyStr.charAt(enc1) +
        keyStr.charAt(enc2) +
        keyStr.charAt(enc3) +
        keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = '';
        enc1 = enc2 = enc3 = enc4 = '';
    } while (i < input.length);

    return output;
}

let util = {

};
// 检测有没有空字符串
util.deVoid = function (obj) {
    var isTrue = false;
    for (var key in obj) {
        if (obj[key] === '') {
            isTrue = true;
        }
    }
    return isTrue;
};

util.title = function (title) {
    title = title || '印捷物流后台';
    window.document.title = title;
};

util.delRow = function (rowId, uid, vm) {
    vm.$Modal.confirm({
        title: '确定删除？',
        content: '是否确认删除这一行信息？',
        onOk: function () {
            var par = {
                'Id': rowId,
                'rowState': 'D'
            };
            util.getAjaxData(par, undefined, uid).then((data) => {
                if (data.errMsg || data.result != 'ok') {
                    vm.$Message.error(data.errMsg);
                    return false;
                }
                vm.$Message.success('删除！');
                vm.getData();
            });
        }
    });
};
// http://yj.kiy.cn/
// http://yj.kiy.cn:9504
// http://localhost:38407
// http://localhost:8089/api
// window.location.protocol
const locationProtocol = window.location.protocol;
const ajaxUrl = env === 'development'
? locationProtocol + '//localhost:8089/api/'
: env === 'production'
? window.location.protocol + '//' + window.location.host + "/"
: window.location.protocol + '//' + window.location.host + "/";

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000,
    withCredentials: true
});

util.env = env;

util.WebSocket = function (vm, wsUrl) {
    var session = Cookies.get('strWebSession');
    var wsUrl = wsUrl || 'ws://101.37.27.113:1113/';
    // var wsUrl = wsUrl ? wsUrl : 'ws://192.168.30.31:1113/'
    window.top.socket = new WebSocket(wsUrl + session);
    // 整个网站只有一个socket，共享一个socket
    window.top.socket.addEventListener('open', function (event) {
        vm.$Message.info('websocket连接成功');
    });
    window.top.socket.addEventListener('message', function (event) {
        var res = JSON.parse(event.data);
        if (res.result === 'ok') {
            var param = {
                strMethod: res.strMethod,
                uid: res.uid,
                data: res.data
            };
            vm.$store.commit('setWebSocket', param);
        } else if (res.result === 'err') {
            vm.$Notice.error({
                title: '警告',
                desc: res.errMsg
            });
        }
    });
    window.top.socket.addEventListener('error', function (event) {
        window.top.socket = new WebSocket(wsUrl + session);
        vm.$Message.error('websocket发生错误');
    });
    window.top.socket.addEventListener('close', function (event) {
        window.top.socket = new WebSocket(wsUrl + session);
        vm.$Message.warning('websocket关闭');
    });
};

util.socketSend = function (param, strMethod, uid) {
    var socket = window.top.socket;

    var uidString = '';
    if (uid != undefined) {
        uidString = uid;
    } else {
        uidString = '245e9b3a-36eb-4599-8805-6c88aca87076';
    }
    if (strMethod != undefined) {
        var strMethod = {'strMethod': strMethod};
    }
    var paramData = {
        param: param
    };

    const data = Object.assign(paramData, {
        'uid': uidString
    }, strMethod || {});
    if (env == 'development') {
            // console.log(data);
    }

    var par = JSON.stringify(data);
    socket.send(par);
};

util.postOtherApi = function (param, url) {
    return axios.post(url,
            param
            ).then((res) => {
                return Promise.resolve(res.data);
            }).catch((e) => {
                return Promise.reject(e);
            });
};

util.postKiyApi = function (param, url) {
    // param = {model : param}
    return axios.post(ajaxUrl + '/global/post/post',
        {
            url: url,
            method: 'POST',
            param: JSON.stringify(param)
        }
    ).then((res) => {
        return Promise.resolve(res.data);
    }).catch((e) => {
        return Promise.reject(e);
    });
};

util.postApiData = function (param, url) {
    return axios.post(ajaxUrl + url,
            param
            ).then((res) => {
                return Promise.resolve(res.data);
            }).catch((e) => {
                return Promise.reject(e);
            });
};

util.getLoginData = function (param) {
    const data = Object.assign(param, {}, {

    });
    var en = encode(JSON.stringify(data));
    return axios.post(ajaxUrl + 'BackStage/Login/Login',
                param
                ).then((res) => {
                    return Promise.resolve(res.data);
                }).catch((e) => {
                    console.log(e);
                });
};

util.getAjaxData = function (param, strMethod, uid) {
    var uidString = '';
    if (uid != undefined) {
        uidString = uid;
    } else {
        uidString = '217141a5-01d0-4696-9500-ae2d82a8cb4c';
    }
    if (strMethod != undefined) {
        var strMethod = {'strMethod': strMethod};
    }
    var paramData = {
        param: param
    };
    const data = Object.assign(paramData, {
        'uid': uidString
    }, strMethod || {});
    // if (env == 'development') {
        console.log(JSON.stringify(data));
    // }
    var en = encode(JSON.stringify(data));
    return axios.post(ajaxUrl + '/Admins/GetData/GetAjaxData', {
        data: en
    }).then((res) => {
        if (res.status == 500) {

        }
        if (res.status == 200) {
            return Promise.resolve(res.data);
        }
    }).catch((e) => {
        console.log(e);
    });
};

util.getDataGrid = function (param, strMethod, uid, vm) {
    var uidString = '';
    if (uid != undefined) {
        uidString = uid;
    } else {
        uidString = '217141a5-01d0-4696-9500-ae2d82a8cb4c';
    }
    if (strMethod != undefined) {
        var strMethod = {'strMethod': strMethod};
    }
    var paramData = {
        param: param
    };
    const data = Object.assign(paramData, {
        'uid': uidString
    });
                // if (env == 'development') {
    console.log(JSON.stringify(data));
                // }
    var en = encode(JSON.stringify(data));

    vm.$Loading.start();

    return axios.post(ajaxUrl + '/Admins/GetData/GetAjaxData', {
        data: en
    }).then((res) => {
        if (res.status == 500) {

        }
        if (res.status == 200) {
            if (res.data.result == 'err') {
                vm.$Loading.error();
                if (env == 'development') {
                    vm.$Notice.error({
                        title: res.data.errMsg,
                        desc: res.data.sysError
                    });
                } else {
                    vm.$Notice.error({
                        title: res.data.errMsg,
                        desc: '操作失败，请正确操作'
                    });
                }
            } else {
                vm.$Loading.finish();
                return Promise.resolve(res.data);
            }
        }
    }).catch((e) => {
        console.log(e);
    });
};

util.tbSave = function (head, dgData, uid, vm) {
    var par = {
        param: {
            head: head,
            dgData: dgData
        },
        uid: uid
    };
    console.log(JSON.stringify(par));

    var en = encode(JSON.stringify(par));
    vm.$Loading.start();
    return new Promise(function (resolve, reject) {
        util.postApiData({data: en }, '/Admins/GetData/GetAjaxData').then((res) => {
            try {
                if (res.result == 'ok') {
                    vm.$Notice.success({
                        title: res.msg,
                        desc: res.msg
                    });
                    vm.$Loading.finish();
                    resolve(res);
                } else {
                    vm.$Notice.error({
                        title: '操作失败，请正确操作',
                        desc: res.errMsg
                    });
                    return reject(res);
                    vm.$Loading.error();
                }
            } catch (e) {
                vm.$Notice.error({
                    title: '操作失败',
                    desc: '操作失败'
                });
                return reject(e);
                vm.$Loading.error();
            }
        });
    });
};

util.inOf = function (arr, targetArr) {
    let res = true;
    arr.map(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.showThisRoute = function (itAccess, currentAccess) {
    if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};

util.getRouterObjByName = function (routers, name) {
    let routerObj = {};
    routers.forEach(item => {
        if (item.name === 'otherRouter') {
            item.children.forEach((child, i) => {
                if (child.name === name) {
                    routerObj = item.children[i];
                }
            });
        } else {
            if (item.children.length === 1) {
                if (item.children[0].name === name) {
                    routerObj = item.children[0];
                }
            } else {
                item.children.forEach((child, i) => {
                    if (child.name === name) {
                        routerObj = item.children[i];
                    }
                });
            }
        }
    });
    return routerObj;
};

util.handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '',
                name: 'home_index'
            }
        ];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '/home',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '',
                    name: 'home_index'
                }
            ];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: name
                }
            ];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
                },
                {
                    title: childObj.title,
                    path: currentPathObj.path + '/' + childObj.path,
                    name: name
                }
            ];
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) {  // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        tag = tag.children ? tag.children[0] : tag;
        if (argu) {
            tag.argu = argu;
        }
        if (query) {
            tag.query = query;
        }
        vm.$store.commit('increateTag', tag);
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.fullscreenEvent = function (vm) {
    vm.$store.commit('initCachepage');
    // 权限菜单过滤相关
    vm.$store.commit('updateMenulist');
    // 全屏相关
};

util.dataGridHeight = function () {
    var sidebarMenuCon = document.querySelector('.sidebar-menu-con').offsetHeight;
    // var mainHeaderCon = document.querySelector('.main-header-con').offsetHeight
    var mainHeaderCon = 100;
    var marginHeight = 40 + 32 + 33;
    // var topBar = document.querySelector('.single-page').firstChild.firstChild.offsetHeight
    var topBar = 220;
    var height = sidebarMenuCon - mainHeaderCon - marginHeight - topBar;
    return height;
};

util.autoPushCol = function (colRow, vm) {
    vm.oldData.push(colRow);
    vm.tableColumnsFilter.push(colRow.key);
    vm.oldColumnsList.push({
        key: colRow.key,
        title: colRow.title
    });
};

util.initButton = function (vm) {
    var userInfo = JSON.parse(Cookies.get('userInfo'));
    var routerArr = window.location.hash.split('#')[1];
    var routerObj = routerArr.split('/');
    var len = routerObj.length;
    var routerName = routerObj[len - 1];
    var pageList = JSON.parse(localStorage.menuList);
    var strCode = '';
    for (var i = pageList.length - 1; i >= 0; i--) {
        if (pageList[i].path == routerName) {
            strCode = pageList[i].strCode;
            break;
        }
    }

    var par = {
        '@strCode': strCode,
        '@idRole': userInfo.RoleId,
        '@userId': userInfo.userId
    };

    this.getAjaxData(par, undefined, 'EC0AD0BE-CF94-4CC8-BE92-54B185C97C76').then((res) => {
        var res = res;
        var button = JSON.parse(res.button);
        button.map((item) => {
            vm.buttonGroup.push(item);
        });
    });
};
String.prototype.padLeft = function (len, char) {
    return this.length < len ? char + this : this;
};

util.nowTime = function (vm, text) {
    if (vm != undefined && vm != null) {
        let app = vm.$store.state.app;
        let currentPageName = app.currentPageName;
        let currentPath = app.currentPath;
        var tabName = '';
        currentPath.map((item) => {
            if (item.name == currentPageName) {
                tabName = item.title;
            }
        });

        vm.$Notice.info({
            title: '正在打开' + tabName,
            desc: text || '加载最近7天的数据',
            duration: 2
        });
    }
    var nowdate = new Date();
    var y = nowdate.getFullYear();
    var m = (nowdate.getMonth() + 1).toString().padLeft(2, '0');
    var d = (nowdate.getDate()).toString().padLeft(2, '0');
    var formatnowdate = y + '-' + m + '-' + d;

    var oneweekdate = new Date(nowdate - 7 * 24 * 3600 * 1000);
    var y = oneweekdate.getFullYear();
    var m = (oneweekdate.getMonth() + 1).toString().padLeft(2, '0');
    var d = (oneweekdate.getDate()).toString().padLeft(2, '0');
    var forweek = y + '-' + m + '-' + d;

    nowdate.setMonth(nowdate.getMonth() - 1);
    var y = nowdate.getFullYear();
    var m = (nowdate.getMonth() + 1).toString().padLeft(2, '0');
    var d = (nowdate.getDate()).toString().padLeft(2, '0');
    var formatwdate = y + '-' + m + '-' + d;

    var h = nowdate.getHours();
    var m = nowdate.getMinutes();
    var s = nowdate.getSeconds();
    var forTime = h + ':' + m + ':' + s;

    return {
        formatnowdate, forweek, formatwdate, forTime
    };
};

export default util;
