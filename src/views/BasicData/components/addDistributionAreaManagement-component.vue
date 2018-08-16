<style lang="less">
    @import '../../../styles/common.less';
    .pubWidth {
        width: 350px;
    }
</style>

<template>
    <Modal
    v-model="showEdit"
    :title="title"
    :width="500"
    @on-ok="ok"
    @on-cancel="cancel">
    <!-- 添加配送地区 -->
    <Form :model="pubForm" label-position="right" :label-width="100" v-if="type == 0 || type == 1">
      <FormItem label="起始地"  label-position="right" :label-width="100" >
        <getAreaComponent ref="qishidi"></getAreaComponent>
    </FormItem>
    <FormItem label="目的地"  label-position="right" :label-width="100">
        <getAreaComponent ref="mudidi"></getAreaComponent>
    </FormItem>
    <FormItem label="起始重量[Kg]"  label-position="right" :label-width="100">
        <InputNumber :min="1" v-model="pubForm.Weight" style="width: 100%"></InputNumber >
        </FormItem>
        <FormItem label="起始价格"  label-position="right" :label-width="100">
            <InputNumber :min="0" v-model="pubForm.Price" style="width: 100%"></InputNumber >
            </FormItem>
            <FormItem label="逐重[Kg]"  label-position="right" :label-width="100">
                <InputNumber :min="1" v-model="pubForm.CattyWeight" style="width: 100%"></InputNumber >
                </FormItem>
                <FormItem label="逐重价格"  label-position="right" :label-width="100">
                    <InputNumber :min="0.1" v-model="pubForm.CattyPrice" style="width: 100%"></InputNumber >
                    </FormItem>
                    <FormItem label="承运公司"  label-position="right" :label-width="100">
                        <CarrierCompanyComponent ref="carrierCompany" @on-change="carrierCompanyChange" style="width: 100%"></CarrierCompanyComponent>
                    </FormItem>
                    <FormItem label="时效"  label-position="right" :label-width="100" v-if="pubForm.CarrerCompanyId == 15">
                        <Input v-model="pubForm.Prescription"  placeholder="请输入时效..."></Input>
                    </FormItem>
                    <FormItem label="限额重量"  label-position="right" :label-width="100">
                        <InputNumber :min="0" v-model="pubForm.QuotaWeight" style="width: 100%"></InputNumber >
                        </FormItem>
                        <FormItem label="是否限额"  label-position="right" :label-width="100">
                            <RadioGroup v-model="pubForm.IsQuota">
                                <Radio label="0">否</Radio>
                                <Radio label="1">是</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="省份分类"  label-position="right" :label-width="100">
                            <RadioGroup v-model="pubForm.Province">
                                <Radio label="0">广东省</Radio>
                                <Radio label="1">外省</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="折扣"  label-position="right" :label-width="100">
                            <InputNumber :min="1" v-model="pubForm.Discount"></InputNumber >
                        </FormItem>
                        <FormItem label="是否折扣"> 
                            <RadioGroup v-model="pubForm.IsDiscount">
                                <Radio label="0">否</Radio>
                                <Radio label="1">是</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="是否启用"  label-position="right" :label-width="100">
                            <RadioGroup v-model="pubForm.Enabled">
                                <Radio label="0">否</Radio>
                                <Radio label="1">是</Radio>
                            </RadioGroup>
                        </FormItem>
                        </Form>
                        

                    </Modal>
                </template>

                <script>
                    import Util from '@/libs/util'
                    import Cookies from 'js-cookie';
                    import toolMap from '@/libs/map'

                    import getAreaComponent from '@/views/toolbar-components/getArea-component'
                    import CarrierCompanyComponent from '@/views/toolbar-components/idCarrierCompany-component';

                    export default {
                        name: 'addDistributionAreaManagementComponent',
                        components: {
                            getAreaComponent,
                            CarrierCompanyComponent
                        },
                        props: {
                            param: Object

                        },
                        data () {
                            return {
                                pubForm: {
                 StartingPoint: '', //起始地 阿坝州
                 DestinationName: '', //    目的地佛山
                 Price: 1, //起始金额
                 Weight: 1, // 起始重量
                 CattyPrice: 1, //逐重价格
                 CattyWeight: 1, //逐重重量
                 QuotaWeight: 30, //限额重量
                 IsQuota: '0', //是否限额重量
                 Province: '0', //本省外省
                 Discount: 1, //折扣
                 IsDiscount: '0', //是否折扣
                 CarrerCompanyId: '', //承运公司ID
                 AreaId: '',
                 Enabled: '0',
                 Prescription: ''
             },
             selectPoint: [],
             index: 1,
             showEdit: false,
             type: 0, 
             title: '新增配送地区',
         };
     }, 
     methods: {
        handleReset (name) {
            for(var key in this.pubForm){
                if(typeof(this.pubForm[key]) == 'boolean'){
                    this.pubForm[key] = '0';
                } else if(typeof(this.pubForm[key]) == 'number'){
                    this.pubForm[key] = 1 ;
                } else if(typeof(this.pubForm[key]) == 'string') {
                    this.pubForm[key] = '';
                }
            }
            this.pubForm.IsQuota = '0'
            this.pubForm.Province = '0'
            this.pubForm.IsDiscount = '0'
            this.pubForm.Enabled = '0'
            this.pubForm.QuotaWeight = 30
            this.$refs.qishidi.resetList()
            this.$refs.mudidi.resetList()

        },
        loadForm() {
            var row = this.param
            for(var key in row){
                if(typeof(row[key]) == 'boolean'){
                    this.pubForm[key] = row[key] ? '1' : '0';
                } else if(typeof(row[key]) == 'number'){

                    this.pubForm[key] = row[key] - 0 ;
                } else if(typeof(row[key]) == 'string') {
                    this.pubForm[key] = row[key] ;
                }
            }
            this.$refs.qishidi.setData(row.StartingPoint)
            this.$refs.mudidi.setData(row.DestinationName)
            this.$refs.carrierCompany.setData(row.CarrerCompanyId)
        },
        carrierCompanyChange(data) {
            console.log(data)

            this.pubForm.CarrerCompanyId = data
        },
        showModal(type) {
                    // type为0是新增，type为1是修改
                    this.type = type
                    if(type == 0){
                    	this.title = '添加配送地区'
                        this.handleReset()
                    } else if(type == 1) {
                    	this.title = '修改配送地区'
                        this.loadForm()
                    } 

                    this.showEdit = true
                },
                ok () {
                    if(this.type == 0) {
                        this.addRow()
                    }
                    if(this.type == 1) {
                        this.modifyRow()
                    }
                    this.showEdit = false
                },
                addRow() {
                    var _this = this;
                    var userInfo = JSON.parse(Cookies.get('userInfo'));
                    var qishidi = this.$refs.qishidi.getData()
                    var mudidi = this.$refs.mudidi.getData()

                    var par = {
                        $StartPoint: qishidi[1],
                        $EndPoint: mudidi[1],
                        $CarrerCompanyId: _this.pubForm.CarrerCompanyId
                    }
                    if(Util.deVoid(par)) {
                        _this.$Message.error('不能为空') 
                        return;
                    }
                    Util.getAjaxData(par , 'QueryDistributionAreaList' , '8fca9681-116f-4e45-abb6-5dbe468ea818').then((res) => {
                        if(res.length != 0){
                            _this.$Message.error(`此快递公司已添加过起始地:${qishidi[1]},目的地:${mudidi[1]}的地区,不能再次添加`);
                            return
                        }else {
                            return Promise.resolve(res)
                        }
                    }).then((res) => {
                        
                        var par = {
                            isLoad : true,
                            $PCode: undefined,
                            $Code: undefined,
                            $Name: qishidi[1]
                        }
                        debugger
                        return Util.getAjaxData(par , 'GetAreaInfo' , undefined).then((res) => {
                            return Promise.resolve(res[0].Code)
                        })
                    }).then((res) => {
                        var par = {
                            StartingPoint: qishidi[1],
                            DestinationName: mudidi[1],
                             Price: _this.pubForm.Price, //起始金额
                             Weight: _this.pubForm.Weight, // 起始重量
                             CattyPrice: _this.pubForm.CattyPrice, //逐重价格
                             CattyWeight: _this.pubForm.CattyWeight, //逐重重量
                             QuotaWeight: _this.pubForm.QuotaWeight, //限额重量
                             IsQuota: _this.pubForm.IsQuota, //是否限额重量
                             Province: _this.pubForm.Province, //
                             Discount: _this.pubForm.Discount, //折扣
                             IsDiscount: _this.pubForm.IsDiscount, //是否折扣
                             Enabled: _this.pubForm.Enabled,
                             CarrerCompanyId: _this.pubForm.CarrerCompanyId, //承运公司ID
                             AreaId: res, //地区的ID
                             CreateDate: Util.nowTime().formatnowdate + ' ' + Util.nowTime().forTime,
                             CreateBy: userInfo.userId
                         }
                         if(Util.deVoid(par)) {
                            _this.$Message.error('不能为空') 
                            return;
                        }
                        // 如果是印捷物流需要多保存一个时效字段
                        if(_this.pubForm.Prescription != ''){
                          par = Object.assign(par , {Prescription : _this.pubForm.Prescription })
                        }
                        debugger
                        Util.getAjaxData(par , undefined,'8fca9681-116f-4e45-abb6-5dbe468ea818').then((data) => {
                           if (data.errMsg || data.result != 'ok') {
                            _this.$Message.error(data.errMsg);
                            return false;
                        }
                        _this.$Message.success('设置成功！');
                        _this.$emit('onSuccess' , '')
                    })

                    })


                },
                modifyRow() {
                    var _this = this;
                    var userInfo = JSON.parse(Cookies.get('userInfo'));
                    var row = this.param;
                    var par = {
                        rowState: 'M',
                        Id: _this.param.Id,
                        Price: _this.pubForm.Price, //起始金额
                         Weight: _this.pubForm.Weight, // 起始重量
                         CattyPrice: _this.pubForm.CattyPrice, //逐重价格
                         CattyWeight: _this.pubForm.CattyWeight, //逐重重量
                         QuotaWeight: _this.pubForm.QuotaWeight, //限额重量
                         IsQuota: _this.pubForm.IsQuota, //是否限额重量
                         Province: _this.pubForm.Province, //
                         Discount: _this.pubForm.Discount, //折扣
                         IsDiscount: _this.pubForm.IsDiscount, //是否折扣
                         Enabled: _this.pubForm.Enabled,
                         CarrerCompanyId: _this.pubForm.CarrerCompanyId, //承运公司ID
                         AreaId: row.AreaID, //地区的ID
                         ModifyDate: Util.nowTime().formatnowdate + ' ' + Util.nowTime().forTime,
                         ModifyerId: userInfo.userId,
                         Modifyer: userInfo.TrueName,

                     }
                     if(Util.deVoid(par)) {
                        _this.$Message.error('不能为空') 
                        return;
                    }

                     // 如果是印捷物流需要多保存一个时效字段
                    if(_this.pubForm.Prescription != ''){
                      par = Object.assign(par , {Prescription : _this.pubForm.Prescription })
                    }

                    debugger
                    Util.getAjaxData(par , undefined , '8fca9681-116f-4e45-abb6-5dbe468ea818').then((data) => {
                        if (data.errMsg || data.result != 'ok') {
                            _this.$Message.error(data.errMsg);
                            return false;
                        }
                        _this.$Message.success('修改成功！');
                        _this.$emit('onSuccess' , '')
                    })

                },
                
                cancel () {
                    this.showEdit = false
                }
            },
            created () {
                // 可在此从服务端获取表格数据

            }
        };
    </script>
