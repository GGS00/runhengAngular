//新建运单
angular.module('MetronicApp').controller('addwsourceController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','order','commonUtil','citySelect', 'd2w', function($rootScope, $scope, $http, uiGridConstants,settings, order,commonUtil,citySelect,d2w) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    vm.invoicex = 3;
    vm.sendWarehouse = 1;
    vm.goodsList = [];

    vm.pageWarehouseParams = {
        bean:'wmsWarehouseArea',
        method:'page',
        page:1,
        rows:10,
        status:'ACTIVE',
        usageMode:"01"
    }

    vm.column = [
        {   field: "id",
            displayName: '库区编码',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "name",
            displayName: '库区名称',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "wareHouseName",
            displayName: '仓库名称',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "provinceName",
            displayName: '仓库地址',
            enableCellEdit: true,
            width:400,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.provinceName}}{{row.entity.cityName}}{{row.entity.districtName}}{{row.entity.address}}</div>'
        },
        {  field: "areaType",
            displayName: '库区类型',
            enableCellEdit: true,
            width:120,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.areaType==01?"普通":(row.entity.areaType==02?"冷藏":(row.entity.areaType==03?"恆溫":(row.entity.areaType==04?"特种":(row.entity.areaType==05?"气调":""))))}}</div>'
        }
    ]

    var storage = window.localStorage;
    vm.imgs=[];

    initial();
    function initial(){
        // vm.addedServiceList = JSON.parse(vm.wsourceSelect[0].addedService);
        vm.dictTypeName ='仓库类型';
        d2w.getTypeList(vm).success(function(data) {
            vm.wtypeList = data.rows;
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
        });
    }

    vm.getWarehouse = function () {
        commonUtil.getList(vm.pageWarehouseParams).success(function(data) {
            vm.data = data;
        });
    };

    vm.addWarehouse = function(){
        vm.getWarehouse();
        $('#selectWarehouse').modal('show');
    }

    vm.confirmWarehouse = function(){
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择库区');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.text('只能选择一个库区');
            return false;

        }else{
            vm.houseInfo = vm.entity.getSelectedRows()[0];
            vm.entity.clearSelectedRows();
            $('#selectWarehouse').modal('hide');

            vm.goods="全部分类";

            if (vm.houseInfo.cateLst != undefined)
            {
                vm.goods="";
                angular.forEach(vm.houseInfo.cateLst, function(data){
                    vm.goods+=data.name + "/";
                });
                vm.goods=vm.goods.substring(0, vm.goods.length-1);
            }
            vm.serviceRequest=0;

            vm.chargeRule=1;
            vm.unit=0;
            vm.unit1=2;
            vm.chargeRule1=1;
            vm.type="100001";

            $('#houseInfo').show();
            $('#orderInfo').show();
        }
    }

    vm.currentImg =  {img: "http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=no+image"};
    $scope.showAddImg = function(){
        if(vm.imgs.length== 5){
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
                    vm.imgs.push({
                        createdTime:null,
                        dwWarehouseId:null,
                        img:res.url,
                        imgId:null
                    });
                });
                $("#showAddImg").modal("hide")

            });
        };
        applyTokenDo(uploadFile);
    }

    vm.removeImg = function(index){
        vm.imgs.splice(index,1)
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

    vm.submit = function() {
        if(vm.houseInfo == undefined)
        {
            msgAlert.info('请先选择库区');
            return false;
        }

        vm.serviceList = [];
        for(var i = 0 ; i < vm.addServiceList.length ; i++){
            vm.serviceList.push({
                name:vm.addServiceList[i].dataName,
                value:vm.addServiceList[i].dataValue,
                state:vm.addServiceList[i].checkState
            })
        }

        vm.warehouseName = $('input[name="warehouseName"]').val();

        vm.storageSqm = $('input[name="storageSqm"]').val();
        if(vm.storageSqm==""){
            msgAlert.text('请填写可用库容');
            return false;
        }

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

        vm.remark = $("#remark").val();

        vm.imgList = [];

        for(var n = 0 ; n <  vm.imgs.length ; n++){
            vm.imgList.push({
                img:vm.imgs[n].img
            })
        }

        if(vm.serviceRequest == 0)
        {
            vm.wareprice = $('input[name="wareprice"]').val();
            if(vm.wareprice==''){
                msgAlert.info('请填写单价');
                return false;
            }
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if(!reg.test(vm.wareprice)){
                msgAlert.info('单价精确到小数点后两位');
                return false;
            }

            vm.wareParams = {
                imgList:vm.imgList,
                warehouseId:vm.houseInfo.wareHouseId,
                warehouseName:vm.houseInfo.wareHouseName,
                title:vm.warehouseName,
                provinceId:vm.houseInfo.provinceId,
                provinceName:vm.houseInfo.provinceName,
                cityId:vm.houseInfo.cityId,
                cityName:vm.houseInfo.cityName,
                districtId:vm.houseInfo.districtId,
                districtName:vm.houseInfo.districtName,
                address:vm.houseInfo.address,
                warehouseAreaId:vm.houseInfo.id,
                warehouseAreaName:vm.houseInfo.name,
                warehouseAreaType:vm.houseInfo.areaType,
                warehouseAreaStore:vm.goods,
                storeMent:vm.houseInfo.storeMent,
                description:vm.remark,
                temperatureRange:vm.temperatureRange,
                humidityRange:vm.humidityRange,
                storageSqm:vm.storageSqm,
                rentPrice:vm.wareprice*100,
                keepPrice:-1,
                unit:vm.unit1,
                keepUnit:'',
                chargingRule:vm.chargeRule1,
                cycle:vm.cycle
            }
        }
        else
        {
            vm.wareprice = $('input[name="wareprice"]').val();
            if(vm.wareprice==''){
                msgAlert.info('请填写单价');
                return false;
            }
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if(!reg.test(vm.wareprice)){
                msgAlert.info('单价精确到小数点后两位');
                return false;
            }

            vm.wareParams = {
                imgList:vm.imgList,
                warehouseId:vm.houseInfo.wareHouseId,
                warehouseName:vm.houseInfo.wareHouseName,
                title:vm.warehouseName,
                provinceId:vm.houseInfo.provinceId,
                provinceName:vm.houseInfo.provinceName,
                cityId:vm.houseInfo.cityId,
                cityName:vm.houseInfo.cityName,
                districtId:vm.houseInfo.districtId,
                districtName:vm.houseInfo.districtName,
                address:vm.houseInfo.address,
                warehouseAreaId:vm.houseInfo.id,
                warehouseAreaName:vm.houseInfo.name,
                warehouseAreaType:vm.houseInfo.areaType,
                warehouseAreaStore:vm.goods,
                storeMent:vm.houseInfo.storeMent,
                description:vm.remark,
                temperatureRange:vm.temperatureRange,
                humidityRange:vm.humidityRange,
                storageSqm:vm.storageSqm,
                rentPrice:-1,
                keepPrice:vm.wareprice*100,
                unit:'',
                keepUnit:vm.unit,
                chargingRule:vm.chargeRule,
                cycle:vm.cycle
            }
        }

        d2w.publish(vm.wareParams).success(function(data) {
            if(data.status==00){
                msgAlert.success('成功')
                window.location.href = "#/d2w/wsource"
            }else{
                msgAlert.info(data.msg);
            }
        });
    }

    vm.cancel = function(){
        window.location.href="#/d2w/wsource";
    }

}])



