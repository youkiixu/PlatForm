
<style lang="less">
	@import '../../styles/common.less';
</style>

<template>
	<span>
		<Select v-if="showSelect" clearable @on-change="selected" style="width:80px" filterable>
			<Option v-for="item in selectDateType" :value="item.value" :key="item.value">{{ item.label }}</Option>
		</Select>
		<DatePicker
		@on-change="startDate"
		format="yyyy-MM-dd"
		clearable type="date"
		placeholder="开始日期" 
		style="width: 150px"></DatePicker>
		到
		<DatePicker
		@on-change="endDate"
		format="yyyy-MM-dd" 
		clearable type="date" 
		placeholder="结束日期" 
		style="width: 150px"></DatePicker>
	</span>
</template>

<script>

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
			},
			showSelect: {
				type: Boolean,
				default:true
			}

		},
		data () {
			return {

			};
		},
		methods: {
			selected(key) {
				this.$emit('typeChange', key);
			},
			startDate(data) {
				this.$emit('startDateChange', data);
			},
			endDate(data) {
				this.$emit('endDateChange', data);
			}
		},
		created () {
    	// 可在此从服务端获取表格数据

    }
};
</script>
