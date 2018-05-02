
/* Setup blank page controller */
angular.module('MetronicApp').controller('goodSettingCategoryController',function($rootScope,$http,$scope,$log,Goods) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    var vm = this;
    initial(0);
    function initial(parentId){
        vm.parentId  = parentId;
        Goods.getCate(parentId).success(function(data) {
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
        $('input[name="nodeName"]').val('');
        $('input[name="nodeDesc"]').val('');
        vm.addCId = parentId;
        vm.addParentId = cId;
        vm.addIndex = index;
        vm.addDeep = deep;
        $('#confirmAddNode').modal('show');
    }


    vm.confirmAddNode = function(){
        vm.nodeName = $('input[name="nodeName"]').val();
        vm.nodeDesc = $('input[name="nodeDesc"]').val();
        if(vm.nodeName == ''){
            msgAlert.text('请将信息填写完整');
            return false;
        }
        var info = {
            parentCId:vm.addParentId,
            name:vm.nodeName,
            description:vm.nodeDesc,
            depth:vm.addDeep + 1
        }

        Goods.addCategory(info).success(function(data) {
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
                        console.log(vm.list,vm.indexForTwo,vm.addIndex)
                        // vm.list[vm.indexForTwo].d2pCategorycol[vm.addIndex].isLeaf = 0;
                        doSearch(vm.addCId,vm.addParentId,vm.addIndex,vm.addDeep)
                    }
                }
                msgAlert.text('新增成功');
                initial(0);
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
            }

        });
    }


    vm.deleteNode = function(cId,parentId,index,deep){
        Goods.delCat(cId).success(function(data) {
            if(data.status==00){
                    initial(0);
                msgAlert.text('删除成功');
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
            }

        });
    }


    vm.search = function(cId,parentId,index,deep){
        console.log(cId,parentId,index,deep)
        doSearch(cId,parentId,index,deep);
    }


    function doSearch(cId,parentId,index,deep){
        if(deep==0){
            vm.parentId  = cId;
            Goods.getCate(cId).success(function(data) {
                if(data.status==00){
                    vm.child = data.data;
                    console.log(index)
                    vm.list[index].d2pCategorycol = vm.child
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
                    console.log(vm.handleList)
                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                }

            });

        }else if(deep==1){
            vm.parentId  = cId;
            Goods.getCate(cId).success(function(data) {
                if(data.status==00){
                    vm.childChild = data.data;
                    console.log(vm.list,cId,parentId)
                    for(var n = 0 ; n < vm.list.length ; n++){
                        if(vm.list[n].cId == parentId){
                            vm.indexForTwo = n;
                            console.log(vm.indexForTwo)
                        }
                    }
                    for(var m = 0 ; m <  vm.list[vm.indexForTwo].d2pCategorycol.length ; m++){
                        if(vm.list[vm.indexForTwo].d2pCategorycol[m].cId == cId){
                            vm.indexForThree = m;
                        }
                    }
                    vm.list[vm.indexForTwo].d2pCategorycol[vm.indexForThree].d2pCategorycol = vm.childChild;
                    console.log(vm.list)
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


});
/**
 * Created by sq on 2017/3/23.
 */
/**
 * Created by sq on 2017/4/5.
 */
