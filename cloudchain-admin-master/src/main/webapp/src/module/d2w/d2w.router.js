
angular
    .module('MetronicApp')
    .config(d2wRouter)
    .config(lazyLoad)




d2wRouter.$inject= ['$stateProvider'];
lazyLoad.$inject= ['$ocLazyLoadProvider'];

function  d2wRouter($stateProvider) {

    $stateProvider

        .state('d2w', {
            url: '/d2w',
            template: '<div ui-view></div>'
        })

        .state('d2w.wsource', {
            url: '/wsource',
            templateUrl: "/dist/tpl/d2w/warehouse/warehouse.html",
            data: {pageTitle: '库源管理'},
            controller: "warehouseController",
            controllerAs: "warehouse",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/d2w/d2w.css"
                        ]
                    });
                }]
            }
        })

        .state('d2w.addwsource', {
            url: '/addwsource',
            templateUrl: "/dist/tpl/d2w/warehouse/add.html",
            data: {pageTitle: '新增库源'},
            controller: "addwsourceController",
            controllerAs: "addwsource",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/d2w/d2w.css",
                            "../assets/plugins/selectize/selectize.default.css",
                            "//cdn.bootcss.com/selectize.js/0.12.4/js/standalone/selectize.js",
                            "http://gosspublic.alicdn.com/aliyun-oss-sdk.min.js",
                            "https://www.promisejs.org/polyfills/promise-6.1.0.js",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.css",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.js",
                            "../assets/plugins/bootstrap-summernote/summernote.css",
                            "../assets/plugins/bootstrap-summernote/summernote.min.js"
                        ]
                    });
                }]
            }
        })

        .state('d2w.updatewsource', {
            url: '/updatewsource',
            templateUrl: "/dist/tpl/d2w/warehouse/update.html",
            data: {pageTitle: '编辑库源'},
            controller: "updatewsourceController",
            controllerAs: "updatewsource",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/d2w/d2w.css",
                            "../assets/plugins/selectize/selectize.default.css",
                            "//cdn.bootcss.com/selectize.js/0.12.4/js/standalone/selectize.js",
                            "http://gosspublic.alicdn.com/aliyun-oss-sdk.min.js",
                            "https://www.promisejs.org/polyfills/promise-6.1.0.js",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.css",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.js",
                            "../assets/plugins/bootstrap-summernote/summernote.css",
                            "../assets/plugins/bootstrap-summernote/summernote.min.js"
                        ]
                    });
                }]
            }
        })

        .state('d2w.ordermanage', {
            url: '/ordermanage',
            templateUrl: "/dist/tpl/d2w/warehouse/ordermanage.html",
            data: {pageTitle: '订单管理'},
            controller: "ordermanageController",
            controllerAs: "ordermanage",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/d2w/d2w.css"
                        ]
                    });
                }]
            }
        })

        .state('d2w.goodsource', {
            url: '/goodsource',
            templateUrl: "/dist/tpl/d2w/goods/goods.html",
            data: {pageTitle: '货源管理'},
            controller: "goodsourceController",
            controllerAs: "goodsource",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/d2w/d2w.css"
                        ]
                    });
                }]
            }
        })

        .state('d2w.ordervalet', {
            url: '/ordervalet',
            templateUrl: "/dist/tpl/d2w/warehouse/ordervalet.html",
            data: {pageTitle: '代客下单'},
            controller: "ordervaletController",
            controllerAs: "ordervalet",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/d2w/d2w.css"
                        ]
                    });
                }]
            }
        })

        .state('d2w.addgoodsource', {
            url: '/addgoodsource',
            templateUrl: "/dist/tpl/d2w/goods/add.html",
            data: {pageTitle: '发布货源'},
            controller: "addgoodsourceController",
            controllerAs: "addgoodsource",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/d2w/d2w.css",
                            "../assets/plugins/selectize/selectize.default.css",
                            "//cdn.bootcss.com/selectize.js/0.12.4/js/standalone/selectize.js",
                            "http://gosspublic.alicdn.com/aliyun-oss-sdk.min.js",
                            "https://www.promisejs.org/polyfills/promise-6.1.0.js",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.css",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.js",
                            "../assets/plugins/bootstrap-summernote/summernote.css",
                            "../assets/plugins/bootstrap-summernote/summernote.min.js"
                        ]
                    });
                }]
            }
        })

        .state('d2w.goodsourcedetail', {
            url: '/goodsourcedetail?id',
            templateUrl: "/dist/tpl/d2w/goods/detail.html",
            data: {pageTitle: '货源详情'},
            controller: "goodsourcedetailController",
            controllerAs: "goodsourcedetail",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/d2w/d2w.css",
                            "http://at.alicdn.com/t/font_fzte69jthrqf47vi.css"
                        ]
                    });
                }]
            }
        })

        .state('d2w.chosewarehouse', {
            url: '/chosewarehouse?id',
            templateUrl: "/dist/tpl/d2w/goods/chose.html",
            data: {pageTitle: '选择仓库'},
            controller: "chosewarehouseController",
            controllerAs: "chosewarehouse",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/d2w/d2w.css"
                        ]
                    });
                }]
            }
        })

        .state('d2w.offermanage', {
            url: '/offermanage',
            templateUrl: "/dist/tpl/d2w/goods/offermanage.html",
            data: {pageTitle: '报价管理'},
            controller: "offermanageController",
            controllerAs: "offermanage",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/d2w/d2w.css"
                        ]
                    });
                }]
            }
        })

        .state('d2w.waresource', {
            url: '/waresource',
            templateUrl: "/dist/tpl/d2w/front/d2wsource.html",
            data: {pageTitle: '柴米优仓'},
            controller: "d2wsourceController",
            controllerAs: "d2wsource",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/d2w/d2w.css",
                            "../assets/pages/css/wholesale/wholesale.css"
                        ]
                    });
                }]
            }
        })

        .state('d2w.waresourcedetail', {
            url: '/waresourceDetail?id',
            templateUrl: "/dist/tpl/d2w/front/d2wsourcedetail.html",
            data: {pageTitle: '柴米优仓仓源详情'},
            controller: "d2wsourcedetailController",
            controllerAs: "d2wsourcedetail",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/wholesale/wholesale.css",
                            "../assets/pages/css/d2w/slider.css",
                            "../assets/pages/css/d2w/d2w.css",
                            "../assets/pages/css/d2w/slider.js"
                        ]
                    });
                }]
            }
        })

        .state('d2w.d2wgoodsdetail', {
            url: '/d2wgoodsdetail?id',
            templateUrl: "/dist/tpl/d2w/front/d2wgoodsdetail.html",
            data: {pageTitle: '柴米优仓货源详情'},
            controller: "d2wgoodsdetailController",
            controllerAs: "d2wgoodsdetail",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/d2w/d2w.css",
                            "../assets/pages/css/wholesale/wholesale.css"
                        ]
                    });
                }]
            }
        })

        .state('d2w.d2wgoodsoffer', {
            url: '/d2wgoodsoffer?id',
            templateUrl: "/dist/tpl/d2w/front/offer.html",
            data: {pageTitle: '柴米优仓货源报价'},
            controller: "d2wgoodsofferController",
            controllerAs: "d2wgoodsoffer",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/js/islogin.js",
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/d2w/d2w.css",
                            "../assets/pages/css/wholesale/wholesale.css",
                            "http://at.alicdn.com/t/font_f1qabcwmictbj4i.css"
                        ]
                    });
                }]
            }
        })

        .state('d2w.waresourceorder', {
            url: '/waresourceorder?id',
            templateUrl: "/dist/tpl/d2w/front/toorder.html",
            data: {pageTitle: '柴米优仓下单'},
            controller: "d2wsourceorderController",
            controllerAs: "d2wsourceorder",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/js/islogin.js",
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/d2w/d2w.css",
                            "../assets/pages/css/wholesale/wholesale.css",
                            "../assets/plugins/selectize/selectize.default.css",
                            "//cdn.bootcss.com/selectize.js/0.12.4/js/standalone/selectize.js",
                            "http://gosspublic.alicdn.com/aliyun-oss-sdk.min.js",
                            "https://www.promisejs.org/polyfills/promise-6.1.0.js",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.css",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.js",
                            "../assets/plugins/bootstrap-summernote/summernote.css",
                            "../assets/plugins/bootstrap-summernote/summernote.min.js",
                            "http://at.alicdn.com/t/font_f1qabcwmictbj4i.css",
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



