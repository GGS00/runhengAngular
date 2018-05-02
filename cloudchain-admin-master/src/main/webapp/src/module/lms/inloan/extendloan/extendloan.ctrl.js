angular.module('MetronicApp').controller('extendLoanController', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'commonUtil', 'Table', function ($rootScope, $scope, $http, uiGridConstants, settings,  commonUtil, Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.menuLen = 4;
    vm.pageParams = {
        bean: 'lmsInExtendLoan',
        method: 'page',
        page: 1,
        rows: 10
    }
    vm.column = [{
        field: "id",
        displayName: 'ID',
        width: '5%',
        visible: false,
        enableColumnMenu: false,// 是否显示列头部菜单按钮
    },

        {
            field: "customer_code",
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
            field: "code",
            displayName: '发放流水号',
            width: '10%',
        },
        {
            field: "to_issue_amount",
            displayName: '应发放金额',
            width: '10%'
        },
        {
            field: "real_issue_amount",
            displayName: '实际发放金额',
            width: '10%'
        },
        {
            field: "from_bank_account",
            displayName: '转出银行账号',
            width: '10%'
        },
        {
            field: "from_bank_name",
            displayName: '转出开户行',
            width: '10%'
        },
        {
            field: "from_account_name",
            displayName: '转出账户名',
            width: '10%'
        },  {
            field: "to_bank_account",
            displayName: '转入银行账号',
            width: '10%'
        },
        {
            field: "to_bank_name",
            displayName: '转入开户行',
            width: '10%'
        },
        {
            field: "to_account_name",
            displayName: '转入账户名',
            width: '10%'
        },
        {
            field: "cashier_name",
            displayName: '放款人',
            width: '10%'
        },
        {
            field: "issue_time",
            displayName: '发放时间',
            width: '10%'
        },
        {
            field: "creator",
            displayName: '创建人员',
            width: '10%'
        },
        {
            field: "created_time",
            displayName: '创建时间',
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
            bean:'lmsInExtendLoan',
            method:'page',
            page:1,
            rows:10
        }
        vm.getPage();
    }

}])



