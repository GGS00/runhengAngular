angular.module('MetronicApp').controller('settleByCustomerController', function ($rootScope, $scope,$http,$location, uiGridConstants, settings,commonUtil, Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    })
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    //获取应还利息
    vm.getInterest = function(){
        var customerId = $("input[name='customerId']").val();
        var payTime = $('.payTime span').html();
        var payAmount = $("input[name='payAmount']").val();
        vm.param={
            customerId:customerId,
            time:payTime,
            payAmount:payAmount
        };
        if(payAmount!=="" && payAmount!==null && payTime!==null && payTime!==""){
            $http({
                url:"/LmsOutbound/getInterest",
                method:"post",
                params:vm.param
            }).success(function(data) {
                vm.toRepayInterest=data.obj;

            }).error(function(){
                msgAlert.text('系统繁忙 >﹏<');
            });
        }
    };
    //返回上一页按钮
    vm.return = function () {
        window.history.back(-1);
    }
    vm.confirmSettlement=function(){
        var payAmount = $("input[name='payAmount']").val();
        var bankName = $("input[name='bankName']").val();
        var accountName = $("input[name='accountName']").val();
        var bankAccount = $("input[name='bankAccount']").val();
        var customerId = $("input[name='customerId']").val();
        /*var arrivalBankId = $("input[name='arrivalBankId']").val();*/
        var payTime = $('.payTime span').html();
        vm.approveParam={
            payAmount:payAmount,
            bankName:bankName,
            accountName:accountName,
            bankAccount:bankAccount,
            customerId:customerId,
            /*customerName:customerName,*/
            /* arrivalBankId:arrivalBankId,*/
            time:payTime,
        };
        $http({
            url:"/LmsAfterReceiptForReturn/settleByCustomer",
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
    vm.customerColumn = [
        {
            field: 'id',
            displayName: 'ID',
           /* enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            visible:false,
            suppressRemoveSort: true,
            enableCellEdit: true,*/ // 是否可编辑
        },
        {
            field: "code",
            displayName: '编码',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        },
        {
            field: "name",
            displayName: '名称',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }
    ]
    vm.placeholder_customerName = '请输入客户名';
    vm.icon_customer= 'plus';
    vm.customerParams = {
        bean: 'lmsCustomer',
        method: 'page',
        page: 1,
        rows: 10
    }
    vm.customerPage = function () {
        commonUtil.getList(vm.customerParams).success(function (data) {
            if (data.additionalMsg.status == '00') {
                vm.customerData = data;
            } else{
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });

    };
    vm.customerPage();
})