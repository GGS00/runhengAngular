
angular
    .module('MetronicApp')
    .config(tmsRouter)
    .config(lazyLoad)




tmsRouter.$inject= ['$stateProvider'];
lazyLoad.$inject= ['$ocLazyLoadProvider'];

function  tmsRouter($stateProvider) {

    $stateProvider
        // TMS

        .state('transport', {
            url: '/transport',
            template: '<div ui-view></div>'
        })

        .state('transport.order', {
            url: "/order",
            templateUrl: "/dist/tpl/transport/order/order.html",
            data: {pageTitle: '运单管理'},
            controller: "TmsController",
            controllerAs: "tmsOrder",
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

        //tms运单按段拆单
        .state('transport.splitbysite', {
            url: "/order/splitbysite?userId",
            templateUrl: "/dist/tpl/transport/order/splitbysite.html",
            data: {pageTitle: '运单按段拆单'},
            controller: "sepOrderController",
            controllerAs: "sepOrder",
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

        //tms运单按量拆单
        .state('transport.splitbyamount', {
            url: "/order/splitbyamount",
            templateUrl: "/dist/tpl/transport/order/splitbyamount.html",
            data: {pageTitle: '运单按量拆单'},
            controller: "separateByAmountController",
            controllerAs: "separateByAmount",
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

        //tms新建运单
        .state('transport.addorder', {
            url: "/order/add",
            templateUrl: "/dist/tpl/transport/order/add.html",
            data: {pageTitle: '新建运单'},
            controller: "newWaybillController",
            controllerAs: "newWaybill",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/tms/tmsPage.css",
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })
        //tms运单详情
        .state('transport.orderdetail', {
            url: "/order/detail?id",
            templateUrl: "/dist/tpl/transport/order/detail.html",
            data: {pageTitle: '运单详情'},
            controller: "tmsOrderDetailController",
            controllerAs: "orderDetail",
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

        //tms运单修改
        .state('transport.updateorder', {
            url: "/order/update?id",
            templateUrl: "/dist/tpl/transport/order/update.html",
            data: {pageTitle: '运单修改'},
            controller: "editTmsOrderController",
            controllerAs: "editTmsOrder",
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


        //物流追踪
        .state('transport.track', {
            url: "/track",
            templateUrl: "/dist/tpl/transport/track/track.html",
            data: {pageTitle: '物流追踪'},
            controller: "logisticsTrackController",
            controllerAs: "logisticsTrack",
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

        //物流信息
        .state('transport.trackdetail', {
            url: "/track/detail?id",
            templateUrl: "/dist/tpl/transport/track/detail.html",
            data: {pageTitle: '物流信息'},
            controller: "logisticsInfoController",
            controllerAs: "logisticsInfo",
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

        //调度配载
        .state('transport.dispatch', {
            url: "/dispatch/allocate",
            templateUrl: "/dist/tpl/transport/dispatch/allocate.html",
            data: {pageTitle: '调度配载'},
            controller: "dispatchController",
            controllerAs: "dispatch",
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
        //新增调度
        .state('transport.dispatchaddstepone', {
            url: "/dispatch/allocate/addstepone",
            templateUrl: "/dist/tpl/transport/dispatch/addstepone.html",
            data: {pageTitle: '新增调度'},
            controller: "addNewDispatchController",
            controllerAs: "addNewDispatch",
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

        //选择司机和和载具
        .state('transport.dispatchaddsteptwo', {
            url: "/dispatch/allocate/addsteptwo",
            templateUrl: "/dist/tpl/transport/dispatch/addsteptwo.html",
            data: {pageTitle: '选择司机和载具'},
            controller: "selectDispatchController",
            controllerAs: "selectDispatch",
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

        //货物配载
        .state('transport.dispatchaddstepthree', {
            url: "/dispatch/allocate/addstepthree",
            templateUrl: "/dist/tpl/transport/dispatch/addstepthree.html",
            data: {pageTitle: '货物配载'},
            controller: "finalDispatchController",
            controllerAs: "finalDispatch",
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

        //装车发运
        .state('transport.loadup', {
            url: "/dispatch/loadup",
            templateUrl: "/dist/tpl/transport/dispatch/loadup.html",
            data: {pageTitle: '装车发运'},
            controller: "dispatchLoadUpController",
            controllerAs: "dispatchLoadUp",
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

        //调度单装车
        .state('transport.loadupshipment', {
            url: "/dispatch/loadup/shipment?id",
            templateUrl: "/dist/tpl/transport/dispatch/shipment.html",
            data: {pageTitle: '装车发运'},
            controller: "distributeController",
            controllerAs: "distribute",
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

        //回单签收
        .state('transport.receipt', {
            url: "/receipt/sign",
            templateUrl: "/dist/tpl/transport/receipt/sign.html",
            data: {pageTitle: '回单签收'},
            controller: "receiptSignController",
            controllerAs: "receiptSign",
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

        //回单签收详情
        .state('transport.receiptdetail', {
            url: "/receipt/sign/detail?id",
            templateUrl: "/dist/tpl/transport/receipt/detail.html",
            data: {pageTitle: '回单签收详情'},
            controller: "receiptSignDetailController",
            controllerAs: "receiptSignDetail",
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


        //常用地址管理
        .state('transport.settingaddress', {
            url: "/setting/address",
            templateUrl: "/dist/tpl/transport/setting/address.html",
            data: {pageTitle: '常用地址管理'},
            controller: "comAddressController",
            controllerAs: "comAddress",
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

        //新增常用地址
        .state('transport.settingaddaddress', {
            url: "/setting/address/add",
            templateUrl: "/dist/tpl/transport/setting/addaddress.html",
            data: {pageTitle: '新增常用地址'},
            controller: "comAddressSetController",
            controllerAs: "comAddressSet",
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

        //单据类型管理
        .state('transport.settingbilltype', {
            url: "/setting/billtype",
            templateUrl: "/dist/tpl/transport/setting/billtype.html",
            data: {pageTitle: '单据类型管理'},
            controller: "billTypeController",
            controllerAs: "billType",
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

        //新增单据类型
        .state('transport.settingaddbilltype', {
            url: "/setting/billtype/add",
            templateUrl: "/dist/tpl/transport/setting/addbilltype.html",
            data: {pageTitle: '新增单据类型'},
            controller: "billTypeSetController",
            controllerAs: "billTypeSet",
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


        //常用联系人管理
        .state('transport.settingcontacts', {
            url: "/setting/contacts",
            templateUrl: "/dist/tpl/transport/setting/contacts.html",
            data: {pageTitle: '常用联系人管理'},
            controller: "comContactsController",
            controllerAs: "comContacts",
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

        //新增常用联系人
        .state('transport.settingaddcontacts', {
            url: "/setting/contacts/add",
            templateUrl: "/dist/tpl/transport/setting/addcontacts.html",
            data: {pageTitle: '新增常用联系人'},
            controller: "comContactsSetController",
            controllerAs: "comContactsSet",
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

        //拒签原因管理
        .state('transport.settingdenialreason', {
            url: "/setting/denialreason",
            templateUrl: "/dist/tpl/transport/setting/denialreason.html",
            data: {pageTitle: '拒签原因管理'},
            controller: "denialReasonController",
            controllerAs: "denialReason",
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

        //新增拒签原因
        .state('transport.settingadddenialreason', {
            url: "/setting/denialreason/add",
            templateUrl: "/dist/tpl/transport/setting/adddenialreason.html",
            data: {pageTitle: '新增拒签原因'},
            controller: "denialReasonSetController",
            controllerAs: "denialReasonSet",
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

        //常用货品管理
        .state('transport.settinggoods', {
            url: "/setting/goods",
            templateUrl: "/dist/tpl/transport/setting/goods.html",
            data: {pageTitle: '常用货品管理'},
            controller: "comGoodsController",
            controllerAs: "comGoods",
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

        //新增常用货品
        .state('transport.settingaddgoods', {
            url: "/setting/goods/add",
            templateUrl: "/dist/tpl/transport/setting/addgoods.html",
            data: {pageTitle: '新增常用货品'},
            controller: "comGoodsSetController",
            controllerAs: "comGoodsSet",
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
        .state('transport.shipperaddress', {
            url: "/setting/shipperaddress/:Id",
            templateUrl: "/dist/tpl/transport/setting/shipperaddress.html",
            data: {pageTitle: '货主管理'},
            controller: "shipperaddressCtrl",
            controllerAs:"shipperaddress"
        })
       //网点管理
        .state('transport.settingpoint', {
            url: "/setting/point",
            templateUrl: "/dist/tpl/transport/setting/point.html",
            data: {pageTitle: '网点管理'},
            controller: "pointController",
            controllerAs: "point",
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

        //新增网点
        .state('transport.settingaddpoint', {
            url: "/setting/point/add",
            templateUrl: "/dist/tpl/transport/setting/addpoint.html",
            data: {pageTitle: '新增网点'},
            controller: "pointSetController",
            controllerAs: "pointSet",
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

        //tms载具管理
        .state('transport.settingvehicle', {
            url: "/setting/vehicle",
            templateUrl: "/dist/tpl/transport/setting/vehicle.html",
            data: {pageTitle: '载具管理'},
            controller: "tmsVehicleController",
            controllerAs: "tmsVehicle",
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

        //tms新增载具
        .state('transport.settingaddvehicle', {
            url: "/setting/vehicle/add",
            templateUrl: "/dist/tpl/transport/setting/addvehicle.html",
            data: {pageTitle: '新增载具'},
            controller: "tmsAddVehicleController",
            controllerAs: "tmsAddVehicle",
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

        //tms车辆类型
        .state('transport.settingvehicletype', {
            url: "/setting/vehicletype",
            templateUrl: "/dist/tpl/transport/setting/vehicletype.html",
            data: {pageTitle: '车辆类型'},
            controller: "tmsVehicleTypeController",
            controllerAs: "tmsVehicleType",
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

        //tms新增车辆类型
        .state('transport.settingaddvehicletype', {
            url: "/setting/vehicletype/add",
            templateUrl: "/dist/tpl/transport/setting/addvehicletype.html",
            data: {pageTitle: '新增车辆类型'},
            controller: "tmsAddVehicleTypeController",
            controllerAs: "tmsAddVehicleType",
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

        //tms托运人管理
        .state('transport.owner', {
            url: "/owner",
            templateUrl: "/dist/tpl/user/owner/tms-owner.html",
            data: {pageTitle: '托运人管理'},
            controller: "userOwnerController",
            controllerAs:"owner"
        })

        //tms新增普通托运人
        .state('transport.addowner', {
            url: "/addowner",
            templateUrl: "/dist/tpl/user/owner/add-tms-owner.html",
            data: {pageTitle: '新增普通托运人'},
            controller: "addOwnerController",
            controllerAs:"addOwner"
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



