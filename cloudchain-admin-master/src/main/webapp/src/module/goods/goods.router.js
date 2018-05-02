angular
    .module('MetronicApp')
    .config(goodsRouter)

goodsRouter.$inject= ['$stateProvider']

function  goodsRouter($stateProvider) {

    $stateProvider
    //用户管理
        .state('goods', {
            url: '/goods',
            template: '<div ui-view></div>'
        })
        .state('goods.list', {
            url: "/list",
            templateUrl: "/dist/tpl/goods/list/goods-list.html",
            data: {pageTitle: '用户管理'},
            controller: "GoodsListController",
            controllerAs:"list",
        })
        .state('goods.add', {
            url: "/add",
            templateUrl: "/dist/tpl/goods/add/goods-add.html",
            data: {pageTitle: '用户管理'},
            controller: "GoodsAddController",
            controllerAs:"add",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.css",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.js",
                            "../assets/plugins/bootstrap-summernote/summernote.css",
                            "../assets/plugins/bootstrap-summernote/summernote.min.js",
                        ]
                    });
                }]
            }
        })
        .state('goods.stock', {
            url: "/stock/:Id",
            templateUrl: "/dist/tpl/goods/stock/goods-stock.html",
            data: {pageTitle: '商品库存'},
            controller: "GoodsStockController",
            controllerAs:"stock",
        })
        .state('goods.edit1', {
            url: "/edit1/:Id",
            templateUrl: "/dist/tpl/goods/edit/goods-edit1.html",
            data: {pageTitle: '修改基本信息'},
            controller: "GoodsEdit1Controller",
            controllerAs:"edit",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.css",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.js",
                            "../assets/plugins/bootstrap-summernote/summernote.css",
                            "../assets/plugins/bootstrap-summernote/summernote.min.js",
                            "../assets/plugins/angularjs/angular-file-upload.min.js",
                        ]
                    });
                }]
            }
        })
        .state('goods.edit2', {
            url: "/edit2/:Id",
            templateUrl: "/dist/tpl/goods/edit/goods-edit2.html",
            data: {pageTitle: '修改基本信息'},
            controller: "GoodsEdit2Controller",
            controllerAs:"edit",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.css",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.js",
                            "../assets/plugins/bootstrap-summernote/summernote.css",
                            "../assets/plugins/bootstrap-summernote/summernote.min.js",
                            "../assets/plugins/angularjs/angular-file-upload.min.js",
                        ]
                    });
                }]
            }
        })
        .state('goods.edit3', {
            url: "/edit3/:Id",
            templateUrl: "/dist/tpl/goods/edit/goods-edit3.html",
            data: {pageTitle: '修改基本信息'},
            controller: "GoodsEdit3Controller",
            controllerAs:"edit",
            cache:'false',
        })
        .state('goods.edit4', {
            url: "/edit4/:Id",
            templateUrl: "/dist/tpl/goods/edit/goods-edit4.html",
            data: {pageTitle: '修改基本信息'},
            controller: "GoodsEdit4Controller",
            controllerAs:"edit",
            cache:'false',
        })

        .state('goods.supplier', {
            url: "/supplier/:Id",
            templateUrl: "/dist/tpl/goods/supplier/supplier.html",
            data: {pageTitle: '供应商设置'},
            controller: "goodSupplierController",
            controllerAs:"supplier",
        })
        .state('goods.sale', {
            url: "/sale/:Id",
            templateUrl: "/dist/tpl/goods/sale/goods-sale.html",
            data: {pageTitle: '供应商设置'},
            controller: "GoodSaleController",
            controllerAs:"sale",
        })

        .state('goods.setting', {
            url: '/setting',
            template: '<div ui-view></div>'
        })
        .state('goods.setting.category', {
            url: "/category",
            templateUrl: "/dist/tpl/goods/setting/category.html",
            data: {pageTitle: '分类管理'},
            controller: "goodSettingCategoryController",
            controllerAs:"category",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }

        })
        .state('goods.setting.brand', {
            url: "/brand",
            templateUrl: "/dist/tpl/goods/setting/brand.html",
            data: {pageTitle: '品牌管理'},
            controller: "goodSettingBrandController",
            controllerAs:"list",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })
        .state('goods.setting.brandadd', {
            url: "/brandadd",
            templateUrl: "/dist/tpl/goods/setting/brandAdd.html",
            data: {pageTitle: '品牌添加'},
            controller: "goodBrandAddController",
            controllerAs:"add",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.css",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.js",
                            "../assets/plugins/bootstrap-summernote/summernote.css",
                            "../assets/plugins/bootstrap-summernote/summernote.min.js",
                        ]
                    });
                }]
            }
        })
        .state('goods.setting.brandedit', {
            url: "/brandedit/:Id",
            templateUrl: "/dist/tpl/goods/setting/brandEdit.html",
            data: {pageTitle: '品牌修改'},
            controller: "goodBrandEditController",
            controllerAs:"brand",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.css",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.js",
                            "../assets/plugins/bootstrap-summernote/summernote.css",
                            "../assets/plugins/bootstrap-summernote/summernote.min.js",
                        ]
                    });
                }]
            }
        })
        .state('goods.setting.proplist', {
            url: "/proplist",
            templateUrl: "/dist/tpl/goods/setting/propList.html",
            data: {pageTitle: '属性参数管理'},
            controller: "goodPropListController",
            controllerAs:"list",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })
        .state('goods.setting.prop', {
            url: "/prop",
            templateUrl: "/dist/tpl/goods/setting/propAdd.html",
            data: {pageTitle: '属性参数添加'},
            controller: "goodPropAddController",
            controllerAs:"prop",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })
        .state('goods.setting.propedit', {
            url: "/propedit/:Id",
            templateUrl: "/dist/tpl/goods/setting/propEdit.html",
            data: {pageTitle: '规格参数修改'},
            controller: "goodPropEditController",
            controllerAs:"prop",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })


        .state('goods.setting.speclist', {
            url: "/speclist",
            templateUrl: "/dist/tpl/goods/setting/specList.html",
            data: {pageTitle: '规格参数设置'},
            controller: "goodSpecListController",
            controllerAs:"list",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })
        .state('goods.setting.spec', {
            url: "/spec",
            templateUrl: "/dist/tpl/goods/setting/specAdd.html",
            data: {pageTitle: '规格参数添加'},
            controller: "goodSpecAddController",
            controllerAs:"spec",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })
        .state('goods.setting.specedit', {
            url: "/specedit/:Id",
            templateUrl: "/dist/tpl/goods/setting/specEdit.html",
            data: {pageTitle: '规格参数修改'},
            controller: "goodSpecEditController",
            controllerAs:"spec",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })

}

