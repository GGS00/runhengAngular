//实名认证
angular.module('MetronicApp').controller('validatemobileController',
    function($rootScope, $scope, $http, $location, uiGridConstants,settings,commonUtil) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        //-----------------------------------------------------------------------------------------------------
        $("#mobile").val($location.search().mobile);
        vm.t = $location.search().t;

        var validateMobileTime;
        var validateMobileSH;
        vm.sendCheckCode = function () {
            vm.activeParam = {
                type: "VALIDATE_MOBILE_PHONE"
            };
            $http({url:"/fmsCheckCode/sendCheckCodeByUser",
                method:"post",
                params:vm.activeParam
            }).success(function (data) {
                if(data.status == '00'){
                    $("#checkUuid").val(data.checkUuid);
                    // 定时操作
                    validateMobileTime = 60;
                    $("#checkCodeBtn").attr("disabled", true);
                    $("#checkCodeTime").html(validateMobileTime + "秒");
                    $("#checkCodeTime").show();
                    $("#checkCodeSuccess").show();
                    validateMobileSH = window.setInterval(function () {
                        validateMobileTime = validateMobileTime - 1;
                        $("#checkCodeTime").html(validateMobileTime + "秒");
                        if(validateMobileTime == 0){
                            clearInterval(validateMobileSH);
                            $("#checkUuid").val("");
                            // 定时操作
                            validateMobileTime = 60;
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
            clearInterval(validateMobileSH);
            window.location.href="#/fms/security/security";
        };

        vm.gotoArtificialAuditPage = function(){
            clearInterval(validateMobileSH);
            window.location.href="#/fms/security/artificialaudit";
        };

        vm.gotoNextPage = function(){
            clearInterval(validateMobileSH);
            if(vm.t == "95gjf980fg"){
                window.location.href="#/fms/security/paypwd";
            } else if (vm.t == "325fsui374") {
                window.location.href="#/fms/security/mobileauth";
            } else {
                msgAlert.text('页面参数有误，请重新进行入页面');
            }
        };

        vm.submit = function() {
            // 验证必填
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
                type: "VALIDATE_MOBILE_PHONE",
                code: code,
                checkUuid: checkUuid
            };
            $http({url:"/fmsCheckCode/validateCheckCode",
                method:"post",
                params:vm.activeParam
            }).success(function (data) {
                if(data.additionalMsg.status == 00){
                    vm.gotoNextPage();
                }else if(data.additionalMsg.status == 01){
                    msgAlert.text('['+ data.additionalMsg.message+']');
                }
            })
        };
    }
)