angular.module('MetronicApp').controller('withdrawController',
    function ($rootScope, $scope, $http, uiGridConstants, settings, commonUtil,Table) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        //----------------------------------------------------------------------------------------------

        $http({url:"/fmsWithdraw/initWithdraw",
            method: "get"
        }).success(function (data) {
            $scope.userBankList = [];
            for(var i = 0; i < data.fmsUserBanks.length; i++) {
                var fmsUserBank = data.fmsUserBanks[i];
                var name = fmsUserBank.bankName + "（" + fmsUserBank.bankAccout + "）";
                var userBank = {id:fmsUserBank.id, name: name};
                $scope.userBankList.push(userBank);

                if(fmsUserBank.isDefault == "1"){
                    $scope.defaultUserBank = fmsUserBank.id;
                }
            }

            vm.amount = 0;
            if(data.actAccount != null){
                if(data.actAccount.cashAmount != 0){
                    vm.amount = data.actAccount.cashAmount/1000;
                }
            }
        });
        
        vm.allWithdraw = function () {
            $("#amount").val(vm.amount);
        }

        vm.submit = function() {
            // 验证必填
            if( $scope.defaultUserBank == undefined || $scope.defaultUserBank == "" || $scope.defaultUserBank == null){
                msgAlert.text('请选择银行卡');
                return false;
            }

            if($("#amount").val() == undefined || $("#amount").val() == ""){
                msgAlert.text('请输入提现金额');
                return;
            }

            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,3})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if (!reg.test($("#amount").val())) {
                msgAlert.text('请输入有效的金额');
                return;
            };

            if($("#amount").val() == 0){
                msgAlert.text('请输入有效的金额');
                return;
            }

            if($("#amount").val() > vm.amount){
                msgAlert.text('转账金额超过可用金额');
                return;
            }

            if($("#payPwd").val() == undefined || $("#payPwd").val() == ""){
                msgAlert.text('请输入支付密码');
                return;
            }

            // 提交
            bodyRSA();
            // 组装参数
            vm.form = {bankId:$scope.defaultUserBank,
                amount:$("#amount").val(),
                payPwd:encryptedString(key, encodeURIComponent($("#payPwd").val()))
            };

            $.ajax({
                url:"/fmsWithdraw/withdraw",
                data:vm.form,
                type:"post",
                dataType:"json",
                success:function(data){
                    if(data.additionalMsg.status == 00){
                        window.location.href="#/fms/account/withdrawResult";
                    }else if(data.additionalMsg.status == 01){
                        msgAlert.text(data.additionalMsg.message);
                    }
                },
                error:function(){
                    msgAlert.text('系统繁忙 >﹏<');
                }
            })
        };

        var key;
        function bodyRSA(){
            setMaxDigits(130);
            key = new RSAKeyPair("10001","","f5e769a799b21ffb5eb358006f110e3653eaf7ade25e764fb722c912fa049156ea851a4929428059cddbc269cd868bc089df30fb22bcb89b79c965f4fee81c516a147b777c5361d63d11e8504b0a416f8cf69f7e810ced126137911010fb72e15ba2d700fcb8663a64e6bffcece7c45d7414a795281420f508387b6017b56037");
        }
    }
);


