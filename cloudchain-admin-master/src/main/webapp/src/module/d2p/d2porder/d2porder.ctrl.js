/* Setup TmsController page controller */
angular.module('MetronicApp').controller('d2porderController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','order','commonUtil', function($rootScope, $scope, $http, uiGridConstants,settings, order,commonUtil) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    /*vm.page = 1; //默认当前页数
     vm.maxSize = 5; //最大页码
     vm.pageSize = 20; //1页多少个
     vm.pageCount = 92;//总条数*/

    vm.menuLen = 6;

    vm.pageParams = {
        bean:'d2POrder',
        method:'page',
        page:1,
        rows:10
    }

    initial();
    function initial(){

        vm.pParams = {
            bean: 'user',
            method: 'pageGetUserList',
            page: 1,
            rows: 50,
            userType:1
        }

        commonUtil.getList(vm.pParams).success(function(data) {
            vm.pList = data.rows;
        });

    }


    vm.column = [
        {   field: "orderId",
            displayName: '订单编号',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true,
            cellTemplate:'<a ui-sref="d2p.d2porder.orderdetail({id:row.entity.orderId})" style="display: block;margin: 5px;">{{row.entity.orderId}}</a>'
        },
        {   field: "actualMoney",
            displayName: '订单金额',
            enableCellEdit: true,
            width:130,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">￥{{row.entity.actualMoney/100}}</div>"
        },
        {   field: "transFee",
            displayName: '运费',
            enableCellEdit: true,
            width:130,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">￥{{row.entity.transFee/100}}</div>"
        },
        {   field: "settlementWay",
            displayName: '结算方式',
            width:120,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.settlementWay==0?'现结':(row.entity.settlementWay==1?'月结':(row.entity.settlementWay==2?'预付':(row.entity.settlementWay==3?'组合':'')))}}</div>"
        },
        {   field: "shopName",
            displayName: '店名',
            width:150,
            enableCellEditOnFocus:true
        },
        {   field: "pName",
            displayName: '网点用户名',
            width:150,
            enableCellEditOnFocus:true
        },
        {   field: "createdTime",
            displayName: '下单时间',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        },
        {   field: "orderState",
            displayName: '订单状态',
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.orderState==0?'待支付':(row.entity.orderState==1?'待发货':(row.entity.orderState==2?'待确认收货':(row.entity.orderState==3?'已完成':(row.entity.orderState==4?'关闭':''))))}}</div>"
        },
        {   field: "deliverState",
            displayName: '发货状态',
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.deliverState==0?'未发货':(row.entity.deliverState==1?'已发货':(row.entity.deliverState==2?'部分发货':''))}}</div>"
        },
        {   field: "isInvoice",
            displayName: '需要发票',
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.isInvoice==0?'不需要':(row.entity.isInvoice==1?'需要':'')}}</div>"
        },
        {   field: "hasInvoice",
            displayName: '已开发票',
            width:120,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.hasInvoice==0?'未开':(row.entity.hasInvoice==1?'已开':'')}}</div>"

        }
    ]

    vm.getPage = function () {

        commonUtil.getList(vm.pageParams).success(function(data) {
            vm.data = data;
        });
    };
    vm.getPage();

    vm.getPageByFilter = function(){
        var orderId = $('input[name="orderId"]').val();
        var customerId = $('.userId').val();
        if(customerId == " "){
            customerId ="";
        }
        var orderState = $('.orderState').val();
        if(orderState == " "){
            orderState ="";
        }
        var deliverState = $('.deliverState').val();
        if(deliverState == " "){
            deliverState ="";
        }

        vm.pageParams = {
            orderId:orderId,
            customerId:customerId,
            orderState:orderState,
            deliverState:deliverState,
            bean:'d2POrder',
            method:'page',
            page:1,
            rows:10
        }
        vm.getPage();
    }


}])

    .controller('d2pOrderDetailController', ['$rootScope', '$scope','$http','$location','uiGridConstants', 'settings','d2pOrderDetail','commonUtil','Table', function($rootScope, $scope, $http, $location,uiGridConstants,settings, d2pOrderDetail,commonUtil,Table) {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.id =  $location.search().id;

        d2pOrderDetail.getDetail(vm).success(function(data) {

            if(data.additionalMsg.status==00){

                vm.payList = data.payList;
                vm.itemList = data.itemList;
                vm.logistics = data.logistics;
                vm.invoice = data.invoice;
                vm.orderId = data.orderId;
                vm.orderState = data.orderState;
                vm.transFee = data.transFee;
                vm.actualMoney = data.actualMoney;
                vm.subtractMoney = data.subtractMoney;
                vm.remark = data.remark;
                vm.isInvoice = data.isInvoice;

            }else if(data.additionalMsg.status==01){
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');

            }

        });



    }])