/* Setup TmsController page controller */
angular.module('MetronicApp').controller('d2pOrderDetailController', ['$rootScope', '$scope','$http','$location','uiGridConstants', 'settings','d2pOrderDetail','commonUtil','Table', function($rootScope, $scope, $http, $location,uiGridConstants,settings, d2pOrderDetail,commonUtil,Table) {

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
            vm.distributionWay = data.distributionWay;

        }else if(data.additionalMsg.status==01){
            msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');

        }

    });

    vm.returnButton = function () {
        window.location.href="#/d2p/d2porder/order";
    }

}])