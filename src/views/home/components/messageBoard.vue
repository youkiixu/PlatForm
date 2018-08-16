<style lang="less">
    // @import './styles/infor-card.less';
  </style>
  <template>
    <div>
     <initDataGridCompoent ref="dataGrid" :param="form" :showControl="false" @selectRow="selectRow" @dbClickRow="dbClickRow"  @showInfo="showInfo"></initDataGridCompoent>
     <replyComponent  ref="reply"></replyComponent>
   </div>
   
 </template>
 <script>
   import Util from '@/libs/util';
   import initDataGridCompoent from '@/views/toolbar-components/initDataGrid-component';
   
   import replyComponent from './reply-component'

   export default {
    components: {
      initDataGridCompoent,
      replyComponent
    },
    data () {
      return {
        form: {
          'isLoad': true,
          '$rowIndex': 1,
          '$pageRecord': 15,
          'strMethod': 'OutSatisfactionList'
        },
        boardList: [],
        index : 0,
        intByPageIndex: 1,
        columns1: [],
        selectRowData: ''
      }
    },
    methods: {
      selectRow(data) {
        this.selectRowData = data
      },
      dbClickRow(data) {
        this.selectRowData = data
      },
      getData () {
       var _this = this;
       this.$refs.dataGrid.initDataGrid(this.filterCol)
     },
     filterCol(GridInfo , vm) {
       var newGridInfo = []
       vm.tableColumnsFilter = []
       vm.oldColumnsList = []
       vm.oldData = []

       

       GridInfo.map((item,index) => {
        if(!item.hidden){
          if(index == 18){
            var colRow = {
              title: item.title,
              key: item.field,
              width: 350,
              height: item.height,
              sortable: item.sortable,
              ellipsis: true
            };
            newGridInfo.push(colRow)
            Util.autoPushCol( colRow , vm)
          } else if(index == 8) {
            
          } else {
            var colRow = {
              title: item.title,
              key: item.field,
              height: item.height,
              sortable: item.sortable,
              ellipsis: true
            }
            newGridInfo.push(colRow)
            Util.autoPushCol( colRow , vm)
          }

        }
      })
       var colRow = {
        title: '操作',
        key: 'action',
        width: 100,
        align: 'center',
        render: (h, params) => {
          var row = params.row;
          var buttonGroup = [h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px'
            },
            on: {
              click: () => {
                vm.showInfo(params.index)
              }
            }
          }, '点击评论')]

          return h('div', buttonGroup);
        }
      }
      newGridInfo.push(colRow)
      Util.autoPushCol( colRow , vm)
      return newGridInfo;
    },
    showInfo(data) {
        //评论
        this.$refs.reply.showReply(data)
      }
    },
    mounted() {
     this.getData()
   }
 }
</script>