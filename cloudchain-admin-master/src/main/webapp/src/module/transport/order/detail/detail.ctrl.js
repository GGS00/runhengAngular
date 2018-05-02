/* Setup TmsController page controller */
angular.module('MetronicApp').controller('tmsOrderDetailController', ['$rootScope', '$scope','$http','$location','uiGridConstants', 'settings','orderDetail','commonUtil','Table', function($rootScope, $scope, $http, $location,uiGridConstants,settings, orderDetail,commonUtil,Table) {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.id =  $location.search().id;

        orderDetail.getDetail(vm).success(function(data) {

            if(data.additionalMsg.status==00){

                vm.orderMap = data.orderMap;
                vm.goodsList = data.goodsList;
                vm.fee = data.fee;

            }else if(data.additionalMsg.status==01){
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');

            }

        });



    }])