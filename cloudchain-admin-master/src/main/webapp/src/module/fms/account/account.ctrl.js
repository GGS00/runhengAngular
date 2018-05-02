angular.module('MetronicApp').controller('accountController',
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
            $http({url:"/fmsActAccount/obtainActAccount",
                method: "get",
                params:{}
            }).success(function(data) {
                loading.hide();
                if(data.status == 00) {
                    vm.data = data;
                    vm.amount = 0;
                    if(data.actAccount != null){
                        if(data.actAccount.amount != 0){
                            vm.amount = data.actAccount.amount/1000;
                        }
                    }
                }else{
                    // 没有财务帐号，不能进行相关操作
                    window.location.href="#/fms/nouser/nouser";
                }
            });
        }
        initPage();

        //跳转到提现页面
        vm.gotoWithdrawPage = function () {
            window.location.href="#/fms/account/withdraw";
        };

        //跳转到转账页面
        vm.gotoTransferPage = function () {
            window.location.href="#/fms/account/transfer";
        };

    }
);


