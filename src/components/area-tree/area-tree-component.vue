<style lang="less">;

</style>

<template> 
	<div>
		<Tree 
		:data="treeData"
		@on-select-change="selectNode"
		:load-data="loadData"
		></Tree>
	</div>

</template>

<script>
	import Util from '@/libs/util'

	export default {
		name: 'getAreaComponent',
		props: {
			value: Array,
            selectMethod: {
                type: Boolean,
                default: true
            }
		},
		model: {
			prop: 'value',
			event: 'valueChange'
		},
		data () {
			return {
				treeData: [],
                treeSelected: [], //二三级菜单
                arr: []
            };
        },
        methods: {
            copyCallBack() {

            },
        	loadData (item, callback) {
                this.copyCallBack = callback
        		this.getCity(item , this.copyCallBack)
        	},
        	getCity(item , callback) {
        		var _this = this;
        			_this.treeSelected.push(item)
        		var par = {
        			$PID : item.strCode
        		}
        		var level = item.level + 1 

                var strMethod = this.selectMethod ? 'getBase_AreaDetails' : 'QueryDeliveryAddressMap'
                var uid = this.selectMethod ? '22c106f0-b6cf-4e10-8db3-81ce1793b69e' : undefined
        		Util.getAjaxData(par , strMethod , uid).then((res) => {
        			callback(_this.setValue(res , level , item.title))
        		})
        	},
        	selectNode(val) {
        		this.arr = []
        		this.changeVal(val[0])
        		this.$emit('on-select-change', this.arr);
        	},
        	setValue(data , level , strParentTitle) {
        		var arr = []
        		data.map((item) => {
        			arr.push({
        				title: item.strText,
        				strCode: item.strCode,
        				strParentCode: item.strParentCode,
        				strParentTitle: strParentTitle ,
        				level: level,
        				loading: false,
        				children: []
        			})
        		})
        		return arr;
        	},
        	changeVal(val){
        		if(val == undefined) return;

        		if(val.level != 0 && val.level) {
        			this.arr[val.level] = val
        			if(val.strParentTitle != ''){ 
        				this.treeSelected.map((item) => {
        					if(item.strCode == val.strParentCode){
        						this.changeVal(item)
        					}
        				})
        			}

        		} else {
        			this.arr[val.level] = val
        		}
        	},
            getPro() {
                var _this = this;
                var area = []
                var par = {
                    $PID: '0',
                }
                var strMethod = this.selectMethod ? 'getBase_AreaDetails' : 'QueryDeliveryAddressMap'
                var uid = this.selectMethod ? '22c106f0-b6cf-4e10-8db3-81ce1793b69e' : undefined
                _this.treeData = []
                Util.getAjaxData(par , strMethod , uid).then((res) => {
                    res.map((item) => {
                        _this.treeData.push({
                            title: item.strText,
                            strCode: item.strCode,
                            strParentCode: item.strParentCode,
                            strParentTitle: '',
                            level: 0 ,
                            loading: false,
                            children: []
                        })
                    })
                })
            }
        },
        mounted() {
            this.getPro()
        },
        created () {
        	

        }
    };
</script>
