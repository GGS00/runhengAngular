angular.module('MetronicApp').controller('tradelistController',
    function($rootScope, $scope, $http, uiGridConstants,settings, order,commonUtil) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        // ===========================================================================
        initWithdraw();
        initTransfer();

        vm.showTabs = function(type){
            if(type == "withdraw"){
                $('#myTab a[href="#withdraw"]').tab('show');
                vm.getWithdrawPage();

            } else if(type == "transfer") {
                $('#myTab a[href="#transfer"]').tab('show');
                vm.getTransferPage();
            }
        };

        vm.getWithdrawByFilter = function(){
            var beginTime = $('.withdrawApplyTimeDiv span').html();
            var endTime = "";
            if(beginTime == undefined || beginTime == "-"){
                beginTime ="";
            }else{
                beginTime = $('.withdrawApplyTimeDiv span').html().slice(0,10);
                endTime = $('.withdrawApplyTimeDiv span').html().slice(11,21);
            }

            vm.withdrawParams = {
                orderNumber:vm.withdrawOrderNumber,
                status:vm.withdrawStatus,
                beginTime:beginTime,
                endTime:endTime,
                bean:'fmsTradeWithdrawList',
                method:'page',
                page:1,
                rows:10
            }
            vm.getWithdrawPage();
        }

        vm.getTransferByFilter = function(){

            var beginTime = $('.transferApplyTimeDiv span').html();
            var endTime = "";
            if(beginTime == undefined || beginTime == "-"){
                beginTime ="";
            }else{
                beginTime = $('.transferApplyTimeDiv span').html().slice(0,10);
                endTime = $('.transferApplyTimeDiv span').html().slice(11,21);
            }

            vm.transferParams = {
                transferNumber:vm.transferOrderNumber,
                phone:vm.transferPhone,
                //status:vm.transferStatus,
                beginTime:beginTime,
                endTime:endTime,
                bean:'fmsTradeTransferList',
                method:'page',
                page:1,
                rows:10
            }
            vm.getTransferPage();
        }

        function initWithdraw() {
            vm.withdrawParams = {bean:'fmsTradeWithdrawList', method:'page', page:1, rows:10};

            vm.withdrawColumn = [
                {field: "order_number", displayName: '交易单号',width:150},
                {
                    field: "bank_name",
                    displayName: '卡号',
                    width:250,
                    cellTemplate:"<div style=\"padding:5px\">{{row.entity.bank_name}}（{{row.entity.bank_account}}）</div>"
                },
                {
                    field: "order_amount",
                    displayName: '提现金额（元）',
                    width:150,
                    cellTemplate:"<div style=\"padding:5px\">{{row.entity.order_amount/1000}}</div>"
                },
                {
                    field: "withdrow_amount",
                    displayName: '到账金额（元）',
                    width:150,
                    cellTemplate:"<div style=\"padding:5px\">{{row.entity.withdrow_amount/1000}}</div>"
                },
                {
                    field: "fee",
                    displayName: '手续费（元）',
                    width:150,
                    cellTemplate:"<div style=\"padding:5px\">{{row.entity.fee/1000}}</div>"
                },
                {
                    field: "order_time",
                    displayName: '申请时间',
                    width:170
                },
                {
                    field: "finished_time",
                    displayName: '完成时间',
                    width:170
                },
                {
                    field: "status",
                    displayName: '状态',
                    width:100,
                    cellTemplate:"<div style=\"padding:5px\">{{row.entity.status==0?'提现中':(row.entity.status==1?'成功':(row.entity.status==2?'失败':''))}}</div>"
                }
            ];

            vm.getWithdrawPage = function () {
                loading.show();
                commonUtil.getList(vm.withdrawParams).success(function(data) {
                    vm.withdrawData = data;
                    loading.hide();
                });
            };

            vm.getWithdrawPage();
        }
        
        function initTransfer() {
            vm.transferParams = {bean:'fmsTradeTransferList', method:'page', page:1, rows:10};

            vm.transferColumn = [
                {
                    field: "transfer_number",
                    displayName: '交易单号',
                    width:150
                },
                {
                    field: "in_code",
                    displayName: '对方账户',
                    width:250,
                    cellTemplate:"<div style=\"padding:5px\">{{row.entity.real_name}}（{{row.entity.in_code}}）</div>"
                },
                {
                    field: "order_amount",
                    displayName: '转账金额（元）',
                    width:150,
                    cellTemplate:"<div style=\"padding:5px\">{{row.entity.order_amount/1000}}</div>"
                },
                {
                    field: "transfer_amount",
                    displayName: '到账金额（元）',
                    width:150,
                    cellTemplate:"<div style=\"padding:5px\">{{row.entity.transfer_amount/1000}}</div>"
                },
                {
                    field: "fee",
                    displayName: '手续费（元）',
                    width:150,
                    cellTemplate:"<div style=\"padding:5px\">{{row.entity.fee/1000}}</div>"
                },
                {
                    field: "out_time",
                    displayName: '转账时间',
                    width:170
                },
                {
                    field: "status",
                    displayName: '状态',
                    width:100,
                    cellTemplate:"<div style=\"padding:5px\">{{row.entity.status==0?'待处理':(row.entity.status==1?'成功':'')}}</div>"
                },
                {
                    field: "remark",
                    displayName: '说明',
                    width:250
                }
            ];

            vm.getTransferPage = function () {
                loading.show();
                commonUtil.getList(vm.transferParams).success(function(data) {
                    vm.transferData = data;
                    loading.hide();
                });
            };
        }
});