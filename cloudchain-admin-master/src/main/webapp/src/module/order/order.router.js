
angular
    .module('MetronicApp')
    .config(orderRouter)
    .config(lazyLoad)




orderRouter.$inject= ['$stateProvider'];
lazyLoad.$inject= ['$ocLazyLoadProvider'];

function  orderRouter($stateProvider) {

    $stateProvider
        // TMS

        .state('order', {
            url: '/order',
            template: '<div ui-view></div>'
        })

        .state('order.salesOrder', {
            url: '/salesOrder',
            template: '<div ui-view></div>'
        })

        .state('order.salesOrder.original', {
            url: "/original",
            templateUrl: "/dist/tpl/order/salesOrder/original.html",
            data: {pageTitle: '原始订单'},
            controller: "originalController",
            controllerAs: "original",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/tms/tmsPage.css",
                            '../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.js'
                        ]
                    });
                }]
            }
        })

        .state('order.salesOrder.neworder', {
            url: "/neworder",
            templateUrl: "/dist/tpl/order/salesOrder/neworder.html",
            data: {pageTitle: '新订单'},
            controller: "newOrderController",
            controllerAs: "newOrder",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/tms/tmsPage.css",
                            "../assets/pages/css/order/order.css"
                        ]
                    });
                }]
            }
        })

        .state('order.salesOrder.neworderdetail', {
            url: "/neworderdetail?id",
            templateUrl: "/dist/tpl/order/salesOrder/neworderdetail.html",
            data: {pageTitle: '新订单详情'},
            controller: "newOrderDetailController",
            controllerAs: "newOrderDetail",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/tms/tmsPage.css",
                            "../assets/pages/css/order/order.css"
                        ]
                    });
                }]
            }
        })

        .state('order.salesOrder.originorderdetail', {
            url: "/originorderdetail?id",
            templateUrl: "/dist/tpl/order/salesOrder/originorderdetail.html",
            data: {pageTitle: '原始订单详情'},
            controller: "originOrderDetailController",
            controllerAs: "originOrderDetail",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/tms/tmsPage.css",
                            "../assets/pages/css/order/order.css"
                        ]
                    });
                }]
            }
        })

        .state('order.salesOrder.neworderexamine', {
            url: "/neworderexamine?id",
            templateUrl: "/dist/tpl/order/salesOrder/neworderexamine.html",
            data: {pageTitle: '新订单审单'},
            controller: "neworderexamineController",
            controllerAs: "neworderexamine",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/tms/tmsPage.css",
                            "../assets/pages/css/order/order.css"
                        ]
                    });
                }]
            }
        })

        .state('order.salesOrder.neworderdistribute', {
            url: "/neworderdistribute?id",
            templateUrl: "/dist/tpl/order/salesOrder/neworderdistribute.html",
            data: {pageTitle: '新订单配仓'},
            controller: "neworderdistributeController",
            controllerAs: "neworderdistribute",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/tms/tmsPage.css",
                            "../assets/pages/css/order/order.css"
                        ]
                    });
                }]
            }
        })

        .state('order.salesOrder.neworderpurchase', {
            url: "/neworderpurchase?ids",
            templateUrl: "/dist/tpl/order/salesOrder/neworderpurchase.html",
            data: {pageTitle: '新订单采购'},
            controller: "neworderpurchaseController",
            controllerAs: "neworderpurchase",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/tms/tmsPage.css",
                            "../assets/pages/css/order/order.css"
                        ]
                    });
                }]
            }
        })

        .state('order.salesOrder.valet', {
            url: "/valet",
            templateUrl: "/dist/tpl/order/salesOrder/valet.html",
            data: {pageTitle: '代客下单'},
            controller: "valetOrderController",
            controllerAs: "valetOrder",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/tms/tmsPage.css",
                            "../assets/pages/css/order/order.css",
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })

        .state('order.purchaseOrder', {
            url: '/purchaseOrder',
            template: '<div ui-view></div>'
        })

        .state('order.purchaseOrder.purchase', {
            url: "/purchase",
            templateUrl: "/dist/tpl/order/purchaseOrder/purchaseorder.html",
            data: {pageTitle: '采购单管理'},
            controller: "purchaseController",
            controllerAs: "purchase",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/tms/tmsPage.css",
                            "../assets/pages/css/order/order.css"
                        ]
                    });
                }]
            }
        })

        .state('order.purchaseOrder.purchasedetail', {
            url: "/purchasedetail",
            templateUrl: "/dist/tpl/order/purchaseOrder/purchasedetail.html",
            data: {pageTitle: '采购单详情'},
            controller: "purchaseDetailController",
            controllerAs: "purchaseDetail",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/tms/tmsPage.css",
                            "../assets/pages/css/order/order.css"
                        ]
                    });
                }]
            }
        })

        .state('order.purchaseOrder.addpurchase', {
            url: "/addpurchase",
            templateUrl: "/dist/tpl/order/purchaseOrder/addpurchase.html",
            data: {pageTitle: '新建采购单'},
            controller: "addpurchaseController",
            controllerAs: "addpurchase",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/tms/tmsPage.css",
                            "../assets/pages/css/order/order.css",
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })

        .state('order.purchaseOrder.editpurchase', {
            url: "/editpurchase",
            templateUrl: "/dist/tpl/order/purchaseOrder/editpurchase.html",
            data: {pageTitle: '修改采购单'},
            controller: "editpurchaseController",
            controllerAs: "editpurchase",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/tms/tmsPage.css",
                            "../assets/pages/css/order/order.css"
                        ]
                    });
                }]
            }
        })

        .state('order.purchaseOrder.arrival', {
            url: "/arrival",
            templateUrl: "/dist/tpl/order/purchaseOrder/arrivalOrder.html",
            data: {pageTitle: '到货管理'},
            controller: "arrivalOrderController",
            controllerAs: "arrivalOrder",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/tms/tmsPage.css",
                            "../assets/pages/css/order/order.css"
                        ]
                    });
                }]
            }
        })

        .state('order.setting', {
            url: '/setting',
            template: '<div ui-view></div>'
        })

        .state('order.setting.flow', {
            url: "/flow",
            templateUrl: "/dist/tpl/order/setting/flow.html",
            data: {pageTitle: '业务流程设置'},
            controller: "flowController",
            controllerAs: "flow",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/order/order.css"
                        ]
                    });
                }]
            }
        })

        .state('order.setting.warerule', {
            url: "/warerule",
            templateUrl: "/dist/tpl/order/setting/warerule.html",
            data: {pageTitle: '配仓规则'},
            controller: "wareruleController",
            controllerAs: "warerule",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/order/order.css"
                        ]
                    });
                }]
            }
        })


        .state('order.setting.wareset', {
            url: "/wareset?id",
            templateUrl: "/dist/tpl/order/setting/wareset.html",
            data: {pageTitle: '收件地区仓库优先级设置'},
            controller: "waresetController",
            controllerAs: "wareset",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/order/order.css"
                        ]
                    });
                }]
            }
        })

        .state('order.setting.warenewset', {
            url: "/warenewset?ruleId",
            templateUrl: "/dist/tpl/order/setting/warenewset.html",
            data: {pageTitle: '收件地区仓库优先级设置'},
            controller: "warenewsetController",
            controllerAs: "warenewset",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/order/order.css"
                        ]
                    });
                }]
            }
        })
        .state('order.setting.examinerule', {
            url: "/examinerule",
            templateUrl: "/dist/tpl/order/setting/examinerule.html",
            data: {pageTitle: '审单规则'},
            controller: "examineRuleController",
            controllerAs: "examineRule",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/order/order.css"
                        ]
                    });
                }]
            }
        })
}

function  lazyLoad($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        debug:  false,
        events: true,
        modules: [
            {
                name: 'datatables',
                files: [
                    '../assets/plugins/datatables/datatables.all.min.js',
                ]
            },
            {
                name:'timepicker',
                insertBefore: '#ng_load_plugins_before',
                files:[
                    // "../assets/plugins/moment.min.js",
                    "../assets/plugins/bootstrap-daterangepicker/daterangepicker.min.js",
                    "../assets/plugins/bootstrap-daterangepicker/daterangepicker.min.css",
                    // "../components/time.component.js",
                    // "../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js",
                    // "../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js",
                    // "../assets/global/plugins/clockface/js/clockface.js",
                ]
            }
        ]
    });
}



