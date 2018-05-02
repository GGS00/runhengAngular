//人工审核 ， 更换手机号
angular.module('MetronicApp').controller('artificialauditController',
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
        var artificialAuditTime;
        var artificialAuditSH;
        vm.sendCheckCode = function () {
            var mobile = $("#mobile").val();
            var reg = /^1[0-9]{10}$/;
            if(!reg.test(mobile)){
                msgAlert.text('请输入正确的手机号码');
                $("#mobile").val("");
                return;
            }

            vm.activeParam = {
                type: "MANUAL_AUDIT_MOBILE_PHONE",
                mobile:$("#mobile").val()
            };
            $http({url:"/fmsCheckCode/sendCheckCode",
                method:"post",
                params:vm.activeParam
            }).success(function (data) {
                if(data.status == '00'){
                    $("#checkUuid").val(data.checkUuid);
                    // 定时操作
                    artificialAuditTime = 60;
                    $("#mobile").attr("disabled", true);
                    $("#checkCodeBtn").attr("disabled", true);
                    $("#checkCodeTime").html(artificialAuditTime + "秒");
                    $("#checkCodeTime").show();
                    $("#checkCodeSuccess").show();
                    artificialAuditSH = window.setInterval(function () {
                        artificialAuditTime = artificialAuditTime - 1;
                        $("#checkCodeTime").html(artificialAuditTime + "秒");
                        if(artificialAuditTime == 0){
                            clearInterval(artificialAuditSH);
                            $("#checkUuid").val("");
                            // 定时操作
                            artificialAuditTime = 60;
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
            clearInterval(artificialAuditSH);
            window.location.href="#/fms/security/security";
        };

        vm.submit = function() {
            // 验证必填
            var mobile = $("#mobile").val();
            var code = $("#code").val();
            var checkUuid = $("#checkUuid").val();
            var realName = $("#realName").val();
            var identityCard = $("#identityCard").val();

            if(checkUuid == null || checkUuid == ""){
                msgAlert.text('请重新获取验证码');
                return;
            }
            if(code == null || code == ""){
                msgAlert.text('请输入验证码');
                return;
            }
            if(realName == null || realName == ""){
                msgAlert.text('请输入真实姓名');
                return;
            }

            var flag = isCardID(identityCard);
            if(!flag){
                return ;
            }


            // 提交
            vm.activeParam = {
                type: "MANUAL_AUDIT_MOBILE_PHONE",
                mobile: mobile,
                code: code,
                checkUuid: checkUuid,
                realName: realName,
                identityCard: identityCard
            };
            $http({url:"/fmsLaborEntry/saveLaborEntry",
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

        var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}

        function isCardID(sId){
            var iSum=0 ;
            if(!/^\d{17}(\d|x)$/i.test(sId)) {
                msgAlert.text('你输入的身份证长度或格式错误');
                return false;
            }
            sId = sId.replace(/x$/i,"a");
            if(aCity[parseInt(sId.substr(0,2))] == null){
                msgAlert.text('你的身份证地区非法');
                return false;
            }
            var sBirthday = sId.substr(6,4) + "-" + Number(sId.substr(10,2)) + "-" + Number(sId.substr(12,2));
            var d = new Date(sBirthday.replace(/-/g,"/")) ;
            if(sBirthday != (d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate())){
                msgAlert.text('身份证上的出生日期非法');
                return false;
            }
            for(var i = 17;i >= 0; i--) {
                iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
            }
            if(iSum%11 != 1){
                msgAlert.text('你输入的身份证号非法');
                return false;
            }
            return true;
        }
    }
);