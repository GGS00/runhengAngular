angular.module('MetronicApp').controller('goodPropAddController',function($rootScope,$http,$scope,Goods) {
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
        $('#categoryTree').jstree(true).deselect_all('true');
        $("#categoryTree").jstree(true).refresh();
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
    vm.isApplyAll = 0;
    vm.propList = [{groupName:"",isCore:0,items:[{paramName:"",settingType:0,isRequired:0,isFilter:0}]}];


    vm.addItem = function (items) {
        items.push({
            paramName:"",
            settingType:0,
            isRequired:0,
            isFilter:0
        })
    }

    vm.rmItem = function (items) {
        items.pop()
    }

    vm.addList = function () {
        vm.propList.push({
            groupName:"",
            isCore:0,
            items:[{
                paramName:"",
                settingType:0,
                isRequired:0,
                isFilter:0
            }]
        })
    }


    vm.setShowClassify  = function(){
        $('#confirmEdit').modal('show')
    }
    vm.showAddValue = function (item) {
        $('#showValue').modal('show')
        vm.settingValue = item
        if(vm.settingValue.values == undefined){
            vm.settingValue.values = [{value:""}]
        }

        vm.addSettingValue = function () {
            vm.settingValue.values.push({value:""})
            console.log(vm.settingValue.values)
        }

        vm.rmSettingValue = function () {
            vm.settingValue.values.pop()
        }
    }



    vm.addProp = function () {
        if(vm.propName == undefined || vm.propName == ""){
            msgAlert.text('请填写一个属性名称')
            return;
        }

        if(vm.isApplyAll == 0 && $scope.cIds.length < 1){
            msgAlert.text('请至少选择一个分类')
            return;
        }


        var list = [];
        for(key in vm.propList){
            if(vm.propList[key].groupName == ""){
                msgAlert.text('有未填写的参数组名称')
                return;
            }
            for(key2 in vm.propList[key].items){
                console.log(vm.propList[key].items[key2])
                if(vm.propList[key].items[key2].paramName == ""){
                    msgAlert.text('有未填写的参数名称')
                    return;
                }
                if(vm.propList[key].items[key2].settingType ==1 && vm.propList[key].items[key2].values == undefined){
                    msgAlert.text('有单选项未设置选择项')
                    return;
                }
                if(vm.propList[key].items[key2].settingType ==2 && vm.propList[key].items[key2].values == undefined){
                    msgAlert.text('有多选项未设置选择项')
                    return;
                }
                var n = []
                for(t in vm.propList[key].items[key2].values){
                    if(vm.propList[key].items[key2].values[t].value == ""){
                        msgAlert.text('有未填写的选择项')
                        return;
                    }
                    n.push(vm.propList[key].items[key2].values[t].value)
                }
                list.push({
                    groupName:vm.propList[key].groupName,
                    isCore:vm.propList[key].isCore,
                    paramName:vm.propList[key].items[key2].paramName,
                    isRequired:vm.propList[key].items[key2].isRequired,
                    isFilter:vm.propList[key].items[key2].isFilter,
                    settingType:vm.propList[key].items[key2].settingType,
                    values:n.join(),
                })
            }
        }


        console.log(list)

        var info ={
            propName:vm.propName,
            isApplyAll:vm.isApplyAll,
            cIds:$scope.cIds.join(),
            paramList:list,
        }
        Goods.addProp(info).success(function (data) {
            if(data.status==00){
                window.history.back();
            }else{
                msgAlert.text(data.msg)
            }
        })
    }

});