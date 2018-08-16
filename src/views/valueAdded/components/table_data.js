 
    // 参照事件的统一管理
    import Util from '@/libs/util'

    let textRefer = {
        Event: function(vm, h, param) {
            var key = param.column.key
            var formStore = vm.MainComponent.getFormData()
            var thisRow = vm.edittingStore[param.index]
            var ThirdPlatformOrderNo = vm.edittingStore[param.index]
            
            // 这里对列做判断
            if(key == 'Freight') {
                // 这里是测试
                Util.getAjaxData({} , undefined , undefined , vm).then((res) => {
                    console.log(res)
                })
                vm.edittingStore[param.index].nonPay = thisRow[key] + formStore.city
            }


        } 
    }


    export const editIncellColumns = [
    {
       title: '序号',
       type: 'index',
       width: 80,
       align: 'center'
   },
   {
       title: '物流单号',
       align: 'center',
       key: 'LogisticsNo_Key',
   },
   {
       title: '重量',
       align: 'center',
       key: 'Weight',
       editable: true
   },
   {
       title: '运费',
       align: 'center',
       key: 'Price'

   },
   {
       title: '预计时间',
       align: 'center',
       key: 'Prescription',
       editable: true
   },
   {
       title: '操作',
       align: 'center',
       width: 240,
       key: 'handle',
       handle: ['edit', 'delete']
   }
   ];

   const tableData = {
    editIncellColumns: editIncellColumns
};

export default tableData;
