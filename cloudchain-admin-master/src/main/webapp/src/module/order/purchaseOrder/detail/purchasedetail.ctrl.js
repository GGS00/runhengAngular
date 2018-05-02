angular.module('MetronicApp').controller('purchaseDetailController', ['$rootScope', '$scope','$location','$http','uiGridConstants', 'settings','order','commonUtil','citySelect', function($rootScope, $scope, $location,$http, uiGridConstants,settings, order,commonUtil,citySelect)  {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;

    initial();
    function initial(){
        var storage = window.localStorage;
        vm.purchaseSelect = JSON.parse(storage["purchaseSelect"]);
        console.log(vm.purchaseSelect)
        vm.goodsList = vm.purchaseSelect.itemList;
        vm.goodsDeliveryWaySelected =vm.purchaseSelect.goodsDeliveryWay==0?'仓库内货权转移':(vm.purchaseSelect.goodsDeliveryWay==1?'自提':(vm.purchaseSelect.goodsDeliveryWay==2?'供应商送货':vm.purchaseSelect.goodsDeliveryWay));
        vm.settlementWaySelected = vm.purchaseSelect.settlementWay==0?'预付':(vm.purchaseSelect.settlementWay==1?'到货结算':vm.purchaseSelect.settlementWay);
        vm.purchaseId =vm.purchaseSelect.purchaseId;
        vm.state =vm.purchaseSelect.state==0?'待审':(vm.purchaseSelect.state==1?'审核通过':vm.purchaseSelect.state);
        vm.lastOperatedTime =vm.purchaseSelect.lastOperatedTime;
        vm.supplierName =vm.purchaseSelect.supplierName;
        vm.warehouseName =vm.purchaseSelect.warehouseName;
        vm.arrivalTime =vm.purchaseSelect.arrivalTime;
        $('#remarks').val(vm.purchaseSelect.remark);
    }

    /* vm.getPage = function () {
     commonUtil.getList(vm.pageParams).success(function(data) {
     vm.data = data;
     });
     };
     vm.getPage();*/

    vm.return = function(){
        window.location.href = "#/order/purchaseOrder/purchase";
    }
}])