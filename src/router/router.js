import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['@/views/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => { require(['@/views/error-page/403.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => { require(['@/views/error-page/500.vue'], resolve); }
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: resolve => { require(['@/views/form/article-publish/preview.vue'], resolve); }
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => { require(['@/views/main-components/lockscreen/components/locking-page.vue'], resolve); }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: resolve => { require(['@/views/home/home.vue'], resolve); } },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: resolve => { require(['@/views/own-space/own-space.vue'], resolve); } },
        { path: 'message', title: '消息中心', name: 'message_index', component: resolve => { require(['@/views/message/message.vue'], resolve); } },
        { path: 'bbs-detail/:note_id', title: '帖子', name: 'bbs-detail', component: resolve => { require(['@/views/bbs/components/bbs-detail.vue'], resolve); } },
        { path: 'dataGridNewPage', title: '列表详情页', name: 'dataGridNewPage', component: resolve => { require(['@/views/advanced-router/dataGridNewPage.vue'], resolve); } },
        { path: 'DeliveryPersonnelListDetailsView', title: '配送人员列表详细', name: 'DeliveryPersonnelListDetailsView', component: resolve => { require(['@/views/advanced-router/Delivery/DeliveryPersonnelListDetailsView.vue'], resolve); } },
        { path: 'newPageDistributionRateView', title: '配送人员配送率详细', name: 'newPageDistributionRateView', component: resolve => { require(['@/views/advanced-router/Delivery/newPageDistributionRateView.vue'], resolve); } },
        { path: 'CollectionRateDetailsView', title: '业务员应收款率详细', name: 'CollectionRateDetailsView', component: resolve => { require(['@/views/advanced-router/Delivery/CollectionRateDetailsView.vue'], resolve); } },
        { path: 'CartScanningSummaryDetailsView', title: '大车扫描详情', name: 'CartScanningSummaryDetailsView', component: resolve => { require(['@/views/advanced-router/Delivery/CartScanningSummaryDetailsView.vue'], resolve); } },
        { path: 'BusinessDistributionSummaryDetailsView', title: '业务配送汇总详细', name: 'BusinessDistributionSummaryDetailsView', component: resolve => { require(['@/views/advanced-router/Delivery/BusinessDistributionSummaryDetailsView.vue'], resolve); } },
        { path: 'placeTheOrder', title: '物流订单下单', name: 'placeTheOrder', component: resolve => { require(['@/views/valueAdded/placeTheOrder.vue'], resolve); } }

    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/orderManage',
        icon: 'document-text',
        name: 'order',
        title: '订单管理',
        component: Main,
        access: 1,
        children: [
            { access: 1, path: 'QueryExpressOrderView', title: '快递订单列表', name: 'QueryExpressOrderView', icon: 'android-send', component: resolve => { require(['@/views/order/QueryExpressOrderView.vue'], resolve); } },
            { access: 1, path: 'QueryOrderView', title: '物流订单列表', name: 'QueryOrderView', icon: 'android-send', component: resolve => { require(['@/views/order/QueryOrderView.vue'], resolve); } },
            { access: 1, path: 'QuerySuggestOrderView', title: '异常订单', name: 'QuerySuggestOrderView', icon: 'android-send', component: resolve => { require(['@/views/order/QuerySuggestOrderView.vue'], resolve); } },
            { access: 1, path: 'QueryOverTimeOrderView', title: '超时订单', name: 'QueryOverTimeOrderView', icon: 'android-send', component: resolve => { require(['@/views/order/QueryOverTimeOrderView.vue'], resolve); } },
            // { access: 1, path: 'OrderOutOfDate', title: '超期订单', name: 'OrderOutOfDate', icon: 'android-send', component: resolve => { require(['@/views/order/OrderOutOfDate.vue'], resolve); } },
            { access: 1, path: 'OrderIndexView', title: '代发快递列表', name: 'OrderIndexView', icon: 'android-send', component: resolve => { require(['@/views/order/OrderIndexView.vue'], resolve); } },
            { access: 1, path: 'OderInvoiceView', title: '发货单列表', name: 'OderInvoiceView', icon: 'android-send', component: resolve => { require(['@/views/order/OderInvoiceView.vue'], resolve); } }

        ]
    },
    {
        path: '/storageManage',
        icon: 'document-text',
        name: 'storage',
        title: '仓储管理',
        component: Main,
        access: 1,
        children: [
            { access: 1, path: 'RevenueSummaryView', title: '仓库收入汇总', name: 'RevenueSummaryView', icon: 'android-send', component: resolve => { require(['@/views/storage/RevenueSummaryView.vue'], resolve); } },
            { access: 1, path: 'OrderTrackingView', title: '物流单跟踪', name: 'OrderTrackingView', icon: 'android-send', component: resolve => { require(['@/views/storage/OrderTrackingView.vue'], resolve); } },
            { access: 1, path: 'OrderDetailedTrackingView', title: '物流单明细跟踪', name: 'OrderDetailedTrackingView', icon: 'android-send', component: resolve => { require(['@/views/storage/OrderDetailedTrackingView.vue'], resolve); } },
            { access: 1, path: 'WarehouseAddressView', title: '仓库地址列表', name: 'WarehouseAddressView', icon: 'android-send', component: resolve => { require(['@/views/storage/WarehouseAddressView.vue'], resolve); } },
            { access: 1, path: 'ConsignmentDeliveryView', title: '委派发货', name: 'ConsignmentDeliveryView', icon: 'android-send', component: resolve => { require(['@/views/storage/ConsignmentDeliveryView.vue'], resolve); } }
        ]
    },
    {
        path: '/transitLineManage',
        icon: 'document-text',
        name: 'transitLine',
        title: '中转线管理',
        component: Main,
        access: 1,
        children: [
            { access: 1, path: 'TransitSummaryView', title: '中转线列表', name: 'TransitSummaryView', icon: 'android-send', component: resolve => { require(['@/views/transitLine/TransitSummaryView.vue'], resolve); } },
            { access: 1, path: 'TransitPackingView', title: '装箱单列表', name: 'TransitPackingView', icon: 'android-send', component: resolve => { require(['@/views/transitLine/TransitPackingView.vue'], resolve); } }

        ]
    },
    {
        path: '/deliveryManage',
        icon: 'document-text',
        name: 'delivery',
        title: '配送管理',
        component: Main,
        access: 1,
        children: [
            { access: 1, path: 'DeliveryPersonnelListView', title: '业务人员配送列表', name: 'DeliveryPersonnelListView', icon: 'android-send', component: resolve => { require(['@/views/delivery/DeliveryPersonnelListView.vue'], resolve); } },
            { access: 1, path: 'DistributionRateView', title: '业务员配送率', name: 'DistributionRateView', icon: 'android-send', component: resolve => { require(['@/views/delivery/DistributionRateView.vue'], resolve); } },
            { access: 1, path: 'CollectionRateView', title: '业务员应收款率', name: 'CollectionRateView', icon: 'android-send', component: resolve => { require(['@/views/delivery/CollectionRateView.vue'], resolve); } },
            { access: 1, path: 'CartScanningSummaryView', title: '大车扫描汇总', name: 'CartScanningSummaryView', icon: 'android-send', component: resolve => { require(['@/views/delivery/CartScanningSummaryView.vue'], resolve); } },
            { access: 1, path: 'BusinessDistributionSummaryView', title: '业务配送汇总表', name: 'BusinessDistributionSummaryView', icon: 'android-send', component: resolve => { require(['@/views/delivery/BusinessDistributionSummaryView.vue'], resolve); } },
            { access: 1, path: 'OrderCollectionDetailsView', title: '订单收款明细表', name: 'OrderCollectionDetailsView', icon: 'android-send', component: resolve => { require(['@/views/delivery/OrderCollectionDetailsView.vue'], resolve); } },
            { access: 1, path: 'TrackIndex', title: '轨迹查询', name: 'TrackIndex', icon: 'android-send', component: resolve => { require(['@/views/delivery/TrackIndex.vue'], resolve); } }

        ]
    },
    {
        path: '/financeManage',
        icon: 'document-text',
        name: 'finance',
        title: '财务',
        component: Main,
        access: 1,
        children: [
            { access: 1, path: 'CollectionView', title: '收款列表', name: 'CollectionView', icon: 'android-send', component: resolve => { require(['@/views/finance/CollectionView.vue'], resolve); } },
            { access: 1, path: 'DistributionReceivablesCompletionRateView', title: '业务员收款完成率', name: 'DistributionReceivablesCompletionRateView', icon: 'android-send', component: resolve => { require(['@/views/finance/DistributionReceivablesCompletionRateView.vue'], resolve); } },
            { access: 1, path: 'FinancialWarehouseSummaryView', title: '财务仓库汇总', name: 'FinancialWarehouseSummaryView', icon: 'android-send', component: resolve => { require(['@/views/finance/FinancialWarehouseSummaryView.vue'], resolve); } },
            { access: 1, path: 'BusinessDistributionSummaryView', title: '业务配送汇总列表', name: 'BusinessDistributionSummaryView', icon: 'android-send', component: resolve => { require(['@/views/finance/BusinessDistributionSummaryView.vue'], resolve); } },
            { access: 1, path: 'OrderCollectionDetailsView', title: '订单收款明细表', name: 'OrderCollectionDetailsView', icon: 'android-send', component: resolve => { require(['@/views/finance/OrderCollectionDetailsView.vue'], resolve); } },
            { access: 1, path: 'SupplierContactsDetailsView', title: '供应商往来明细', name: 'SupplierContactsDetailsView', icon: 'android-send', component: resolve => { require(['@/views/finance/SupplierContactsDetailsView.vue'], resolve); } },
            { access: 1, path: 'SupplierReconciliationView', title: '供应商对账表', name: 'SupplierReconciliationView', icon: 'android-send', component: resolve => { require(['@/views/finance/SupplierReconciliationView.vue'], resolve); } },
            { access: 1, path: 'CaiWuRecordView', title: '财务管理', name: 'CaiWuRecordView', icon: 'android-send', component: resolve => { require(['@/views/finance/CaiWuRecordView.vue'], resolve); } },
            { access: 1, path: 'CaiWuBaoBiao', title: '提点报表', name: 'CaiWuBaoBiao', icon: 'android-send', component: resolve => { require(['@/views/finance/CaiWuBaoBiao.vue'], resolve); } },
            { access: 1, path: 'ExpressOrderReportView', title: '代发快递报表', name: 'ExpressOrderReportView', icon: 'android-send', component: resolve => { require(['@/views/finance/ExpressOrderReportView.vue'], resolve); } },
            { access: 1, path: 'FreightFinancialView', title: '运费财务报表', name: 'FreightFinancialView', icon: 'android-send', component: resolve => { require(['@/views/finance/FreightFinancialView.vue'], resolve); } },
            { access: 1, path: 'Paymentlist', title: '支付记录', name: 'Paymentlist', icon: 'android-send', component: resolve => { require(['@/views/finance/Paymentlist.vue'], resolve);} }
        ]
    },
    {
        path: '/BaseicData',
        icon: 'document-text',
        name: 'BaseicData',
        title: '基础资料',
        component: Main,
        access: 1,
        children: [
            { access: 1, path: 'CarrierCompanyManagementView', title: '承运公司管理', name: 'CarrierCompanyManagementView', icon: 'android-send', component: resolve => { require(['@/views/BasicData/CarrierCompanyManagementView.vue'], resolve); } },
            { access: 1, path: 'DistributionAreaManagementView', title: '配送地区管理', name: 'DistributionAreaManagementView', icon: 'android-send', component: resolve => { require(['@/views/BasicData/DistributionAreaManagementView.vue'], resolve); } },
            { access: 1, path: 'ThirdPlatformCompanyManagentView', title: '第三方公司管理', name: 'ThirdPlatformCompanyManagentView', icon: 'android-send', component: resolve => { require(['@/views/BasicData/ThirdPlatformCompanyManagentView.vue'], resolve); } },
            { access: 1, path: 'WeightPriceManagentView', title: '重量价格管理', name: 'WeightPriceManagentView', icon: 'android-send', component: resolve => { require(['@/views/BasicData/WeightPriceManagentView.vue'], resolve); } },
            { access: 1, path: 'MemberAddressManagentView', title: '会员地址管理', name: 'MemberAddressManagentView', icon: 'android-send', component: resolve => { require(['@/views/BasicData/MemberAddressManagentView.vue'], resolve); } },
            { access: 1, path: 'WarehouseManagentView', title: '仓库管理', name: 'WarehouseManagentView', icon: 'android-send', component: resolve => { require(['@/views/BasicData/WarehouseManagentView.vue'], resolve); } },
            { access: 1, path: 'RouteManagentView', title: '线路管理', name: 'RouteManagentView', icon: 'android-send', component: resolve => { require(['@/views/BasicData/RouteManagentView.vue'], resolve); } },
            { access: 1, path: 'ProjectProductsManagentView', title: '单品重量管理', name: 'ProjectProductsManagentView', icon: 'android-send', component: resolve => { require(['@/views/BasicData/ProjectProductsManagentView.vue'], resolve); } },
            { access: 1, path: 'BackWarhoursManagentView', title: '回仓提点管理', name: 'BackWarhoursManagentView', icon: 'android-send', component: resolve => { require(['@/views/BasicData/BackWarhoursManagentView.vue'], resolve); } },
            { access: 1, path: 'RemindManagentView', title: '提点管理', name: 'RemindManagentView', icon: 'android-send', component: resolve => { require(['@/views/BasicData/RemindManagentView.vue'], resolve); } },
            { access: 1, path: 'FormulaManagentView', title: '公式管理', name: 'FormulaManagentView', icon: 'android-send', component: resolve => { require(['@/views/BasicData/FormulaManagentView.vue'], resolve); } },
            { access: 1, path: 'DistributionSetManagenetView', title: '配送设置管理', name: 'DistributionSetManagenetView', icon: 'android-send', component: resolve => { require(['@/views/BasicData/DistributionSetManagenetView.vue'], resolve); } }
        ]
    },
    {
        path: '/System',
        icon: 'document-text',
        name: 'System',
        title: '系统',
        component: Main,
        access: 1,
        children: [
            { access: 1, path: 'UserManagementView', title: '用户管理', name: 'UserManagementView', icon: 'android-send', component: resolve => { require(['@/views/System/UserManagementView.vue'], resolve); } },
            { access: 1, path: 'MemberManagementView', title: '会员管理', name: 'MemberManagementView', icon: 'android-send', component: resolve => { require(['@/views/System/MemberManagementView.vue'], resolve); } },
            { access: 1, path: 'RoleManagementView', title: '权限管理', name: 'RoleManagementView', icon: 'android-send', component: resolve => { require(['@/views/System/RoleManagementView.vue'], resolve); } },
            { access: 1, path: 'bbs', title: 'bbs', name: 'bbs', icon: 'android-send', component: resolve => { require(['@/views/bbs/bbs.vue'], resolve); } },
            { access: 1, path: 'appVersion', title: 'APP版本控制', name: 'appVersion', icon: 'android-send', component: resolve => { require(['@/views/System/appVersion.vue'], resolve); } }

        ]
    },
    {
        path: '/Administration',
        icon: 'document-text',
        name: 'Administration',
        title: '行政管理',
        component: Main,
        access: 1,
        children: [
            { access: 1, path: 'MileageStatistics', title: '业务员里程统计', name: 'MileageStatistics', icon: 'android-send', component: resolve => { require(['@/views/Administration/MileageStatistics.vue'], resolve); } },
            { access: 1, path: 'VisitRegister', title: '拜访登记', name: 'VisitRegister', icon: 'android-send', component: resolve => { require(['@/views/Administration/VisitRegister.vue'], resolve); } },
            { access: 1, path: 'DrivingRecord', title: '业务配送考勤审核', name: 'DrivingRecord', icon: 'android-send', component: resolve => { require(['@/views/Administration/DrivingRecord.vue'], resolve); } }
        ]
    },
    {
        path: '/lineManagent',
        icon: 'document-text',
        name: 'lineManagent',
        title: '配送街道管理',
        component: Main,
        access: 1,
        children: [
            { access: 1, path: 'areaManagement', title: '配送区域管理', name: 'areaManagement', icon: 'android-send', component: resolve => { require(['@/views/lineManagement/areaManagement.vue'], resolve); } },

            { access: 1, path: 'deliveryDistributeManagement', title: '配送员道路分配', name: 'deliveryDistributeManagement', icon: 'android-send', component: resolve => { require(['@/views/lineManagement/deliveryDistributeManagement.vue'], resolve); } }
        ]
    },
    {
        path: '/valueAdded',
        icon: 'document-text',
        name: 'valueAdded',
        title: '增值服务',
        component: Main,
        access: 1,
        children: [

            { access: 1, path: 'placeTheOrderList', title: '物流订单下单列表', name: 'placeTheOrderList', icon: 'android-send', component: resolve => { require(['@/views/valueAdded/placeTheOrderList.vue'], resolve); } }
        ]
    }

];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
