angular.module('MetronicApp').controller('inReceiptForLoanController', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'commonUtil', 'Table', function ($rootScope, $scope, $http, uiGridConstants, settings,  commonUtil, Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.menuLen = 4;
    vm.pageParams = {
        bean: 'lmsInReceiptForLoan',
        method: 'page',
        page: 1,
        rows: 10,
        check_status:'CHECKED',
        status:'UN_EXTEND'
    }
    vm.column = [{
        field: "id",
        displayName: 'ID',
        width: '5%',
        visible: false,
        enableColumnMenu: false,// 是否显示列头部菜单按钮
    },

        {
            field: "code",
            displayName: '客户编码',
            width: '20%',

        },
        {
            field: "customer_name",
            displayName: '客户名称',
            width: '10%',
        },
        {
            field: "loan_type",
            displayName: '贷款品种',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.loan_type=="INVENTORY_FINANCE"?"货好贷":(row.entity.loan_type=="ORDER_FINANCE"?"单好贷":row.entity.loan_type)}}</div>'
        },
        {
            field: "apply_loan_code",
            displayName: '申请流水号',
            width: '10%'
        },
        {
            field: "check_time3",
            displayName: '审核完成时间',
            width: '10%'
        },
        {
            field: "status",
            displayName: '状态',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.status=="WAIT_COMMIT"?"待提交":(row.entity.status=="WAIT_CHECK"?"待审核":(row.entity.status=="ACTIVE"?"生效":(row.entity.status=="FINISHED"?"完成":(row.entity.status=="WAIT_IN"?"待入库":(row.entity.status=="CHECKING"?"审核中":(row.entity.status=="CHECKED"?"已审核":(row.entity.status=="FINISH_IN"?"入库完成":(row.entity.status=="UN_CHECKED"?"未审核":(row.entity.status=="STATUS_CHECK_PASS"?"审核通过":(row.entity.status=="CHECK_FAIL"?"审核失败":(row.entity.status=="EXTENDED"?"已放款":(row.entity.status=="PART_REFUND"?"部分还款":(row.entity.status=="REFUNDED"?"还款完成":(row.entity.status=="NONE"?"无需回款":(row.entity.status=="UN_BACKED"?"未回款":(row.entity.status=="UN_CLEARED"?"未结清":(row.entity.status=="CLEARED"?"已结清":(row.entity.status=="NO_CLEARED"?"无需结清":(row.entity.status=="INVALID"?"失效":(row.entity.status=="OPEN"?"打开":row.entity.status))))))))))))))))))))}}</div>'
        },
        {
            field: "checked_amount",
            displayName: '应转金额',
            width: '10%'
        },
        {
            field: "loan_amount",
            displayName: '已放款金额',
            width: '10%'
        },
        {
            field: "account_name",
            displayName: '应转入账号名',
            width: '10%'
        },  {
            field: "bank_account",
            displayName: '应转入账号',
            width: '10%'
        },  {
            field: "bank_name",
            displayName: '应转入账号开户行',
            width: '10%'
        }
    ]
    vm.getPage = function () {
        $http({
            url: "/process", method: "get",
            params: vm.pageParams
        }).success(function (data) {
            vm.data = data;
        })
    };
    vm.getPage();

    //审批
    vm.toConfirmExtend = function(){
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.info('请先选择要审批记录');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.info('每次只能审批一条记录');
            return false;

        }else {
            window.location.href="#/lms/inloan/inreceiptforloan/confirmextend?id="+vm.entity.getSelectedRows()[0].id;
        }
    }
    vm.getPageByFilter = function(){
        var applyLoanCode = $('input[name="applyLoanCode"]').val();
        var customerName = $('input[name="customerName"]').val();

        var loanType = $('#id_loan_type').val();
        if(loanType == " "){
            loanType ="";
        }

        if(applyLoanCode == "" && customerName == "" && loanType == ""){
            msgAlert.info('搜索条件不能为空');
            return false;
        }
        vm.pageParams = {
            applyLoanCode:applyLoanCode,
            customerName:customerName,
            loanType:loanType,
            bean:'lmsInReceiptForLoan',
            method:'page',
            page:1,
            rows:10
        }
        vm.getPage();
    }
}])



