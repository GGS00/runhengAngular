/**
 * 入库单控制器
 */
angular.module('MetronicApp').controller('addCustomerController', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'commonUtil', 'Table', function ($rootScope, $scope, $http, uiGridConstants, settings, commonUtil, Table) {
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

    /*************************************************************保存新建贷款客户************************************************************************************/
    vm.saveNewCustomer =function () {
        if ($("input[name='code']").val()== "") {
            msgAlert.text('请输入编码');
            return false;
        }
        if ($("input[name='name']").val()== "") {
            msgAlert.text('请输入名称');
            return false;
        }

        vm.form = $("#lmsCustomer").serialize();
        vm.form = decodeURIComponent(vm.form,true);
        console.log(vm.form)
        $.ajax({
            url:"/lmsCustomer/add",
            data:vm.form,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.additionalMsg.status=='成功' || data.additionalMsg.status == '00'){
                    msgAlert.info('新增成功，现在返回');
                    window.location.href = "#/lms/basic/customer";
                }else if(data.additionalMsg.status=='01'){
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                }
            },
            error:function(){
                 msgAlert.text('系统繁忙 >﹏<');
            }
        })
    }
    vm.accountColumn = [
        {
            field: 'id',
            displayName: 'ID',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            visible:false,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        },
        {
            field: "account_name",
            displayName: '账户名',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        },
        {
            field: "bank_account",
            displayName: '账号',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        },
        {
            field: "bank_name",
            displayName: '开户行',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }
    ]
    vm.placeholder_accountName = '请输入账户名';
    vm.placeholder_accountName2 = '请输入汇款账户名';
    vm.icon_account= 'plus';
    vm.accountParams = {
        bean: 'lmsBankAccount',
        method: 'page',
        page: 1,
        rows: 10
    }
    vm.accountPage = function () {
        commonUtil.getList(vm.accountParams).success(function (data) {
            if (data.additionalMsg.status == '00') {
                vm.accountData = data;
            } else{
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });

    };
    vm.accountPage();
}])
