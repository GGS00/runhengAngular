angular.module('MetronicApp').controller('d2pgoodsclassifyController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','d2p','commonUtil', function($rootScope, $scope, $http, uiGridConstants,settings, d2p,commonUtil) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    initial(0);
    function initial(parentId){
        vm.parentId  = parentId;
        d2p.getGoodsNode(vm).success(function(data) {
            if(data.status==00){
                vm.list = data.data;
                vm.handleList = [];
                for(var j = 0 ; j < vm.list.length ; j++) {
                    vm.handleList.push(vm.list[j])
                }
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
            }

        });
    }

    vm.addNewNode = function(cId,parentId,index,deep){
        vm.currentImg =  {img: "http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=no+image"};
        $('input[name="nodeName"]').val('');
        $('input[name="nodeDesc"]').val('');
        vm.addCId = cId;
        vm.addParentId = parentId;
        vm.addIndex = index;
        vm.addDeep = deep;
        $('#confirmAddNode').modal('show');
    }


    vm.confirmAddNode = function(){
        vm.nodeName = $('input[name="nodeName"]').val();
        vm.nodeDesc = $('input[name="nodeDesc"]').val();
        vm.nodeIcon = vm.currentImg.img;
        if(vm.nodeName == ''||vm.nodeDesc == ''){
            msgAlert.text('请将信息填写完整');
            return false;
        }

        d2p.addChildNode(vm).success(function(data) {
            if(data.status==00){
                $('#confirmAddNode').modal('hide');
                if(vm.addCId == 0){
                    initial(0);
                }else{
                    if(vm.addDeep == 0){
                        vm.list[vm.addIndex].isLeaf = 0;
                        doSearch(vm.addCId,vm.addParentId,vm.addIndex,vm.addDeep)
                    }else if(vm.addDeep == 1) {
                        for(var n = 0 ; n < vm.list.length ; n++){
                            if(vm.list[n].cId == vm.addParentId){
                                vm.indexForTwo = vm.list[n].index;
                            }
                        }
                        vm.list[vm.indexForTwo].d2pCategorycol[vm.addIndex].isLeaf = 0;
                        doSearch(vm.addCId,vm.addParentId,vm.addIndex,vm.addDeep)
                    }
                }
                msgAlert.text('新增成功');
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
            }

        });
    }

    vm.deleteNode = function(cId,parentId,index,deep){
        vm.cId = cId;
        d2p.deleteNode(vm).success(function(data) {
            if(data.status==00){
                if(deep==0){
                    initial(0);
                }else if(deep==1) {
                    vm.parentId  = 0;
                    d2p.getGoodsNode(vm).success(function(data) {
                        if(data.status==00){
                            vm.list = data.data;
                            vm.handleList = [];
                            for(var j = 0 ; j < vm.list.length ; j++) {
                                vm.handleList.push(vm.list[j]);
                                if(vm.list[j].cId == parentId){
                                    vm.parentIndex = vm.list[j].index
                                }
                            }
                            doSearch(parentId,0,vm.parentIndex,0)
                        }else{
                            msgAlert.text('删除失败 >﹏< ['+ data.msg+']');
                        }

                    });
                }else if(deep==2) {
                    var p = 0;
                    for(var m = 0 ; m < vm.handleList.length ; m++){
                        if(vm.handleList[m].parentCId == parentId){
                            p++;
                        }
                    }
                    for(var n = 0 ; n < vm.handleList.length ; n++){
                        if(vm.handleList[n].cId == parentId){
                            vm.parentParentId = vm.handleList[n].parentCId;
                            vm.parentIndex = vm.handleList[n].index;
                        }
                    }
                    for(var j = 0 ; j < vm.list.length ; j++){
                        if(vm.list[j].cId == vm.parentParentId){
                            vm.indexForTwo = vm.list[j].index;
                        }
                    }

                    if(p==1){
                        vm.list[vm.indexForTwo].d2pCategorycol[vm.parentIndex].isLeaf = 1;
                    }
                    doSearch(parentId,vm.parentParentId,vm.parentIndex,1);
                }
                msgAlert.text('删除成功');
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
            }

        });
    }



     // 上移
     vm.upRecord = function(deep,parentId,arr,$index,index,cId) {
         if($index == 0){
             msgAlert.text('第一层不允许上移');
         }else{
             if(deep==0){
                 vm.parentId  = 0;
                 d2p.getGoodsNode(vm).success(function(data) {
                     if(data.status==00){
                         vm.deepList = [];
                         for(var i = 0 ; i < vm.handleList.length ; i++){
                             if(vm.handleList[i].parentCId == parentId){
                                 vm.deepList.push(vm.handleList[i].cId)
                             }
                         }
                         swapItems(parentId,deep,vm.deepList,index,index - 1);
                     }else{
                         msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                     }

                 });
             }else if(deep==1){
                     vm.deepList = [];
                     if(index == 0){
                         msgAlert.text('只能同级移动');
                         return;
                     }
                     vm.deepList = [];
                     for(var i = 0 ; i < vm.handleList.length ; i++){
                         if(vm.handleList[i].parentCId == parentId){
                             vm.deepList.push(vm.handleList[i].cId)
                         }
                         if(vm.handleList[i].cId == parentId){
                             vm.addIndex = vm.handleList[i].index;
                             vm.addDeep = vm.handleList[i].depth;
                         }
                     }

                     swapItems(parentId,deep,vm.deepList,index,index - 1);

             }else if(deep == 2){

                 if(index == 0){
                     msgAlert.text('只能同级移动');
                     return;
                 }
                 vm.deepList = [];
                 for(var i = 0 ; i < vm.handleList.length ; i++){
                     if(vm.handleList[i].parentCId == parentId){
                         vm.deepList.push(vm.handleList[i].cId)
                     }
                 }

                 for(var n = 0 ; n < vm.handleList.length ; n++){
                     if(vm.handleList[n].cId == parentId){
                         vm.parentParentId = vm.handleList[n].parentCId;
                         vm.parentIndex = vm.handleList[n].index;
                     }
                 }
                 swapItems(parentId,deep,vm.deepList,index,index - 1);
             }


         }

     };

    var swapItems = function(parentId,deep,arr,index1,index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        vm.sortParentId = parentId;
        d2p.changeSort(vm).success(function(data) {
            if(data.status==00){
               if(deep==0){
                   initial(0);
               }else if(deep==1){
                   doSearch(parentId,0,vm.addIndex,vm.addDeep)
               }else if(deep==2){
                   doSearch(parentId,vm.parentParentId,vm.parentIndex,1);
               }

            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                initial(0);
            }

        });
        return arr;
    };

     // 下移
     vm.downRecord = function(deep,parentId,arr,$index,index,cId) {
         if(deep == 0){
             vm.parentId  = 0;
             d2p.getGoodsNode(vm).success(function(data) {
                 if(data.status==00){
                     vm.list = data.data;
                     vm.handleList = [];
                     for(var j = 0 ; j < vm.list.length ; j++) {
                         vm.handleList.push(vm.list[j])
                     }

                     if(index == vm.handleList.length-1){
                         msgAlert.text('同级最后一个不允许下移');
                         return;
                     }
                     vm.deepList = [];
                     for(var i = 0 ; i < vm.handleList.length ; i++){
                         vm.deepList.push(vm.handleList[i].cId);
                     }
                     swapItems(parentId,deep,vm.deepList,index,index + 1);
                 }else{
                     msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                 }

             });
         }else if(deep==1){
             vm.deepList = [];

             for(var i = 0 ; i < vm.handleList.length ; i++){
                 if(vm.handleList[i].parentCId == parentId){
                     vm.deepList.push(vm.handleList[i].cId)
                 }
                 if(vm.handleList[i].cId == parentId){
                     vm.addIndex = vm.handleList[i].index;
                     vm.addDeep = vm.handleList[i].depth;
                 }
             }

             if(index == vm.deepList.length-1){
                 msgAlert.text('同级最后一个不允许下移');
                 return;
             }

             swapItems(parentId,deep,vm.deepList,index,index + 1);
         }else if(deep ==2){

             vm.deepList = [];
             for(var i = 0 ; i < vm.handleList.length ; i++){
                 if(vm.handleList[i].parentCId == parentId){
                     vm.deepList.push(vm.handleList[i].cId)
                 }
             }

             for(var n = 0 ; n < vm.handleList.length ; n++){
                 if(vm.handleList[n].cId == parentId){
                     vm.parentParentId = vm.handleList[n].parentCId;
                     vm.parentIndex = vm.handleList[n].index;
                 }
             }
             if(index == vm.deepList.length-1){
                 msgAlert.text('同级最后一个不允许下移');
                 return;
             }
             swapItems(parentId,deep,vm.deepList,index,index + 1);
         }

     };

    vm.search = function(cId,parentId,index,deep){
        doSearch(cId,parentId,index,deep);
    }


    function doSearch(cId,parentId,index,deep){
        if(deep==0){
            vm.parentId  = cId;
            d2p.getGoodsNode(vm).success(function(data) {
                if(data.status==00){
                    vm.child = data.data;
                    vm.list[index].d2pCategorycol=vm.child;
                    vm.handleList = [];
                    for(var j = 0 ; j < vm.list.length ; j++){
                        vm.handleList.push(vm.list[j])
                        if(vm.list[j].d2pCategorycol != null){
                           for(var k=0 ; k < vm.list[j].d2pCategorycol.length ; k++){
                               if(vm.list[j].d2pCategorycol[k].parentCId == cId){
                                   vm.handleList.push(vm.list[j].d2pCategorycol[k]);
                               }
                           }
                        }
                    }
                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                }

            });

        }else if(deep==1){
            vm.parentId  = cId;
            d2p.getGoodsNode(vm).success(function(data) {
                if(data.status==00){
                    vm.childChild = data.data;
                    for(var n = 0 ; n < vm.list.length ; n++){
                        if(vm.list[n].cId == parentId){
                            vm.indexForTwo = vm.list[n].index;
                        }
                    }
                    for(var m = 0 ; m <  vm.list[vm.indexForTwo].d2pCategorycol.length ; m++){
                        if(vm.list[vm.indexForTwo].d2pCategorycol[m].cId == cId){
                            vm.indexForThree = m;
                        }
                    }
                    vm.list[vm.indexForTwo].d2pCategorycol[vm.indexForThree].d2pCategorycol = vm.childChild;
                    vm.handleList = [];
                    for(var j = 0 ; j < vm.list.length ; j++){
                        vm.handleList.push(vm.list[j])
                        if(vm.list[j].d2pCategorycol != null){
                            for(var k=0 ; k < vm.list[j].d2pCategorycol.length ; k++){
                                if(vm.list[j].d2pCategorycol[k].parentCId == vm.list[vm.indexForTwo].cId){
                                    vm.handleList.push(vm.list[j].d2pCategorycol[k]);
                                }
                                if(vm.list[j].d2pCategorycol[k].d2pCategorycol != null){
                                    for(var t=0 ; t < vm.list[j].d2pCategorycol[k].d2pCategorycol.length ; t++){
                                        if(vm.list[j].d2pCategorycol[k].d2pCategorycol[t].parentCId == cId){
                                            vm.handleList.push(vm.list[j].d2pCategorycol[k].d2pCategorycol[t]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                }

            });


        }else if(deep==2){
            return;
        }


    }

    vm.currentImg =  {img: "http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=no+image"};
    $scope.showAddImg = function(){
        $("#showAddImg").modal("show")
    }

    $scope.addImg = function () {
        var uploadFile = function (client) {
            var file = document.getElementById('file').files[0];
            console.log(file.name);
            return client.multipartUpload("cloudchain/gms/goods/images/"+file.name+"", file).then(function (res) {
                $scope.$apply(function () {
                    vm.skuImgs  = {img:res.url};
                    vm.currentImg = vm.skuImgs;
                });
                vm.skuImgs = {img:res.url}
                console.log('upload success: %j', res);
                console.log(vm.skuImgs)
                vm.currentImg = vm.skuImgs
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



}])