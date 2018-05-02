//实名认证
angular.module('MetronicApp').controller('addbankController',
    function($rootScope, $scope, $http, uiGridConstants,settings, bankService,commonUtil) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        //-----------------------------------------------------------------------------------------------------

        bankService.getBankList().success(function (data) {
            $scope.bankList = data.fmsBanks;
        });

        vm.toParent = function(){
            window.location.href="#/fms/bank/bank";
        };

        vm.submit = function() {
            // 验证必填
            if( $("#bankId").val() == undefined || $("#bankId").val() == ""){
                msgAlert.text('请选择归属银行');
                return false;
            }

            if($("#bankAccout").val() == undefined || $("#bankAccout").val() == ""){
                msgAlert.text('请填写银行卡号');
                return;
            }

            if($("#bankAddr").val() == undefined || $("#bankAddr").val() == ""){
                msgAlert.text('请填写开户行地址');
                return;
            }

            // 组装参数
            vm.form = $("#bankForm").serialize();
            vm.form = decodeURIComponent(vm.form, true);

            $.ajax({
                url:"/fmsUserBank/saveUserBank",
                data:vm.form,
                type:"post",
                dataType:"json",
                success:function(data){
                    if(data.additionalMsg.status == 00){
                        msgAlert.text('提交成功');
                        window.location.href="#/fms/bank/bank";
                    }else if(data.additionalMsg.status == 01){
                        msgAlert.text('提交失败 >﹏< ['+ data.additionalMsg.message+']');
                    }
                },
                error:function(){
                    msgAlert.text('系统繁忙 >﹏<');
                }
            })
        };
    }
)