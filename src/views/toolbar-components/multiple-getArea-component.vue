<style lang="less">;

</style>

<template> 
	<div>
		省
		<Select  style="width:100px" v-model="city1" @on-change="city1Change" filterable>
			<Option v-for="item in cityList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
		</Select>
        <br>
		市
		<Select  style="width:250px" v-model="city2" @on-change="city2Change" clearable multiple>
			<Option v-for="item in cityList2" :value="item.value" :key="item.value">{{ item.label }}</Option>
		</Select>
	</div>

</template>

<script>
	import Util from '@/libs/util'


	export default {
		name: 'getAreaComponent',
		props: {
			param: Object

		},
		data () {
			return { 

				cityList1: [],
				cityList2: [],
				cityList3: [],
				city1: '',
				city2: [],
				city3: ''
			};
		},
		methods: {
			resetList() {
				this.cityList1 = [];
				this.cityList2 = []
				this.cityList3 = []
				this.city1 = ''
				this.city2 = []
				this.city3 = ''
				this.getList()
			},
			city1Change(data){
				var _this = this;
				var par = {
					isLoad: true,
					$PCode: data,
					strMethod: 'GetAreaInfo'
                }
				_this.cityList2 = []
				Util.getAjaxData(par , undefined , undefined).then((res) => {
					var data = res.dgData;
					data.map((item) => {
						_this.cityList2.push({
							label: item.Name,
							value: item.Code
						})
					})
				})
			},
			city2Change(data) {
				var _this = this;
				var par = {
					isLoad: true,
					$PCode: data,
					strMethod: 'GetAreaInfo'
				}
				_this.cityList3 = []
				// Util.getAjaxData(par , undefined , undefined).then((res) => {
				// 	var data = res.dgData;
				// 	data.map((item) => {
				// 		_this.cityList3.push({
				// 			label: item.Name,
				// 			value: item.Code
				// 		})
				// 	})
				// })
			},
			getData() {
                // console.log(data)
                var cityList = []
                this.city2(selectCity => {
                    this.cityList2.map((item) => {
                        if(item.value == selectCity){
                            cityList.push(item)
                        }
                    })
                })
                return cityList;
            },
            setData(areaName) {
				console.log(areaName)
				var _this = this;
				_this.city2 = []
				if(typeof areaName === 'string') {
					this.getAreaInfos(areaName)
				} else {
					areaName(item => {
						this.getAreaInfos(item)
					})
				}
			},
			getAreaInfos(areaName) {
				var _this =this;
				var par = {
					isLoad : true,
					$PCode: undefined,
					$Code: undefined,
					$Name: areaName
				}
				
				Util.getAjaxData(par , 'GetAreaInfo' , undefined).then((res) => {
					var item = res[0]
					_this.city1 = item.PCode
					setTimeout(function() {
						_this.city2.push(item.Code)
					},20)
				})
			},
            getList() {
            	var _this = this;
                var par = {
                	isLoad: true,
                	$PCode: 0,
                	strMethod: 'GetAreaInfo'
                }
                Util.getAjaxData(par , undefined , undefined).then((res) => {
                	var data = res.dgData;
                	data.map((item) => {
                		_this.cityList1.push({
                			label: item.Name,
                			value: item.Code
                		})
                	})
                })
            }
            },
            created () {
                // 可在此从服务端获取表格数据
                this.getList()

            }
        };
    </script>
