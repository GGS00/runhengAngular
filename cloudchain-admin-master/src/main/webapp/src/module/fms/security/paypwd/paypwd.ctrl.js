//人工审核 ， 更换手机号
angular.module('MetronicApp').controller('paypwdController',
    function($rootScope, $scope, $http,$location, uiGridConstants,settings,commonUtil) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        //-----------------------------------------------------------------------------------------------------
        vm.toParent = function(){
            window.location.href="#/fms/security/security";
        };

        vm.submit = function() {
            // 验证必填
            var paypwd1 = $("#paypwd1").val();
            var paypwd2 = $("#paypwd2").val();

            if(paypwd1 == null || paypwd1 == "" || paypwd2 == null || paypwd2 == ""){
                msgAlert.text('请输入密码');
                return;
            }

            if(paypwd1 != paypwd2){
                msgAlert.text('请确保密码一致');
                return;
            }

            // 提交
            bodyRSA();
            /* encodeURIComponent*/
            vm.activeParam = {
                password: encryptedString(key, encodeURIComponent(paypwd1))
            };

            $http({url:"/fmsUserSecurity/setPayPwd",
                method:"post",
                params:vm.activeParam
            }).success(function (data) {
                if(data.additionalMsg.status == 00){
                    msgAlert.text('支付密码设置成功');
                    vm.toParent();
                }else if(data.additionalMsg.status == 01){
                    msgAlert.text('支付密码设置失败 >﹏< ['+ data.additionalMsg.message+']');
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