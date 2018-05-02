angular.module('MetronicApp').controller('d2wsourceorderController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','d2w','commonUtil','$location', function($rootScope, $scope, $http, uiGridConstants,settings, d2w,commonUtil,$location) {
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

    vm.goodsList = [
        {
            count:'',
            unit:'个',
            goodsType:'',
            goodsName:'',
            imgUrl:[],
            newImgUrl:[]
        }
    ]
    isloginCheck();
    initial();
    function initial(){
        vm.dictTypeName ='计量单位';
        d2w.getTypeList(vm).success(function(data) {
            vm.unitList = data.rows;
        });

        d2w.toAddOrder(vm).success(function(data) {
            if(data.status==00){
                vm.orderData = data.obj;
                vm.userId = data.obj.userId;
                vm.warehouseAreaType = data.obj.warehouseAreaType;
                vm.dwWarehouseId =data.obj.id;
                vm.provinceId=data.obj.provinceId;
                vm.provinceName=data.obj.provinceName;
                vm.cityId=data.obj.cityId;
                vm.cityName=data.obj.cityName;
                vm.districtId=data.obj.districtId;
                vm.districtName=data.obj.districtName;
                vm.address= data.obj.address;
                vm.chargeRule=data.obj.chargingRule;
                if(vm.orderData.require.split('')[0]==1){
                    vm.serviceRequest = 0;
                    vm.unit=data.obj.unit;
                    vm.price=data.obj.rentPrice;

                }else{
                    vm.serviceRequest = 1;
                    vm.unit=data.obj.keepUnit;
                    vm.price=data.obj.keepPrice;
                }
            }else{
                window.location.href='#/d2w/waresourceDetail?id=' + vm.id;
                msgAlert.text('获取失败 >﹏< ['+ data.msg+']');
            }
        });

    }

    vm.pageParams = {
        bean:'goods',
        method:'page',
        page:1,
        rows:10,
        showType:'sku'
    }
    vm.column= [
        {  field: "spuId",
            displayName: '商品编码',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {   field: "title",
            displayName: '货品名',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        }
    ]

    vm.getPage = function () {
        commonUtil.getList(vm.pageParams).success(function(data) {
            vm.data = data;
        });
    };
    vm.getPage();


    vm.addNewGoods = function(goodIndex){
        vm.goodIndex = goodIndex;
        $('#selectGoods').modal('show');
    };

    vm.confirmGoods = function(){

        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择商品');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能选择一种商品');
            return false;

        }else{
                vm.goodsType = vm.entity.getSelectedRows()[0].categoryName;
                vm.goodsName =vm.entity.getSelectedRows()[0].spuName;
                vm.goodsList[vm.goodIndex].goodsType = vm.entity.getSelectedRows()[0].categoryName;
                vm.goodsList[vm.goodIndex].goodsName = vm.entity.getSelectedRows()[0].spuName;
                d2w.getGoodsImgs(vm).success(function(data) {
                    if(data.status==00){
                        if(data.data.length == 0){
                            vm.goodsList[vm.goodIndex].newImgUrl = [];
                        }else{
                            vm.goodsList[vm.goodIndex].newImgUrl = data.data;
                        }
                    }
                });
            vm.entity.clearSelectedRows();
            $('#selectGoods').modal('hide');

        }

    }

    vm.addGoods = function(){
        vm.goodsList.push({
            count:'',
            unit:'个',
            goodsType:'',
            goodsName:'',
            imgUrl:[],
            newImgUrl:[]
        });
    }

    vm.removeGood = function(index){
        vm.goodsList.splice(index,1)
    }

    vm.removeImg = function(goodindex,imgindex){
        vm.goodsList[goodindex].newImgUrl.splice(imgindex,1);
    }

    vm.currentImg =  {img: "http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=no+image"};
    $scope.showAddImg = function(goodindex){
        vm.goodindex = goodindex;
        if(vm.goodsList[vm.goodindex].newImgUrl.length == 5){
            msgAlert.text('最多添加五张图片');
            return false;
        }else{
            $("#showAddImg").modal("show")
        }
    }

    $scope.addImg = function () {
        var uploadFile = function (client) {
            var file = document.getElementById('file').files[0];
            return client.multipartUpload("cloudchain/gms/goods/images/"+file.name+"", file).then(function (res) {
                $scope.$apply(function () {
                    vm.goodsList[vm.goodindex].newImgUrl.push({
                        img:res.url,
                    });
                });
                $("#showAddImg").modal("hide")

            });
        };
        applyTokenDo(uploadFile);
    }


    /*仓储租赁*/
    $scope.wareSubmit = function(){
        vm.wareCum = $('input[name="wareCum"]').val();
        if(vm.wareCum==''){
            $('.goodstips').html('请填写库容');
            $('.goodstips').show();
            setTimeout(function(){$('.goodstips').hide();},1000);
            return false;
        }

        vm.goodsBeginTime=$('.goodsBeginTime span').html();
        var start=new Date(vm.goodsBeginTime.replace("-", "/").replace("-", "/"));
        vm.goodsEndTime=$('.goodsEndTime span').html();
        var end=new Date(vm.goodsEndTime.replace("-", "/").replace("-", "/"));
        if(end<start){
            $('.goodstips').html('结束时间不能小于开始时间');
            $('.goodstips').show();
            setTimeout(function(){$('.goodstips').hide();},1000);
            return false;
        }
        var startTime = new Date(Date.parse(start)).getTime();
        var endTime = new Date(Date.parse(end)).getTime();

        var dates = Math.abs((endTime - startTime))/(1000*60*60*24);
        // vm.totalMoney = (dates+1)*vm.wareprice;
        vm.remark = $('.goodsRemarks').val();
        $("#confirmSubmit").modal("show")
    }

    /*货物保管*/
    $scope.goodsSubmit = function(){
        vm.wareBeginTime=$('.wareBeginTime span').html();
        var start=new Date(vm.wareBeginTime.replace("-", "/").replace("-", "/"));
        vm.wareEndTime=$('.wareEndTime span').html();
        var end=new Date(vm.wareEndTime.replace("-", "/").replace("-", "/"));
        if(end<start){
            $('.waretips').html('结束时间不能小于开始时间');
            $('.waretips').show();
            setTimeout(function(){$('.waretips').hide();},1000);
            return false;
        }

        var startTime = new Date(Date.parse(start)).getTime();
        var endTime = new Date(Date.parse(end)).getTime();
        vm.remark = $('.wareRemarks').val();
        $("#confirmSubmit").modal("show")
    }

    vm.confirmSubmit = function(){
        if(vm.serviceRequest == 0){
            vm.wareParams = {
                orderType:0,
                userId:vm.userId,
                dwWarehouseId:vm.dwWarehouseId,
                unit:vm.unit,
                price:vm.price,
                count:vm.wareCum,
                startTime:vm.goodsBeginTime,
                endTime:vm.goodsEndTime,
                warehouseAreaType:vm.warehouseAreaType,
                provinceId:vm.provinceId,
                provinceName:vm.provinceName,
                cityId:vm.cityId,
                cityName:vm.cityName,
                districtId:vm.districtId,
                districtName:vm.districtName,
                address:vm.address,
                remark:vm.remark,
                goodsModels:[],
                chargingRule:vm.chargeRule,
                cycle:1
            }
            $("#confirmSubmit").modal("hide");
            d2w.addOrder(vm.wareParams).success(function(data) {
                if(data.status==00){
                    msgAlert.success('成功')
                    window.location.href = "#/d2w/waresource?type=0"
                }else{
                    $('.waretips').html(data.msg);
                    $('.waretips').show();
                    setTimeout(function(){$('.waretips').hide();},2000);
                }
            });
        }else if(vm.serviceRequest == 1){
            vm.wareParams = {
                orderType:1,
                userId:vm.userId,
                dwWarehouseId:vm.dwWarehouseId,
                unit:vm.unit,
                price:vm.price,
                totalPrice:0,
                startTime:vm.wareBeginTime,
                endTime:vm.wareEndTime,
                warehouseAreaType:vm.warehouseAreaType,
                provinceId:vm.provinceId,
                provinceName:vm.provinceName,
                cityId:vm.cityId,
                cityName:vm.cityName,
                districtId:vm.districtId,
                districtName:vm.districtName,
                address:vm.address,
                remark:vm.remark,
                goodsModels:[],
                chargingRule:vm.chargeRule,
                cycle:1
            }
            $("#confirmSubmit").modal("hide");
            d2w.addOrder(vm.wareParams).success(function(data) {
                if(data.status==00){
                    msgAlert.success('成功')
                    window.location.href = "#/d2w/waresource?type=0"
                }else{
                    $('.goodstips').html(data.msg);
                    $('.goodstips').show();
                    setTimeout(function(){$('.goodstips').hide();},2000);
                }
            });
        }
    }



    function getTotalMoney(startDate,endDate,money)
    {
        var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();
        var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();
        var dates = Math.abs((startTime - endTime))/(1000*60*60*24);
    }


    $scope.orderSubmit = function(){
        console.log(vm.goodsList)
    }

    //OSS上传配置
    var appServer = 'http://app.chaimi.net:3000';
    var bucket = 'cloudchain';
    var region = 'oss-cn-hangzhou';

    var urllib = OSS.urllib;
    var Buffer = OSS.Buffer;
    var Wrapper = OSS.Wrapper;
    var STS = OSS.STS;

    var applyTokenDo = function (func) {
        var url = appServer;
        return urllib.request(url, {
            method: 'GET'
        }).then(function (result) {
            var creds = JSON.parse(result.data);
            var client = new Wrapper({
                region: "oss-cn-hangzhou",
                accessKeyId:   creds.AccessKeyId,
                accessKeySecret: creds.AccessKeySecret,
                stsToken: creds.SecurityToken,
                bucket: bucket
            });
            return func(client);
        });
    };
}])