<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <Select :clearable="clearable" v-model="selectedLabel" @on-change="selected" style="width:150px" filterable>
        <Option v-for="item in CarrierCompanys" :value="item.Id" :key="item.Id">{{ item.CarrierCompanyName }}</Option>
    </Select>
</template>
<!-- 物流状态下拉框 -->
<script>
    import Util from '../../libs/util';

    export default { 
        name: 'CarrierCompany',
        props: {
            selectedValue: String,
            selectedNumber: Number,
            clearable: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                CarrierCompanys : [],
                selectedLabel: 0
            };
        },
        methods: {
            selected(key) {
                var keyString = ''
                this.CarrierCompanys.map((item)=> {
                    if(item.Id == key){
                        keyString = item.CarrierCompanyName
                    }
                })
                this.$emit('on-change',keyString);
            },
            initData() {
                // if(this.selectedValue){
                //     this.CarrierCompanys.map((item)=> {
                //         if(item.CarrierCompanyName == this.selectedValue){
                //             this.selectedLabel = item.Id
                //         }
                //     })


                // }else if(this.selectedNumber) {

                //     this.selectedLabel = this.selectedNumber

                // }

            }
        },
        mounted() {


        },
        created () {
            // 可在此从服务端获取表格数据
            var _this = this;
            Util.getAjaxData({},'GetCarrierCompanyList' , undefined).then((res) => {
                _this.CarrierCompanys = res;
                // _this.initData()
            })


        },
        watch: {
            selectedValue: function (newSelectedNumber) {
                this.CarrierCompanys.map((item)=> {
                    if(item.CarrierCompanyName == this.selectedValue){
                        this.selectedLabel = item.Id
                    }
                })
            },
            selectedNumber: function(newSelectedString) {
                this.selectedLabel = this.selectedNumber
            }
        }
    };
</script>
