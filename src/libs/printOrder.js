const printOrder = {};

function getHtml (row, collectionMoney , senderInfo) {
        // ids += "'" + row.ReplaceCourieredId + "'" + ",";
    var html = '';
    var OrderId = row.OrderId;// 订单号

    var RecipientPhone = row.RecipientPhone;  // 收件人电话

    var RecipientCompany = row.RecipientCompany;  // 收件人公司名称
    if (RecipientCompany.length > 12) {
        	RecipientCompany = RecipientCompany.substring(0, 12);
    }
    var RecipientName = row.RecipientName;  // 收件人名称
    if (RecipientName.length > 10) {
        	RecipientName = RecipientName.substring(0, 10);
    }
    var RecipientAddress = row.RecipientAddress;  // 收件人地址

    var SenderPhone = row.SenderPhone;  // 寄件人电话

    var SenderCompany = row.SenderCompany;  // 寄件人公司名称
    if (SenderCompany.length > 12) {
        	SenderCompany = SenderCompany.substring(0, 12);
    }
    var SenderName = row.SenderName;  // 寄件人名称
    if (SenderName.length > 10) {
        	SenderName = SenderName.substring(0, 10);
    }
    var SenderAddress = row.SenderAddress;  // 寄件人地址

    var PaymentType = row.PaymentType;  // 付款类型

    PaymentType = PaymentType == undefined || PaymentType == null || PaymentType == '' ? '' : PaymentType;
    var df = '';
    var yf = '';
    if (PaymentType != '' && PaymentType.indexOf('寄付') >= 0) {  // 寄付
        	yf = '√寄付';
    }
    if (PaymentType != '' && PaymentType.indexOf('到付') >= 0) { // 到付
        	df = '√到付';
    }
        // var collectionMoney = row.CollectionMoney == null ? 0 : row.CollectionMoney;
        // 强制固定内容
        // SenderCompany = "平台"; 
    SenderCompany = row.SenderCompany;
    SenderAddress = OrderId + '货物名称：印刷品';
    SenderPhone = '13929989971';
    SenderName = '陈志敏';

    if(senderInfo) {
        SenderName = senderInfo.sendName
        SenderPhone = senderInfo.sendPhone
    }

    html += '<style type="text/css">body {margin: 0px;}</style>';
    html += '<div style="border:1px solid black;height:527px;">';
    html += '<table style="padding-bottom:0px;padding-top:135px;padding-left:85px;">';
    html += '<tr style="height: 30px;"><td width="205px" style=" padding-left: 87px;">' + SenderCompany + '</td><td style=" width: 189px; padding-left: 63px;">' + RecipientCompany + ' </td></tr>';
    html += '<tr style="height: 75px;" ><td width="180px" style="vertical-align:top;padding-left: 40px;width: 239px; padding-right: 25px;">' + SenderAddress + ' </td><td style="vertical-align:top; width: 189px; ">' + RecipientAddress + '</td></tr>';
    html += '<tr style="height: 35px;"><td> <span style="vertical-align:top;padding-left: 35px;padding-right: 65px;">' + SenderPhone + '</span>  <span>' + SenderName + '</span></td><td> <span style="vertical-align:top;padding-left: 35px">' + RecipientPhone + '</span> <span style="padding-left: 40px;">' + RecipientName + '</span></td></tr>';
    html += '<tr style="height: 30px;"><td> <span style="vertical-align:top;padding-left: 25px;padding-right: 45px;"> </span>  <span> </span></td><td> <span style="padding-left: 130px;padding-right: 35px;" >' + yf + '</span><p></td></tr>';
    html += '<tr style="height: 25px;"><td> <span style="vertical-align:top;padding-left: 20px;padding-right: 45px;"> </span></td><td><span>' + df + '</span></td></tr>';
    html += '<tr style="height: 65px;"><td>&nbsp;</td><td colspan="2" style="padding-left:256px;">￥' + collectionMoney + '</td></tr>';
    html += '<tr style="height: 30px;"><td style="text-align:right;padding-right: 35px;"> <span style="vertical-align:top;padding-left: 25px;padding-right: 45px;font-size: 28px;">已验视</span></td><td style="text-align:right;padding-right: 25px;"> <span style="padding-left: 130px;padding-right: 35px;" >' + OrderId + '</span><p></td></tr>';
    html += '</table>';
    html += '</div>';
    return html;
}

function printPdf (htmlStr) {
    let newWindow = window.open('_blank');   // 打开新窗口
    let codestr = htmlStr;   // 获取需要生成pdf页面的div代码
    let head = newWindow.document.getElementsByTagName('head')[0];
    newWindow.document.write(codestr);   // 向文档写入HTML表达式或者JavaScript代码
    newWindow.document.close();     // 关闭document的输出流, 显示选定的数据
    newWindow.print();   // 打印当前窗口
    return true;
}

printOrder.getHtml = getHtml;
printOrder.printPdf = printPdf;

export default printOrder;
