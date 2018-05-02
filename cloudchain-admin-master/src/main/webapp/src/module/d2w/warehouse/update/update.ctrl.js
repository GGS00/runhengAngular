angular.module('MetronicApp').controller('updatewsourceController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','d2w','commonUtil','citySelect', function($rootScope, $scope, $http, uiGridConstants,settings, d2w,commonUtil,citySelect) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    var storage = window.localStorage;
    vm.wsourceSelect = JSON.parse(storage["wsourceSelect"]);
    console.log(vm.wsourceSelect)
    if(vm.wsourceSelect[0].rentPrice==0){
        vm.rentPriceState = true;
    }else{
        vm.rentPriceState = false;
    }

    if(vm.wsourceSelect[0].keepPrice==0){
        vm.keepPriceState = true;
    }else{
        vm.keepPriceState = false;
    }

    initial();

    function initial(){
        vm.addedServiceList = JSON.parse(vm.wsourceSelect[0].addedService);
        console.log(vm.addedServiceList)
        vm.dictTypeName ='仓库类型';
        d2w.getTypeList(vm).success(function(data) {
            vm.wtypeList = data.rows;
        });
        vm.dictTypeName ='计量单位';
        d2w.getTypeList(vm).success(function(data) {
            vm.unitList = data.rows;
        });
        vm.dictTypeName ='优仓增值服务';
        d2w.getTypeList(vm).success(function(data) {
            vm.addServiceList = data.rows;
            for(var i = 0 ; i < vm.addServiceList.length ; i++){
                for(var j = 0 ; j < vm.addedServiceList.length ; j++){
                    if(vm.addServiceList[i].dataValue == vm.addedServiceList[j].value){
                        vm.addServiceList[i].checkState = vm.addedServiceList[j].state;
                    }
                }
            }
            console.log(vm.addServiceList)
        });

    }


    vm.submit = function(){
            if(vm.wsourceSelect[0].imgs.lenth < 1){
                msgAlert.text('至少添加一张仓库图片');
                return false;
            }
            vm.warehouseName = $('input[name="warehouseName"]').val();
            if(vm.warehouseName==""){
                msgAlert.text('请填写仓库名称');
                return false;
            }
            if(vm.wsourceSelect[0].type == null){
                msgAlert.text('请选择仓库类型');
                return false;
            }

            vm.typeName = $("input[name='type']:checked").attr('dataname');

            vm.temperatureRangeStart = $('input[name="temperatureRangeStart"]').val();
            vm.temperatureRangeEnd = $('input[name="temperatureRangeEnd"]').val();

            if(vm.temperatureRangeStart=="" || vm.temperatureRangeEnd ==""){
                msgAlert.text('请输入温度范围');
                return false;
            }
            vm.temperatureRange = vm.temperatureRangeStart + '-' + vm.temperatureRangeEnd;

            vm.humidityRangeStart = $('input[name="humidityRangeStart"]').val();
            vm.humidityRangeEnd = $('input[name="humidityRangeEnd"]').val();

            if(vm.humidityRangeStart=="" || vm.humidityRangeEnd ==""){
                msgAlert.text('请输入湿度范围');
                return false;
            }

            vm.humidityRange = vm.humidityRangeStart + '-' + vm.humidityRangeEnd;

            vm.storageSqm = $('input[name="storageSqm"]').val();
            vm.storageCum = $('input[name="storageCum"]').val();
            if(vm.storageSqm=="" || vm.storageCum ==""){
                msgAlert.text('请填写可用库容');
                return false;
            }
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            vm.rentPrice = $('input[name="rentPrice"]').val();
            if(vm.rentPriceState==false){
                if(vm.rentPrice==""){
                    msgAlert.text('租赁价格为空或格式错误');
                    return false;
                }else{
                    if(!reg.test(vm.rentPrice)){
                        msgAlert.text('租赁价格精确到小数点后两位');
                        return false;
                    }
                }
            }else{
                vm.rentPrice = 0;
            }

            vm.keepPrice = $('input[name="keepPrice"]').val();
            if(vm.keepPriceState==false){
                if(vm.keepPrice==""){
                    msgAlert.text('请填写保管价格');
                    return false;
                }else{
                    if(!reg.test(vm.keepPrice)){
                        msgAlert.text('保管价格精确到小数点后两位');
                        return false;
                    }
                }
            }else{
                vm.keepPrice = 0;
            }
            vm.goodsUnit = $('select[name="goodsUnit"]').val();


            vm.serviceList = [];
            for(var i = 0 ; i < vm.addServiceList.length ; i++){
                vm.serviceList.push({
                    name:vm.addServiceList[i].dataName,
                    value:vm.addServiceList[i].dataValue,
                    state:vm.addServiceList[i].checkState
                })
            }

            vm.imgList = [];
            console.log(JSON.stringify(vm.serviceList).length)

            for(var n = 0 ; n <  vm.wsourceSelect[0].imgs.length ; n++){
                vm.imgList.push({
                    img:vm.wsourceSelect[0].imgs[n].img
                })
            }

            d2w.d2wWarehouseUpdate(vm).success(function(data) {
                if(data.status==00){
                    msgAlert.text('修改成功');
                    window.location.href="#/d2w/wsource";
                }else{
                    msgAlert.text('修改失败 >﹏< ['+ data.msg+']');
                }
            });

        }


        vm.removeImg = function(index){
            vm.wsourceSelect[0].imgs.splice(index,1)
        }

    vm.currentImg =  {img: "http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=no+image"};
    $scope.showAddImg = function(){
        if(vm.wsourceSelect[0].imgs.length== 5){
            msgAlert.text('最多添加五张图片');
            return false;
        }else{
            $("#showAddImg").modal("show")
        }
    }

    $scope.addImg = function () {
        var uploadFile = function (client) {
            var file = document.getElementById('file').files[0];
            console.log(file.name);
            return client.multipartUpload("cloudchain/gms/goods/images/"+file.name+"", file).then(function (res) {
                $scope.$apply(function () {
                    /*vm.spuImgs.push({img:res.url});
                    vm.skuImgs  = {img:res.url};
                    vm.currentImg = vm.skuImgs;*/
                    vm.wsourceSelect[0].imgs.push({
                        createdTime:null,
                        dwWarehouseId:null,
                        img:res.url,
                        imgId:null
                    });
                });
                console.log(vm.wsourceSelect)
                $("#showAddImg").modal("hide")

            });
        };
        applyTokenDo(uploadFile);
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

    vm.tod2w = function(){
        window.location.href="#/d2w/wsource";
    }

}])