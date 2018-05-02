
angular
    .module('MetronicApp')
    .config(wholesaleRouter)
    .config(lazyLoad)




wholesaleRouter.$inject= ['$stateProvider'];
lazyLoad.$inject= ['$ocLazyLoadProvider'];

function  wholesaleRouter($stateProvider) {

    $stateProvider

        .state('wholesale', {
            url: '/wholesale',
            template: '<div ui-view></div>'
        })

        .state('wholesale.goods', {
            url: '/goods',
            templateUrl: "/dist/tpl/wholesale/wholesale.html",
            data: {pageTitle: '商品'},
            controller: "wholesaleController",
            controllerAs: "wholesale",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/wholesale/jquery-accordion-menu.css",
                            "../assets/pages/css/wholesale/wholesale.css"
                        ]
                    });
                }]
            }
        })

        .state('wholesale.shopcart', {
            url: '/shopcart',
            templateUrl: "/dist/tpl/wholesale/shopcart/shopcart.html",
            data: {pageTitle: '购物车'},
            controller: "shopcartController",
            controllerAs: "shopcart",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/wholesale/wholesale.css"
                        ]
                    });
                }]
            }
        })

        .state('wholesale.order', {
            url: '/order',
            templateUrl: "/dist/tpl/wholesale/order/order.html",
            data: {pageTitle: '订单'},
            controller: "wholesaleorderController",
            controllerAs: "wholesaleorder",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/wholesale/wholesale.css"
                        ]
                    });
                }]
            }
        })

        .state('wholesale.orderdetail', {
            url: '/orderdetail?orderId',
            templateUrl: "/dist/tpl/wholesale/order/orderdetail.html",
            data: {pageTitle: '订单详情'},
            controller: "orderdetailController",
            controllerAs: "orderdetail",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/wholesale/wholesale.css"
                        ]
                    });
                }]
            }
        })

        .state('wholesale.orderlogistics', {
            url: '/orderlogistics?orderId',
            templateUrl: "/dist/tpl/wholesale/order/logistics.html",
            data: {pageTitle: '物流信息'},
            controller: "logisticsController",
            controllerAs: "logistics",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/wholesale/wholesale.css"
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
                    "../assets/plugins/bootstrap-daterangepicker/daterangepicker.min.js",
                    "../assets/plugins/bootstrap-daterangepicker/daterangepicker.min.css",
                ]
            }
        ]
    });
}



