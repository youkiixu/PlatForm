import Util from './util';

let baseData = {

};
// 返回订单号
function LoadRoleList (obj, vm) {
    let param = {
        ThirdPlatformOrderNo: obj.OrderId,
        strMethod: 'getExpressOrderRelation'
    };

    return Util.getDataGrid(param, undefined, '94257d04-a8cb-4cf7-a3f1-49de7e34ff54').then((data) => {
        var orderIdGroup = '';
        if (data && data.length > 0) {
            var orderIds = '';
            for (var i = 0; i < data.length; i++) {
                orderIds += data[i].Orderid + ',';
            }
            orderIdGroup = orderIds.substr(0, orderIds.length - 1);
        } else {
            orderIdGroup = data[0].OrderId;
        }

        return Promise.resolve(orderIdGroup);
    });
}
baseData.LoadRoleList = LoadRoleList;

export default baseData;
