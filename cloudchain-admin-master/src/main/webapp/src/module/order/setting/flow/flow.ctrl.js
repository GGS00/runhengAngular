angular.module('MetronicApp').controller('flowController', ['$rootScope','$scope','$http','$log','uiGridConstants','settings','order','commonUtil','System', function($rootScope,$scope,$http,$log,uiGridConstants,settings,order,commonUtil,System) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;

    initial();
    function initial(){
        order.getList().success(function (data) {
            if(data.status == 00){
                vm.flowList = data.data;
            }else{
                msgAlert.text(data.msg);
                return false;
            }

        });
    }


    // $('#categoryTree').
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
            "plugins" : ["dnd", "state", "types" ]
        })

    }


    //获取用户列表
    $scope.getList = function() {
        commonUtil.getList($scope.params).success(function (data) {
            $scope.data = data
        })
    }

    vm.changeStatus = function(x,y){
        if(y == 1){
            vm.flowList[x].isOpen = 0;
        }else{
            vm.flowList[x].isOpen = 1;
        }
    }

    //表格配置
    $scope.column = [{ field: 'empId',
        displayName: 'id',
        enableCellEdit: true,
        enableCellEditOnFocus:false
    },
        {  field: "realName",
            displayName: '真实姓名',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "orgName",
            displayName: '所属部门',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "roleName",
            displayName: '角色',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "mobile",
            displayName: '手机',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "email",
            displayName: '邮箱',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        }
    ];

    System.getOrg().success(function (data) {
        var oldbox = data.data;
        var row =  new Array();

        row.push({"id":0,"parent":"#","text":"根节点"})
        if(oldbox != null){
            for(var i=0;i<oldbox.length;i++){
                row.push({"id":oldbox[i].orgId,"parent":oldbox[i].orgParentId,"text":oldbox[i].orgName})
            }
        }
        categoryTree()
        $("#categoryTree").jstree(true).settings.core.data = row;
        $("#categoryTree").jstree(true).refresh();
        $("#categoryTree").on('changed.jstree',function(e,data){
            $scope.clickedNode = data.instance.get_node(data.selected[0]);

            $scope.params ={
                bean:'umsEmployee',
                method:'pageGetEmployees',
                page:1,
                rows:10,
                orgId:$scope.clickedNode.id
            }
            $scope.getList();

        });
    })

    vm.showDialog = function(flowId){
        vm.flowId = flowId;
        order.getAccessPerson(vm).success(function (data) {
            if(data.status == 00){
                vm.personList = [];
                for(var i = 0 ; i < data.data.length; i++){
                    vm.personList.push({empName: data.data[i].empName,empId:data.data[i].empId,flowId:vm.flowId})
                }
            }else{
                msgAlert.text(data.msg);
                return false;
            }

        });
        $("#confirmEdit").modal('show');
    }


    vm.removePerson = function(index){
        vm.deleteIndex = index;
        $("#confirmDelete").modal('show');
    };

    vm.addPerson= function() {
        vm.selectListAdd = [];
        if($scope.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要添加的人员');
            return false;

        }else{

            for(var i = 0 ;i <$scope.entity.getSelectedRows().length ; i++){
                for(var j = 0 ;j < vm.personList.length ; j++){
                    if(vm.personList[j].empId == $scope.entity.getSelectedRows()[i].empId){
                        $scope.entity.clearSelectedRows();
                        msgAlert.text('添加人员中存在已有权限的人员!');
                        return false;
                    }
                }
                vm.personList.push({empName:$scope.entity.getSelectedRows()[i].realName,empId:$scope.entity.getSelectedRows()[i].empId,flowId:vm.flowId});
            }
            $scope.entity.clearSelectedRows();
        }
    }

    vm.confirmDelete = function(index){
        vm.personList.splice(index,1);
        $("#confirmDelete").modal('hide');
    };

    vm.confirmEdit = function(){

        vm.addPersonList = "["
        for (var i = 0; i < vm.personList.length; i++) {

            var jsonText = {};
            jsonText["flowId"] = vm.personList[i].flowId;
            jsonText["empName"] = vm.personList[i].empName;
            jsonText["empId"] = vm.personList[i].empId;

            if(i<(vm.personList.length-1)){
                vm.addPersonList+=JSON.stringify(jsonText)+",";
            }else{
                vm.addPersonList+=JSON.stringify(jsonText);
            }
        }
        vm.addPersonList += "]";

        order.addPerson(vm).success(function(data) {
            if(data.status==00){

                msgAlert.text('权限新增成功');
                $("#confirmEdit").modal('hide');

            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
            }

        });
    }

    vm.saveFlow = function(){
        order.saveFlowSettings(vm).success(function(data) {
            if(data.status==00){
                msgAlert.text('保存成功');
                initial();

            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
            }

        });
    }


}])