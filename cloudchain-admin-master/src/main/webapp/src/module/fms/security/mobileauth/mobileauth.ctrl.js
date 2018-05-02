//实名认证
angular.module('MetronicApp').controller('mobileauthController',
    function($rootScope, $scope, $http, uiGridConstants,settings,commonUtil) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        //-----------------------------------------------------------------------------------------------------
        var mobileAuthTime;
        var mobileAuthSH;
        vm.sendCheckCode = function () {
            var mobile = $("#mobile").val();
            var reg = /^1[0-9]{10}$/;
            if(!reg.test(mobile)){
                msgAlert.text('请输入正确的手机号码');
                $("#mobile").val("");
                return;
            }

            vm.activeParam = {
                type: "INSTALL_MOBILE_PHONE",
                mobile:$("#mobile").val()
            };
            $http({url:"/fmsCheckCode/sendCheckCode",
                method:"post",
                params:vm.activeParam
            }).success(function (data) {
                if(data.status == '00'){
                    $("#checkUuid").val(data.checkUuid);
                    // 定时操作
                    mobileAuthTime = 60;
                    $("#mobile").attr("disabled", true);
                    $("#checkCodeBtn").attr("disabled", true);
                    $("#checkCodeTime").html(mobileAuthTime + "秒");
                    $("#checkCodeTime").show();
                    $("#checkCodeSuccess").show();
                    mobileAuthSH = window.setInterval(function () {
                        mobileAuthTime = mobileAuthTime - 1;
                        $("#checkCodeTime").html(mobileAuthTime + "秒");
                        if(mobileAuthTime == 0){
                            clearInterval(mobileAuthSH);
                            $("#checkUuid").val("");
                            // 定时操作
                            mobileAuthTime = 60;
                            $("#mobile").attr("disabled", false);
                            $("#checkCodeTime").html("");
                            $("#checkCodeTime").hide();
                            $("#checkCodeSuccess").hide();
                            $("#checkCodeBtn").attr("disabled", false);
                        }
                    }, 1000);
                }
            })
        };
        
        vm.toParent = function(){
            clearInterval(mobileAuthSH);
            window.location.href="#/fms/security/security";
        };

        vm.submit = function() {
            // 验证必填
            var mobile = $("#mobile").val();
            var code = $("#code").val();
            var checkUuid = $("#checkUuid").val();

            if(code == null || code == ""){
                msgAlert.text('请获取验证码');
                return;
            }

            if(code == null || code == ""){
                msgAlert.text('请输入验证码');
                return;
            }

            // 提交
            vm.activeParam = {
                type: "INSTALL_MOBILE_PHONE",
                mobile: mobile,
                code: code,
                checkUuid: checkUuid
            };
            $http({url:"/fmsUserSecurity/bindMobile",
                method:"post",
                params:vm.activeParam
            }).success(function (data) {
                if(data.additionalMsg.status == 00){
                    msgAlert.text('提交成功');
                    toParent();
                }else if(data.additionalMsg.status == 01){
                    msgAlert.text('提交失败 >﹏< ['+ data.additionalMsg.message+']');
                }
            })
        };
    }
)