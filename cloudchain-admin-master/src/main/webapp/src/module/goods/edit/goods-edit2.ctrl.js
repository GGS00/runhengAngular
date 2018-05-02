angular.module('MetronicApp').controller('GoodsEdit2Controller', function($stateParams, $scope, $timeout,Goods,FileUploader,commonUtil) {

    $scope.$on('$viewContentLoaded', function() {


    });

    var vm = this;
    var spuId = $stateParams.Id;
    Goods.getSpu(spuId,2).success(function (data) {
        var p = angular.copy(data.obj)
        vm.skuOld = angular.copy(data.obj.skus)
        vm.isRelate = p.isRelate;
        vm.isShareInv = p.isShareInv;
        var channel = p.channel.split('');
        $scope.checkbox =  parseInt(channel[0])
        $scope.checkbox1 = parseInt(channel[1])
        $scope.checkbox2 = parseInt(channel[2])
        $scope.checkbox3 = parseInt(channel[3])
        vm.sku = p.skus
        for(var key in vm.sku){
            vm.sku[key].price = vm.sku[key].price/100
        }
        var specValIds = p.specValIds.split(',')
        Goods.getPSB(p.cId).success(function (data) {
            if(data.status == 00){
                vm.specList = data.resultMap.specList
                vm.head = []
                for(var a in vm.specList){
                    var cont = 0;
                    // vm.specList[a].specVals[0].checked = true;
                    for(var b in vm.specList[a].specVals){
                        for(var c in specValIds){
                            if(specValIds[c] == vm.specList[a].specVals[b].specValId){
                                vm.specList[a].specVals[b].checked = true;
                                vm.specList[a].specVals[b].disable = true;
                            }
                        }
                        if(vm.specList[a].specVals[b].checked){
                            cont ++;
                        }
                    }
                    if(cont != 0){
                        vm.head.push(vm.specList[a].name)
                    }
                }
                if(vm.head.length == 0){
                    vm.headOld = angular.copy(vm.head)
                }
                 vm.checkSpec()
            }
        })
    })

    vm.oldKey = [];

    vm.checkSpec =function (valId) {
        vm.specRow = []
        vm.head = []
        vm.updateSku = []
        vm.newSku = []
        for(key in vm.specList){
            var cont = 0;
            for(a in vm.specList[key].specVals){
                if(vm.specList[key].specVals[a].checked){
                    cont ++;
                }
            }
            console.log(cont)
            if(cont != 0){
                vm.specRow[key] = []
                vm.head.push(vm.specList[key].name)
            }
            for(key2 in vm.specList[key].specVals){
                if(vm.specList[key].specVals[key2].checked){
                    vm.specRow[key].push(vm.specList[key].specVals[key2])
                }
            }
        }
        vm.specRow = vm.specRow.filter(function (val) {
            return val
        })
        $scope.new4D = ND(vm.specRow)
        console.log($scope.new4D,112)
        vm.sku = [];
        for(key in $scope.new4D){
            var model = [];
            if (vm.head.length !=1){
                for(key2 in $scope.new4D[key]){
                    model[key2] = {
                        specVal:$scope.new4D[key][key2].specVal,
                        specId:$scope.new4D[key][key2].specId,
                        specValId:$scope.new4D[key][key2].specValId,
                        specName:vm.specList[key2].name
                    }
                }
            } else {
                model[0] = {
                    specVal:$scope.new4D[key].specVal,
                    specId:$scope.new4D[key].specId,
                    specValId:$scope.new4D[key].specValId,
                    specName:vm.specList[0].name
                }
            }

            vm.sku[key] = {
                title:"",
                bn:"",
                cost:null,
                price:null,
                weight:"",
                volume:"",
                skuBarcode:"",
                skuImgs:[{img:''}],
                skuSpecValModels:model
            }


            for(var a in vm.skuOld){
                var cont = 0;
                for(var b in vm.skuOld[a].skuSpecValModels){
                    for(var c in model){
                        if(vm.skuOld[a].skuSpecValModels[b].specValId == model[c].specValId ){
                            cont ++;
                            console.log(vm.skuOld[a].skuSpecValModels[b].specValId,model[c].specValId,cont)
                        }
                    }
                }
                console.log(vm.skuOld[a].skuSpecValModels.length , cont)
                if(vm.skuOld[a].skuSpecValModels.length == cont){
                    var num = 0
                    for(var x in vm.updateSku){
                        if(vm.updateSku[x].skuId == vm.skuOld[a].skuId){
                            num ++
                        }
                    }
                    if(num == 0){
                        vm.sku[key].skuId = vm.skuOld[a].skuId
                        vm.sku[key].price = vm.skuOld[a].price/100
                        vm.sku[key].weight = vm.skuOld[a].weight
                        vm.sku[key].volume = vm.skuOld[a].volume
                        vm.sku[key].bn = vm.skuOld[a].bn
                        vm.sku[key].quantity = vm.skuOld[a].quantity
                        vm.sku[key].skuImgs = vm.skuOld[a].skuImgs
                        vm.sku[key].skuBarcode = vm.skuOld[a].skuBarcode
                        vm.updateSku.push(vm.sku[key])
                    }
                }
            }

        }

        for(key in vm.sku){
            if(vm.sku[key].skuId == undefined || vm.sku[key].skuId == ""){
                if(vm.headOld.length == 0 && key == 0){
                    console.log(vm.sku)
                    vm.sku[0].skuId = vm.skuOld[0].skuId;
                    vm.updateSku.push(vm.sku[0])
                }else{
                    vm.newSku.push(vm.sku[key])
                }

            }
        }

        console.log(vm.updateSku,"up")
        console.log(vm.newSku,"new")
        console.log(vm.sku,'self')
    }

    function ND(){
        var arr = arguments[0]
        // var arr=Array.prototype.slice.call(arguments);
        // console.log(arr)
        while(arr.length>1){
            var a=arr.shift();
            // if(a.length==0)a.push("-");
            var b=arr.shift();
            // if(b.length==0)b.push("-");
            var tmp=[];
            for(var i=0;i<a.length;i++)
                for(var j=0;j<b.length;j++)
                    if(a[i] instanceof Array)
                        tmp.push(a[i].concat(b[j]));
                    else
                        tmp.push([a[i],b[j]]);
            arr.unshift(tmp);
        }
        // console.log(arr)
        return arr[0];
    }

    vm.getUserFunc = function (type,name,num) {
        if(type == 1){
            Goods.getUserFunc(name).success(function (data) {
                if(data.obj == null||data.obj.funcValue == 0 ){
                    msgAlert.text(data.msg);
                    switch(num)
                    {
                        case 0:
                            $scope.checkbox = 0
                            break;
                        case 1:
                            $scope.checkbox1 = 0
                            break;
                        case 2:
                            $scope.checkbox2 = 0
                            break;
                        case 3:
                            $scope.checkbox3 = 0
                            break;
                    }
                }
            })
        }

    }




    vm.setInfo = function () {
        for(key in vm.sku){
            if($scope.quantity != undefined && vm.isRelate == 0){
                vm.sku[key].quantity = $scope.quantity
            }
            if(vm.price != undefined ){
                vm.sku[key].price = vm.price
            }
            if($scope.weight != undefined){
                vm.sku[key].weight = $scope.weight
            }
            if($scope.volume != undefined){
                vm.sku[key].volume = $scope.volume
            }
        }
    }








    vm.addGoods = function () {

        $scope.channel = ""+ $scope.checkbox +""+ $scope.checkbox1 +""+ $scope.checkbox2 +""+ $scope.checkbox3 +""
        vm.updateSkuCopy = angular.copy(vm.updateSku)
        vm.newSkuCopy = angular.copy(vm.newSku)

        for(key in vm.updateSkuCopy){
            vm.updateSkuCopy[key].price = vm.updateSku[key].price * 100
        }
        for(key in vm.newSkuCopy){
            vm.newSkuCopy[key].price = vm.newSku[key].price * 100
        }

        if(vm.head.length == 0){
            vm.updateSkuCopy = vm.skuOld
            if($scope.quantity != null && $scope.quantity  != undefined){
                vm.updateSkuCopy[0].quantity = $scope.quantity
            }
        }

        var info = {
            spuId:spuId,
            isRelate:vm.isRelate,
            isShareInv:vm.isShareInv,
            price:vm.price * 100,
            invNum:$scope.quantity ,
            channel:$scope.channel,
            skus:vm.newSkuCopy,
            updateSkus:vm.updateSkuCopy

        }
        console.log(info)

        Goods.updateGoods(1,info).success(function (data) {
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

