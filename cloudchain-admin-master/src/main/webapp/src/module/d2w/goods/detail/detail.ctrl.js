angular.module('MetronicApp').controller('goodsourcedetailController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','d2w','commonUtil','$location', function($rootScope, $scope, $http, uiGridConstants,settings, d2w,commonUtil,$location) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;

    vm.id =  $location.search().id;

    vm.showTabs = function(index){
        switch (index)
        {
            case 0:
                vm.getGoodsPage();
                break;
            case 1:
                vm.getPage()
                break;
        }
    }


    initial();

    function initial(){
        d2w.goodsDetail(vm).success(function(data) {
            if(data.status == 00){
                 vm.detailData = data.obj;
                 vm.goodsData = data.obj.itemDetailModels;
                 vm.offersData = data.obj.offers;
            }else{
                msgAlert.text('详情查看失败' +data.msg);
                return false;
            }
        });

    }


}])