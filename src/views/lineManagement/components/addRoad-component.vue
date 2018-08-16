<template>
	<Form ref="formValidate" :model="pubForm" label-position="left">
        <FormItem
        v-for="(item, index) in pubForm.materialValue"
        v-if="item.status"
        :key="index"
        :prop="'materialValue.' + index + '.value'">
        <Row>
            <span class="margin-lr-10px" v-if="areaName.length >= 0">
                省:<Input type="text" v-model="item.province" placeholder="省" style="width: 100px" :disabled="areaName.length >= 1"></Input>
            </span>
            <span class="margin-lr-10px" v-if="areaName.length >= 1">
                市:<Input type="text" v-model="item.city" placeholder="城市" style="width: 100px" :disabled="areaName.length >= 2"></Input>
            </span>
            <span class="margin-lr-10px" v-if="areaName.length >= 2">
                地区:<Input type="text" v-model="item.distric" placeholder="地区" style="width: 100px" :disabled="areaName.length >= 3"></Input>
            </span>
            <span class="margin-lr-10px" v-if="areaName.length >= 3">
                街道:<Input type="text" v-model="item.street" placeholder="街道" style="width: 100px" :disabled="areaName.length >= 4"></Input>
            </span>
            <span class="margin-lr-10px" v-if="areaName.length >= 4">
                路名:<Input type="text" v-model="item.road" placeholder="道路名称" style="width: 100px" :disabled="areaName.length >= 5"></Input>
            </span>
            <span class="margin-lr-10px" >
                <Poptip
                confirm
                title="您确认删除这条道路吗？" 
                @on-ok="handleRemove(index , item)"
                @on-cancel="cancel">
                <Button
                type="ghost"
                >删除</Button>
            </Poptip>
        </span> 
    </Row>
</FormItem>
<FormItem>
    <Row>
        <Col span="20">
            <Button type="dashed" long @click="handleAdd" icon="plus-round">增加道路</Button>
        </Col>
    </Row>
</FormItem>   
</Form>
</template>

<script> 


    export default {
        name: 'addRoad-component',
        components: {

        },
        props: {
            value: String,
            treeSelect: {
                type: Array,
                default: []
            }
        },
        model: {
            prop: 'value',
            event: 'valueChange'
        },
        data () {
            return {
                pubForm :{
                    materialValue: []
                },
                areaName: [],
                showName: '',
                index: 1
            }
        }, 
        methods: {
            getData () {

            },
            handleAdd () {
                this.index++;
                this.pubForm.materialValue.push({
                    province: this.areaName[0] != undefined  ? this.areaName[0].strText : '',
                    provinceCode: this.areaName[0]  != undefined ? this.areaName[0].strCode : '',
                    city: this.areaName[1]  != undefined ? this.areaName[1].strText : '',
                    cityCode: this.areaName[1]  != undefined ? this.areaName[1].strCode : '',
                    distric: this.areaName[2]  != undefined ? this.areaName[2].strText : '',
                    districCode: this.areaName[2]  != undefined ? this.areaName[2].strCode : '',
                    street : this.areaName[3]  != undefined ? this.areaName[3].strText : '',
                    streetCode : this.areaName[3]  != undefined ? this.areaName[3].strCode : '',
                    road: this.areaName[4]  != undefined ? this.areaName[4].strText : '',
                    roadCode: this.areaName[4]  != undefined ? this.areaName[4].strCode : '',
                    index: this.index,
                    status: 1
                });
            },
            handleRemove (index , item) {
                this.pubForm.materialValue[index].status = 0;
                this.$emit('handleRemove' , item)
            },
            handleReset () {
                this.$refs['formValidate'].resetFields();
                this.pubForm.materialValue = []
                var list = this.treeSelect; //加载出来的数
                var arr = this.value.split(' ')
                this.areaName = new Array()
                arr.map((item)=>{
                    if(item != ""){
                        this.areaName.push({
                            strCode: 0,
                            strText: item
                        })
                    }
                })
                list.map((item) => {
                    this.pubForm.materialValue.push({
                        province: this.areaName[0] != undefined  ? this.areaName[0].strText : item.strText,
                        provinceCode: this.areaName[0]  != undefined ? this.areaName[0].strCode : item.strCode,
                        city: this.areaName[1]  != undefined ? this.areaName[1].strText : item.strText,
                        cityCode: this.areaName[1]  != undefined ? this.areaName[1].strCode : item.strCode,
                        distric: this.areaName[2]  != undefined ? this.areaName[2].strText : item.strText,
                        districCode: this.areaName[2]  != undefined ? this.areaName[2].strCode : item.strCode,
                        street : this.areaName[3]  != undefined ? this.areaName[3].strText : item.strText,
                        streetCode : this.areaName[3]  != undefined ? this.areaName[3].strCode : item.strCode,
                        road: this.areaName[4]  != undefined ? this.areaName[4].strText : item.strText,
                        roadCode: this.areaName[4]  != undefined ? this.areaName[4].strCode : item.strCode,
                        index: 1,
                        status: 1
                    })
                })
            },
            cancel () {

            }

        },
        mounted () {

        },
        watch : {
            value(val) {
                if(val) {
                    this.handleReset()    
                }
                
            }
        }
    };
</script>