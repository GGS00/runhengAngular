angular.module('MetronicApp').controller('newOrderController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','order','commonUtil','citySelect', function($rootScope, $scope, $http, uiGridConstants,settings, order,commonUtil,citySelect) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    vm.menuLen = 6;

    vm.allOrderParams = {
        bean:'omsSaleOrder',
        method:'page',
        page:1,
        rows:10,
        display:1
    }

    vm.allOrderColumn = [
        {   field: "orderId",
            displayName: '编号',
            enableCellEdit: true,
            width:170,
            enableCellEditOnFocus:true,
            cellTemplate:'<a ui-sref="order.salesOrder.neworderdetail({id:row.entity.orderId})" style="display: block;margin: 5px;">{{row.entity.orderId}}</a>'

        },
        {  field: "orderState",
            displayName: '订单状态',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:150,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.orderState==0?'待确认':(row.entity.orderState==1?'待财务审核':(row.entity.orderState==2?'待出库审核':(row.entity.orderState==3?'审核不通过':(row.entity.orderState==4?'待发货':(row.entity.orderState==5?'待确认收货':(row.entity.orderState==6?'已完成':(row.entity.orderState==7?'已关闭':(row.entity.orderState==9?'已取消':(row.entity.orderState==10?'待配仓':row.entity.orderState)))))))))}}</div>"
        },
        {  field: "cneeName",
            displayName: '收件人',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {   field: "receiveAddress",
            displayName: '收件地区',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:450,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.provinceName}}{{row.entity.cityName}}{{row.entity.districtName}}{{row.entity.address}}</div>"
        },
        {   field: "warehouseName",
            displayName: '发货仓库',
            enableCellEdit: true,
            width:140,
            enableCellEditOnFocus:true
        },
        /* {  field: "stockState",
         displayName: '是否缺货',
         enableCellEdit: true,
         enableCellEditOnFocus:true,
         width:150,
         cellTemplate:"<div style=\"padding:5px\">{{row.entity.goodsDeliveryWay==0?'仓库内货权转移':(row.entity.goodsDeliveryWay==1?'自提':(row.entity.goodsDeliveryWay==2?'供应商送货':''))}}</div>"
         },*/
        {  field: "distributionWay",
            displayName: '配送方式',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:150,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.distributionWay==0?'快递':(row.entity.distributionWay==1?'自营物流':(row.entity.distributionWay==2?'物流':(row.entity.distributionWay==3?'自提':'')))}}</div>"
        },
        {  field: "transName",
            displayName: '承运商',
            enableCellEdit: true,
            width:300,
            enableCellEditOnFocus:true
        },
        {   field: "lastOperatedTime",
            displayName: '订单操作时间',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        },
        {   field: "deliverState",
            displayName: '发货状态',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:150,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.deliverState==0?'未发货':(row.entity.deliverState==1?'已发货':(row.entity.deliverState==2?'部分发货':''))}}</div>"
        }
    ]

    vm.getAllOrderPage = function () {
        commonUtil.getList(vm.allOrderParams).success(function(data) {
            vm.allOrderData = data;
        });
    };
    vm.getAllOrderPage();

    vm.pendConfirmParams = {
        bean:'omsSaleOrder',
        method:'page',
        page:1,
        rows:10,
        orderState:0,
        display:1
    }

    vm.pendConfirmColumn = [
        {   field: "orderId",
            displayName: '编号',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:170,
            cellTemplate:'<a ui-sref="order.salesOrder.neworderdetail({id:row.entity.orderId})" style="display: block;margin: 5px;">{{row.entity.orderId}}</a>'
        },
        {  field: "orderState",
            displayName: '订单状态',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:150,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.orderState==0?'待确认':(row.entity.orderState==1?'待财务审核':(row.entity.orderState==2?'待出库审核':(row.entity.orderState==3?'审核不通过':(row.entity.orderState==4?'待发货':(row.entity.orderState==5?'待确认收货':(row.entity.orderState==6?'已完成':(row.entity.orderState==7?'已关闭':(row.entity.orderState==9?'已取消':(row.entity.orderState==10?'待配仓':row.entity.orderState)))))))))}}</div>"
        },
        {  field: "cneeName",
            displayName: '收件人',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {   field: "userName",
            displayName: '收件地区',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:450,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.provinceName}}{{row.entity.cityName}}{{row.entity.districtName}}{{row.entity.address}}</div>"
        },
        {   field: "warehouseName",
            displayName: '发货仓库',
            enableCellEdit: true,
            width:140,
            enableCellEditOnFocus:true
        },
        {  field: "distributionWay",
            displayName: '配送方式',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.distributionWay==0?'快递':(row.entity.distributionWay==1?'自营物流':(row.entity.distributionWay==2?'物流':(row.entity.distributionWay==3?'自提':'')))}}</div>"
        },
        {  field: "lastOperatedTime",
            displayName: '操作时间',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        }
    ]

    vm.getPendConfirmPage = function () {
        commonUtil.getList(vm.pendConfirmParams).success(function(data) {
            vm.pendConfirmData = data;
        });
    };

    vm.allotParams = {
        bean:'omsSaleOrder',
        method:'page',
        page:1,
        rows:10,
        orderState:10,
        display:1
    }

    vm.allotColumn = [
        {   field: "orderId",
            displayName: '编号',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:170,
            cellTemplate:'<a ui-sref="order.salesOrder.neworderdetail({id:row.entity.orderId})" style="display: block;margin: 5px;">{{row.entity.orderId}}</a>'
        },
        {  field: "orderState",
            displayName: '订单状态',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:150,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.orderState==0?'待确认':(row.entity.orderState==1?'待财务审核':(row.entity.orderState==2?'待出库审核':(row.entity.orderState==3?'审核不通过':(row.entity.orderState==4?'待发货':(row.entity.orderState==5?'待确认收货':(row.entity.orderState==6?'已完成':(row.entity.orderState==7?'已关闭':(row.entity.orderState==9?'已取消':(row.entity.orderState==10?'待配仓':row.entity.orderState)))))))))}}</div>"
        },
        {  field: "cneeName",
            displayName: '收件人',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {   field: "userName",
            displayName: '收件地区',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:450,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.provinceName}}{{row.entity.cityName}}{{row.entity.districtName}}{{row.entity.address}}</div>"
        },
        {   field: "warehouseName",
            displayName: '发货仓库',
            enableCellEdit: true,
            width:140,
            enableCellEditOnFocus:true
        },
        {  field: "distributionWay",
            displayName: '配送方式',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.distributionWay==0?'快递':(row.entity.distributionWay==1?'自营物流':(row.entity.distributionWay==2?'物流':(row.entity.distributionWay==3?'自提':'')))}}</div>"
        },
        {  field: "lastOperatedTime",
            displayName: '操作时间',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        }
    ]

    vm.getAllotPage = function () {
        commonUtil.getList(vm.allotParams).success(function(data) {
            vm.allotData = data;
        });
    };


    vm.financeExamineParams = {
        bean:'omsSaleOrder',
        method:'page',
        page:1,
        rows:10,
        orderState:1,
        display:1
    }

    vm.getFinanceExaminePage = function () {
        commonUtil.getList(vm.financeExamineParams).success(function(data) {
            vm.financeExamineData = data;
        });
    };

    vm.warehouseExamineParams = {
        bean:'omsSaleOrder',
        method:'page',
        page:1,
        rows:10,
        orderState:2,
        display:1
    }

    vm.getWarehouseExaminePage = function () {
        commonUtil.getList(vm.warehouseExamineParams).success(function(data) {
            vm.warehouseExamineData = data;
        });
    };

    vm.unExamineParams = {
        bean:'omsSaleOrder',
        method:'page',
        page:1,
        rows:10,
        orderState:3
    }

    vm.unExamineColumn = [
        {   field: "orderId",
            displayName: '编号',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            cellTemplate:'<a ui-sref="order.salesOrder.neworderdetail({id:row.entity.orderId})" style="display: block;margin: 5px;">{{row.entity.orderId}}</a>'
        },
        {  field: "customerId",
            displayName: '会员编号',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "customerName",
            displayName: '会员名称',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "cneeName",
            displayName: '收件人',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {   field: "receiveAddress",
            displayName: '收件地区',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.provinceName}}{{row.entity.cityName}}{{row.entity.districtName}}{{row.entity.address}}</div>"
        },
        {   field: "warehouseName",
            displayName: '发货仓库',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "stockState",
            displayName: '是否缺货',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.stockState==0?'否':(row.entity.stockState==1?'是':(row.entity.stockState==2?'未配仓':''))}}</div>"
        },
        {  field: "distributionWay",
            displayName: '配送方式',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.distributionWay==0?'快递':(row.entity.distributionWay==1?'自营物流':(row.entity.distributionWay==2?'物流':(row.entity.distributionWay==3?'自提':'')))}}</div>"
        },
        {  field: "lastOperatedTime",
            displayName: '操作时间',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        }
    ]

    vm.getUnExaminePage = function () {
        commonUtil.getList(vm.unExamineParams).success(function(data) {
            vm.unExamineData = data;
        });
    };

    vm.pendSendParams = {
        bean:'omsSaleOrder',
        method:'page',
        page:1,
        rows:10,
        orderState:4
    }

    vm.pendSendColumn = [
        {   field: "orderId",
            displayName: '编号',
            enableCellEdit: true,
            width:170,
            enableCellEditOnFocus:true
        },
        {  field: "cneeName",
            displayName: '收件人',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "customerId",
            displayName: '客户',
            visible:false
        },
        {   field:"userName",
            displayName:'收件地区',
            enableCellEdit:true,
            width:450,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.provinceName}}{{row.entity.cityName}}{{row.entity.districtName}}{{row.entity.address}}</div>"

        },
        {   field:"warehouseName",
            displayName: '发货仓库',
            enableCellEdit: true,
            width:140,
            enableCellEditOnFocus:true
        },
        {  field: "distributionWay",
            displayName: '配送方式',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.distributionWay==0?'快递':(row.entity.distributionWay==1?'自营物流':(row.entity.distributionWay==2?'物流':(row.entity.distributionWay==3?'自提':'')))}}</div>"

        },
        {  field: "transName",
            displayName: '承运商',
            enableCellEdit: true,
            width:300,
            enableCellEditOnFocus:true
        },
        {  field: "lastOperatedTime",
            displayName: '操作时间',
            enableCellEdit: true,
            width:300,
            enableCellEditOnFocus:true
        },
        {  field: "stockUpStatus",
            displayName: '是否完成备货',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">是</div>"
        }
    ]

    vm.getPendSendPage = function () {
        commonUtil.getList(vm.pendSendParams).success(function(data) {
            vm.pendSendData = data;
        });
    };

    vm.pendReceiveParams = {
        bean:'omsSaleOrder',
        method:'page',
        page:1,
        rows:10,
        orderState:5
    }

    vm.pendReceiveColumn = [
        {   field: "orderId",
            displayName: '编号',
            enableCellEdit: true,
            width:170,
            enableCellEditOnFocus:true
        },
        {  field: "cneeName",
            displayName: '收件人',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {   field: "userName",
            displayName: '收件地区',
            enableCellEdit: true,
            width:450,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.provinceName}}{{row.entity.cityName}}{{row.entity.districtName}}{{row.entity.address}}</div>"
        },
        {   field: "warehouseName",
            displayName: '发货仓库',
            enableCellEdit: true,
            width:140,
            enableCellEditOnFocus:true
        },
        {  field: "distributionWay",
            displayName: '配送方式',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.distributionWay==0?'快递':(row.entity.distributionWay==1?'自营物流':(row.entity.distributionWay==2?'物流':(row.entity.distributionWay==3?'自提':'')))}}</div>"
        },
        {  field: "lastOperatedTime",
            displayName: '操作时间',
            enableCellEdit: true,
            width:300,
            enableCellEditOnFocus:true
        },
        {  field: "ownerSubacctExt.ext5",
            displayName: '是否补发',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        }
    ]

    vm.getPendReceivePage = function () {
        commonUtil.getList(vm.pendReceiveParams).success(function(data) {
            vm.pendReceiveData = data;
        });
    };


    vm.orderDoneParams = {
        bean:'omsSaleOrder',
        method:'page',
        page:1,
        rows:10,
        orderState:6
    }

    vm.orderDoneColumn = [
        {   field: "orderId",
            displayName: '编号',
            enableCellEdit: true,
            width:170,
            enableCellEditOnFocus:true
        },
        {  field: "cneeName",
            displayName: '收件人',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {   field: "userName",
            displayName: '收件地区',
            enableCellEdit: true,
            width:450,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.provinceName}}{{row.entity.cityName}}{{row.entity.districtName}}{{row.entity.address}}</div>"
        },
        {   field: "warehouseName",
            displayName: '发货仓库',
            enableCellEdit: true,
            width:140,
            enableCellEditOnFocus:true
        },
        {  field: "distributionWay",
            displayName: '配送方式',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.distributionWay==0?'快递':(row.entity.distributionWay==1?'自营物流':(row.entity.distributionWay==2?'物流':(row.entity.distributionWay==3?'自提':'')))}}</div>"
        },
        {  field: "lastOperatedTime",
            displayName: '操作时间',
            enableCellEdit: true,
            width:300,
            enableCellEditOnFocus:true
        },
        {  field: "ownerSubacctExt.ext5",
            displayName: '是否补发',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        }
    ]

    vm.getOrderdonePage = function () {
        commonUtil.getList(vm.orderDoneParams).success(function(data) {
            vm.orderDoneData = data;
        });
    };


    vm.showTabs = function(index){
        switch (index)
        {
            case 0:
                vm.getAllOrderPage();
                break;
            case 1:
                vm.getPendConfirmPage();
                break;
            case 2:
                vm.getFinanceExaminePage();
                break;
            case 3:
                vm.getWarehouseExaminePage();
                break;
            case 4:
                vm.getUnExaminePage();
                break;
            case 5:
                vm.getPendSendPage();
                getLogList();
                break;
            case 6:
                vm.getPendReceivePage();
                break;
            case 7:
                vm.getOrderdonePage();
                break;
            case 8:
                vm.getAllotPage();
                break;
            case 9:
                break;
        }

    }


    vm.distributeWare = function(){
        if(vm.allotEntity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要配仓的新订单');
            return false;

        }else if(vm.allotEntity.getSelectedRows().length > 1){

            msgAlert.text('每次只能配仓一条新订单');

        }else{
            vm.orderId = vm.allotEntity.getSelectedRows()[0].orderId;
            vm.provinceId = vm.allotEntity.getSelectedRows()[0].provinceId;
            vm.cityId = vm.allotEntity.getSelectedRows()[0].cityId;
            vm.districtId = vm.allotEntity.getSelectedRows()[0].districtId;
            window.location.href = "#/order/salesOrder/neworderdistribute?orderId="+vm.orderId+"&provinceId="+vm.provinceId+"&cityId="+vm.cityId+"&districtId="+vm.districtId;
            /*order.getNewOrderDetail(vm).success(function(data) {
             if(data.status==00){
             console.log(data)
             vm.pendConfirmGoodsList = data.obj;
             }else{
             msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
             }

             });
             $('#confirmDis').modal('show')*/
        }

    }

    vm.pages = [
        {name:'10',id:'10'},
        {name:'20',id:'20'},
        {name:'50',id:'50'},
        {name:'100',id:'100'}
    ];

    vm.selected=vm.pages[0].id;//如果想要第一个值
    vm.page = 1; //默认当前页数
    vm.maxSize = 5; //最大页码
    vm.pageSize = 10; //1页多少个


    /*每页不同条数展示*/
    vm.packChange = function(x){
        console.log(x)
        console.log(vm.goodsParams.rows)
        vm.goodsParams.rows = x;
        getGoodsList();
    }

    function getGoodsList(){
        order.getAllotWarehouses(vm).success(function(data) {
            if(data.status==00){
                console.log(data)
                vm.pageCount = data.total
                vm.wareList = data.data;
                for(var h = 0 ; h < vm.wareList.length ; h++) {
                    vm.wareList[h].suppliers=[]
                    for(var j = 0 ; j < vm.wareList[h].items.length ; j++) {
                        vm.wareList[h].suppliers[j]=[];
                        for(var n= 0 ; n < vm.wareList[h].items[j].suppliers.length ; n++){
                            vm.wareList[h].suppliers[j].push(vm.wareList[h].items[j].suppliers[n]);
                        }
                    }
                }
                console.log(vm.wareList)
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
            }

        });
    }

    vm.pendConfirmWarehouse = function(){
        vm.provinceId = vm.pendConfirmGoodsList.logisticses[0].provinceId,
            vm.cityId = vm.pendConfirmGoodsList.logisticses[0].cityId,
            vm.districtId =  vm.pendConfirmGoodsList.logisticses[0].districtId,
            $('#confirmWarehouse').modal('show');
        getGoodsList();
    }



    vm.confirmWarehouse = function(){
        console.log("warehouseType:"+vm.wt);
        if(vm.warehouseEntity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要配仓的仓库');
            return false;

        }else if(vm.warehouseEntity.getSelectedRows().length > 1){

            msgAlert.text('每次只能配仓一个仓库');

        }else{
            //提交仓库
            vm.warehouseId = vm.warehouseEntity.getSelectedRows()[0].fk_id;
            order.confirmSetWarehouse(vm).success(function(data) {
                if(data.status==00){
                    console.log(data)
                    order.getSaleOrderDetail(vm).success(function(data) {
                        if(data.status==00){
                            console.log(data)
                            vm.pendConfirmGoodsList = data.obj;
                        }else{
                            msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                        }

                    });
                    msgAlert.text('配仓成功');
                    $('#confirmWarehouse').modal('hide');
                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                }

            });
        }
    }

    vm.carrierType = 0;
    vm.sendAddressSwitch = 0;
    vm.sendGoods = function(){
        if(vm.pendSendEntity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要发货的新订单');
            return false;

        }else if(vm.pendSendEntity.getSelectedRows().length > 1){

            msgAlert.text('每次只能发货一条订单');

        }else{
            vm.sendAddressSwitch = 1;
            vm.orderId = vm.pendSendEntity.getSelectedRows()[0].orderId;
            vm.warehouseType = vm.pendSendEntity.getSelectedRows()[0].warehouseType;
            if(vm.warehouseType=='01'){
                order.ownToWms(vm).success(function(data) {
                    if(data.status==00){
                        msgAlert.text('发货成功');
                        vm.getPendSendPage();
                    }else{
                        msgAlert.text('发货失败 >﹏< ['+ data.msg+']');
                    }

                });
            }else if(vm.warehouseType=='02'){
                vm.sendAddressColumn = [
                    {   field: "contactName",
                        displayName: '联系人',
                        enableCellEdit: true,
                        enableCellEditOnFocus:true
                    },
                    {  field: "mobile",
                        displayName: '联系电话',
                        enableCellEdit: true,
                        enableCellEditOnFocus:true
                    },
                    {  field: "address",
                        displayName: '联系地址',
                        enableCellEdit: true,
                        enableCellEditOnFocus:true,
                        cellTemplate:'<div style="padding:5px">{{row.entity.provinceName+row.entity.cityName+row.entity.countyName+row.entity.address}}</div>'
                    }
                ]
                vm.sendAddressParams = {
                    bean:'umsAddress',
                    method:'page',
                    qryUserId:vm.pendSendEntity.getSelectedRows()[0].warehouseId,
                    addrType:'112',
                    page:1,
                    rows:10
                }
                vm.receiveAddressParams = {
                    bean:'umsAddress',
                    method:'page',
                    qryUserId:vm.pendSendEntity.getSelectedRows()[0].customerId,
                    addrType:'111',
                    page:1,
                    rows:10
                }
                vm.transColumn = [
                    {
                        field: 'taker_id',
                        displayName: '承运商id',
                        enableColumnMenu: false,// 是否显示列头部菜单按钮
                        enableHiding: true,
                        suppressRemoveSort: true,
                        enableCellEdit: true, // 是否可编辑
                    },
                    {
                        field: "taker_nicknm",
                        displayName: '承运商名称',
                        enableCellEdit: true,
                        enableCellEditOnFocus: true
                    }
                ]
                vm.transParams = {
                    bean:'umsCooper',
                    method:'page',
                    qryType:'T',
                    qryRole:'3',
                    page:1,
                    rows:10
                }
                getSendAddress();
                getCarriers();
                getDefaultReceiverAddr();
                getReceiveAddress();
                $.fn.modal.Constructor.prototype.enforceFocus = function () { }
                $(".select2me").select2();
                $('#confirmCarrier').modal('show');
            }
        }
    }

    function getCarriers(){
        commonUtil.getList(vm.transParams).success(function(data) {
            vm.carrierData = data;
        });
    }

    function getSendAddress(){
        commonUtil.getList(vm.sendAddressParams).success(function(data) {
            vm.sendAddressData = data;
            vm.sendId =  vm.sendAddressData.rows[0].addressId;
            vm.sendName =  vm.sendAddressData.rows[0].contactName;
            vm.sendMobile =  vm.sendAddressData.rows[0].mobile;
            vm.sendProvince =  vm.sendAddressData.rows[0].provinceName;
            vm.sendCity =  vm.sendAddressData.rows[0].cityName;
            vm.sendDistrict =  vm.sendAddressData.rows[0].countyName;
            vm.sendAddress =  vm.sendAddressData.rows[0].address;
            vm.sendAddr= vm.sendAddressData.rows[0].provinceName
                + vm.sendAddressData.rows[0].cityName
                + vm.sendAddressData.rows[0].countyName
                + vm.sendAddressData.rows[0].address;
        });
    }
    function getLogisticsCompIdByArea(receiver){
        $http({url:"/sale/getLogisticsCompIdByArea",method: "post",
            params:{
            shipArea:receiver
            }
        }).success(function (data) {
            if(data.status==00){
                vm.logisticsComp=data.resultMap.logisticsCompId;
            }
        })
    }
    function getReceiveAddress(){
        commonUtil.getList(vm.receiveAddressParams).success(function(data) {
            vm.receiveAddressData = data.rows;
        });
    }
    //发货界面

    vm.addSender = function(){
        $('#selectSendAddress').modal('show');
    }

    vm.addSendAddress=function () {
        if (vm.sendAddressEntity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择一条收货信息');
            return false;
        } else if (vm.sendAddressEntity.getSelectedRows().length > 1) {
            msgAlert.info('只能选用一条收货信息');
            return false;
        }else{
            $('#selectSendAddress').modal('hide');
            vm.sendId = vm.sendAddressEntity.getSelectedRows()[0].addressId;
            vm.sendName = vm.sendAddressEntity.getSelectedRows()[0].contactName;
            vm.sendMobile = vm.sendAddressEntity.getSelectedRows()[0].mobile;
            vm.sendProvince = vm.sendAddressEntity.getSelectedRows()[0].provinceName;
            vm.sendCity = vm.sendAddressEntity.getSelectedRows()[0].cityName;
            vm.sendDistrict = vm.sendAddressEntity.getSelectedRows()[0].countyName;
            vm.sendAddress = vm.sendAddressEntity.getSelectedRows()[0].address;
            vm.sendAddr=vm.sendAddressEntity.getSelectedRows()[0].provinceName
                         +vm.sendAddressEntity.getSelectedRows()[0].cityName
                            +vm.sendAddressEntity.getSelectedRows()[0].countyName
                             +vm.sendAddressEntity.getSelectedRows()[0].address;
        }
    }

    function getDefaultReceiverAddr(){
        vm.defaultReceiveAddr=vm.pendSendEntity.getSelectedRows()[0].provinceName
                             +vm.pendSendEntity.getSelectedRows()[0].cityName
                             +vm.pendSendEntity.getSelectedRows()[0].districtName
                                +vm.pendSendEntity.getSelectedRows()[0].address;
        vm.defaultReceiveCneeName=vm.pendSendEntity.getSelectedRows()[0].cneeName;
        vm.defaultReceiveCneeMobile=vm.pendSendEntity.getSelectedRows()[0].cneeMobile;
        var addressList=[];
        addressList[0]= {
            province: vm.pendSendEntity.getSelectedRows()[0].provinceId,
            provinceName: vm.pendSendEntity.getSelectedRows()[0].provinceName,
            city: vm.pendSendEntity.getSelectedRows()[0].cityId,
            cityName:vm.pendSendEntity.getSelectedRows()[0].cityName,
            district: vm.pendSendEntity.getSelectedRows()[0].districtId,
            districtName: vm.pendSendEntity.getSelectedRows()[0].districtName
        }
        getLogisticsCompIdByArea(angular.toJson(addressList))
    }

    vm.isReceiverChanged=0;
    vm.editReceiver=function(){

        vm.isReceiverChanged=1;
    }
    vm.cancelEditReceiver=function(){

        vm.isReceiverChanged=0;
    }

    vm.confirmCarrier = function(){
      /*  if(vm.sendAddressEntity.getSelectedRows().length == 0){

         msgAlert.text('请先选择发货地址');
         return false;

         }else if(vm.sendAddressEntity.getSelectedRows().length > 1){

         msgAlert.text('每次只能选择一个发货地址');

         }else{
         vm.sendprovince = vm.sendAddressEntity.getSelectedRows()[0].provinceName;
         vm.sendcity = vm.sendAddressEntity.getSelectedRows()[0].cityName;
         vm.senddistrict = vm.sendAddressEntity.getSelectedRows()[0].countyName;
         vm.sendaddress = vm.sendAddressEntity.getSelectedRows()[0].address;
         vm.sendcontactor = vm.sendAddressEntity.getSelectedRows()[0].contactName;
         vm.sendmobile = vm.sendAddressEntity.getSelectedRows()[0].mobile;
         }*/

        if(vm.carrierType==0||vm.carrierType==1){
            if(vm.carrierType==0){
                vm.carrierId ='';
                vm.carrierName ='';
                vm.carrierType = 'SELF';
            }else if(vm.carrierType==1){
                if(vm.carrierEntity.getSelectedRows().length == 0){

                    msgAlert.text('请先选择承运商');
                    return false;

                }else if(vm.carrierEntity.getSelectedRows().length > 1){

                    msgAlert.text('每次只能选择一个承运商');

                }else{
                    vm.carrierId =vm.carrierEntity.getSelectedRows()[0].taker_id;
                    vm.carrierName =vm.carrierEntity.getSelectedRows()[0].taker_nicknm;
                    vm.carrierType = 'CHAIMI';
                }
            }
            order.ownToTms(vm).success(function(data) {
                if(data.status==00){
                    msgAlert.text('发货成功');
                    vm.getPendSendPage();
                    $('#confirmCarrier').modal('hide');
                }else{
                    msgAlert.text('发货失败 >﹏< ['+ data.msg+']');
                }

            });
        }else if(vm.carrierType==2){
            vm.logisticsCompanyId =vm.logisticsComp;
            vm.logisticsCompany=$('.sendExpress').find("option:selected").text();
            vm.logisticsNo = $('input[name="logisticsNo"]').val();
            vm.logisticsRemark = $('textarea[name="logisticsRemark"]').val();
            if(vm.logisticsCompanyId==""||vm.logisticsCompanyId==null){
                msgAlert.text('请先选择第三方物流');
                return false;
            }
            if(vm.logisticsNo==""){
                msgAlert.text('请先填写运单号');
                return false;
            }
            order.sendExpress(vm).success(function(data) {
                if(data.status==00){
                    msgAlert.text('发货成功');
                    vm.getPendSendPage();
                    $('#confirmCarrier').modal('hide');
                }else{
                    msgAlert.text('发货失败 >﹏< ['+ data.msg+']');
                }

            });
        }
    }

    //采购
    vm.purchase = function(){
        vm.selectListPurchase = [];
        if(vm.allotEntity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要采购的新订单');
            return false;

        }else if(vm.allotEntity.getSelectedRows().length > 1){

            msgAlert.text('每次只能采购一条新订单');
            return false;

        }else{
            for(var i = 0 ;i < vm.allotEntity.getSelectedRows().length ; i++){
                vm.selectListPurchase.push(vm.allotEntity.getSelectedRows()[0].orderId);
            }
            console.log(vm.selectListPurchase.join())

            vm.provinceId = vm.allotEntity.getSelectedRows()[0].provinceId;
            vm.cityId = vm.allotEntity.getSelectedRows()[0].cityId;
            vm.districtId = vm.allotEntity.getSelectedRows()[0].districtId;

            window.location.href = "#/order/salesOrder/neworderpurchase?ids="+vm.selectListPurchase.join()+"&provinceId="+vm.provinceId+"&cityId="+vm.cityId+"&districtId="+vm.districtId;
        }
    }

    vm.examineOrder = function(){
        if(vm.pendConfirmEntity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要审查的新订单');
            return false;

        }else if(vm.pendConfirmEntity.getSelectedRows().length > 1){

            msgAlert.text('每次只能审查一条新订单');
            return false;

        }else{
            vm.orderId = vm.pendConfirmEntity.getSelectedRows()[0].orderId;
            window.location.href = "#/order/salesOrder/neworderexamine?id="+vm.orderId+'&action=CONFIRM';
        }
    }

    /**
     * 财务审核
     * @returns {boolean}
     */
    vm.financeExamineOrder = function(){
        if(vm.financeExamineEntity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要审查的新订单');
            return false;

        }else if(vm.financeExamineEntity.getSelectedRows().length > 1){

            msgAlert.text('每次只能审查一条新订单');
            return false;

        }else{
            vm.orderId = vm.financeExamineEntity.getSelectedRows()[0].orderId;
            window.location.href = "#/order/salesOrder/neworderexamine?id="+vm.orderId+'&action=FINANCE_CHECK';
        }
    }

    /**
     * 仓库审核
     * @returns {boolean}
     */
    vm.warehouseExamineOrder = function(){
        if(vm.warehouseExamineEntity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要审查的新订单');
            return false;

        }else if(vm.warehouseExamineEntity.getSelectedRows().length > 1){

            msgAlert.text('每次只能审查一条新订单');
            return false;

        }else{
            vm.orderId = vm.warehouseExamineEntity.getSelectedRows()[0].orderId;
            window.location.href = "#/order/salesOrder/neworderexamine?id="+vm.orderId+'&action=WAREHOUSE_CHECK';
        }
    }

    vm.splitOrder = function(){
        if(vm.allotEntity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要拆分的待确认订单');
            return false;

        }else if(vm.allotEntity.getSelectedRows().length > 1){

            msgAlert.text('每次只能拆分一条待确认订单');

        }else{
            vm.orderId = vm.allotEntity.getSelectedRows()[0].orderId;
            order.getSaleOrderDetail(vm).success(function(data) {
                if(data.status==00){
                    console.log(data)
                    vm.pendConfirmGoodsList = data.obj;
                    $('#confirmSplit').modal('show');
                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                }

            });

        }
    }

    function getLogList(){
        vm.supParams = {
            bean:'omsExternalLogisticsCompany',
            method:'page',
            page:1,
            rows:10
        }
        commonUtil.getList(vm.supParams).success(function(data) {
            vm.logList = data.rows;
            vm.logisticsComp=vm.logisticsCompanyList[0].id;
        });
        /*order.getLogList(vm).success(function(data) {
         if(data.status==00){
         vm.logList = data.resultMap.logisticsCompId;
         }else{
         msgAlert.text('获取第三方快递失败 >﹏< ['+ data.msg+']');
         }
         });*/
    }


    vm.confirmSplit = function(){
        var countIndex = 0;
        var countIndexZero = 0;
        for (var i = 0; i < vm.pendConfirmGoodsList.items.length; i++) {
            var count = $(".pendConfirmGoods_" + i).find('input[name="items['+ i +'].count"]').val();
            var splitCount = $(".pendConfirmGoods_" + i).find('input[name="items['+ i +'].splitCount"]').val();
            if(splitCount == ""){
                msgAlert.text('请填写第'+ (i+1) +'条商品的拆单数量');
                return false;
            }
            if(parseInt(splitCount) == parseInt(count)){
                countIndex++;
            }

            if(parseInt(splitCount) == 0){
                countIndexZero++;
            }

        }

        if(countIndex == vm.pendConfirmGoodsList.items.length){
            msgAlert.text('所有商品的拆分数量不能同时为商品已有数量');
            return false;
        }

        if(countIndexZero == vm.pendConfirmGoodsList.items.length){
            msgAlert.text('所有商品的拆分数量不能同时为零');
            return false;
        }


        vm.form = $("#pendConfirmGoods").serialize();

        vm.form = decodeURIComponent(vm.form,true)

        console.log(vm.form)
        $.ajax({
            url:"/sale/splitOrder",
            data:vm.form,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.status==00){

                    msgAlert.text('拆单成功');
                    vm.allotEntity.clearSelectedRows();
                    $('#confirmSplit').modal('hide');
                    vm.getPendConfirmPage();

                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');

                }

            },
            error:function(){
                msgAlert.text('系统繁忙 >﹏<');
            }
        })
    }


    vm.mergeOrder = function(){
        if (vm.pendConfirmEntity.getSelectedRows().length < 2){
            msgAlert.text('至少选择两条订单进行合并');
            return false;
        }

        $('#confirmMerge').modal('show');
    }


    vm.confirmMerge = function(){
        var param = '';
        var orders = vm.pendConfirmEntity.getSelectedRows();
        for (var i = 0; i < orders.length; i++){
            var order = orders[i];
            param = param + order.orderId + ',';
        }
        console.log({mergeIds:param});
        $.ajax({
            url:"/sale/mergeOrder",
            data:{mergeIds:param},
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.status==00){

                    msgAlert.text('合单成功');
                    $('#confirmMerge').modal('hide');
                    vm.getPendConfirmPage();

                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');

                }

            },
            error:function(){
                msgAlert.text('系统繁忙 >﹏<');
            }
        })
    }
    // 点击上传按钮，显示弹框上传文件
    $scope.uploadNeworder = function () {
        $("#uploadExcel").modal('show');
    }
    // 选择文件之后点击上传文件
    $scope.uploadExcel = function () {

        if($("#excelFile").val()==""){
            msgAlert.text("请选择excel文件！");
            return false;
        } else {
            var reg = "/\.xl(s[xmb]|t[xm]|am)$/i"; // 校验文件格式
            msgAlert.text("请选择上传excel文件！");
            return false;
        }
        loading.show();

        $.ajaxFileUpload({
            url: "/newOrder/importData",
            type: 'post',
            fileElementId:'excelFile',
            data:'',
            dataType: 'JSON',
            success: function (data, status) {
                loading.hide();
                vm.mdata = JSON.parse(data);
                console.log(vm.mdata)

            },
            error: function (data, status, e) {
                loading.hide();
                vm.mdata = JSON.parse(data);
                console.log(vm.mdata)
            }
        });

    }
    // 点击导出订单按钮
    $scope.downloadNeworder = function () {
        // 被选中的数组
        var neworders = vm.allOrderEntity.getSelectedRows();
        console.log(neworders);
        // 判断用户选中的订单条目数是否合理
        if(neworders.length < 0){
            msgAlert.text("请选择下载的订单！");
        }
        if (neworders.length > 10){
            msgAlert.text("选择下载订单过多！");
        }
        var params = [];
        for(var i=0;i<neworders.length ;i++){
            params.add(neworders[i].orderId);
        }

        $.ajax({
            url:"#",  // 下载地址
            data:{param:params},
            type:"post",
            success:function () {
                //
            },
            error:function () {
                msgAlert.text("系统繁忙，导出失败！");
            }

        });


    }


}])