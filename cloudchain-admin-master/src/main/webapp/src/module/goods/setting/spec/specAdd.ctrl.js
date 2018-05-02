angular.module('MetronicApp').controller('goodSpecAddController',function($rootScope,$http,$scope,Goods) {
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

    var vm = this;

    vm.specVals = [{specVal:""}]
    vm.isFilter = 0
    vm.isApplyAll = 0

    vm.addList = function () {
        vm.specVals.push({
            specVal:"",
        })
    }

    vm.rmList = function (items) {
        vm.specVals.pop()
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
            name:vm.name,
            isApplyAll:vm.isApplyAll,
            isFilter:vm.isFilter,
            cIds:$scope.cIds.join(),
            specVals:vm.specVals,
        }
        Goods.addSpec(info).success(function (data) {
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
