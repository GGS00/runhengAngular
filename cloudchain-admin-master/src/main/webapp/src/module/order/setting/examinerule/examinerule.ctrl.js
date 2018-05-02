angular.module('MetronicApp').controller('examineRuleController', ['$rootScope','$scope','$http','$log','uiGridConstants','settings','order','commonUtil','System', function($rootScope,$scope,$http,$log,uiGridConstants,settings,order,commonUtil,System) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.ruleType='AUDIT_ORDER_RULE';
    vm.ruleName='审单规则';
    initial()

    function initial(){
        order.queryExamineRule(vm).success(function(data) {
            if(data.status==00){
                var ruleData = data.ruleItems;
                if(ruleData!=null) {
                    for (var i = 0; i < ruleData.length; i++) {
                        if (ruleData[i].paramName == "IS_AUTO_GENERATE_INVOICE") {
                            vm.autoDelivery = ruleData[i].paramValue;
                        }
                        if (ruleData[i].paramName == "IS_AUTO_AUDIT_ORDER") {
                            vm.autoExamine = ruleData[i].paramValue;
                        }
                    }
                }
                else{
                    vm.autoDelivery = "0";
                    vm.autoExamine = "0";
                }
            }else{
                msgAlert.text('初始化失败 >﹏< ['+ data.msg+']');
            }

        });
    }

    vm.saveExamineRule = function(){
        vm.autoExamine = $('input[name="autoExamine"]:checked').val();
        vm.autoDelivery =$('input[name="autoDelivery"]:checked').val();
        if(vm.autoExamine==undefined||vm.autoDelivery==undefined){
            msgAlert.text('请先将信息选择完整');
            return false;
        }
        order.saveExamineRule(vm).success(function(data) {
            if(data.status==00){
                msgAlert.info("保存成功");
                initial();
            }else{
                msgAlert.text('初始化失败 >﹏< ['+ data.msg+']');
            }

        });
    }




}])