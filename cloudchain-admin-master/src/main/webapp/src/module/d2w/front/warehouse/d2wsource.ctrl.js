angular.module('MetronicApp').controller('d2wsourceController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','d2w','commonUtil','multicitySelect','$location', function($rootScope, $scope, $http, uiGridConstants,settings, d2w,commonUtil,multicitySelect,$location)  {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    var vm = this;
    vm.type =  $location.search().type;

    $('.finance a').removeClass('selectOn');
    $('.yiti a').removeClass('selectOn');
    $('.saas a').removeClass('selectOn');
    $('.about a').removeClass('selectOn');
    $('.homepage a').addClass('selectOn');

    $('.banner-show').css({'background':'url(../assets/pages/img/d2w/backone.jpg) center center no-repeat','background-size':'cover'});

    initial();

    function initial(){
        $(document).scrollTop(0);
        $(document).scrollTop(560);
        vm.dictTypeName ='优仓增值服务';
        d2w.getTypeList(vm).success(function(data) {
            vm.addServiceList = data.rows;
            for(var i = 0 ; i < vm.addServiceList.length ; i++){
                vm.addServiceList[i].checkState = false;
            }
        });
    }

    vm.showTabs = function(index){
        switch (index)
        {
            case 0:
                vm.getPage();
                break;
            case 1:
                vm.getgoodsPage();
                break;
        }

    }





    vm.maxSize = 5; //最大页码
    vm.pageParams = {
        bean:'d2WWareHouse',
        method:'pageHome',
        page:1,
        rows:20
    }
    vm.getPage = function () {
        commonUtil.getList(vm.pageParams).success(function(data) {
            vm.pageCount = data.total;
            vm.dataList = data.rows;
        });
    };

    vm.goodsmaxSize = 5; //最大页码
    vm.goodspageParams = {
        bean:'d2WGoods',
        method:'pageHome',
        page:1,
        rows:20
    }
    vm.getgoodsPage = function () {
        commonUtil.getList(vm.goodspageParams).success(function(data) {
            vm.goodspageCount = data.total;
            vm.goodsdataList = data.rows;
        });
    };

    if(vm.type==0){
        vm.getPage();
    }else if(vm.type==1){
        vm.getgoodsPage();
    }

    vm.getPageByFilter = function(){
        console.log(multicitySelect.getSelect())
        var storageMin = $('input[name="storageMin"]').val();
        var storageMax = $('input[name="storageMax"]').val();
        var storeMent = $('.storeMent').val();
        if(status == " "){
            status ="";
        }
        if(storeMent == " "){
            storeMent ="";
        }

        vm.addServiceCheck = [];
        for(var i = 0 ; i < vm.addServiceList.length ; i++){
            if(vm.addServiceList[i].checkState == true){
                vm.addServiceCheck.push(vm.addServiceList[i].dataName)
            };
        }
        console.log(vm.addServiceCheck.join())

        vm.pageParams = {
            bean:'d2WWareHouse',
            method:'pageHome',
            page:1,
            rows:20,
            provinceId:multicitySelect.getSelect().proId,
            cityId:multicitySelect.getSelect().cityId,
            districtId:multicitySelect.getSelect().areaId,
            storageMin:storageMin,
            storageMax:storageMax,
            storeMent:storeMent,
            service:vm.addServiceCheck.join()
        }
        vm.getPage();
    }

    vm.serviceChange = function(state,name){
        vm.addServiceCheck = [];
        for(var i = 0 ; i < vm.addServiceList.length ; i++){
            if(vm.addServiceList[i].checkState == true){
                vm.addServiceCheck.push(vm.addServiceList[i].dataName)
            };
        }
        vm.pageParams.service = vm.addServiceCheck.join();
        vm.getPage();
    }

    vm.getGoodsPageByFilter = function(){
        var storageMin = $('input[name="goodsstorageMin"]').val();
        var storageMax = $('input[name="goodsstorageMax"]').val();
        var warehouseAreaType = $('.warehouseAreaType').val();
        if(warehouseAreaType == " "){
            warehouseAreaType ="";
        }

        vm.typeCheck = [];
        if(vm.cangchu==true){
            vm.typeCheck.push('0');
        }
        if(vm.huowu==true){
            vm.typeCheck.push('1');
        }

        vm.goodspageParams = {
            bean:'d2WGoods',
            method:'pageHome',
            page:1,
            rows:20,
            provinceId:multicitySelect.getSelect().proId,
            cityId:multicitySelect.getSelect().cityId,
            districtId:multicitySelect.getSelect().areaId,
            storageMin:storageMin,
            storageMax:storageMax,
            warehouseAreaType:warehouseAreaType,
            types:vm.typeCheck.join()
        }
        vm.getgoodsPage();
    }

    vm.cangchu = false;
    vm.huowu = false;

    vm.goodsChange = function(){
        vm.typeCheck = [];
        if(vm.cangchu==true){
            vm.typeCheck.push('0');
        }
        if(vm.huowu==true){
            vm.typeCheck.push('1');
        }
        vm.goodspageParams.types = vm.typeCheck.join();
        vm.getgoodsPage();
    }

    vm.toDetail = function(id){
        window.location.href='#/d2w/waresourceDetail?id=' + id;
    }

    vm.toGoodsDetail = function(id){
        window.location.href='#/d2w/d2wgoodsdetail?id=' + id;
    }

}])

    .controller('d2wsourcedetailController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','d2w','commonUtil','multicitySelect','$location', function($rootScope, $scope, $http, uiGridConstants,settings, d2w,commonUtil,multicitySelect,$location)  {

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

        d2w.warehouseDetail(vm).success(function(data) {
            if(data.additionalMsg.status==00){
                vm.detailData = data.detail;

            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                vm.entity.clearSelectedRows();
            }
        });
        vm.toWaresource = function(){
            window.location.href='#/d2w/waresource?type=0'
        }

        $scope.toOrder = function(){
            window.location.href='#/d2w/waresourceorder?id=' + vm.id;
        }

    }])