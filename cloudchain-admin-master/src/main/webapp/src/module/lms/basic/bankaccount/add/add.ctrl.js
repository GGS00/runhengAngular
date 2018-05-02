/**
 * 入库单控制器
 */
angular.module('MetronicApp').controller('addBankAccountController', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'commonUtil', 'Table', function ($rootScope, $scope, $http, uiGridConstants, settings, commonUtil, Table) {
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
    /*************************************************************新建银行账号************************************************************************************/
    vm.saveNewBankAccount =function () {
        if ($("input[name='accountName']").val()== "") {
            msgAlert.text('请输入账号名');
            return false;
        }
        if ($("input[name='bankName']").val()== "") {
            msgAlert.text('请输入开户行');
            return false;
        }
        if ($("input[name='bankAccount']").val()== "") {
            msgAlert.text('请输入银行账号');
            return false;
        }

        vm.form = $("#lmsBankAccount").serialize();
        vm.form = decodeURIComponent(vm.form,true);
        console.log(vm.form)
        $.ajax({
            url:"/lmsBankAccount/add",
            data:vm.form,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.additionalMsg.status=='成功' || data.additionalMsg.status == '00'){
                    msgAlert.info('新增成功，现在返回');
                    window.location.href = "#/lms/basic/bankaccount";
                }else if(data.additionalMsg.status=='01'){
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                }
            },
            error:function(){
                 msgAlert.text('系统繁忙 >﹏<');
            }
        })
    }
}])
