angular.module('MetronicApp').controller('newOrderDetailController', ['$rootScope', '$scope','$location','$http','uiGridConstants', 'settings','order','commonUtil','citySelect', function($rootScope, $scope, $location,$http, uiGridConstants,settings, order,commonUtil,citySelect)  {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.orderId =  $location.search().id

        order.getSaleOrderDetail(vm).success(function(data) {
           console.log(data)
            if(data.status==00){
               vm.repData = data.obj;

            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
            }

        });


        vm.toNewOrder = function(){
            window.location.href = "#/order/salesOrder/neworder";
        }
    }])