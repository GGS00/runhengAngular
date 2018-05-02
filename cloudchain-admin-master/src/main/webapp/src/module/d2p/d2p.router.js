
angular
    .module('MetronicApp')
    .config(d2pRouter)
    .config(lazyLoad)




d2pRouter.$inject= ['$stateProvider'];
lazyLoad.$inject= ['$ocLazyLoadProvider'];

function  d2pRouter($stateProvider) {

    $stateProvider

        .state('d2p', {
            url: '/d2p',
            template: '<div ui-view></div>'
        })

        .state('d2p.d2porder', {
            url: '/d2porder',
            template: '<div ui-view></div>'
        })

        .state('d2p.d2porder.order', {
            url: '/order',
            templateUrl: "/dist/tpl/d2p/d2porder/d2porder.html",
            data: {pageTitle: '所有订单'},
            controller: "d2porderController",
            controllerAs: "d2porder",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/tms/tmsPage.css",
                        ]
                    });
                }]
            }
        })

        .state('d2p.d2pgoods', {
            url: '/d2pgoods',
            template: '<div ui-view></div>'
        })

        .state('d2p.d2pgoods.manage', {
            url: '/manage',
            templateUrl: "/dist/tpl/d2p/d2pgoods/d2pgoodsmanage.html",
            data: {pageTitle: '商品管理'},
            controller: "d2pgoodsmanageController",
            controllerAs: "d2pgoodsmanage",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/tms/tmsPage.css",
                            "../assets/pages/css/d2p/d2p.css"
                        ]
                    });
                }]
            }
        })

        .state('d2p.d2pgoods.classify', {
            url: '/classify',
            templateUrl: "/dist/tpl/d2p/d2pgoods/d2pgoodsclassify.html",
            data: {pageTitle: '展示分类'},
            controller: "d2pgoodsclassifyController",
            controllerAs: "d2pgoodsclassify",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/tms/tmsPage.css",
                            "../assets/pages/css/d2p/d2p.css",
                            "../assets/plugins/selectize/selectize.default.css",
                            "//cdn.bootcss.com/selectize.js/0.12.4/js/standalone/selectize.js",
                            "http://gosspublic.alicdn.com/aliyun-oss-sdk.min.js",
                            "https://www.promisejs.org/polyfills/promise-6.1.0.js",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.css",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.js",
                            "../assets/plugins/bootstrap-summernote/summernote.css",
                            "../assets/plugins/bootstrap-summernote/summernote.min.js",
                        ]
                    });
                }]
            }
        })

        .state('d2p.d2porder.orderdetail', {
            url: "/order/detail?id",
            templateUrl: "/dist/tpl/d2p/d2porder/orderdetail.html",
            data: {pageTitle: '订单详情'},
            controller: "d2pOrderDetailController",
            controllerAs: "d2pOrderDetail",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/tms/tmsPage.css"
                        ]
                    });
                }]
            }
        })

        .state('d2p.d2porder.orderAfter', {
            url: "/orderAfter",
            templateUrl: "/dist/tpl/common/unrealized.html",
            data: {pageTitle: '功能未实现'},
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



