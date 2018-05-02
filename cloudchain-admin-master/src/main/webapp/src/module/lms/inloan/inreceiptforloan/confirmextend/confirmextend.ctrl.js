angular.module('MetronicApp').controller('confirmExtendController', function ($rootScope, $scope,$http,$location, uiGridConstants, settings,commonUtil, Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    })
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    vm.showSwitch= 0;
    vm.id =  $location.search().id;
    initial();
    function initial(){
        $http({url:"/LmsInReceiptForLoan/load",
            method: "post",
            params:{
                id:vm.id
            }
        }).success(function(data) {
            vm.objData = data;
        });
    }
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

    //返回上一页按钮
    vm.return = function () {
        window.history.back(-1);
    }
    vm.confirm=function(){
        /*if ($("#checkStatus3 option:selected").val()== "") {
         msgAlert.text('请输入审批结果');
         return false;
         }*/
        // var applyLoanId=$("#checkStatus3 option:selected").val();
        var applyLoanId = $("input[name='applyLoanId']").val();
        var applyLoanCode = $("input[name='applyLoanCode']").val();
        var customerCode= $("input[name='customerCode']").val();
        var customerName= $("input[name='customerName']").val();
        var customerId= $("input[name='customerId']").val();
        var fromAccountName= $("input[name='fromAccountName']").val();
        var fromBankAccount= $("input[name='fromBankAccount']").val();
        var fromBankName= $("input[name='fromBankName']").val();
        var toAccountName= $("input[name='toAccountName']").val();
        var toBankAccount= $("input[name='toBankAccount']").val();
        var toBankName= $("input[name='toBankName']").val();
        var realIssueAmount= $("input[name='realIssueAmount']").val();
        var issueTime = $('.issueTime span').html();
        var description= $("input[name='description']").val();
        var loanType= $("input[name='loanType']").val();
        var toIssueAmount= $("input[name='toIssueAmount']").val();
        /* var a = issueTime.split(" ");
         var b = a[0].split("-");
         var c = a[1].split(":");
         //var date = new Date(b[0], b[1], b[2], c[0], c[1], c[2]);
         var date=new Date();*/
        vm.confirmParam={
            applyLoanCode:applyLoanCode,
            customerCode:customerCode,
            customerName:customerName,
            applyLoanId:applyLoanId,
            fromAccountName:fromAccountName,
            fromBankAccount:fromBankAccount,
            fromBankName:fromBankName,
            toAccountName:toAccountName,
            toBankAccount:toBankAccount,
            toBankName:toBankName,
            realIssueAmount:realIssueAmount,
            time:issueTime,
            description:description,
            loanType:loanType,
            toIssueAmount:toIssueAmount,
            customerId:customerId
        };

        /* vm.form = $("#confirmExtend").serialize();
         vm.form = decodeURIComponent(vm.form,true);
         $.ajax({
         url:"/LmsInExtendLoan/doConfirmExtend",
         data:vm.form,
         type:"post",
         dataType:"json",
         success:function(data){
         if(data.additionalMsg.status=='成功' || data.additionalMsg.status == '00'){
         msgAlert.info('审批成功，现在返回');
         window.location.href="#/lms/inloan/inreceiptforloan";
         }else if(data.additionalMsg.status=='01'){
         msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
         }
         },
         error:function(){
         msgAlert.text('系统繁忙 >﹏<');
         }
         })*/
        $http({
            url:"/LmsInExtendLoan/doConfirmExtend",
            method:"post",
            params:vm.confirmParam
        }).success(function(data) {
            if(data.additionalMsg.status==00){
                msgAlert.info("放款成功，现在返回");
                window.location.href="#/lms/inloan/inreceiptforloan";
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
            }
        }).error(function(){
            msgAlert.text('系统繁忙 >﹏<');
        });
    };

})