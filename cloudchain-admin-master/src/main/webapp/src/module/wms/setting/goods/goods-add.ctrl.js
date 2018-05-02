/**
 * Created by sq on 2017/4/20.
 */
angular.module('MetronicApp').controller('wmsGoodsAddController', function($rootScope, $scope, $timeout,Goods,commonUtil) {
    var editor_a = "";
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
        $(".js-data-example-ajax").select2({
            // placeholder: "选择一个商品分类",
            width: null,
            escapeMarkup: function(markup) {
                return markup;
            },
            language: "zh-CN",
            createSearchChoice:function (data) {
                console.log(data)
            }
        });

    });

   $scope.initEditor = function () {
       UE.delEditor('myEditor')
       editor_a = UE.getEditor('myEditor',{initialFrameHeight:500});
   }



    var vm = this
    vm.keywords = []
    vm.sku = [];
    vm.isRelate = 1;
    vm.isSn = 0;
    vm.isShareInv = 1;
    $scope.checkbox=0;
    $scope.checkbox1= 0;
    $scope.checkbox2= 0;
    $scope.checkbox3= 0;

    vm.addList = function () {
        if(vm.keywords.length <10){
            vm.keywords.push({
                key:"",
            })
        }

    }

    vm.rmList = function (items) {
        if(vm.keywords.length > 1) {
            vm.keywords.pop()
        }
    }


    vm.setShowClassify  = function(){
        $('#confirmEdit').modal('show')
    }

    
    function categoryTree() {
        $("#categoryTree").jstree({
            "core" : {
                "themes" : {
                    "responsive": false
                },
                // so that create works
                "check_callback" : true,
            },
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "file" : {
                    "icon" : "fa fa-file icon-state-warning icon-lg"
                }
            },
            "state" : { "key" : "demo2" },
            "plugins" : ["dnd", "state", "types",]
        })

    }

    Goods.getCategoryList().success(function (data) {
        var oldbox = data.data;
        var row =  new Array();

       row.push({"id":-100,"parent":"#","text":"通用分类"})
        if(oldbox != null){
            for(var i=0;i<oldbox.length;i++){
                if(oldbox[i].parentCId == 0){
                    row.push({"id":oldbox[i].cId,"parent":"#","text":oldbox[i].name})
                }else{
                    row.push({"id":oldbox[i].cId,"parent":oldbox[i].parentCId,"text":oldbox[i].name})
                }
            }
        }
        categoryTree()
        $("#categoryTree").jstree(true).settings.core.data = row;
        $('#categoryTree').jstree(true).deselect_all();
        $("#categoryTree").jstree(true).refresh('true');
        $("#categoryTree").on('select_node.jstree',function(e,data){
            var node = data.instance.get_node(data.selected[0])
            if(data.instance.is_leaf(node)) {
                $scope.cId = node.id
                $scope.cName = node.text
                Goods.getPSB($scope.cId).success(function (data) {
                    if(data.status == 00){
                        vm.brandList = data.resultMap.brandList;
                        vm.propList = data.resultMap.propList;
                        vm.specList = data.resultMap.specList
                        // for(key in vm.specList){
                        //     vm.specList[key].specVals[0].checked = true;
                        // }
                        vm.checkSpec()
                    }
                })
            }else{
                // msgAlert.text("请选择最后一级分类");
            }
        });
    })
    
    Goods.getUnit().success(function (data) {
        vm.unitList = data.rows
        vm.unit = vm.unitList[0].dataValue
    })

    vm.checkSpec =function () {
        vm.specRow = []
        vm.head = []
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
        console.log(vm.head)
        console.log(vm.specRow,233)
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
                skuImgs:[{img:'http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=no+image'}],
                skuSpecValModels:model
            }
        }
        console.log(vm.sku)

        // if(vm.sku.length < 1){
        //     vm.sku[0] = {
        //         title:"",
        //         bn:"",
        //         cost:"",
        //         price:"",
        //         weight:"",
        //         volume:"",
        //         skuBarcode:"",
        //         skuImgs:[{img:'http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=no+image'}],
        //         skuSpecValModels:[]
        //     }
        // }
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

    vm.getUserFunc = function (type,name,num) {
        if(type == 1){
            Goods.getUserFunc(name).success(function (data) {
                    if(data.obj == null||data.obj.funcValue == 0){
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




    vm.addGoods = function () {
        vm.skuCopy = angular.copy(vm.sku)
        $scope.channel = ""+ $scope.checkbox +""+ $scope.checkbox1 +""+ $scope.checkbox2 +""+ $scope.checkbox3 +""
        if(vm.spuName == undefined || vm.spuName == ""){
            msgAlert.text('请填写商品名称');
            return
        }

        // var wordsList = [];
        // for(key in vm.keywords){
        //     // if(vm.keywords[key].key == ""){
        //     //     msgAlert.text('有未填写的关键字');
        //     //     return
        //     // }
        //     wordsList[key] = vm.keywords[key].key
        // }
        // if($scope.form.cost == undefined || $scope.form.cost == ""){
        //     msgAlert.text('请填写成本价格');
        //     return
        // }
        // if($scope.form.price == undefined || $scope.form.price == ""){
        //     msgAlert.text('请填写销售价格');
        //     return
        // }
        // if(vm.bn == undefined || vm.bn == ""){
        //     msgAlert.text('请填写商品编码');
        //     return
        // }
        // if(vm.bId == undefined || vm.bId == ""){
        //     msgAlert.text('请选择一个品牌');
        //     return
        // }
        if(vm.unit == undefined || vm.unit == ""){
            msgAlert.text('请选择一个单位');
            return
        }

        var spuProps = []
        for(key in vm.propList){
            for(key2 in vm.propList[key].groupList){
                for(key3 in vm.propList[key].groupList[key2].paramList){
                    var item = vm.propList[key].groupList[key2].paramList[key3];
                    if(item.settingType == 0 || item.settingType == 1){
                        // if(item.val == undefined || item.val == "" ){
                        //     msgAlert.text('有没填写/选择的属性');
                        //     return;
                        // }
                        console.log(item.val)
                        spuProps.push({
                            paramName:item.paramName,
                            paramValue:item.val,
                            groupId:item.groupId,
                            propId:vm.propList[key].groupList[key2].propId,
                            paramId:item.paramId,
                        })
                    }
                    if(item.settingType == 2){
                        // var a = [];
                        // for(var n in item.valList){
                        //     if(item.valList[n].checked == 1){
                        //         a.push(item.valList[n].val)
                        //     }
                        // }
                        // if(item.val.length < 1){
                        //     msgAlert.text('请至少选择一个多选项');
                        //     return;
                        // }
                        if(item.val != undefined){
                            spuProps.push({
                                paramName:item.paramName,
                                paramValue:item.val.join(),
                                groupId:item.groupId,
                                propId:vm.propList[key].groupList[key2].propId,
                                paramId:item.paramId,
                            })
                        }

                    }
                    if(item.settingType == 3){
                        // var time = $("#"+ item.paramId+ " span").html()
                        // if(time == undefined || time == "-"){
                        //     msgAlert.text('请选择时间属性');
                        //     return;
                        // }
                        spuProps.push({
                            paramName:item.paramName,
                            paramValue:item.val,
                            groupId:item.groupId,
                            propId:vm.propList[key].groupList[key2].propId,
                            paramId:item.paramId,
                        })
                    }
                }
            }
        }



        if($scope.cId == undefined || $scope.cId == ""){
            msgAlert.text('请选择一个商品分类');
            return
        }
        // if(vm.barCode == undefined || vm.barCode == ""){
        //     msgAlert.text('填写商品条码');
        //     return
        // }


        for(key in vm.skuCopy){
            vm.skuCopy[key].price = vm.sku[key].price * 100
            //     console.log(vm.sku[key])
        //     if(vm.sku[key].title == undefined || vm.sku[key].title == ""){
        //         msgAlert.text('有未填写的商品标题');
        //         return
        //     }
        //     if(vm.sku[key].bn == undefined || vm.sku[key].bn == ""){
        //         msgAlert.text('有未填写的商品编码');
        //         return
        //     }
        //     // if(vm.sku[key].cost == undefined || vm.sku[key].cost == ""){
        //     //     msgAlert.text('有未填写的商品成本价格');
        //     //     return
        //     // }
        //     if(vm.sku[key].price == undefined || vm.sku[key].price == ""){
        //         msgAlert.text('有未填写的商品销售价格');
        //         return
        //     }
        //     if(vm.isRelate == 0){
        //         if(vm.sku[key].quantity == undefined || vm.sku[key].quantity == ""){
        //             msgAlert.text('有未填写的销售库存');
        //             return
        //         }
        //     }
        //     if(vm.sku[key].price == undefined || vm.sku[key].price == ""){
        //         msgAlert.text('请填写销售价格');
        //         return
        //     }
        //     // if(vm.sku[key].weight == undefined ||vm.sku[key].weight == ""){
        //     //     msgAlert.text('有未填写的商品重量');
        //     //     return
        //     // }
        //     // if(vm.sku[key].volume == undefined || vm.sku[key].volume == ""){
        //     //     msgAlert.text('有未填写的商品体积');
        //     //     return
        //     // }
        }

        // if(vm.price == undefined || vm.price == ""){
        //     msgAlert.text('请填写销售价格');
        //     return
        // }

        if($scope.quantity == null && $scope.quantity == undefined){
            $scope.quantity = 0
        }



        var info = {
            spuName:vm.spuName,
            bn:vm.bn,
            barCode:vm.barCode,
            bId:vm.bId,
            cId:$scope.cId,
            price:vm.price * 100,
            unit:vm.unit,
            info:vm.info,
            isSn:vm.isSn,
            channel:$scope.channel,
            isRelate:vm.isRelate,
            isShareInv:vm.isShareInv,
            invNum:$scope.quantity,
            keywords:vm.keywords.join(),
            spuImgs:vm.spuImgs,
            // spuSpecs:[{specId,specName,specValIds}...],
            spuProps:spuProps,
            skus:vm.skuCopy,
        }


        console.log(info)

        App.blockUI({
            message: '提交中请等待...',
            animate: true
        });


        Goods.saveGoods(info).success(function (data) {
            if(data.status == 00){
                App.unblockUI();
                $scope.addInfo(data.userId,data.spuId);
            }else{
                App.unblockUI();
                msgAlert.text(data.msg);
            }
        }).error(function () {
            App.unblockUI();
            alert("添加失败")
        })

    }




    vm.spuImgs = []

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
            };
            applyTokenDo(uploadFile);
        }
    }


    $scope.addInfo = function (userId,spuId) {
        applyTokenDo(function (client) {
            if(editor_a == "" || editor_a == undefined){
                var content = "";
            }else{
                var content =  editor_a.getContent();
            }
            return client.put("cloudchain/gms/goods/details/"+ userId +"/"+ spuId +"/"+ spuId +".html", new Buffer(content),{headers:{
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
            }}).then(function (res) {
                console.log('upload success: %j', res);
                App.unblockUI();
                window.location.href ="#/goods/list"
            });
        })
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

