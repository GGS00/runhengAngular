angular.module('MetronicApp').controller('securityController',
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

        function initPage(){
            loading.show();
            $http({url:"/fmsUserSecurity/obtainUserSecurityInfo",
                method: "get",
                params:{}
            }).success(function(data) {
                loading.hide();
                if(data.status == 00) {
                    // 实名认证
                    vm.isTrueName = data.fmsUserSecurity.isTrueName;
                    vm.isTrueNameStr = convertIsTrueNameStr(vm.isTrueName);
                    vm.realName = data.fmsUserSecurity.realName;
                    vm.certifiNo = data.fmsUserSecurity.certifiNo;
                    if(vm.isTrueName == "1" || vm.isTrueName == "2") {
                        vm.realNameAndCertificateNo = vm.realName + "（" + vm.certifiNo + "）";
                    }else{
                        vm.realNameAndCertificateNo = "";
                    }

                    // 手机认证
                    vm.isMobile = data.fmsUserSecurity.isMobile;
                    vm.isMobileStr = convertIsMobileStr(vm.isMobile);
                    vm.mobile = data.fmsUserSecurity.mobile;

                    // 支付密码
                    vm.isPayPwd = data.fmsUserSecurity.isPayPwd;
                    vm.dealPwdStr = convertPayPwdStr(vm.isPayPwd);

                    // 安全保护问题
                    vm.isSetPwdQuestion = data.fmsUserSecurity.isSetPwdQuestion;
                    vm.isSetPwdQuestionStr = convertIsSetPwdQuestionStr(vm.isSetPwdQuestion);
                }else{
                    // 没有财务帐号，不能进行相关操作
                    window.location.href="#/fms/nouser/nouser";
                }
            });
        }
        initPage();

        //跳转到设置实名认证页面
        vm.gotoRealNameAuthPage = function () {
            window.location.href="#/fms/security/realnameauth";
        };

        vm.gotoQuestionPage = function () {
            window.location.href="#/fms/security/question";
        };

        vm.gotoMobileAuthPage = function () {
            window.location.href="#/fms/security/mobileauth";
        };

        vm.gotoUpdateMobilePage = function () {
            window.location.href="#/fms/security/validatemobile?mobile="+vm.mobile+"&t=325fsui374";
        };

        vm.gotoPayPwdAuthPage = function () {
            if(vm.isMobile == "1"){
                //window.location.href="#/fms/security/paypwd";
                window.location.href="#/fms/security/validatemobile?mobile="+vm.mobile+"&t=95gjf980fg";
            }else{
                msgAlert.text('请先绑定手机号');
            }
        };

        function convertIsTrueNameStr(isTrueName){
            var result = "";
            if(isTrueName == "1"){
                result = "已认证";
            }else if(isTrueName == "2"){
                result = "审核中";
            }else if(isTrueName == "3"){
                result = "审核失败";
            }else{
                result = "未认证";
            }
            return result;
        }

        function convertIsMobileStr(isMobile){
            var result = "";
            if(isMobile == "1"){
                result = "已认证";
            } else {
                result = "未认证";
            }
            return result;
        }

        function convertPayPwdStr(isPayPwd) {
            var result = "";
            if(isPayPwd == "1"){
                result = "已设置";
            } else {
                result = "未设置";
            }
            return result;
        }

        function convertIsSetPwdQuestionStr(isSetPwdQuestion) {
            var result = "";
            if(isSetPwdQuestion == "1"){
                result = "已设置";
            } else {
                result = "未设置";
            }
            return result;
        }
    }
);


