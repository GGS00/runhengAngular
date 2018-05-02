//实名认证
angular.module('MetronicApp').controller('realnameauthController',
    function($rootScope, $scope, $http, uiGridConstants,settings,commonUtil,citySelect) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        //-----------------------------------------------------------------------------------------------------
        vm.zhengImg =  {img: "http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=no+image"};
        vm.fanImg =  {img: "http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=no+image"};

        vm.selectPicture = function(type){
            vm.pictureType = type;
            $("#showAddImg").modal("show");
        }

        $scope.addImg = function () {
            var uploadFile = function (client) {
                var file = document.getElementById('file').files[0];
                return client.multipartUpload("cloudchain/fms/security/auth/" + file.name , file).then(function (res) {
                    if(vm.pictureType == "1"){
                        $scope.$apply(function () {
                            vm.skuImgs  = {img:res.url};
                            vm.zhengImg = vm.skuImgs;
                        });
                        vm.skuImgs = {img:res.url};
                        vm.zhengImg = vm.skuImgs;
                        $("#certificateFrontPic").val(res.url);
                    } else {
                        $scope.$apply(function () {
                            vm.skuImgs  = {img:res.url};
                            vm.fanImg = vm.skuImgs;
                        });
                        vm.skuImgs = {img:res.url};
                        vm.fanImg = vm.skuImgs;
                        $("#certificateBackPic").val(res.url);
                    }
                    $("#showAddImg").modal("hide");
                });
            };
            applyTokenDo(uploadFile);
        }

        //OSS上传配置
        var appServer = 'http://app.chaimi.net:3000';
        var bucket = 'cloudchain';
        var region = 'oss-cn-hangzhou';
        var urllib = OSS.urllib;
        var Buffer = OSS.Buffer;
        var Wrapper = OSS.Wrapper;
        var STS = OSS.STS;

        var applyTokenDo = function (func) {
            var url = appServer;
            return urllib.request(url, {
                method: 'GET'
            }).then(function (result) {
                var creds = JSON.parse(result.data);
                var client = new Wrapper({
                    region: "oss-cn-hangzhou",
                    accessKeyId:   creds.AccessKeyId,
                    accessKeySecret: creds.AccessKeySecret,
                    stsToken: creds.SecurityToken,
                    bucket: bucket
                });
                return func(client);
            });
        };

        vm.toParent = function(){
            window.location.href="#/fms/security/security";
        }

        vm.submit = function() {
            //验证信息
            var realName = $("#realName").val();
            if(realName == ""){
                msgAlert.text('请填写真实姓名');
                return;
            }

            var certificateNo = $("#certificateNo").val();
            var flag = isCardID(certificateNo);
            if(!flag){
                return ;
            }

            var certificateFrontPic = $("#certificateFrontPic").val();
            var certificateBackPic = $("#certificateBackPic").val();
            if(certificateFrontPic == "" || certificateBackPic == ""){
                msgAlert.text('请上传证件图片');
                return;
            }

            vm.form = $("#authForm").serialize();
            vm.form = decodeURIComponent(vm.form, true);

            $.ajax({
                url:"/fmsUserAuth/saveAuthApply",
                data:vm.form,
                type:"post",
                dataType:"json",
                success:function(data){
                    if(data.additionalMsg.status == 00){
                        msgAlert.text('提交成功');
                        window.location.href="#/fms/security/security";
                    }else if(data.additionalMsg.status == 01){
                        msgAlert.text('提交失败 >﹏< ['+ data.additionalMsg.message+']');
                    }
                },
                error:function(){
                    msgAlert.text('系统繁忙 >﹏<');
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
)