angular.module('MetronicApp').controller('goodSpecEditController',function($rootScope,$stateParams,$http,$scope,Goods) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

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
            "plugins" : ["dnd", "state", "types", "checkbox"]
        })

    }



    var vm = this;
    Goods.loadSpec($stateParams.Id).success(function (data) {
          vm.name = data.obj.name;
          vm.isApplyAll = data.obj.isApplyAll;
          vm.isFilter = data.obj.isFilter;
          vm.specVals = data.obj.specVals;
          vm.specId = data.obj.specId;
        var clist = []
        for(var i in data.obj.categoryList){
            clist.push(data.obj.categoryList[i].cId)
        }
        console.log(clist)
        Goods.getCategoryList().success(function (data) {
            console.log(data)
            var oldbox = data.data;
            var row =  new Array();

            // row.push({"id":0,"parent":"#","text":"根节点"})
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
            $("#categoryTree").on('refresh.jstree', function(e, data){
                $("#categoryTree").jstree(true).select_node(clist)
            })
            $("#categoryTree").on('changed.jstree',function(e,data){
                $scope.cIds = [];
                var i, j;
                for (i = 0, j = data.selected.length; i < j; i++) {
                    var node = data.instance.get_node(data.selected[i]);
                    if (data.instance.is_leaf(node)) {
                        $scope.cIds.push(node.id);
                    }
                }
            });
        })
    })




    // vm.specVals = [{specVal:""}]
    // vm.isFilter = 0
    // vm.isApplyAll = 0

    vm.addList = function () {
        vm.specVals.push({
            specVal:"",
        })
    }

    vm.deleteList = [];
    vm.rmList = function (items) {
        var a =  vm.specVals.pop()
        if(a.specValId != "" && a.specValId != undefined){
            vm.deleteList.push({specValId:a.specValId})
        }
    }

    vm.setShowClassify  = function(){
        $('#confirmEdit').modal('show')
    }


    vm.addSpec = function () {
        console.log(vm.specVals)
        if(vm.name == undefined || vm.name == ""){
            msgAlert.text('请填写一个规格项名称')
            return;
        }

        for(key in vm.specVals){
            if(vm.specVals[key].specVal == ""){
                msgAlert.text('有未填写的规格项')
                return;
            }
        }

        if(vm.isApplyAll == 0 && $scope.cIds.length < 1){
            msgAlert.text('请至少选择一个分类')
            return;
        }

        var info = {
            specId:vm.specId,
            name:vm.name,
            isApplyAll:vm.isApplyAll,
            isFilter:vm.isFilter,
            cIds:$scope.cIds.join(),
            specVals:vm.specVals,
            delSpecVals:vm.deleteList
        }
        Goods.updateSpec(info).success(function (data) {
            if(data.status==00){
                window.history.back();
            }else{
                msgAlert.text(data.msg)
            }
        })
    }

});/**
 * Created by sq on 2017/5/24.
 */
/**
 * Created by sq on 2017/5/25.
 */
