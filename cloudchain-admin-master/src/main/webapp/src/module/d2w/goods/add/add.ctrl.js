angular.module('MetronicApp').controller('addgoodsourceController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','d2w','commonUtil','citySelect', function($rootScope, $scope, $http, uiGridConstants,settings, d2w,commonUtil,citySelect) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;

    vm.serviceType = 0;
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

    initial();

    function initial(){
        vm.dictTypeName ='仓库类型';
        d2w.getTypeList(vm).success(function(data) {
            vm.wtypeList = data.rows;
        });
        vm.dictTypeName ='计量单位';
        d2w.getTypeList(vm).success(function(data) {
            vm.unitList = data.rows;
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
                    console.log(vm.goodsList)
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
        console.log(vm.goodsList)
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
            console.log(file.name);
            return client.multipartUpload("cloudchain/gms/goods/images/"+file.name+"", file).then(function (res) {
                $scope.$apply(function () {
                    vm.goodsList[vm.goodindex].newImgUrl.push({
                        img:res.url,
                    });
                    console.log(vm.goodsList)
                });
                $("#showAddImg").modal("hide")

            });
        };
        applyTokenDo(uploadFile);
    }

    vm.unitChange = function(unit){
        console.log(unit)
        for(var i = 0 ; i < vm.goodsList.length ; i++){
            vm.goodsList[i].unit = unit;
        }
        console.log(vm.goodsList)
    }

    vm.submitSource = function(){
        console.info(vm.goodsList)
        vm.title = $('input[name="title"]').val();
        if(vm.title==''){
            msgAlert.text('请填写标题');
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

        vm.humidityRange = vm.humidityRangeStart + '-' + vm.humidityRangeEnd;

        vm.storageSqm = $('input[name="storageSqm"]').val();
        if(vm.storageSqm==""){
            msgAlert.text('请填写所需库容');
            return false;
        }

        vm.proName = $('.provideAddress').find('.selectPro :selected').html();
        vm.cityName = $('.provideAddress').find('.selectCity :selected').html();
        vm.countyName = $('.provideAddress').find('.selectArea :selected').html();
        vm.warehouseAreaType = $('input[name="areaType"]:checked').val();
        vm.wannaPrice = $('input[name="wannaPrice"]').val();
        vm.rukuTime = $('.rukuTime span').html();
        vm.remarks = $('.remarks').val();
        if(vm.warehouseAreaType == undefined){
            msgAlert.text('请选择库区类型');
            return false;
        }

        var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
        if(!reg.test(vm.wannaPrice)){
            msgAlert.text('意向价格精确到小数点后两位');
            return false;
        }
        if(vm.wannaPrice == ''){
            msgAlert.text('请填写意向价格');
            return false;
        }

        if(vm.serviceType == 0){
            vm.wareParams = {
                type:vm.serviceType,
                title:vm.title ,
                provinceId:citySelect.getSelect().proId,
                provinceName:vm.proName,
                cityId:citySelect.getSelect().cityId,
                cityName:vm.cityName,
                districtId:citySelect.getSelect().areaId,
                districtName:vm.countyName,
                warehouseAreaType:vm.warehouseAreaType,
                temperatureRange:vm.temperatureRange,
                humidityRange:vm.humidityRange,
                storageSqm:vm.storageSqm,
                storageTime:vm.rukuTime,
                intentPrice:vm.wannaPrice*100,
                remark:vm.remarks,
                unit:$('select[name="wannaUnit"]').val(),
                models:[]
            }
            d2w.saveGoods(vm.wareParams).success(function(data) {
                if(data.status==00){
                    msgAlert.text('发布成功')
                    window.location.href = "#/d2w/goodsource"
                }else{
                    msgAlert.text(data.msg);
                    return false;
                }
            });
        }else if(vm.serviceType == 1){
            for(var i = 0 ; i < vm.goodsList.length ; i++){
                if(vm.goodsList[i].goodsName=='' || vm.goodsList[i].goodsType ==''){
                    msgAlert.text('请先选择商品');
                    return false;
                }
                if(vm.goodsList[i].count==''){
                    msgAlert.text('请填写入库数量');
                    return false;
                }
                vm.goodsList[i].imgUrl =[];
                for(var j = 0 ; j < vm.goodsList[i].newImgUrl.length ; j++){
                    vm.goodsList[i].imgUrl.push(vm.goodsList[i].newImgUrl[j].img)
                }
            }
            for(var n = 0 ; n < vm.goodsList.length ; n++){
                vm.goodsList[n].imgUrl=vm.goodsList[n].imgUrl.join();
            }

            vm.wareParams = {
                type:vm.serviceType,
                title:vm.title ,
                provinceId:citySelect.getSelect().proId,
                provinceName:vm.proName,
                cityId:citySelect.getSelect().cityId,
                cityName:vm.cityName,
                districtId:citySelect.getSelect().areaId,
                districtName:vm.countyName,
                warehouseAreaType:vm.warehouseAreaType,
                temperatureRange:vm.temperatureRange,
                humidityRange:vm.humidityRange,
                storageSqm:vm.storageSqm,
                storageTime:vm.rukuTime,
                intentPrice:vm.wannaPrice*100,
                remark:vm.remarks,
                unit:vm.goodsList[0].unit,
                models:vm.goodsList
            }
            d2w.saveGoods(vm.wareParams).success(function(data) {
                if(data.status==00){
                    msgAlert.text('发布成功')
                    window.location.href = "#/d2w/goodsource"
                }else{
                    msgAlert.text(data.msg);
                    return false;
                }
            });
        }
    }

    vm.togoods = function(){
        window.location.href="#/d2w/goodsource";
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