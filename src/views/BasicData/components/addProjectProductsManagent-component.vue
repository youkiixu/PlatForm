<style lang="less">
    @import '../../../styles/common.less';

</style>

<template>
    <Modal
    v-model="showEdit"
    title="新增/修改单品重量"
    :width="900"
    @on-ok="ok"
    @on-cancel="cancel">
    <Form :model="pubForm" label-position="right" :label-width="100" >
        <Row>
            <Col span="12">
                <FormItem label="标识号">
                    <Input v-model="pubForm.Code"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="产品名称">
                    <Input v-model="pubForm.Name"></Input>
                </FormItem>
            </Col>

        </Row>
    </Form>

    <div class="line-gray" style="margin-bottom: 24px;"></div>

    <Form :model="pubForm" label-position="right" :label-width="100">
        <Row>
            <Col span="8">
                <FormItem label="长度 [CM]">
                    <Input v-model="pubForm.Length"></Input>
                </FormItem>
            </Col>
            <Col span="8">
                <FormItem label="宽度 [CM]">
                    <Input v-model="pubForm.Width"></Input>
                </FormItem>
            </Col>
            <Col span="8">
                <FormItem label="高度 [CM]">
                    <Input v-model="pubForm.Height"></Input>
                </FormItem>
            </Col>
        </Row>
    </Form>

    <div class="line-gray" style="margin-bottom: 24px;"></div>

    <Form ref="formDynamic" :model="formDynamic" :label-width="80" >
        <Row>
            <Col span="12">
               <FormItem
               v-for="(item, index) in formDynamic.materialName"
               v-if="item.status"
               :key="index"
               :label="'材质名称'"
               :prop="'materialName.' + index + '.value'">
               <Row>
                <Col span="18">
                    <Input type="text" v-model="item.value" placeholder="输入材质名称"></Input>
                </Col>
            </Row>
        </FormItem>
    </Col>
    <Col span="12">
        <FormItem
        v-for="(item, index) in formDynamic.materialValue"
        v-if="item.status"
        :key="index"
        :label="'材质值'"
        :prop="'materialValue.' + index + '.value'">
        <Row>
            <Col span="18">
                <Input type="text" v-model="item.value" placeholder="输入材质值"></Input>
            </Col>
            <Col span="4" offset="1">
                <Button type="ghost" @click="handleRemove(index)">删除</Button>
            </Col>
        </Row>
    </FormItem>
</Col>
</Row>
<Row>
    <FormItem>
        <Row>
            <Col span="20">
                <Button type="dashed" long @click="handleAdd" icon="plus-round">增加材质</Button>
            </Col>
        </Row>
    </FormItem>
</Row>
</Form>

<div class="line-gray" style="margin-bottom: 24px;"></div>

<Form label-position="right" :label-width="100">
    <Row>
        <Col span='8'>
            <FormItem label="公式">
                <Select v-model="Formula" style="width:100px;">
                    <Option v-for="item in selectFormula" :value="item.strKey" >{{item.Title}}</Option>
                </Select>
            </FormItem>
        </Col>
        <Col span="3">
         <Button type="primary" icon="search" @click="btnCalculate()" >计算重量</Button>
     </Col>
 </Row>
</Form>

<div class="line-gray" style="margin-bottom: 24px;"></div>

<Form :model="pubForm" label-position="right" :label-width="100" ref="numberForm">
    <Row>
        <Col span="8">
            <FormItem label="重量 [g]">
                <InputNumber :min="0"  v-model="pubForm.Weight"></InputNumber >
                </FormItem>
            </Col>
            <Col span="8">
                <FormItem label="误差重量 [g]">
                    <InputNumber :min="0" v-model="pubForm.ErrorWeight"></InputNumber >
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="数量">
                        <InputNumber :min="1" v-model="pubForm.Number"></InputNumber >
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Form label-position="right" :label-width="100">
                <FormItem label="是否启用"> 
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

        export default {
            name: 'addProjectProductsManagentComponent',
            props: {
                param: Object

            },
            data () {
                return {
                    pubForm: {
                        Code: '',
                        Name: '',
                        Length: '',
                        Width: '',
                        Height: '',
                        Formula: '',
                        Material: '',
                        Weight: 0,
                        ErrorWeight: 0,
                        Number: 0,
                        Enabled: '0',
                        CreateId: '',
                        CreateDate: ''
                    },
                    index: 1,
                    formDynamic: {
                        materialName: [
                        {
                            value: '',
                            index: 1,
                            status: 1
                        }
                        ],
                        materialValue: [{
                            value: '',
                            index: 1,
                            status: 1
                        }]
                    },
                    Formula: 'ChunZhong',
                    selectFormula: [],
                    showEdit: false,
                    type: 0 //0是新增，1是修改
                };
            },
            methods: {
                handleSubmit (name) {

                },
                handleReset (name) {
                    this.$refs['formDynamic'].resetFields();
                    for(var key in this.pubForm){
                        if(key != 'Weight' && key != 'ErrorWeight' && key != 'Number') {
                            this.pubForm[key] = ''
                        } else {
                            this.pubForm[key] = 0
                        }
                    }
                    this.pubForm.Enabled = '0'
                    this.index = 1
                    this.formDynamic = {
                        materialName: [
                        {
                            value: '',
                            index: 1,
                            status: 1
                        }
                        ],
                        materialValue: [{
                            value: '',
                            index: 1,
                            status: 1
                        }]
                    }

                },
                handleAdd () {
                    this.index++;
                    this.formDynamic.materialName.push({
                        value: '',
                        index: this.index,
                        status: 1
                    });
                    this.formDynamic.materialValue.push({
                        value: '',
                        index: this.index,
                        status: 1
                    });
                },
                handleRemove (index) {
                    this.formDynamic.materialName[index].status = 0;
                    this.formDynamic.materialValue[index].status = 0;
                },
                loadForm() {
                    var _this = this;
                    var row = this.param
                    var pubForm = this.pubForm;

                    
                    var MArr = row.Material.split(',')
                    _this.formDynamic.materialName = []
                    _this.formDynamic.materialValue = []
                     _this.index = MArr.length;
                    MArr.map((item , index) => {
                        var materialNameItem = item.split(':')[0]
                        var materialValueItem = item.split(':')[1]
                        _this.formDynamic.materialName.push({
                            value: materialNameItem,
                            index: index+1,
                            status: 1
                        })
                        _this.formDynamic.materialValue.push({
                            value: materialValueItem,
                            index: index+1,
                            status: 1
                        })

                    })

                    pubForm.Code = row.Code
                    pubForm.Name = row.Name
                   
                    pubForm.Height = row.Height
                    pubForm.Length = row.Length
                    pubForm.Weight = row.Weight
                    
                    pubForm.Formula = row.Formula
                    _this.Formula = row.Formula

                    pubForm.Width = row.Width
                    pubForm.ErrorWeight = row.ErrorWeight
                    pubForm.Number = row.Number

                    pubForm.Enabled = row.Enabled ? '1' : '0'
                },
                showModal(type) {
                    // type为0是新增，type为1是修改
                    this.type = type
                    if(type == 0){
                        this.handleReset()
                    } else {
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
                    let _this = this;
                    var userInfo = JSON.parse(Cookies.get('userInfo'));
                    let isRight = false
                    let Material = '';
                    let MLength = this.formDynamic.materialName.length;
                    for (var i = 0; i < MLength; i++) {
                        var mName = this.formDynamic.materialName[i];
                        let mValue = this.formDynamic.materialValue[i];

                        if(mName.status === 1 && mValue.status === 1){
                            let MKey =  this.formDynamic.materialName[i].value;
                            let MValue = this.formDynamic.materialValue[i].value;
                            if(MKey) Material += MKey + ':' + MValue + ',';     
                        }     
                    }
                    _this.pubForm.Material = Material;
                    _this.pubForm.CreateDate = Util.nowTime().formatnowdate;
                    // _this.pubForm.CreateId = userInfo.userId
                    _this.pubForm.CreateId = userInfo.userId
                    _this.pubForm.Formula = _this.Formula

                    for(var key in _this.pubForm) {
                        if(_this.pubForm[key] === ''){
                            isRight = true
                        }
                    }
                    if(isRight){
                        _this.$Notice.warning({
                            'title': '提交失败',
                            'desc': '不能为空'
                        })
                        return
                    }

                    Util.getAjaxData(_this.pubForm , undefined , '2ed969a7-d150-4c61-9f39-7b6735ca157e').then((data) => {
                        if (data.errMsg || data.result != 'ok') {
                            _this.$Message.error(data.errMsg);
                            return false;
                        }
                        _this.$Message.success('设置成功！');
                        _this.$emit('onSuccess' , '')
                    })
                },
                modifyRow() {
                    var _this = this;
                    let Material = '';
                    var userInfo = JSON.parse(Cookies.get('userInfo'));
                    let MLength = this.formDynamic.materialName.length;
                    for (var i = 0; i < MLength; i++) {
                        var mName = this.formDynamic.materialName[i];
                        let mValue = this.formDynamic.materialValue[i];

                        if(mName.status === 1 && mValue.status === 1){
                            let MKey =  this.formDynamic.materialName[i].value;
                            let MValue = this.formDynamic.materialValue[i].value;
                            if(MKey) Material += MKey + ':' + MValue + ',';     
                        }     
                    }
                    var param = {
                        'Id' : this.param.Id,
                        'rowState' : 'M',
                        'Code' : this.pubForm.Code,
                        'Name' : this.pubForm.Name,
                        'Length' : this.pubForm.Length,
                        'Width': this.pubForm.Width,
                        'Height' : this.pubForm.Height,
                        'Formula' : this.Formula,
                        'Material' : Material,
                        'Weight' : this.pubForm.Weight,
                        'ErrorWeight' : this.pubForm.ErrorWeight,
                        'Number' : this.pubForm.Number,
                        'Enabled' : this.pubForm.Enabled,
                        // 'ModifyId' : userInfo.userId,
                        'ModifyId' : userInfo.userId,
                        'ModifyDate' : Util.nowTime().formatnowdate
                    }

                    Util.getAjaxData(param , undefined , '2ed969a7-d150-4c61-9f39-7b6735ca157e').then((data) => {
                        if (data.errMsg || data.result != 'ok') {
                            _this.$Message.error(data.errMsg);
                            return false;
                        }
                        _this.$Message.success('设置成功！');
                        _this.$emit('onSuccess' , '')
                    })


                },
                cancel () {
                    this.showEdit = false
                },
                btnCalculate() {
                    var _this = this;
                    let MLength = this.formDynamic.materialName.length;
                    var par = new toolMap.Map();
                    var Material  = new toolMap.Map();
                    for (var i = 0; i < MLength; i++) {
                        var mName = this.formDynamic.materialName[i];
                        let mValue = this.formDynamic.materialValue[i];

                        if(mName.status === 1 && mValue.status === 1){
                            let MKey =  this.formDynamic.materialName[i].value + '';
                            let MValue = this.formDynamic.materialValue[i].value + '';
                            if(MKey) {
                                Material.put(MKey , MValue)     
                            }
                        }         
                    }
                    var obj = {
                        Length : _this.pubForm.Length,
                        Width : _this.pubForm.Width,
                        Height : _this.pubForm.Height,
                        key : _this.Formula
                    }
                    
                    par.put('Length' , obj.Length)
                    par.put("Width", obj.Width)
                    par.put("Height", obj.Height)
                    par.put("Key",  obj.key)
                    par.put('Material' , Material)
                    for(var key in obj) {
                        if(obj[key] == ''){
                            _this.$Message.error('无法获取信息，请填写信息...');
                            return
                        }
                    }
                    Util.postApiData({data:toolMap.getParJSONByMap(par)}, '/BackStage/BasicData/FormulaWeight').then((res) => {
                        if(res.Code != 200){
                            _this.$Message.error('计算出错，请自行填写重量或重新尝试计算...');
                            return
                        }
                        _this.$Message.success(`计算结果为：${res.value}`);
                        _this.pubForm.Weight = res.value - 0
                    })
                }
        },
        created () {
        // 可在此从服务端获取表格数据
        var _this = this;
        Util.getAjaxData({} , 'GetFormulaList' , undefined).then((res) => {
            _this.selectFormula = res

        })
    }
};
</script>
