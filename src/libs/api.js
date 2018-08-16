import Util from './util';

let api = {};

// 查询用户信息
api.QueryUserInfoList = function(value , vm) {
	var _this = vm;
	var par = {
		$key: value,
		isLoad: true, 
		$pageRecord: 10,
		$rowIndex : 1,
		strMethod: 'QueryUserInfoList'
	}
	return Util.getDataGrid(par , undefined , undefined , vm).then((res) => {
		return Promise.resolve(res);

	})
}

// 查询用户地址
api.QueryUsersAddressList = function(value , vm) {
	var _this = vm;
	var par = {
		$key: value,
		isLoad: true, 
		$pageRecord: 10,
		$rowIndex : 1,
		strMethod: 'QueryUsersAddressList'
	}
	return Util.getDataGrid(par , undefined , undefined , vm).then((res) => {
		return Promise.resolve(res);

	})
}

// 查询物流订单 (物流单号LogisticsNo)
api.QueryOrderList = function(value , vm) {
	var _this = vm;
	var par = {
		$LogisticsNo: value,
		isLoad: true, 
		$pageRecord: 10,
		$rowIndex : 1,
		strMethod: 'QueryOrderList'
	}
	return Util.getDataGrid(par , undefined , undefined , vm).then((res) => {
		return Promise.resolve(res);

	})
}

// 查询物流子订单
api.QueryOrderItemsList = function(value , vm) {
	var par = {
		$oId: value
	}
	return Util.getAjaxData(par , 'QueryOrderItemsList' , undefined).then((res) => {
		return Promise.resolve(res);

	})
}

export default api;