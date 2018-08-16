

<style lang="less">
    @import '../../styles/common.less';
    
</style>

<template>
    <div @keyup.enter="getData()">

        <Row v-if="buttonGroup.length != 0" style="position: fixed; top: 110px;left: 675px; z-index: 7;">
            <span style="margin: 0 10px;" v-for="item in buttonGroup">
                <Button :type="item.strValue" :icon="item.strImg" @click='buttonEvent(item.strEventMethod)'>{{item.strText}}</Button>
            </span>
        </Row>

        <Row class="margin-top-10">
            <span style="float: left;" >
                <Card class='margin-right-10 ' style="width:465px;height: 900px;">
                    <p slot="title" class="card-title">
                        <Icon type="android-map"></Icon>
                        筛选地区
                    </p>
                    <div>
                        <areaIndex
                      @on-change="areaChange"
                      ref="areaComponent"
                      ></areaIndex>
                    </div>
                </Card>
            </span>
            <span style="float: left;" class=" margin-top-50" v-show="showForm">
                <Card>
                    <addRoadComponent
                    v-model="showName"
                    :treeSelect ="treeSelect"
                    ref="addRoad"
                    @handleRemove="removeRow"
                    ></addRoadComponent>
                </Card> 
            </span>
        </Row>
    </Modal>
</div>
</template>
<!-- 物流订单列表 -->
<script> 
    import Util from '../../libs/util'; 
    import areaTree from '@/components/area-tree/area-tree-component'
    import addRoadComponent from './components/addRoad-component'
    import areaIndex from '@/components/area-component/area-index'
    // dataGrid组件
    // import initDataGridCompoent from '@/components/watchInitDataGrid-component';

    export default {
        name: 'areaManagement',
        components: {
            // initDataGridCompoent,
            addRoadComponent,
            areaTree,
            areaIndex
        },
        data () {
            return {
                form: {
                    isLoad: true,
                    $pageRecord: 30,
                    $rowIndex : 1,
                    strMethod: 'getAreaDetailsList',
                },
                showControl: false,
                selectRowData: undefined,
                buttonGroup: [],
                showForm: false,
                treeSelect: [],
                showName: '',
                PID: ''
            };
        },
        methods: {
            buttonEvent(e) {
                if(e === 'add') {
                    // this.addRoad('add')
                    this.ok()
                }
            },
            getData () {
                this.form.$rowIndex = 1; 
                // this.$refs.dataGrid.initDataGrid()
            },
            areaChange(data) {
                var _this = this;
                _this.addRoad(data.strCode)

            },
            addRoad(code) {
                var _this = this;
                var par = {
                    $PID : code
                }
                _this.PID = code
                _this.showForm = false
                Util.getAjaxData(par , 'getBase_AreaDetails' , '22c106f0-b6cf-4e10-8db3-81ce1793b69e').then((res) => {
                    _this.treeSelect = res
                    _this.showName = _this.$refs.areaComponent.showName
                    setTimeout(function(){
                        _this.$refs.addRoad.handleReset()
                    } , 0)
                    _this.showForm = true

                })
            },
            getLevelValue(level) {
                var strName = ''
                switch(level) {
                    case  1:
                    strName = 'province'
                    break;
                    case  2:
                    strName = 'city';
                    break;
                    case  3:
                    strName = 'distric';
                    break;
                    case  4:
                    strName = 'street';
                    break;
                    case  5:
                    strName = 'road';
                    break;
                }
                return strName
            },
            ok() {
                var _this = this;
                this.componentReset = false
                var len = this.$refs.addRoad.areaName.length + 1
                var materialValue = this.$refs.addRoad.pubForm.materialValue;
                var areaName = this.$refs.addRoad.areaName
                var strArea = this.getLevelValue(len )
                var head =  {PID : _this.PID};
                var dgData = []
                materialValue.map((item) => {
                    // item.status == 0 说明是已经删除的
                    if(item.status == 1 && item[strArea] != '') {
                        var parItem = {
                            intLevel: len,
                            strName: item[strArea]
                        }
                        if(item[strArea + "Code"] != '' && item[strArea + "Code"] != undefined){
                            parItem = Object.assign(parItem , {id : item[strArea + "Code"] })
                        }


                        dgData.push(parItem)
                    }
                })
                _this.$Spin.show();
                Util.tbSave( head , dgData ,'c09c9580-55fe-46b6-bf39-0537460b8ed1' , this).then((res) => {
                    if(res.result == 'ok'){
                        _this.addRoad(_this.PID)
                    }
                    
                    _this.$Spin.hide();
                }).catch((res) => {
                    _this.$Spin.hide();
                    // _this.addRoad(_this.PID)
                  
                })
            },
            cancel() {
                this.showForm = false
            },
            removeRow(item) {
                var _this = this;
                var len = this.$refs.addRoad.areaName.length + 1
                var materialValue = this.$refs.addRoad.pubForm.materialValue;
                var areaName = this.$refs.addRoad.areaName
                var strArea = this.getLevelValue(len)
                var head =  {PID : _this.PID};
                var dgData = []

                if(item[strArea + 'Code'] == ''){
                    return
                }

                var parItem = {
                    rowState: "D",
                    intLevel: len,
                    strName: item[strArea],
                    id: item[strArea + 'Code']
                }
                dgData.push(parItem)
                _this.$Spin.show();
                Util.tbSave( head , dgData ,'c09c9580-55fe-46b6-bf39-0537460b8ed1' , this).then((res) => {
                    if(res.result == 'ok'){
                        _this.addRoad(_this.PID)
                    }
                    _this.$Spin.hide();
                }).catch((res) => {
                    _this.addRoad(_this.PID)
                    _this.$Spin.hide();
                  
                })
            }
        },
        mounted () {
            Util.initButton(this)
            this.getData()

        }
    };
</script>
