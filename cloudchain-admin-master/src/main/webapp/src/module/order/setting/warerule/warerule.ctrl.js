angular.module('MetronicApp').controller('wareruleController', ['$rootScope','$scope','$http','$log','uiGridConstants','settings','order','commonUtil','System', function($rootScope,$scope,$http,$log,uiGridConstants,settings,order,commonUtil,System) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;

    initial()

    function initial(){
        order.queryAllotRule(vm).success(function(data) {
            if(data.status==00){
                vm.ruleData = data.obj;
            }else{
                msgAlert.text('初始化失败 >﹏< ['+ data.msg+']');
            }

        });
    }




    vm.confirmDeleteShow = function(id){
        vm.deleteId = id;
        $('#confirmDelete').modal('show');
    }

    vm.confirmDelete = function(){
        order.deleteWarehousePriorityRule(vm).success(function(data) {
            if(data.status==00){
                initial();
                msgAlert.text('删除成功');
                $('#confirmDelete').modal('hide');
            }else{
                $('#confirmDelete').modal('hide');
                msgAlert.text('删除失败 >﹏< ['+ data.msg+']');
                return false;
            }

        });


    }

    vm.saveAllotRule = function(){
        // vm.allowChangeWarehouse = $('input[name="changeWare"]:checked').val();
        // vm.giftNotEnough = $('input[name="handleWay"]:checked').val();
        // vm.invNotenoughAllotRule = $('input[name="autoRule"]:checked').val();
        vm.isOpen = $('input[name="autoDis"]:checked').val();
        vm.ruleId =  vm.ruleData.ruleId;
        if(vm.isOpen==undefined){
            msgAlert.text('请先将信息选择完整');
            return false;
        }
        order.saveAllotRule(vm).success(function(data) {
            if(data.status==00){
                initial();
            }else{
                msgAlert.text('初始化失败 >﹏< ['+ data.msg+']');
            }

        });
    }

    vm.toAdd = function(id){
        if(vm.ruleData==null){
            msgAlert.text('请先保存规则');
            return false;
        }
        window.location.href="#/order/setting/warenewset?ruleId=" + vm.ruleData.ruleId;
    }

    vm.toEdit = function(id){
        window.location.href="#/order/setting/wareset?id="+id + '&ruleId=' + vm.ruleData.ruleId;
    }



}])