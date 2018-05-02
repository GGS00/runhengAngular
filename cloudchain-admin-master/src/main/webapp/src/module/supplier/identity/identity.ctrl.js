angular.module('MetronicApp')
    .controller('identityCtrl', ['$rootScope', '$scope', '$http', '$stateParams', 'uiGridConstants', 'settings','citySelect', 'suppServer', 'commonUtil', 'Table', function ($rootScope, $scope, $http, $stateParams, uiGridConstants, settings,citySelect, suppServer, commonUtil, Table) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        var userid = $stateParams.Id;
        /**************************************************添加账号************************************************************************************************/
        vm.Ident_column = [{
            field: "userId",
            displayName: '用户id',
            visible: false,
        },
            {
                field: "userType",
                displayName: '账号类型',
                cellTemplate:'<div style="padding:5px">{{row.entity.userType==4?"主账号":""}}</div>'

            },
            {
                field: "userName",
                displayName: '账号',
            },
            {
                name: "操作",
                displayName: '操作',

            }
        ]
        vm.identity_params = {}
        vm.identdata;
        vm.getIdentPage = function () {
            $http({
                    url: "/user/qryUserInfoByUserId/" + userid, method: "get",
            }).success(function (data) {
                if (data.additionalMsg.status == '00') {
                    if (data.rows[0].userName == null || data.rows[0].userName == "") {
                        vm.identdata = null;
                    } else {
                        vm.identdata = data;
                    }

                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });

        };
        vm.getIdentPage();

        //添加账号
        vm.addIdent = function () {
            if ( vm.identdata== null ||  vm.identdata == "") {
                $('#addIdent').modal('show');
            }else  if(   vm.identdata.rows.length>=1){
                msgAlert.text('已有账号，不能再次添加');
                return;
            }
        }
        //确认添加账号
        vm.btaddIdent = function () {
            
            var namereg = /^(?![0-9]*$)[a-zA-Z0-9]{6,20}$/;
            vm.userName = $.trim($("#id_name").val());
            vm.password = $.trim($("#id_passwd").val());
            vm.userId = userid;
            if (vm.userName == "" && vm.userName !== undefined) {
                msgAlert.text('账号不能为空');
                return;
            }

            if (vm.userName.match(namereg) == null) {
                msgAlert.text('登入账号必须为字母+数字/纯字母/大于6个字');
                return false;
            }
            if (vm.password == "" && vm.password !== undefined) {
                msgAlert.text('密码不能为空');
                return;
            }
            bodyRSA();
            /* encodeURIComponent*/
            vm.password = encryptedString(key, encodeURIComponent($.trim($("#id_passwd").val())));
            suppServer.addAccounts(vm).success(function (data) {
                if (data.status == '00') {
                    $('#addIdent').modal('hide');
                    msgAlert.text('添加成功');
                    vm.getIdentPage();

                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
                }
            });
        }
        var key;

        function bodyRSA() {
            setMaxDigits(130);
            key = new RSAKeyPair("10001", "", "f5e769a799b21ffb5eb358006f110e3653eaf7ade25e764fb722c912fa049156ea851a4929428059cddbc269cd868bc089df30fb22bcb89b79c965f4fee81c516a147b777c5361d63d11e8504b0a416f8cf69f7e810ced126137911010fb72e15ba2d700fcb8663a64e6bffcece7c45d7414a795281420f508387b6017b56037");
        }
        //返回按钮
        vm.returnButton = function () {
            window.history.back(-1);
        }
    }]);