<style lang="less">
	@import './styles/reply.less';
</style>

<template>
    <Modal
        v-model="showModal"
        :title="title"
        >
        
        <div class="title-content">
        	<Alert type="success" show-icon>
		        主题：{{title}}
		        <template slot="desc">&nbsp;&nbsp;{{content}}</template>
		    </Alert>
        </div>
        <div class="reply-content"> 
        	<ul>
        		<li v-for="(item , index) in replyList" class="">
        			
        			<Alert :closable="closeAccess" @on-close="closeAlert(item)">
				        <span>{{index + 1}}楼、</span><span>来自{{item.account ? item.account : '匿名'}}的回复:</span>
				        <template slot="desc">{{item.strReplyContent}}</template>
				    </Alert>
        		</li>
        	</ul>
        </div>
        <div class="reply-input" @keyup.enter="replyAnswer">
        	<Input v-model="replyValue" placeholder="回复..." style="width: 400px" ></Input>
        	<Button type="primary" @click="replyAnswer" >回复</Button>
        </div>
        <div slot="footer">
            <Button  size="large" long  @click="cencel">关闭</Button>
        </div>
    </Modal>
</template>

<script>
import Util from '@/libs/util';
import Cookies from 'js-cookie';

export default {
    name: 'replyComponent',
    props: {
        param: Object
    },
    data () {
        return {
        	rowData:'',
        	title: '标题',
        	content: '主题',
            showModal: false,
            replyValue: '',
            replyList: [],
            closeAccess: false
        };
    },
    methods: {
    	loadData() {
    		var row = this.rowData;
    		this.title = row.strTitle
    		this.content = row.strContent
    		this.replyList = []
    		this.loadReply()
    	},
    	loadReply() {
    		var _this = this;
    		var row = this.rowData;
    		var par = {
    			'sId': row.Id
    		}
    		Util.getAjaxData(par , undefined , 'cff73fad-235d-427d-8555-a283441bca48').then((res) => {
    			_this.replyList = res.Table
    		})

    	},
    	showReply(data) {
    		this.rowData = data
    		this.loadData()
    		this.showModal = true
    	},
    	replyAnswer() {
    		var _this = this;
    		var userInfo = JSON.parse(Cookies.get('userInfo'));
    		var row = this.rowData;
    		if(!userInfo.userId) return;
    		var par = {
    			'sId': row.Id,
    			'content': this.replyValue,
    			'replyUser': userInfo.userId
    		}

    		Util.getAjaxData(par , undefined , '91e7364a-4ac3-42a2-8d3e-87668761f31c').then((res)=>{
    			if(res.result === 'ok') {
    				_this.replyValue = ''
    				_this.loadReply()
    			}
    		})
    	},
    	cencel() {
    		this.showModal = false
    	},
    	closeAlert(item){
    		var _this = this;
    		var par = {
    			'answer_Id': item.id
    		}
    		Util.getAjaxData(par , undefined , 'c2e0eddb-4107-4bb4-935b-a75ddacb56a4').then((res) => {
    			if(res.result == 'ok'){
    				_this.loadReply()
    			}
    		})
    	}

    },
    created () {
        // 可在此从服务端获取表格数据
        var userInfo = JSON.parse(Cookies.get('userInfo'));
        if(userInfo.RoleId === 1) {
        	this.closeAccess = true
        }
    }
};
</script>
