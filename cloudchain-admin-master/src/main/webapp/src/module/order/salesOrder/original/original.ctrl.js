angular.module('MetronicApp').controller('originalController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','order','commonUtil', function($rootScope, $scope, $http, uiGridConstants,settings, order,commonUtil) {

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
        bean:'omsSaleOriginOrder',
        method:'page',
        page:1,
        rows:10
    }

    vm.allOrderColumn = [
        {   field: "orderId",
            displayName: '编号',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true,
            cellTemplate:'<a ui-sref="order.salesOrder.originorderdetail({id:row.entity.orderId})" style="display: block;margin: 5px;">{{row.entity.orderId}}</a>'

        },
        {  field: "orderState",
            displayName: '订单状态',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:150,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.orderState==0?'待确认':(row.entity.orderState==1?'待财务审核':(row.entity.orderState==2?'待出库审核':(row.entity.orderState==3?'审核不通过':(row.entity.orderState==4?'待发货':(row.entity.orderState==5?'待确认收货':(row.entity.orderState==6?'已完成':(row.entity.orderState==7?'已关闭':(row.entity.orderState==9?'已取消':''))))))))}}</div>"
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
            width:300,
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
        {  field: "payState",
            displayName: '付款状态',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:150,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.payState==0?'未付款':(row.entity.payState==1?'已付款':'部分付款')}}</div>"
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

    vm.payOrderParams = {
        bean:'omsSaleOriginOrder',
        method:'page',
        payState: '0',
        page:1,
        rows:10
    }

    vm.payOrderColumn = [
        {   field: "orderId",
            displayName: '编号',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true,
            cellTemplate:'<a ui-sref="order.salesOrder.originorderdetail({id:row.entity.orderId})" style="display: block;margin: 5px;">{{row.entity.orderId}}</a>'

        },
        {  field: "orderState",
            displayName: '订单状态',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:150,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.orderState==0?'待确认':(row.entity.orderState==1?'待财务审核':(row.entity.orderState==2?'待出库审核':(row.entity.orderState==3?'审核不通过':(row.entity.orderState==4?'待发货':(row.entity.orderState==5?'待确认收货':(row.entity.orderState==6?'已完成':(row.entity.orderState==7?'已关闭':(row.entity.orderState==9?'已取消':''))))))))}}</div>"
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
            width:300,
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

    vm.getPayPage = function () {
        commonUtil.getList(vm.payOrderParams).success(function(data) {
            vm.payOrderData = data;
        });
    };

    vm.sendOrderParams = {
        bean:'omsSaleOriginOrder',
        method:'page',
        orderState: '4',
        page:1,
        rows:10
    }

    vm.sendOrderColumn = [
        {   field: "orderId",
            displayName: '编号',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true,
            cellTemplate:'<a ui-sref="order.salesOrder.originorderdetail({id:row.entity.orderId})" style="display: block;margin: 5px;">{{row.entity.orderId}}</a>'

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
            width:300,
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

    vm.getSendPage = function () {
        commonUtil.getList(vm.sendOrderParams).success(function(data) {
            vm.sendOrderData = data;
        });
    };


    vm.receiveOrderParams = {
        bean:'omsSaleOriginOrder',
        method:'page',
        orderState: '5',
        page:1,
        rows:10
    }

    vm.receiveOrderColumn = [
        {   field: "orderId",
            displayName: '编号',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true,
            cellTemplate:'<a ui-sref="order.salesOrder.originorderdetail({id:row.entity.orderId})" style="display: block;margin: 5px;">{{row.entity.orderId}}</a>'

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
            width:300,
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

    vm.getReceivePage = function () {
        commonUtil.getList(vm.receiveOrderParams).success(function(data) {
            vm.receiveOrderData = data;
        });
    };

    vm.doneOrderParams = {
        bean:'omsSaleOriginOrder',
        method:'page',
        orderState: '6',
        page:1,
        rows:10
    }

    vm.receiveOrderColumn = [
        {   field: "orderId",
            displayName: '编号',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true,
            cellTemplate:'<a ui-sref="order.salesOrder.originorderdetail({id:row.entity.orderId})" style="display: block;margin: 5px;">{{row.entity.orderId}}</a>'

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
            width:300,
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

    vm.getDonePage = function () {
        commonUtil.getList(vm.doneOrderParams).success(function(data) {
            vm.doneOrderData = data;
        });
    };

    vm.closeOrderParams = {
        bean:'omsSaleOriginOrder',
        method:'page',
        orderState: '7',
        page:1,
        rows:10
    }

    vm.closeOrderColumn = [
        {   field: "orderId",
            displayName: '编号',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true,
            cellTemplate:'<a ui-sref="order.salesOrder.originorderdetail({id:row.entity.orderId})" style="display: block;margin: 5px;">{{row.entity.orderId}}</a>'

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
            width:300,
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

    vm.getClosePage = function () {
        commonUtil.getList(vm.closeOrderParams).success(function(data) {
            vm.closeOrderData = data;
        });
    };

    vm.showTabs = function(index){
        switch (index)
        {
            case 0:
                vm.getAllOrderPage();
                break;
            case 1:
                vm.getPayPage();
                break;
            case 2:
                vm.getSendPage();
                break;
            case 3:
                vm.getReceivePage();
                break;
            case 4:
                vm.getDonePage();
                break;
            case 5:
                vm.getClosePage();
                break;
        }

    }


    vm.importOrder = function(){
        $('#confirmExcel').modal('show');
    }


/*    loading.show()*/
    vm.confirmExcel = function(){
        if ($("#excelFile").val() == "") {
            msgAlert.text('请导入excel文件');
            return false;
        } else {
            var reg = /^.*\.(?:xls|xlsx)$/i;//文件名可以带空格
            if (!reg.test($("#excelFile").val())) {//校验不通过
                msgAlert.text('请上传excel格式的文件!');
                return false;
            }
        }

        // loading.show();

        $.ajaxFileUpload({
            url: "/originOrder/importData",
            type: 'post',
            fileElementId:'excelFile',
            data:'',
            dataType: 'JSON',
            success: function (data, status) {
                // loading.hide();
                vm.mdata = JSON.parse(data);
                console.log(vm.mdata)

            },
            error: function (data, status, e) {
                // loading.hide();
                vm.mdata = JSON.parse(data);
                console.log(vm.mdata)
            }
        });
    }

    vm.exportOrder = function(state){
        window.open("/originOrder/exportData/order?status="+state);
    }

    vm.download = function() {
        window.location.href="/templetFile/sale_order_template.xls";
    }

}])