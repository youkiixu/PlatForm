<style lang="less">
	@import '../../styles/common.less';

	.time{
		font-size: 14px;
		font-weight: bold;
	}
	.content{
		padding-left: 5px;
	}
</style>

<template>
	<div>
		<Timeline>
			<TimelineItem color="green" v-for="item in tableData">
				<p class="time">{{item.CreateDate}}</p>
				<p class="content">{{item.Remark}}</p>
			</TimelineItem>
		</Timeline>
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>

<script>
	import Util from '../../libs/util';

	export default {
		name: 'queryExpress',
		props: {
			param: Number
		},
		data () {
			return {
				spinShow: false,
				tableData: []
			};
		},
		methods: {


		},
		mounted () {
			var oid = this.param;
			var _this = this;
			_this.spinShow = true;
			if(oid != undefined) {
				var par = {
					oid: oid,
					ThirdPlat: true
				}
				Util.getAjaxData(par , undefined , "245e9b3a-36eb-4599-8805-6c88aca87076").then((res) => {
					//var res = res;
					if(res.result == 'err'){
						this.$Notice.warning({
							title: '暂无任何物流信息',
							desc: '暂无任何物流信息'
						});
						_this.$Modal.remove()
						return
					}
					if(res.orderStatus == undefined){
						this.$Notice.warning({
							title: '获取不到物流信息',
							desc: '获取不到物流信息'
						});
						_this.$Modal.remove()
						return
					}
					var tableData = JSON.parse(res.orderStatus)
					if(tableData.length <= 0){
						_this.$Message.warning({
							content: '暂时获取不到最新物流信息,请稍后再操作',
							closable: true
						})
						_this.$Modal.remove()
					} else {
						_this.tableData = tableData.reverse()
						_this.spinShow = false
					}
					
				})
			} else {
				_this.$Modal.remove()
				_this.$Message.warning({
					content: '没有获取到快递单号',
					closable: true
				})
				
			}

		},
		created () {
        // 可在此从服务端获取表格数据
        
    }
};
</script>
