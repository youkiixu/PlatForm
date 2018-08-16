 <style lang="less">
 	@import '../../styles/common.less';
 	.fl {
 		float: left;
 	}
 </style>

 <template>
 	<div>
 		<CheckboxGroup style="float: left;" @on-change="selected1" v-model="selectType1" >
	 		<Checkbox v-for="item in caiWuTypeId1" :label="item.Id" >{{item.title}}</Checkbox>
	 	</CheckboxGroup>
	 	<CheckboxGroup style="float: left;" @on-change="selected2" v-model="selectType2" >
	 		<Checkbox v-for="item in caiWuTypeId2" :label="item.Id" >{{item.title}}</Checkbox>
	 	</CheckboxGroup>
 	</div>
 </template>

 <script>
 	import Util from '../../libs/util';
 	export default {
 		name: 'checkBoxCaiWuTypesList',
 		data () {
 			return {
 				caiWuTypeId1: [],
 				caiWuTypeId2: [],
 				selectType1: [],
 				selectType2: []
 			};
 		},
 		methods: {
 			selected1(key) {
 				this.$emit('on-change-type',this.selectType1);
 			},
 			selected2(key) {
 				this.$emit('on-change-count' , this.selectType2);
 			}
 		},
 		created () {
        // 可在此从服务端获取表格数据
        var _this = this;
        Util.getDataGrid({'strMethod': 'GetCaiWuTypesList'},undefined , undefined).then((res) => {
        	var data = res
        	_this.caiWuTypeId1 = data.head.Table;
        	_this.caiWuTypeId2 = data.dgData;
        })
    }
};
</script>
