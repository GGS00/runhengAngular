angular.module('MetronicApp').controller('settleByOrderController', function ($rootScope, $scope,$http,$location, uiGridConstants, settings,commonUtil, Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    })
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    vm.showSwitch= 0;
    vm.ids =  $location.search().ids;
    vm.menuLen = 4;
    vm.pageParams = {
        bean: 'lmsAfterReceiptForReturn',
        method: 'page',
        page: 1,
        rows: 10,
        ids:vm.ids,
    }
    vm.column = [
        {
            field: "id",
            displayName: 'id',
            visible: false,
            enableColumnMenu: false// 是否显示列头部菜单按钮
        },
        {
            field: "customer_code",
            displayName: '客户编码'
        },
        {
            field: "customer_name",
            displayName: '客户名称'
        },
        {
            field: "to_repay_capital",
            displayName: '未还本金'
        },
        {
            field: "borrow_date",
            displayName: '借款日期'
        }
    ]

    vm.getPage = function () {

        commonUtil.getList(vm.pageParams).success(function (data) {

            if ( data.additionalMsg.status == '00') {
                vm.data = data;
            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });
    };
    vm.getPage();
    //返回上一页按钮
    vm.return = function () {
        window.history.back(-1);
    }
    vm.confirmSettlement=function(){
        var payAmount = $("input[name='payAmount']").val();
        var bankName = $("input[name='bankName']").val();
        var accountName = $("input[name='accountName']").val();
        var bankAccount = $("input[name='bankAccount']").val();
        var payTime = $('.payTime span').html();
        vm.approveParam={
            payAmount:payAmount,
            bankName:bankName,
            accountName:accountName,
            bankAccount:bankAccount,
            time:payTime,
            orderIds:vm.ids
        };
        $http({
            url:"/LmsAfterReceiptForReturn/settleByOrder",
            method:"post",
            params:vm.approveParam
        }).success(function(data) {
            if(data.additionalMsg.status==00){
                msgAlert.info("结算成功，现在返回");
                window.location.href="#/lms/afterloan/receiptforreturn";
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
            }
        }).error(function(){
            msgAlert.text('系统繁忙 >﹏<');
        });
    };
    vm.accountColumn = [
        {
            field: 'id',
            displayName: 'ID',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            visible:false,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        },
        {
            field: "account_name",
            displayName: '账户名',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        },
        {
            field: "bank_account",
            displayName: '账号',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        },
        {
            field: "bank_name",
            displayName: '开户行',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }
    ]
    vm.placeholder_accountName = '请输入账户名';
    vm.icon_account= 'plus';
    vm.accountParams = {
        bean: 'lmsBankAccount',
        method: 'page',
        page: 1,
        rows: 10
    }
    vm.accountPage = function () {
        commonUtil.getList(vm.accountParams).success(function (data) {
            if (data.additionalMsg.status == '00') {
                vm.accountData = data;
            } else{
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });

    };
    vm.accountPage();
})