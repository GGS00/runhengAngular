angular.module('MetronicApp').controller('d2wgoodsofferController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','d2w','commonUtil','$location', function($rootScope, $scope, $http, uiGridConstants,settings, d2w,commonUtil,$location) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    $('.finance a').removeClass('selectOn');
    $('.yiti a').removeClass('selectOn');
    $('.saas a').removeClass('selectOn');
    $('.about a').removeClass('selectOn');
    $('.homepage a').addClass('selectOn');
    vm.id =  $location.search().id;
    var storage = window.localStorage;
    vm.goodsDetailData = JSON.parse(storage["goodsDetailData"]);
    isloginCheck();
    initial();

    function initial(){
        d2w.warehouselist(vm).success(function(data) {
             vm.wareList = data.data;
             for(var i = 0 ; i < vm.wareList.length ; i++){
                 vm.wareList[i].checkStatus = false;
             }
        });
    }

    vm.statusChange = function(){
        var m = 0;
        for(var i = 0 ; i < vm.wareList.length ; i++){
            if(vm.wareList[i].checkStatus == true){
                m++
            }
        }
        if(m>1){
            msgAlert.text('只能选择一个仓源');
            for(var i = 0 ; i < vm.wareList.length ; i++){
                vm.wareList[i].checkStatus = false;
            }
        }
    }

    vm.submit = function(){
        var m = 0;
        for(var i = 0 ; i < vm.wareList.length ; i++){
            if(vm.wareList[i].checkStatus == true){
                m++
            }
        }
        if(m==0){
            msgAlert.text('请先选择仓源');
            return false;
        }
        for(var i = 0 ; i < vm.wareList.length ; i++){
            if(vm.wareList[i].checkStatus == true){
                vm.dwWarehouseId = vm.wareList[i].id;
            }
        }
        vm.rentPrice = $('input[name="rentPrice"]').val();
        if(vm.rentPrice==''){
            msgAlert.text('请填写单价');
            return false;
        }
        var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
        if(!reg.test(vm.rentPrice)){
            msgAlert.text('单价精确到小数点后两位');
            return false;
        }
        d2w.goodsOffer(vm).success(function(data) {
            if(data.status ==00){
                msgAlert.success('提交成功')
                window.location.href = "#/d2w/waresource?type=0"
            }else{
                msgAlert.text('提交失败' + data.msg)
                return false;
            }
        });

    }

}])