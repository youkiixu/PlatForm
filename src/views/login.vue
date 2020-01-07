<style lang="less">
@import "./login.less";
.logo-btn {
}
</style>

<template>
    <div class="login"
         @keydown.enter="handleSubmit">
        <canvas id="canvas"
                v-if="backgroundDom"></canvas>

        <div class="login-con">
            <div class="logo-box">
                <img src="../images/20171125113948.png" />
                <!-- <span>用数据的心智,去超越</span> -->
            </div>
            <Card :bordered="true">
                <p slot="title"
                   @click="showQRCode">
                    <Icon type="log-in"></Icon>
                    <span v-if="showQR">密码登录</span>
                    <span v-if="!showQR">扫码登录</span>
                </p>
                <div class="form-con"
                     v-if="showQR">
                    <img :src="qr"
                         style="display:block;margin:0 auto;width:200px;height:200px;"
                         alt="">
                </div>
                <div class="form-con"
                     v-if="!showQR">
                    <Form ref="loginForm"
                          :model="form"
                          :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName"
                                   placeholder="请输入用户名">
                            <span slot="prepend">
                                <Icon :size="16"
                                      type="person"></Icon>
                            </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password"
                                   v-model="form.password"
                                   class="psw-focus"
                                   placeholder="请输入密码">
                            <span slot="prepend">
                                <Icon :size="14"
                                      type="locked"></Icon>
                            </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password"
                                  v-if="isCheck">
                            <Input v-model="form.checkCode"
                                   placeholder="请输入验证码">
                            <span slot="prepend">
                                <Icon :size="14"
                                      type="ios-loop-strong"></Icon>
                            </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="checkCodeImg"
                                  v-if="isCheck">
                            <img v-bind:src="checkCodeImg">
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit"
                                    class="logo-btn"
                                    style="background:linear-gradient(to right, #26c4ca , #3fbdd6);border: 1px solid rgba(6, 178, 184,1);box-shadow: 0rem 0rem 0.24rem rgba(0,0,0,0.2);color:#fff;"
                                    long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">印捷物流平台管控中心</p>
                </div>
            </Card>
        </div>
    </div>
</template>
 
<script>
import Cookies from "js-cookie";
import Util from "../libs/util";
const basePath = Util.basePath;

export default {
    data() {
        return {
            form: {
                userName: "",
                password: "",
                checkCode: ""
            },
            rules: {
                userName: [
                    { required: true, message: "账号不能为空", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "密码不能为空", trigger: "blur" }
                ]
            },
            checkCodeImg:
                basePath +
                "BackStage/Login/GetCheckCode" +
                "?time=" +
                new Date().getTime(),

            isCheck: false,
            subNum: 0,
            backgroundDom: true,
            showQR: false,
            qr: basePath + "Areas/Web/Content/images/wx_wait.gif"
        };
    },
    methods: {
        showQRCode() {
            var _this = this;
            this.showQR = !this.showQR;
            if (this.showQR) {
                _this.qr = basePath + "Areas/Web/Content/images/wx_wait.gif";
                Util.postApiData({}, "Global/HotUpdate/GetLoginQRCode").then(
                    res => {
                        _this.qr = res.qrUrl;
                        _this.checkQRcode(res.key);
                    }
                );
            }
        },
        checkQRcode(key) {
            var _this = this;
            var tim = setInterval(() => {
                Util.postApiData(
                    {},
                    "Global/HotUpdate/CheckLogin?key=" + key
                ).then(res => {
                    if (res.success) {
                        clearInterval(tim);
                        Cookies.set("user", res.TrueName);
                        Cookies.set("password", res.password);
                        Cookies.set("YSH-PlatformManage", res.userId);
                        Cookies.set("YSH-PlatformUsername", res.TrueName);
                        _this.$store.commit(
                            "setAvator",
                            "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg"
                        );
                        // 设置权限RoleId
                        Cookies.set("access", res.RoleId);
                        Cookies.set("userInfo", JSON.stringify(res));
                        Cookies.set("strWebSession", res.strWebSession);

                        _this.$router.push({
                            name: "home_index"
                        });
                    }
                });
            }, 1000);
        },
        getCheckCode() {
            this.isCheck = true;
            this.checkCodeImg =
                basePath +
                "BackStage/Login/GetCheckCode" +
                "?time=" +
                new Date().getTime();
        },
        handleSubmit() {
            var jsonP = { "username": this.form.userName, "password": this.form.password , "checkCode": this.form.checkCode}
                var _this = this;
                Util.getLoginData(jsonP).then((res) => {
                    if(!res.success) {
                        this.$Notice.error({
                            title: '登录失败',
                            desc: res.msg,
                            duration: 4,
                            name: 'greeting'
                        });
                        if(res.minTimesWithoutCheckCode === 3 && _this.subNum >= 2) {
                            _this.getCheckCode()
                        }
                        _this.subNum++
                        return
                    } else {
                        Cookies.set('user', _this.form.userName);
                        Cookies.set('password', _this.form.password);
                        Cookies.set('YSH-PlatformManage' , res.userId)
                        Cookies.set('YSH-PlatformUsername' , _this.form.userName)
                        _this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                        // 设置权限RoleId
                        Cookies.set('access', res.RoleId);
                        Cookies.set('userInfo' , JSON.stringify(res))
                        Cookies.set('strWebSession' , res.strWebSession)
                        _this.$router.push({
                            name: 'home_index'
                        });
                    }
                })
            // var jsonP = { key: this.form.userName, pwd: this.form.password };
            // var _this = this;
            // Util.getLoginData(jsonP).then(res => {
            //     if (!res.SUCCESS) {
            //         this.$Notice.error({
            //             title: "登录失败",
            //             desc: res.MESSAGE,
            //             duration: 4,
            //             name: "greeting"
            //         });
            //         // if(res.minTimesWithoutCheckCode === 3 && _this.subNum >= 2) {
            //         //     _this.getCheckCode()
            //         // }
            //         // _this.subNum++
            //         // return
            //     } else {
            //         Cookies.set("user", _this.form.userName);
            //         Cookies.set("password", _this.form.password);
            //         Cookies.set("YSH-PlatformManage", res.DATA.Id);
            //         Cookies.set("YSH-PlatformUsername", _this.form.userName);
            //         _this.$store.commit(
            //             "setAvator",
            //             "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg"
            //         );
            //         // 设置权限RoleId
            //         Cookies.set("access", res.DATA.RoleId);
            //         const userInfo = Object.assign(res.DATA, {
            //             userId: res.DATA.Id,
            //             TrueName: res.DATA.RealName
            //         });
            //         console.log(JSON.stringify(userInfo));
                    
            //         Cookies.set("userInfo", JSON.stringify(userInfo));
            //         Cookies.set("strWebSession", res.strWebSession);
            //         _this.$router.push({
            //             name: "home_index"
            //         });
            //     }
            // });
        },
        initBackgroung() {
            var WIDTH = window.innerWidth,
                HEIGHT = window.innerHeight,
                POINT = 35;

            var canvas = document.getElementById("canvas");
            (canvas.width = WIDTH), (canvas.height = HEIGHT);
            var context = canvas.getContext("2d");
            (context.strokeStyle = "rgba(6, 178, 184,0.2)"),
                (context.strokeWidth = 1),
                (context.fillStyle = "rgba(6, 178, 184,0.8)");
            var circleArr = [];

            function Line(x, y, _x, _y, o) {
                (this.beginX = x),
                    (this.beginY = y),
                    (this.closeX = _x),
                    (this.closeY = _y),
                    (this.o = o);
            }

            function Circle(x, y, r, moveX, moveY) {
                (this.x = x),
                    (this.y = y),
                    (this.r = r),
                    (this.moveX = moveX),
                    (this.moveY = moveY);
            }

            function num(max, _min) {
                var min = arguments[1] || 0;
                return Math.floor(Math.random() * (max - min + 1) + min);
            }

            function drawCricle(cxt, x, y, r, moveX, moveY) {
                var circle = new Circle(x, y, r, moveX, moveY);
                cxt.beginPath();
                cxt.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
                cxt.closePath();
                cxt.fill();
                return circle;
            }

            function drawLine(cxt, x, y, _x, _y, o) {
                var line = new Line(x, y, _x, _y, o);
                cxt.beginPath();
                cxt.strokeStyle = "rgba(255,255,255," + o + ")";
                cxt.moveTo(line.beginX, line.beginY);
                cxt.lineTo(line.closeX, line.closeY);
                cxt.closePath();
                cxt.stroke();
            }

            function init() {
                circleArr = [];
                for (var i = 0; i < POINT; i++) {
                    circleArr.push(
                        drawCricle(
                            context,
                            num(WIDTH),
                            num(HEIGHT),
                            num(15, 2),
                            num(10, -10) / 40,
                            num(10, -10) / 40
                        )
                    );
                }
                draw();
            }

            function draw() {
                context.clearRect(0, 0, canvas.width, canvas.height);
                for (var i = 0; i < POINT; i++) {
                    drawCricle(
                        context,
                        circleArr[i].x,
                        circleArr[i].y,
                        circleArr[i].r
                    );
                }
                for (var i = 0; i < POINT; i++) {
                    for (var j = 0; j < POINT; j++) {
                        if (i + j < POINT) {
                            var A = Math.abs(
                                    circleArr[i + j].x - circleArr[i].x
                                ),
                                B = Math.abs(
                                    circleArr[i + j].y - circleArr[i].y
                                );
                            var lineLength = Math.sqrt(A * A + B * B);
                            var C = (1 / lineLength) * 7 - 0.009;
                            var lineOpacity = C > 0.03 ? 0.03 : C;
                            if (lineOpacity > 0) {
                                drawLine(
                                    context,
                                    circleArr[i].x,
                                    circleArr[i].y,
                                    circleArr[i + j].x,
                                    circleArr[i + j].y,
                                    lineOpacity
                                );
                            }
                        }
                    }
                }
            }

            init();
            window.top.initBG = setInterval(function() {
                for (var i = 0; i < POINT; i++) {
                    var cir = circleArr[i];
                    cir.x += cir.moveX;
                    cir.y += cir.moveY;
                    if (cir.x > WIDTH) cir.x = 0;
                    else if (cir.x < 0) cir.x = WIDTH;
                    if (cir.y > HEIGHT) cir.y = 0;
                    else if (cir.y < 0) cir.y = HEIGHT;
                }
                draw();
            }, 20);
        }
    },
    mounted() {
        this.initBackgroung();
    },
    destroyed() {
        clearInterval(window.top.initBG);
        this.backgroundDom = false;
    }
};
</script>

<style>
</style>
