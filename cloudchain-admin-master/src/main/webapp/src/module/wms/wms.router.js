angular
    .module('MetronicApp')
    .config(wmsRouter)
    .config(lazyLoad)

wmsRouter.$inject = ['$stateProvider'];
lazyLoad.$inject = ['$ocLazyLoadProvider'];

function wmsRouter($stateProvider) {
    $stateProvider

        .state('wms', {
            url: '/wms',
            template: '<div ui-view></div>'
        })

        .state('wms.inbound', {
            url: '/inbound',
            template: '<div ui-view></div>'
        })
        .state('wms.outbound', {
            url: '/outbound',
            template: '<div ui-view></div>'
        })
        .state('wms.inventory', {
            url: '/inventory',
            template: '<div ui-view></div>'
        })
        .state('wms.reporting', {
            url: '/reporting',
            template: '<div ui-view></div>'
        })
        .state('wms.setting', {
            url: '/setting',
            template: '<div ui-view></div>'
        })
        //入库单管理
        .state('wms.inbound.order', {
            url: "/order",
            templateUrl: "/dist/tpl/wms/inbound/order.html",
            data: {pageTitle: '入库单管理'},
            controller: "BillInboundContro",
            controllerAs: "billInboundManage",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css",
                        ]
                    });
                }]
            }
        })
        //入库单管理
        .state('wms.inbound.addorder', {
            url: "/order/add",
            templateUrl: "/dist/tpl/wms/inbound/add.html",
            data: {pageTitle: '入库单管理'},
            controller: "BillInboundNewContro",
            controllerAs: "InboundNew",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css",
                            "../assets/plugins/jstree/dist/themes/default/style.css"
                        ]
                    });
                }]
            }
        })
        //入库单导入
        .state('wms.inbound.importorder', {
            url: "/order/import",
            templateUrl: "/dist/tpl/wms/inbound/import.html",
            data: {pageTitle: '入库单管理'},
            controller: "InboundImportContro",
            controllerAs: "InboundImport",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css",
                            "../assets/plugins/jstree/dist/themes/default/style.css"
                        ]
                    });
                }]
            }
        })
        //单一明细收货
        .state('wms.inbound.single', {
            url: "/order/single?id",
            templateUrl: "/dist/tpl/wms/inbound/single.html",
            data: {pageTitle: '单一明细收货'},
            controller: "InboundSingleContro",
            controllerAs: "InboundSingle",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css"
                        ]
                    });
                }]
            }
        })
        //单一收货记录 收货记录查询
        .state('wms.inbound.receiptrecord', {
            url: "/receiptrecord?id",
            templateUrl: "/dist/tpl/wms/inbound/receiptrecord.html",
            data: {pageTitle: '收货记录'},
            controller: "BillInboundRecordContro",
            controllerAs: "InboundRecordManage",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css"
                        ]
                    });
                }]
            }
        })
        //录入唯一码 串码
        .state('wms.inbound.inputsn', {
            url: "/order/inputsn?id",
            templateUrl: "/dist/tpl/wms/inbound/inputsn.html",
            data: {pageTitle: '唯一码录入'},
            controller: "InboundSnContro",
            controllerAs: "InboundSnManage",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css"
                        ]
                    });
                }]
            }
        })
        //上架单管理
        .state('wms.inbound.shelves', {
            url: "/shelves",
            templateUrl: "/dist/tpl/wms/inbound/shelves.html",
            data: {pageTitle: '入库单管理'},
            controller: "ShelfControl",
            controllerAs: "shelfManage",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css"
                        ]
                    });
                }]
            }
        })
        //上架单分配
        .state('wms.inbound.shelvesallot', {
            url: "/shelves/allot?id",
            templateUrl: "/dist/tpl/wms/inbound/allot.html",
            data: {pageTitle: '入库单管理'},
            controller: "ShelfAllotControl",
            controllerAs: "shelfAllotManage",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css"
                        ]
                    });
                }]
            }
        }) //上架作业操作
        .state('wms.inbound.shelveswork', {
            url: "/shelveswork",
            templateUrl: "/dist/tpl/wms/inbound/shelveswork.html",
            data: {pageTitle: '上架作业单'},
            controller: "ShelfTaskControl",
            controllerAs: "shelfTaskManage",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css"
                        ]
                    });
                }]
            }
        })
        //上架作业确认
        .state('wms.inbound.shelvesworkconfirm', {
            url: "/shelveswork/confirm?id",
            templateUrl: "/dist/tpl/wms/inbound/confirm.html",
            data: {pageTitle: '上架作业单确认'},
            controller: "ShelfTaskSureControl",
            controllerAs: "shelfTaskSureManage",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css"
                        ]
                    });
                }]
            }
        })

        //出库单
        .state('wms.outbound.order', {
            url: "/order",
            templateUrl: "/dist/tpl/wms/outbound/order.html",
            data: {pageTitle: '出库单'},
            controller: "outboundOrderCtrl",
            controllerAs: "outboundOrder",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css"
                        ]
                    });
                }]
            }
        })
        //新建出库单
        .state('wms.outbound.add', {
            url: "/order/add",
            templateUrl: "/dist/tpl/wms/outbound/add.html",
            data: {pageTitle: '新建出库单'},
            controller: "outboundAddCtrl",
            controllerAs: "outboundAdd",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css",
                            "../assets/plugins/jstree/dist/themes/default/style.css"
                        ]
                    });
                }]
            }
        })
        //出库单详情
        .state('wms.outbound.details', {
            url: "/order/details?id",
            templateUrl: "/dist/tpl/wms/outbound/details.html",
            data: {pageTitle: '出库单详情'},
            controller: "outboundDetailCtrl",
            controllerAs: "outboundDetail",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css",
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })
        //导入出库单
        .state('wms.outbound.import', {
            url: "/order/import",
            templateUrl: "/dist/tpl/wms/outbound/import.html",
            data: {pageTitle: '导入出库单'},
            controller: "outboundImportCtrl",
            controllerAs: "outboundImport",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css",
                            "../assets/plugins/jstree/dist/themes/default/style.css"
                        ]
                    });
                }]
            }
        })
        //拣货单管理
        .state('wms.outbound.pick', {
            url: "/pick",
            templateUrl: "/dist/tpl/wms/outbound/pick.html",
            data: {pageTitle: '拣货单管理'},
            controller: "outboundPickCtrl",
            controllerAs: "outboundPick",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css"
                            // '../assets/pages/css/tmsOrder.css'
                        ]
                    });
                }]
            }
        })
        //拣货单作业
        .state('wms.outbound.pickwork', {
            url: "/pickwork",
            templateUrl: "/dist/tpl/wms/outbound/pickwork.html",
            data: {pageTitle: '拣货作业单'},
            controller: "outboundPickWorkCtrl",
            controllerAs: "outboundPickWork",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css"
                            // '../assets/pages/css/tmsOrder.css'
                        ]
                    });
                }]
            }
        })
        //拣货确认
        .state('wms.outbound.confirm', {
            url: "/pickwork/confirm",
            templateUrl: "/dist/tpl/wms/outbound/confirm.html",
            data: {pageTitle: '拣货作业分配'},
            controller: "outboundPickConfirmCtrl",
            controllerAs: "outboundPick",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css"
                            // '../assets/pages/css/tmsOrder.css'
                        ]
                    });
                }]
            }
        })
        //任务分配单
        .state('wms.outbound.task', {
            url: "/task",
            templateUrl: "/dist/tpl/wms/outbound/task.html",
            data: {pageTitle: '拣货作业分配'},
            controller: "TaskConfirmCtrl",
            controllerAs: "task",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css"
                            // '../assets/pages/css/tmsOrder.css'
                        ]
                    });
                }]
            }
        })
        //发运
        .state('wms.outbound.delivery', {
            url: "/delivery",
            templateUrl: "/dist/tpl/wms/outbound/delivery.html",
            data: {pageTitle: '发运作业'},
            controller: "outboundDeliveryCtrl",
            controllerAs: "outboundDelivery",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css"
                            // '../assets/pages/css/tmsOrder.css'
                        ]
                    });
                }]
            }
        })
        //入库单详情
        .state('wms.inbound.details', {
            url: "/order/details?id",
            templateUrl: "/dist/tpl/wms/inbound/details.html",
            data: {pageTitle: '入库单详情'},
            controller: "inboundDetailCtrl",
            controllerAs: "inboundDetail",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css",
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })

        //杂费详情
        .state( 'wms.inbound.fee', {
            url: "/order/fee?id",
            templateUrl: "/dist/tpl/wms/inbound/fee.html",
            data: {pageTitle: '入库单杂费详情'},
            controller: "feeCtrl",
            controllerAs: "fee",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css",
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })

        //出库杂费详情
        .state( 'wms.outbound.fee', {
            url: "/order/outFee?id",
            templateUrl: "/dist/tpl/wms/outbound/fee.html",
            data: {pageTitle: '出库单杂费详情'},
            controller: "outFeeCtrl",
            controllerAs: "outFee",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css",
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })

        //周转箱 region
        .state('wms.setting.turnovercarton', {
            url: "/turnovercarton",
            templateUrl: "/dist/tpl/wms/setting/turnovercartonlist.html",
            data: {pageTitle: '周转箱管理'},
            controller: "cartonCtrl",
            controllerAs: "carton",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css"
                            // '../assets/pages/css/tmsOrder.css'
                        ]
                    });
                }]
            }
        })

        //库区 region
        .state('wms.setting.region', {
            url: "/region",
            templateUrl: "/dist/tpl/wms/setting/region.html",
            data: {pageTitle: '库区管理'},
            controller: "regionCtrl",
            controllerAs: "region",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/tbms/outbound.css"
                            // '../assets/pages/css/tmsOrder.css'
                        ]
                    });
                }]
            }
        })
        //库位 location
        .state('wms.setting.location', {
            url: "/location",
            templateUrl: "/dist/tpl/wms/setting/location.html",
            data: {pageTitle: '库位管理'},
            controller: "locationCtrl",
            controllerAs: "location",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/tbms/outbound.css"
                            // '../assets/pages/css/tmsOrder.css'
                        ]
                    });
                }]
            }
        })

        //添加库位 location
        .state('wms.setting.addlocation', {
            url: "/addlocation",
            templateUrl: "/dist/tpl/wms/setting/addlocation.html",
            data: {pageTitle: '添加库位'},
            controller: "addlocationCtrl",
            controllerAs: "addlocation",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/tbms/outbound.css"
                            // '../assets/pages/css/tmsOrder.css'
                        ]
                    });
                }]
            }
        })
        //修改库位 location
        .state('wms.setting.updatelocation', {
            url: "/updatelocation",
            templateUrl: "/dist/tpl/wms/setting/updatelocation.html",
            data: {pageTitle: '添加库位'},
            controller: "updatelocationCtrl",
            controllerAs: "updatelocation",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/pages/css/tbms/outbound.css"
                            // '../assets/pages/css/tmsOrder.css'
                        ]
                    });
                }]
            }
        })
        //新建库区 addregion
        .state('wms.setting.addregion', {
            url: "/addregion",
            templateUrl: "/dist/tpl/wms/setting/addregion.html",
            data: {pageTitle: '新建库区'},
            controller: "addregionCtrl",
            controllerAs: "addregion",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })
        //修改库区
        .state('wms.setting.updateregion', {
            url: "/updateregion/:Id",
            templateUrl: "/dist/tpl/wms/setting/updateregion.html",
            data: {pageTitle: '修改库区'},
            controller: "updateregionCtrl",
            controllerAs: "updateregion",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })
        //wms货主管理
        .state('wms.owner', {
            url: "/owner",
            templateUrl: "/dist/tpl/user/owner/wms-owner.html",
            data: {pageTitle: '货主管理'},
            controller: "userOwnerController",
            controllerAs: "owner"
        })

        //wms商品管理
        .state('wms.setting.goodsAdd', {
            url: "/goodsAdd",
            templateUrl: "/dist/tpl/wms/setting/goods-add.html",
            data: {pageTitle: '商品管理'},
            controller: "wmsGoodsAddController",
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
        //
        .state('wms.setting.owneraddress', {
            url: "/owneraddress/:Id",
            templateUrl: "/dist/tpl/wms/setting/owneraddress.html",
            data: {pageTitle: '货主管理'},
            controller: "owneraddressCtrl",
            controllerAs: "owneraddress"
        })
        //wms新增普通货主
        .state('wms.addowner', {
            url: "/addowner",
            templateUrl: "/dist/tpl/user/owner/add-wms-owner.html",
            data: {pageTitle: '新增普通货主'},
            controller: "addOwnerController",
            controllerAs: "addOwner"
        })
        //wms批次库存查询
        .state('wms.inventory.lot', {
            url: "/lot",
            templateUrl: "/dist/tpl/wms/inventory/inventory.lot.html",
            data: {pageTitle: '批次库存查询'},
            controller: "inventoryLotController",
            controllerAs: "inventoryLot"
        })
        //wms批次库存明细查询
        .state('wms.inventory.detail', {
            url: "/detail?id",
            templateUrl: "/dist/tpl/wms/inventory/inventory-lot-detail.html",
            data: {pageTitle: '批次库存明细查询'},
            controller: "inventoryDetailControl",
            controllerAs: "inventoryDetail"
        })
        //库内转移管理
        .state('wms.inventory.mvlocation', {
            url: "/mvlocation",
            templateUrl: "/dist/tpl/wms/inventory/inventory-move-location.html",
            data: {pageTitle: '库内转移管理'},
            controller: "inventoryMvLocControl",
            controllerAs: "inventoryMvLoc"
        })
        //wms商品库存查询
        .state('wms.inventory.product', {
            url: "/product",
            templateUrl: "/dist/tpl/wms/inventory/inventory.product.html",
            data: {pageTitle: '商品库存查询'},
            controller: "inventoryProductController",
            controllerAs: "inventoryProduct"
        })
        //wms商品库存明细查询
        .state('wms.inventory.productetail', {
            url: "/productetail?id",
            templateUrl: "/dist/tpl/wms/inventory/inventory-product-detail.html",
            data: {pageTitle: '商品库存明细查询'},
            controller: "invProductDetailControl",
            controllerAs: "invProductDetail"
        })
        //wms盘点单管理
        .state('wms.inventory.stocktaking', {
            url: "/stocktaking",
            templateUrl: "/dist/tpl/wms/inventory/stocktaking.html",
            data: {pageTitle: '盘点单管理'},
            controller: "stocktakingCtrl",
            controllerAs: "stocktaking"
        })
        //wms盘点单管理
        .state('wms.inventory.addstock', {
            url: "/stocktaking/addstock",
            templateUrl: "/dist/tpl/wms/inventory/addstock.html",
            data: {pageTitle: '盘点计划'},
            controller: "addstockCtrl",
            controllerAs: "addstock",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })
        //wms盘点分配
        .state('wms.inventory.allocation', {
            url: "/stocktaking/allocation",
            templateUrl: "/dist/tpl/wms/inventory/allocation.html",
            data: {pageTitle: '盘点分配'},
            controller: "allocationCtrl",
            controllerAs: "allocation"
        })
        //wms盘点勾选分配
        .state('wms.inventory.checkallocat', {
            url: "/stocktaking/checkallocat",
            templateUrl: "/dist/tpl/wms/inventory/checkallocat.html",
            data: {pageTitle: '盘点分配'},
            controller: "checkallocatCtrl",
            controllerAs: "checkallocat",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css"
                        ]
                    });
                }]
            }
        })
        //wms盘点明盘
        .state('wms.inventory.binitstock', {
            url: "/stocktaking/binitstock",
            templateUrl: "/dist/tpl/wms/inventory/binitstock.html",
            data: {pageTitle: '初盘明盘'},
            controller: "binitstockCtrl",
            controllerAs: "binitstock",
        })

        //wms盘点明盘
        .state('wms.inventory.breplaystock', {
            url: "/stocktaking/breplaystock",
            templateUrl: "/dist/tpl/wms/inventory/breplaystock.html",
            data: {pageTitle: '复盘明盘'},
            controller: "breplaystockCtrl",
            controllerAs: "breplaystock",
        })
        //平账
        .state('wms.inventory.platestock', {
            url: "/stocktaking/platestock",
            templateUrl: "/dist/tpl/wms/inventory/platestock.html",
            data: {pageTitle: '平账'},
            controller: "platestockCtrl",
            controllerAs: "platestock",
        })

        //货权转移管理
        .state('wms.inventory.mvowner', {
            url: "/mvowner",
            templateUrl: "/dist/tpl/wms/inventory/inventory-move-owner.html",
            data: {pageTitle: '货权转移管理'},
            controller: "inventoryMvOwnerControl",
            controllerAs: "inventoryMvOwner"
        })
        //损耗增溢管理
        .state('wms.inventory.profitloss', {
            url: "/profitloss",
            templateUrl: "/dist/tpl/wms/inventory/inventory-profit-loss.html",
            data: {pageTitle: '损耗增溢管理'},
            controller: "inventoryProfitLossControl",
            controllerAs: "inventoryProfitLoss"
        })
        //复合
        .state('wms.outbound.pack', {
            url: "/pack/:ID",
            templateUrl: "/dist/tpl/wms/outbound/pack.html",
            data: {pageTitle: '包装任务'},
            controller: "packControl",
            controllerAs: "pack"
        })
        //费用
        .state('wms.setting.expense', {
            url: "/expense",
            templateUrl: "/dist/tpl/wms/setting/expense.html",
            data: {pageTitle: '费用管理'},
            controller: "expenseCtrl",
            controllerAs: "expense",
        })
        //新增费用
        .state('wms.setting.addexpense', {
            url: "/addexpense",
            templateUrl: "/dist/tpl/wms/setting/addexpense.html",
            data: {pageTitle: '费用新增'},
            controller: "addexpenseCtrl",
            controllerAs: "addexpense",
        })
        //修改费用
        .state('wms.setting.updateexpense', {
            url: "/updateexpense",
            templateUrl: "/dist/tpl/wms/setting/updateexpense.html",
            data: {pageTitle: '费用修改'},
            controller: "updateexpenseCtrl",
            controllerAs: "updateexpense",
        })

        //仓库平面图
        .state('wms.square', {
            url: "/square",
            templateUrl: "/dist/tpl/wms/square/square.html",
            data: {pageTitle: '仓库平面图'},
            controller: "squareController",
            controllerAs: "square",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/pages/css/wms/square.css",
                            "../assets/plugins/counterup/jquery.counterup.min.js",
                            "../assets/plugins/counterup/jquery.waypoints.min.js",
                            "https://img.hcharts.cn/highcharts/highcharts.js"/*,
                            "https://img.hcharts.cn/highcharts/highcharts-3d.js",
                            "https://img.hcharts.cn/highcharts/modules/exporting.js",
                            "https://img.hcharts.cn/highcharts-plugins/highcharts-zh_CN.js",
                            "https://img.hcharts.cn/highcharts/themes/grid-light.js"*/
                        ]
                    });
                }]
            }
        })

        //调拨单
        .state('wms.outbound.requisition', {
            url: "/requisition",
            templateUrl: "/dist/tpl/wms/outbound/requisition.html",
            data: {pageTitle: '调拨单'},
            controller: "requisitionCtrl",
            controllerAs: "requisition",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css"
                        ]
                    });
                }]
            }
        })
        //调拨单详情
        .state('wms.outbound.requisitionDetail', {
            url: "/requisition/requisitionDetail?id",
            templateUrl: "/dist/tpl/wms/outbound/requisitionDetail.html",
            data: {pageTitle: '调拨单详情'},
            controller: "requisitionDetailCtrl",
            controllerAs: "requisitionDetail",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })
        //新建调拨单
        .state('wms.outbound.requisitionAdd', {
            url: "/requisition/requisitionAdd",
            templateUrl: "/dist/tpl/wms/outbound/requisitionAdd.html",
            data: {pageTitle: '新建调拨单'},
            controller: "requisitionAddCtrl",
            controllerAs: "requisitionAdd",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css"
                        ]
                    });
                }]
            }
        })
        //出入库汇总
        .state('wms.reporting.outincollect', {
            url: "/reporting/outincollect",
            templateUrl: "/dist/tpl/wms/reporting/outincollect.html",
            data: {pageTitle: '出入库汇总'},
            controller: "outincollectCtrl",
            controllerAs: "outincollect",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css"
                        ]
                    });
                }]
            }
        })
}

function lazyLoad($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: [
            {
                name: 'datatables',
                files: [
                    '../assets/plugins/datatables/datatables.all.min.js',
                ]
            },
            {
                name: 'timepicker',
                insertBefore: '#ng_load_plugins_before',
                files: [
                    "../assets/plugins/bootstrap-daterangepicker/daterangepicker.min.js",
                    "../assets/plugins/bootstrap-daterangepicker/daterangepicker.min.css",
                ]
            }
        ]
    });
}



