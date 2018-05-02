angular.module('MetronicApp').controller('chosewarehouseController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','d2w','commonUtil','$location', function($rootScope, $scope, $http, uiGridConstants,settings, d2w,commonUtil,$location) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;

    vm.id =  $location.search().id;
    vm.type =  $location.search().type;

    initial();

    function initial(){
        vm.dictTypeName ='优仓增值服务';
        d2w.getTypeList(vm).success(function(data) {
            vm.addServiceList = data.rows;
            for(var i = 0 ; i < vm.addServiceList.length ; i++){
                vm.addServiceList[i].checkState = false;
            }
            console.log(vm.addServiceList)
        });

        vm.dictTypeName ='计量单位';
        d2w.getTypeList(vm).success(function(data) {
            vm.unitList = data.rows;
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
        bean:'d2WGoods',
        method:'pageOfferHouses',
        page:1,
        rows:20,
        goodsId:vm.id
    }
    vm.getPage = function () {
        commonUtil.getList(vm.pageParams).success(function(data) {
            vm.pageCount = data.total;
            vm.dataList = data.rows;
        });
    };
    vm.getPage();

    vm.getPageByFilter = function(){
        var storageMin = $('input[name="storageMin"]').val();
        var storageMax = $('input[name="storageMax"]').val();
        var offerMin = $('input[name="offerMin"]').val();
        var offerMax = $('input[name="offerMax"]').val();
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
            bean:'d2WGoods',
            method:'pageOfferHouses',
            page:1,
            rows:20,
            goodsId:vm.id,
            priceMin:offerMin*100,
            priceMax:offerMax*100,
            storageMin:storageMin,
            storageMax:storageMax,
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

    vm.toSelectWare = function(data){
        vm.selectWareData = data;
        $('#selectWare').modal('show');
    }

    
    /*货物保管*/
    $scope.goodsSubmit = function(){
        
        vm.goodsBeginTime=$('.goodsBeginTime span').html();
        var start=new Date(vm.goodsBeginTime.replace("-", "/").replace("-", "/"));
        vm.goodsEndTime=$('.goodsEndTime span').html();
        var end=new Date(vm.goodsEndTime.replace("-", "/").replace("-", "/"));
        if(end<start){
             msgAlert.text('结束时间不能小于开始时间');
            return false;
        }
        vm.goodsprice = $('input[name="goodsprice"]').val();
        if(vm.goodsprice==''){
             msgAlert.text('请填写单价');
            return false;
        }
        var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
        if(!reg.test(vm.goodsprice)){
             msgAlert.text('单价精确到小数点后两位');
            return false;
        }

        vm.goodsRemarks = $('.goodsRemarks').val();

    }

    vm.confirmWare = function(){
        if(vm.type == 0){
            vm.wareCum = $('input[name="wareCum"]').val();
            if(vm.wareCum==''){
                msgAlert.text('请填写库容');
                return false;
            }
            vm.wareBeginTime=$('.wareBeginTime span').html();
            var start=new Date(vm.wareBeginTime.replace("-", "/").replace("-", "/"));
            vm.wareEndTime=$('.wareEndTime span').html();
            var end=new Date(vm.wareEndTime.replace("-", "/").replace("-", "/"));
            if(end<start){
                msgAlert.text('结束时间不能小于开始时间');
                return false;
            }
            vm.wareprice = $('input[name="wareprice"]').val();
            if(vm.wareprice==''){
                msgAlert.text('请填写单价');
                return false;
            }
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if(!reg.test(vm.wareprice)){
                msgAlert.text('单价精确到小数点后两位');
                return false;
            }
            var startTime = new Date(Date.parse(start)).getTime();
            var endTime = new Date(Date.parse(end)).getTime();
            var dates = Math.abs((endTime - startTime))/(1000*60*60*24);
            vm.totalMoney = (dates+1)*vm.wareprice;
            vm.wareRemarks = $('.wareRemarks').val();

            vm.wareParams = {
                offerId:vm.selectWareData.offerId,
                goodsId:vm.id,
                orderType:0,
                customerId:vm.selectWareData.userId,
                dwWarehouseId:vm.selectWareData.id,
                count:vm.wareCum,
                unit:$('.wareGoodsUnit').val(),
                price:vm.wareprice*100,
                totalPrice:vm.totalMoney*100,
                startTime:vm.wareBeginTime,
                endTime:vm.wareEndTime,
                warehouseAreaType:vm.selectWareData.warehouseAreaType,
                provinceId:vm.selectWareData.provinceId,
                provinceName:vm.selectWareData.provinceName,
                cityId:vm.selectWareData.cityId,
                cityName:vm.selectWareData.cityName,
                districtId:vm.selectWareData.districtId,
                districtName:vm.selectWareData.districtName,
                address:vm.selectWareData.address,
                remark:vm.wareRemarks,
                goodsModels:[]
            }
            d2w.chooseOrder(vm.wareParams).success(function(data) {
                if(data.status==00){
                    msgAlert.text('成功');
                    window.location.href = "#/d2w/goodsource"
                }else{
                    $('#selectWare').modal('hide');
                   msgAlert.text(data.msg);
                   return false;
                }
            });
        }else if(vm.type == 1){
            vm.goodsBeginTime=$('.goodsBeginTime span').html();
            var start=new Date(vm.goodsBeginTime.replace("-", "/").replace("-", "/"));
            vm.goodsEndTime=$('.goodsEndTime span').html();
            var end=new Date(vm.goodsEndTime.replace("-", "/").replace("-", "/"));
            if(end<start){
                msgAlert.text('结束时间不能小于开始时间');
                return false;
            }
            vm.goodsprice = $('input[name="goodsprice"]').val();
            if(vm.goodsprice==''){
                msgAlert.text('请填写单价');
                return false;
            }
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if(!reg.test(vm.goodsprice)){
                msgAlert.text('单价精确到小数点后两位');
                return false;
            }
            vm.goodsRemarks = $('.goodsRemarks').val();

            vm.goodsParams = {
                offerId:vm.selectWareData.offerId,
                goodsId:vm.id,
                orderType:1,
                customerId:vm.selectWareData.userId,
                dwWarehouseId:vm.selectWareData.id,
                count:'',
                unit:'',
                price:vm.goodsprice*100,
                totalPrice:'',
                startTime:vm.goodsBeginTime,
                endTime:vm.goodsEndTime,
                warehouseAreaType:vm.selectWareData.warehouseAreaType,
                provinceId:vm.selectWareData.provinceId,
                provinceName:vm.selectWareData.provinceName,
                cityId:vm.selectWareData.cityId,
                cityName:vm.selectWareData.cityName,
                districtId:vm.selectWareData.districtId,
                districtName:vm.selectWareData.districtName,
                address:vm.selectWareData.address,
                remark:vm.goodsRemarks,
                goodsModels:[]
            }
            d2w.chooseOrder(vm.goodsParams).success(function(data) {
                if(data.status==00){
                    msgAlert.text('成功');
                    window.location.href="#/d2w/goodsource"
                }else{
                    $('#selectWare').modal('hide');
                     msgAlert.text(data.msg);
                     return false;
                }
            });
        }
    }


}])