<template>
	<div class="vue-dist-picker"  v-clickoutside="immEndChoice">
	<!-- 	<input type="text" autocomplete="off" disableautocomplete :placeholder="placeholder" :value="showName"
	@focus="startChoice" @keypress="startChoice"  ref="input" > -->
	<Input 
	v-model="showName"
	@on-focus="startChoice" 
	@on-keypress="startChoice"
	:readonly="readonly"
	ref="input" 
	placeholder="请选择地址" 
	style="width: 410px;margin: 0 10px;"></Input>
	<!--选择面板-->
	<!-- v-show="distPanelIsShow" -->
	<div class="vdp-panel" >
		<h5>选择省市区</h5>
		<ul class="vdp-tags">
			<li :class="{'z-on': activatedTag==1}" @click="activeTag(1)">{{ currProv }}</li>
			<li :class="{'z-on': activatedTag==2}" @click="activeTag(2)" v-if="provId">{{ currCity }}</li>
			<li :class="{'z-on': activatedTag==3}" @click="activeTag(3)" v-if="cityId">{{ currDist }}</li>
			<li :class="{'z-on': activatedTag==4}" @click="activeTag(4)" v-if="streetId">{{ currStreet }}</li>
		</ul>
		<Card class="vdp-list">
			<ul v-if="activatedTag==1">
				<li v-for="(item, idx ) in provList" @click="choiceProv(item)" :key="idx" :title=" item.strText ">{{ item.strText }}</li>
			</ul>
			<ul v-if="activatedTag==2">
				<li v-for="(item, idx ) in cityList" @click="choiceCity(item)" :key="idx" :title=" item.strText ">{{ item.strText }}</li>
			</ul>
			<ul v-if="activatedTag==3">
				<li v-for="(item, idx ) in distList" @click="choiceDist(item)" :key="idx" :title="item.strText ">{{ item.strText }}</li>
			</ul>
			<ul v-if="activatedTag==4">
				<li v-for="(item, idx ) in streetList" @click="choiceStreet(item)" :key="idx" :title="item.strText ">{{ item.strText }}</li>
			</ul>
		</Card>
	</div>
</div>

</template>

<script>
	import VueClickoutside from './clickoutside.js'
	import Util from '@/libs/util.js'
	export default {
		name : 'kkcascader',
		directives: {
			'clickoutside' : VueClickoutside
		},
		create() {
			this.setShowName();
		},
		props: {
			placeholder: {
				type: String,
				default: '请选择城市'
			},
			level: {
				type: Number,
				default: 5
			},
			readonly: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				distPanelIsShow: false,
			activatedTag : 1, //1省 2市 3区 3镇
			
			provId:'',
			cityId:'',
			distId:'',
			streetId: '',
			provList: [],
			cityList: [],
			distList: [],
			streetList: [],
			currProv: '请选择',
			currCity: '请选择',
			currDist: '请选择',
			currStreet: '请选择',
			showName:'',
			selectData: []
		};
	},
	computed: {
	},
	methods: {
		// 开始选择（显示省市区面板）
		init() {
			var _this = this;
			this.getAreaData(0).then((res)=>{
				res.map((item) => {
					_this.provList.push(item)
				})
			})
		},
		getAreaData(code) {
			var _this = this;
			var par = {
				$PID: code
			}

			this.$emit('on-pid-change', code);

			return Util.getAjaxData(par , 'QueryDeliveryAddressMap' , undefined).then((res) => {
				return Promise.resolve(res);
			})
		},
		startChoice(e) {
			if (e && e.type == 'keypress') {
				e.returnValue = false;
			}
			this.distPanelIsShow = true;
		},
		activeTag(k) {
			this.activatedTag = k;
		},
		choiceProv(ele) {
			var _this = this;
			this.provId = ele.strCode;
			this.cityId = '';
			this.distId = '';
			this.streetId = '';
			this.currProv = ele.strText;
			this.currCity = '';
			this.currDist = '';
			this.currStreet = '';
			
			this.getAreaData(ele.strCode).then((res) => {
				_this.cityList = []
				res((item) => {
					_this.cityList.push(item)
				})
				if(_this.cityList.length != 0) {
					_this.activeTag(2);
				}
				_this.setShowName();
				this.$emit('on-change', ele);
			})
			
			
		},
		choiceCity(ele) {
			var _this = this;
			this.cityId = ele.strCode;
			this.currCity = ele.strText;
			this.distId = '';
			this.streetId = '';
			this.currDist = '';
			this.currStreet = '';
			

			this.getAreaData(ele.strCode).then((res) => {
				_this.distList = []
				res.map((item) => {
					_this.distList.push(item)
				})
				if(_this.distList.length != 0) {
					_this.activeTag(3);
				}
				_this.setShowName();
				this.$emit('on-change', ele);
			})
			
			
		},
		choiceDist(ele) {
			if(this.level == 3) return;
			var _this = this;
			this.currDist = ele.strText
			this.distId = ele.strCode;
			this.streetId = '';
			this.currStreet = '';
			this.getAreaData(ele.strCode).then((res) => {
				_this.streetList = []
				res((item) => {
					_this.streetList.push(item)
				})
				if(_this.streetList.length != 0) {
					_this.activeTag(4);
				}
				_this.setShowName();
				this.$emit('on-change', ele);
			})
		},
		choiceStreet(ele) {
			if(this.level == 4) return;

			var _this = this;
			this.currStreet = ele.strText
			this.streetId = ele.strCode;
			// this.streetId = '';

			this.setShowName();
			// this.immEndChoice();
			this.$emit('on-change', ele);
		},
		setShowName() {
			let {
				currProv,
				currCity,
				currDist,
				currStreet
			} = this;
			this.showName = currProv + ' ' + currCity + ' ' + currDist + ' ' + currStreet;
			
		},
		// 立即关闭省市区面板
		immEndChoice() {
			this.distPanelIsShow = false;
		}
	},
	mounted() {
		this.init()
	}
}
</script>

<style lang="less" scoped>
	@grey1: #DDD;
	@grey2: #f2f2f3;
	@c1: #2d8cf0;
	@c2: #8babec;
	@keyframes vueDistPicker {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0);
		}
		100% {
			opacity: 1;
			transform: translate(0) scale(1);
		}
	}
	.vue-dist-picker {
		position: relative;
		margin: 0;
		padding: 0;
		font: 12px/1.5 'Microsoft YaHei',tahoma,arial,'Hiragino Sans GB','\\5b8b\4f53',sans-serif;
		color: #333;
		text-align: center;
		* {
			margin: 0;
			padding: 0;
			box-sizing: content-box;
		}
		input {
			display: block;
			width: 245px;
			height: 28px;
			padding-left: 6px;
			border: 1px solid @grey1;
			outline: none;
			font-size: 14px;
		}
		li {
			list-style-type: none;
		}
		.vdp-panel {
			position: absolute;
			z-index: 7;
			left: 0;
			top: 50px;
			padding: 12px 10px 0;
			width: 410px;
			border: 1px solid @grey1;
		// box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.18);
		overflow: hidden;
		background-color: #FFF;
		animation: vueDistPicker 0.1s ease-out;
		h5 {
			margin-bottom: 5px;
			padding-left: 2px;
			color: #aaa;
			line-height: 1.5;
			font-weight: normal;
		}
		.vdp-tags {
			margin: 5px 0;
			border-bottom: 2px solid @c2;
			&::after {
				content: '';
				display: block;
				clear: both;
			}
			li {
				position: relative;
				display: block;
				bottom: -2px;
				float: left;
				margin-right: 6px;
				padding: 0 4px;
				width: 85px;
				font-size: 12px;
				line-height: 24px;
				height: 23px;
				text-align: center;
				border: 1px solid #ccc;
				border-bottom: none;
				cursor: pointer;
				font-weight: bold;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				&.z-on {
					color: @c1;
					border-color: @c2;
					border-width: 2px;
					border-bottom: 2px solid #fff;
				}
			}
		}
		.vdp-list {
			overflow: hidden;
			border-bottom: 10px solid #fff;
			ul {
				padding: 10px 12px 20px;
				line-height: 28px;
				overflow-y: auto;
				height: 480px;
				li {
					float: left;
					display: block;
					width: 84px;
					padding-left: 4px;
					cursor: pointer;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					&:hover {
						color: @c1;
						background-color: @grey2;
					}
				}
			}
		}
	}
}
</style>