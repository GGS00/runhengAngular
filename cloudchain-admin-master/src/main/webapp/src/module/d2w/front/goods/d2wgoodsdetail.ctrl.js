angular.module('MetronicApp').controller('d2wgoodsdetailController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','d2w','commonUtil','multicitySelect','$location', function($rootScope, $scope, $http, uiGridConstants,settings, d2w,commonUtil,multicitySelect,$location)  {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    var vm = this;
    $('.finance a').removeClass('selectOn');
    $('.yiti a').removeClass('selectOn');
    $('.saas a').removeClass('selectOn');
    $('.about a').removeClass('selectOn');
    $('.homepage a').addClass('selectOn');
    vm.id =  $location.search().id;

    d2w.isLogin().success(function(data) {
            vm.isLogin = data.obj;
    });

    d2w.goodsDetail(vm).success(function(data) {
        if(data.status==00){
            vm.detailData = data.obj;
            var storage = window.localStorage;
            storage["goodsDetailData"] = JSON.stringify(vm.detailData);
        }else{
            msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
            vm.entity.clearSelectedRows();
        }
    });
    vm.toWaresource = function(){
        window.location.href='#/d2w/waresource?type=1'
    }

    $scope.toOrder = function(){
        window.location.href='#/d2w/d2wgoodsoffer?id=' + vm.id;
    }

}])