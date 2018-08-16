
<style lang="less">
	@import '../../styles/common.less';
</style>

<template>
	<span>
		<Select  v-model="datePcikerValue.selectType" @on-change="selected" style="width:80px">
			<Option v-for="item in selectDateType" :value="item.value" :key="item.value">{{ item.label }}</Option>
		</Select>
		<DatePicker
		@on-change="startDate"
		:value="datePcikerValue.startDateValue"
		format="yyyy-MM-dd"
		clearable type="date"
		placeholder="开始日期" 
		style="width: 150px"></DatePicker>
		到
		<DatePicker
		@on-change="endDate"
		:value="datePcikerValue.endDateValue"
		format="yyyy-MM-dd" 
		clearable type="date" 
		placeholder="结束日期" 
		style="width: 150px"></DatePicker>
	</span>
</template>
	
<script>
	import Util from '@/libs/util'; 
	export default {
		name: 'datePickerCompoent',
		props: {
			selectDateType: {
				type: Array,
				default: function() {
					return [{
						value:  0,
						label: '下单'
					},{
						value: 1,
						label: '操作'
					}]
				}
			}
		},
		data () {
			return {
				datePcikerValue: {
					selectType: 0,
					startDateValue: '',
					endDateValue: ''
				}
			};
		},
		methods: {
			selected(key) {
				this.datePcikerValue.selectType = key
				this.$emit('typeChange', this.datePcikerValue);
			},
			startDate(data) {
				this.datePcikerValue.startDateValue = data
				this.$emit('startDateChange', this.datePcikerValue);
			},
			endDate(data) {
				this.datePcikerValue.endDateValue = data
				this.$emit('endDateChange', this.datePcikerValue);
			},
			getData(type , start , end){
				this.datePcikerValue.selectType = type
				this.datePcikerValue.startDateValue = start
				this.datePcikerValue.endDateValue = end
				return this.datePcikerValue
			}
		},
		created () {
    	// 可在此从服务端获取表格数据
    }
};
</script>
