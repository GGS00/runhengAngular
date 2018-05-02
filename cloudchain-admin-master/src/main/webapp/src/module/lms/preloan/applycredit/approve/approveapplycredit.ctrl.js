/**
 * 入库单控制器
 */
angular.module('MetronicApp').controller('approveApplyCreditController', function ($rootScope, $scope, $http,$location, uiGridConstants, settings,approveApplyCredit, editCustomer, commonUtil, Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    //返回按钮
    vm.returnButton = function () {
        window.history.back(-1);
    }
    vm.id =  $location.search().id;
    approveApplyCredit.getDetail(vm).success(function (data) {
        vm.data=data;
    });
    /*********** **************************************************审批提交************************************************************************************/
    vm.approve =function () {
        vm.form = $("#lmsCustomer").serialize();
        vm.form = decodeURIComponent(vm.form,true);
        console.log(vm.form)
        $.ajax({
            url:"/lmsPreApplyCredit/approve",
            data:vm.form,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.additionalMsg.status=='成功' || data.additionalMsg.status == '00'){
                    msgAlert.info('修改，现在返回');
                    window.location.href = "#/lms/preloan/applycredit";
                }else if(data.additionalMsg.status=='01'){
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                }
            },
            error:function(){
                 msgAlert.text('系统繁忙 >﹏<');
            }
        })
    }
    /*************************************************************获取贷款规则***********************************************************************************/
    vm.loanRuleColumn = [
        {
            field: 'id',
            displayName: 'ID',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        },
        {
            field: 'code',
            displayName: '编码',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        },
        {
            field: "name",
            displayName: '名称',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }
    ]
    vm.placeholder_loanRuleName = '请选择贷款规则';
    vm.placeholder_excessRuleName = '请选择超额规则';
    vm.icon_loanRule = 'plus';
    vm.loanRuleParams = {
        bean: 'lmsLoanRule',
        method: 'page',
        page: 1,
        rows: 10
    }
    vm.loanRulePage = function () {
        $http({
            url: "/process", method: "get",
            params: vm.loanRuleParams
        }).success(function (data) {
            if (data.additionalMsg.status == '00') {
                vm.loanRuleData = data;
            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        })
    };
    vm.loanRulePage();
})
