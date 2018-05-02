angular.module('MetronicApp').controller('transferController',
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

        vm.previousStep = function () {
            $("#page1").show();
            $("#page2").hide();
        }

        vm.nextStep = function () {
            // 验证必填
            if($("#phone").val() == undefined || $("#phone").val() == ""){
                msgAlert.text('请输入手机号');
                return;
            }

            $.ajax({
                url:"/fmsUser/obtainUserByPhone",
                data:{mobile:$("#phone").val()},
                type:"get",
                dataType:"json",
                success:function(data){
                    if(data.status == 00) {
                        $scope.$apply(function () {
                            vm.inUserId = data.fmsUser.userId;
                            vm.account = data.fmsUser.realName + "（" + data.fmsUser.mobile + "）";
                            vm.cashAmount = 0;
                            if(data.actAccount != null){
                                if(data.actAccount.cashAmount != 0){
                                    vm.cashAmount = data.actAccount.cashAmount/1000;
                                }
                            }
                            $("#page2").show();
                            $("#page1").hide();
                        })
                    }else{
                        msgAlert.text(data.msg);
                    }
                },
                error:function(){
                    msgAlert.text('系统繁忙 >﹏<');
                }
            })
        };

        vm.submit = function() {
            // 验证必填
            if($("#amount").val() == undefined || $("#amount").val() == ""){
                msgAlert.text('请输入转账金额');
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

            if($("#amount").val() > vm.cashAmount){
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
            vm.form = {
                amount:$("#amount").val(),
                payPwd:encryptedString(key, encodeURIComponent($("#payPwd").val())),
                inUserId:vm.inUserId,
                mobile:$("#phone").val(),
                remark:$("#remark").val()
            };

            $.ajax({
                url:"/fmsTransfer/transfer",
                data:vm.form,
                type:"post",
                dataType:"json",
                success:function(data){
                    if(data.additionalMsg.status == 00){
                        window.location.href="#/fms/account/transferResult";
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


