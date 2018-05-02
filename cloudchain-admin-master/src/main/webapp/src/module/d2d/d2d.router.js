
angular
    .module('MetronicApp')
    .config(d2dRouter)
    .config(lazyLoad)




d2dRouter.$inject= ['$stateProvider'];
lazyLoad.$inject= ['$ocLazyLoadProvider'];

function  d2dRouter($stateProvider) {

    $stateProvider

        .state('d2d', {
            url: '/d2d',
            template: '<div ui-view></div>'
        })

        .state('d2d.d2dgoods', {
            url: '/d2dgoods',
            template: '<div ui-view></div>'
        })

        .state('d2d.d2dgoods.goods', {
            url: '/goods',
            templateUrl: "/dist/tpl/d2d/d2dgoods/d2dgoods.html",
            data: {pageTitle: '在售商品'},
            controller: "d2dgoodsController",
            controllerAs: "d2dgoods",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/d2d/d2d.css"
                        ]
                    });
                }]
            }
        })

        .state('d2d.d2dgoods.order', {
            url: '/order',
            templateUrl: "/dist/tpl/d2d/d2dorder/d2dorder.html",
            data: {pageTitle: '订单管理'},
            controller: "d2dorderController",
            controllerAs: "d2dorder",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/wholesale/wholesale.css",
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/d2d/d2d.css"
                        ]
                    });
                }]
            }
        })

        .state('d2d.d2dgoods.orderdetail', {
            url: '/orderdetail?orderId',
            templateUrl: "/dist/tpl/d2d/d2dorder/d2dorderdetail.html",
            data: {pageTitle: '订单详情'},
            controller: "orderdetailController",
            controllerAs: "orderdetail",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/wholesale/wholesale.css",
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/d2d/d2d.css"
                        ]
                    });
                }]
            }
        })

        .state('d2d.d2dgoods.orderlogistics', {
            url: '/orderlogistics?orderId',
            templateUrl: "/dist/tpl/d2d/d2dorder/d2dorderlogistics.html",
            data: {pageTitle: '物流信息'},
            controller: "logisticsController",
            controllerAs: "logistics",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/wholesale/wholesale.css",
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/d2d/d2d.css"
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



