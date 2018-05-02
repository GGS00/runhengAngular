/**
 * 入库单控制器
 */
angular.module('MetronicApp').controller('addLoanRuleController', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'commonUtil', 'Table', function ($rootScope, $scope, $http, uiGridConstants, settings, commonUtil, Table) {
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
    /*********** **************************************************保存新建贷款规则************************************************************************************/
    vm.saveNewLoanRule =function () {
        if ($("input[name='code']").val()== "") {
            msgAlert.text('请输入编码');
            return false;
        }
        if ($("input[name='name']").val()== "") {
            msgAlert.text('请输入名称');
            return false;
        }
        if ($("input[name='yearInterest']").val()== "") {
            msgAlert.text('请输入月利率');
            return false;
        }
        if ($("input[name='discountRate']").val()== "") {
            msgAlert.text('请输入折扣率');
            return false;
        }
        if ($("input[name='daysOfYear']").val()== "") {
            msgAlert.text('请输入一年天数');
            return false;
        }
        if ($("input[name='noticeMail']").val()== "") {
            msgAlert.text('请输入通知邮箱');
            return false;
        }


        vm.form = $("#lmsLoanRule").serialize();
        vm.form = decodeURIComponent(vm.form,true);
        console.log(vm.form)
        $.ajax({
            url:"/lmsLoanRule/add",
            data:vm.form,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.additionalMsg.status=='成功' || data.additionalMsg.status == '00'){
                    msgAlert.info('新增成功，现在返回');
                    window.location.href = "#/lms/basic/loanrule";
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
