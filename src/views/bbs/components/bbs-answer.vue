<style lang="less">
	// @import '../../../styles/common.less';

</style>
 
<template>
	<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
     <FormItem label="Name" prop="name">
        <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
    </FormItem>
    <FormItem label="Desc" prop="desc">
        <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
    </FormItem>
</Form>
</template>

<script> 
	import Util from '@/libs/util'
	
	import toolMap from '@/libs/map'

	export default {
		name: 'addFormulaManagentComponent',
		props: {
			param: ''

		},
		data () {
			return {
				formValidate: {
                   name: '',
                   desc: ''
               },
               ruleValidate: {
                name: [
                { required: true, message: '标题不能为空', trigger: 'blur' }
                ],
                desc: [
                { required: true, message: '必须填写内容', trigger: 'blur' },
                { type: 'string', min: 20, message: '内容不能少于20个字符', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit (name) {
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    this.$emit('change' , this.formValidate)
                } else {
                    this.$Message.error('Fail!');
                }
            })
        }
    },
    created () {
        // this.$refs.formValidate.resetFields();
    }

};
</script>
