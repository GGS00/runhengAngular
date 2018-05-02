angular.module('MetronicApp').controller('bankController',
    function ($rootScope, $scope, $http, uiGridConstants, settings, commonUtil, Table) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;

        vm.pageParams = {
            bean: 'fmsUserBank',
            method: 'page',
            page: 1,
            rows: 10
        };
        vm.column = [{
                field: "id",
                displayName: 'ID',
                width: '5%',
                visible: false,
                enableColumnMenu: false,// 是否显示列头部菜单按钮
            },
            {
                field: 'bank_name',
                displayName: '银行',
                width: '15%'
            },
            {
                field: "bank_accout",
                displayName: '卡号',
                width: '20%'
            },
            {
                field: "bank_addr",
                displayName: '开户行地址',
                width: '20%'
            },
            {
                field: "is_default",
                displayName: '是否默认',
                width: '10%',
                cellTemplate:'<div style="padding:5px">{{row.entity.is_default=="1"?"是":"否"}}</div>'
            },
            {
                field: "created_time",
                displayName: '创建时间',
                width: '20%'
            }
        ];
        vm.getPage = function () {
            loading.show();
            $http({
                url: "/process", method: "get",
                params: vm.pageParams
            }).success(function (data) {
                vm.data = data;
                loading.hide();
            })
        };

        vm.initPage = function () {
            $http({
                url: "/fmsUser/obtainUserInfo", method: "get",
                params: vm.pageParams
            }).success(function (data) {
                if(data.additionalMsg.status == "00"){
                    vm.getPage();
                }else{
                    // 没有财务帐号，不能进行相关操作
                    window.location.href="#/fms/nouser/nouser";
                }
            })
        };
        vm.initPage();

        //刷新页面
        vm.refreshPage =function () {
            vm.getPage();
        };

        //新建银行卡
        vm.addBankPage =function () {
            window.location.href = "#/fms/bank/addbank";
        };

        vm.deleteBank = function(){
            vm.selectListActive = [];
            if(vm.entity.getSelectedRows().length == 0){
                msgAlert.text('请选择需要删除的记录');
                return false;
            }else{
                for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                    vm.selectListActive.push(vm.entity.getSelectedRows()[i].id);
                }
                vm.activeParam = {
                    ids: vm.selectListActive.join()
                };

                $http({url:"/fmsUserBank/batchDeleteUserBank",
                    method: "post",
                    params:vm.activeParam,
                }).success(function (data) {
                    if(data.additionalMsg.status == '00'){
                        msgAlert.info('操作成功');
                        vm.getPage();
                        vm.entity.clearSelectedRows();
                    }else if(data.additionalMsg.status=='01'){
                        msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                        vm.entity.clearSelectedRows();
                    }
                })
            }
        };

        vm.setDefaultBank = function(){
            if(vm.entity.getSelectedRows().length == 0){
                msgAlert.text('请选择记录');
                return false;
            }else if(vm.entity.getSelectedRows().length > 1){
                msgAlert.text('每次只能操作一条记录');
            }else{
                vm.activeParam = {
                    id: vm.entity.getSelectedRows()[0].id
                };
                $http({url:"/fmsUserBank/setDefaultUserBank",
                    method: "post",
                    params:vm.activeParam,
                }).success(function (data) {
                    if(data.additionalMsg.status == '00'){
                        msgAlert.info('操作成功');
                        vm.getPage();
                        vm.entity.clearSelectedRows();
                    }else if(data.additionalMsg.status=='01'){
                        msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                        vm.entity.clearSelectedRows();
                    }
                })
            }
        };
    }
);