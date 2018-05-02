angular.module('MetronicApp').controller('GoodsEdit1Controller', function($stateParams, $scope, $timeout,Goods,FileUploader,commonUtil) {

    $scope.$on('$viewContentLoaded', function() {


    });

    var vm = this;
    var spuId = $stateParams.Id;
    Goods.getSpu(spuId,1).success(function (data) {
       var p = angular.copy(data.obj)
       vm.spuName = p.spuName;
       vm.cName = p.cName;
       vm.cId = p.cId
       vm.unit = p.unit;
       vm.keywords =[]
       for(key in p.keywordList){
           vm.keywords.push(p.keywordList[key].keyword)
       }
       vm.bn = p.bn;
       vm.barCode = p.barCode;
       vm.isSn = p.isSn;
       vm.spuImgs = p.spuImgs;
        Goods.getPSB(p.cId).success(function (data) {
            if(data.status == 00){
                vm.brandList = data.resultMap.brandList;
                vm.bId = p.bId;
            }
        })
    })

    Goods.getUnit().success(function (data) {
        vm.unitList = data.rows
        vm.unit = vm.unitList[0].dataValue
    })


    vm.addGoods = function () {

        if(vm.spuName == undefined || vm.spuName == ""){
            msgAlert.text('请填写商品名称');
            return
        }

        var info = {
            spuId:spuId,
            spuName:vm.spuName,
            bn:vm.bn,
            barCode:vm.barCode,
            bId:vm.bId,
            cId:vm.cId,
            unit:vm.unit,
            isSn:vm.isSn,
            keywords:vm.keywords.join(),
            spuImgs:vm.spuImgs,
        }


        Goods.updateGoods(0,info).success(function (data) {
            if(data.status == 00){
                window.history.back(-1)
            }else{
                msgAlert.text(data.msg);
            }
        })
    }



    $scope.showAddImg = function(type,index){
        $scope.addType = type
        $("#showAddImg").modal("show")

        $scope.addImg = function () {
            var uploadFile = function (client) {
                var file = document.getElementById('file').files[0];
                console.log(client);
                return client.multipartUpload("cloudchain/gms/goods/images/"+file.name+"", file).then(function (res) {
                    if($scope.addType == 1){
                        $scope.$apply(function () {
                            vm.spuImgs.push({img:res.url});
                        });
                    }else{
                        $scope.$apply(function () {
                            vm.sku[index].skuImgs[0].img = res.url
                        })
                    }

                    // vm.spuImgs.push({img:res.url})
                    console.log(vm.spuImgs)
                    console.log('upload success: %j', res);
                    console.log(vm.skuImgs)
                    vm.currentImg = vm.skuImgs
                    $("#showAddImg").modal("hide")
                });
            };console.log(1)
            applyTokenDo(uploadFile);
        }
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



})

