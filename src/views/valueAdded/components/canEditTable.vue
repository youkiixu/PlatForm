<style lang="less">
    @import './editable-table.less';
    @import '../../../styles/common.less';
</style>

<template>
    <div id="initDataGrid">
        <Table :ref="refs" :columns="columnsList" :data="thisTableData" border disabled-hover></Table>
    </div>
</template>

<script>
    import Util from '@/libs/util'
    const inputEvent = (item , vm , param , value) => {
        var key = param.column.key
        var tableVm = vm;
        var formStore = vm.MainComponent.getFormData()
        var thisRow = vm.edittingStore[param.index]

        if(key == 'Weight'){
            var startCity = formStore.ContactAddress[1]
            var endCity = formStore.ReceiveAddress[1]
            var weight = thisRow.weight
            var par = {
                StartPoint: startCity,
                EndPoint: endCity,
                Weight: value
            }
            Util.getAjaxData(par , undefined , '70ec62b0-8a29-4d2f-81b9-1c77a14c749b').then((res) => {
                var data = res;
                if(res.result == 'err'){
                    vm.$Notice.error({
                        title: '获取失败',
                        desc: res.msg
                    });
                } else {
                    vm.edittingStore[param.index].Price = data.Freight
                    vm.edittingStore[param.index].Prescription = data.Prescription

                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                }
                
            })
        }
    }


    const editButton = (vm, h, currentRow, index) => {

        return h('Button', {
            props: {
                type: currentRow.editting ? 'success' : 'primary',
                loading: currentRow.saving
            },
            style: {
                margin: '0 5px'
            },
            on: {
                'click': () => {
                    // pageType
                    if(vm.pageType) {
                        vm.$Notice.warning({
                            title: '提交失败',
                            desc: '当前表单状态不能提交保存'
                        })
                        return
                    }

                    if (!currentRow.editting) {
                        if (currentRow.edittingCell) {
                            for (let name in currentRow.edittingCell) {
                                currentRow.edittingCell[name] = false;
                                vm.edittingStore[index].edittingCell[name] = false;
                            }
                        }
                        vm.edittingStore[index].editting = true;
                        vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    } else {
                        vm.edittingStore[index].saving = true;
                        vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                        let edittingRow = vm.edittingStore[index];
                        edittingRow.editting = false;
                        edittingRow.saving = false;
                        vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                        vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                        vm.$emit('on-change', vm.handleBackdata(vm.thisTableData), index);
                    }
                }
            }
        }, currentRow.editting ? '保存' : '编辑');
    };
    const deleteButton = (vm, h, currentRow, index) => {
        // pageType
        
        return h('Poptip', {
            props: {
                confirm: true,
                title: '您确定要删除这条数据吗?',
                transfer: true
            },
            on: {
                'on-ok': () => {
                    if(vm.pageType) {
                        vm.$Notice.warning({
                            title: '提交失败',
                            desc: '当前表单状态不能提交保存'
                        })
                        return
                    }
                    
                    // 清空一行
                    vm.thisTableData.splice(index, 1);
                    vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                    vm.$emit('on-delete', vm.handleBackdata(vm.thisTableData), index);
                }
            }
        }, [
        h('Button', {
            style: {
                margin: '0 5px'
            },
            props: {
                type: 'error',
                placement: 'top'
            }
        }, '删除')
        ]);
    };
// 点击行内编辑
const incellEditBtn = (vm, h, param) => {
    if (vm.hoverShow) {
        return h('div', {
            'class': {
                'show-edit-btn': vm.hoverShow
            }
        }, [
        h('Button', {
            props: {
                type: 'text',
                icon: 'edit'
            },
            on: {
                click: (event) => {
                    vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                }
            }
        })
        ]);
    } else {
        return h('Button', {
            props: {
                type: 'text',
                icon: 'edit'
            },
            on: {
                click: (event) => {
                    vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                }
            }
        });
    }
};
// 点击一行的保存

const saveIncellEditBtn = (vm, h, param) => {
    return h('Button', {
        props: {
            type: 'text',
            icon: 'checkmark'
        },
        on: {
            click: (event) => {
                vm.edittingStore[param.index].edittingCell[param.column.key] = false;
                vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                vm.$emit('on-cell-change', vm.handleBackdata(vm.thisTableData), param.index, param.column.key);
            }
        }
    });
};
// 点击参照按钮
const incellReferBtn = (vm, h, param) => {
    if (vm.hoverShow) {
        return h('div', {
            'class': {
                'show-edit-btn': vm.hoverShow
            }
        }, [
        h('Button', {
            props: {
                type: 'text',
                icon: 'ios-pricetag-outline'
            },
            on: {
                click: (event) => {
                    vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                }
            }
        })
        ]);
    } else {
        return h('Button', {
            props: {
                type: 'text',
                icon: 'ios-pricetag-outline'
            },
            on: {
                click: (event) => {
                    vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    // console.log(vm.thisTableData)
                }
            }
        });
    }
};
// 参照保存
const saveReferBtn = (vm, h, param) => {
    return h('Button', {
        props: {
            type: 'text',
            icon: 'ios-pricetag'
        },
        on: {
            click: (event) => {
                var index = param.index
                var key = param.column.key
                var row = param.row

                // 回调函数
                if(param.column.refer.Event) {
                    param.column.refer.Event(vm , h , param)
                }
                // vm.edittingStore[param.index].sex = vm.edittingStore[param.index].date

                // 常规操作
                vm.edittingStore[param.index].edittingCell[param.column.key] = false;
                vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                
                vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                vm.$emit('on-cell-change', vm.handleBackdata(vm.thisTableData), param.index, param.column.key);
            }
        }
    });
};
// 行内输入
const cellInput = (vm, h, param, item) => {
    return h('Input', {
        props: {
            type: 'text',
            value: vm.edittingStore[param.index][item.key]
        },
        on: {
            'on-change' (event) {
                let key = item.key;
                vm.edittingStore[param.index][key] = event.target.value;
            }
        }
    });
};
export default {
    name: 'canEditTable',
    props: {
        refs: String,
        columnsList: Array,
        value: Array,
        url: String,
        editIncell: {
            type: Boolean,
            default: false
        },
        hoverShow: {
            type: Boolean,
            default: false
        },
        pageType: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            columns: [],
            thisTableData: [],
            edittingStore: [],
            MainComponent: undefined
        };
    },
    created () {
        this.init();
    },
    methods: {
        init () {
            let vm = this;
            let editableCell = this.columnsList.filter(item => {
                if (item.editable) {
                    if (item.editable === true) {
                        return item;
                    }
                }
            });
            let cloneData = JSON.parse(JSON.stringify(this.value));
            let res = [];
            res = cloneData((item, index) => {
                let isEditting = false;
                if (this.thisTableData[index]) {
                    if (this.thisTableData[index].editting) {
                        isEditting = true;
                    } else {
                        for (const cell in this.thisTableData[index].edittingCell) {
                            if (this.thisTableData[index].edittingCell[cell] === true) {
                                isEditting = true;
                            }
                        }
                    }
                }
                if (isEditting) {
                    return this.thisTableData[index];
                } else {
                    this.$set(item, 'editting', false);
                    let edittingCell = {};
                    editableCell.forEach(item => {
                        edittingCell[item.key] = false;
                    });
                    this.$set(item, 'edittingCell', edittingCell);
                    return item;
                }
            });
            this.thisTableData = res;
            this.edittingStore = JSON.parse(JSON.stringify(this.thisTableData));
            this.columnsList.forEach(item => {
                // 可以编辑
                if (item.editable) {
                    item.render = (h, param) => {
                        let currentRow = this.thisTableData[param.index];
                        if (!currentRow.editting) {
                            if (this.editIncell) {
                                return h('Row', {
                                    props: {
                                        type: 'flex',
                                        align: 'middle',
                                        justify: 'center'
                                    }
                                }, [
                                h('Col', {
                                    props: {
                                        span: '20'
                                    }
                                }, [
                                !currentRow.edittingCell[param.column.key] ? h('span', currentRow[item.key]) : cellInput(this, h, param, item)
                                ]),
                                h('Col', {
                                    props: {
                                        span: '4'
                                    }
                                }, [
                                currentRow.edittingCell[param.column.key] ? saveIncellEditBtn(this, h, param) : incellEditBtn(this, h, param)
                                ])
                                ]);
                            } else {
                                return h('span', currentRow[item.key]);
                            }
                        } else {
                            return h('Input', {
                                props: {
                                    type: 'text',
                                    value: currentRow[item.key]
                                },
                                on: {
                                    'on-change' (event) {
                                        if(inputEvent){
                                            inputEvent(item , vm , param ,event.target.value)
                                        }

                                        let key = param.column.key;
                                        vm.edittingStore[param.index][key] = event.target.value;
                                    }
                                }
                            });
                        }
                    };
                }

                // 行末的按钮事件
                if (item.handle) {
                    item.render = (h, param) => {
                        let currentRowData = this.thisTableData[param.index];
                        if (item.handle.length === 2) {
                            return h('div', [
                                editButton(this, h, currentRowData, param.index),
                                deleteButton(this, h, currentRowData, param.index)
                                ]);
                        } else if (item.handle.length === 1) {
                            if (item.handle[0] === 'edit') {
                                return h('div', [
                                    editButton(this, h, currentRowData, param.index)
                                    ]);
                            } else {
                                return h('div', [
                                    deleteButton(this, h, currentRowData, param.index)
                                    ]);
                            }
                        }
                    };
                }

                // 如果是参照事件
                if(item.refer) {
                    item.render = (h, param) => {
                        let currentRow = this.thisTableData[param.index];
                        // cellInput
                        if (!currentRow.refer) {
                            if (this.editIncell) {
                                return h('Row', {
                                    props: {
                                        type: 'flex',
                                        align: 'middle',
                                        justify: 'center'
                                    }
                                }, [
                                h('Col', {
                                    props: {
                                        span: '20'
                                    }
                                }, [
                                !currentRow.edittingCell[param.column.key] ? h('span', currentRow[item.key]) : cellInput(this, h, param, item)
                                ]),
                                h('Col', {
                                    props: {
                                        span: '4'
                                    }
                                }, [
                                currentRow.edittingCell[param.column.key] ? saveReferBtn(this, h, param) : incellReferBtn(this, h, param)
                                ])
                                ]);
                            } else {
                                return h('span', currentRow[item.key]);
                            }
                        } else {
                            return h('Input', {
                                props: {
                                    type: 'text',
                                    value: currentRow[item.key]
                                },
                                on: {
                                    'on-change' (event) {
                                        let key = param.column.key;
                                        vm.edittingStore[param.index][key] = event.target.value;
                                    }
                                }
                            });
                        }
                    };
                }
            });
},
handleBackdata (data) {
    let clonedData = JSON.parse(JSON.stringify(data));
    clonedData.forEach(item => {
        delete item.editting;
        delete item.edittingCell;
        delete item.saving;
    });
    return clonedData;
},
setMainComponent(vm) {
    this.MainComponent = vm
}
},
watch: {
    value (data) {
        this.init();
    }
}
};
</script>