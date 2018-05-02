angular
    .module('MetronicApp')
    .config(loanRouter)
    .config(lazyLoad)




loanRouter.$inject= ['$stateProvider'];
lazyLoad.$inject= ['$ocLazyLoadProvider'];

function  loanRouter($stateProvider) {
    $stateProvider

        .state('lms', {
            url: "/lms",
            template: '<div ui-view></div>'
        })
        .state('lms.basic', {
            url: "/basic",
            template: '<div ui-view></div>'
        })
        .state('lms.afterloan', {
            url: "/afterloan",
            template: '<div ui-view></div>'
        })
        .state('lms.inloan', {
            url: "/inloan",
            template: '<div ui-view></div>'
        })
        .state('lms.preloan', {
            url: "/preloan",
            template: '<div ui-view></div>'
        })
        //基础管理
        //贷款规则
        .state('lms.basic.loanrule', {
            url: "/loanrule",
            templateUrl: "/dist/tpl/lms/basic/loanrule.html",
            controller: "loanRuleController",
            controllerAs: "loanRule"
        })
        .state('lms.basic.addloanrule', {
            url: "/loanrule/add",
            templateUrl: "/dist/tpl/lms/basic/addLoanRule.html",
            controller: "addLoanRuleController",
            controllerAs: "addLoanRule"
        })
        .state('lms.basic.editLoanRule', {
            url: "/loanrule/update",
            templateUrl: "/dist/tpl/lms/basic/updateLoanRule.html",
            controller: "editLoanRuleController",
            controllerAs: "editLoanRule"
        })
        //客户管理
        .state('lms.basic.customer', {
            url: "/customer",
            templateUrl: "/dist/tpl/lms/basic/customer.html",
            controller: "customerController",
            controllerAs: "customer"
        })
        .state('lms.basic.addCustomer', {
            url: "/customer/add",
            templateUrl: "/dist/tpl/lms/basic/addCustomer.html",
            controller: "addCustomerController",
            controllerAs: "addCustomer"
        })
        .state('lms.basic.editCustomer', {
            url: "/customer/update",
            templateUrl: "/dist/tpl/lms/basic/updateCustomer.html",
            controller: "editCustomerController",
            controllerAs: "editCustomer"
        })
        //银行账号
        .state('lms.basic.bankaccount', {
            url: "/bankaccount",
            templateUrl: "/dist/tpl/lms/basic/bankaccount.html",
            controller: "bankAccountController",
            controllerAs: "bankAccount"
        })
        .state('lms.basic.addBankAccount', {
            url: "/bankaccount/add",
            templateUrl: "/dist/tpl/lms/basic/addBankAccount.html",
            controller: "addBankAccountController",
            controllerAs: "addBankAccount"
        })
        .state('lms.basic.editBankAccount', {
            url: "/bankaccount/update",
            templateUrl: "/dist/tpl/lms/basic/updateBankAccount.html",
            controller: "editBankAccountController",
            controllerAs: "editBankAccount"
        })
        //贷前管理
        //资料审核
        .state('lms.preloan.applycredit', {
            url: "/applycredit",
            templateUrl: "/dist/tpl/lms/preloan/applycredit.html",
            controller: "applyCreditController",
            controllerAs: "applyCredit"
        })
        .state('lms.preloan.approveapplycredit', {
            url: "/applycredit/approve",
            templateUrl: "/dist/tpl/lms/preloan/approveapplycredit.html",
            controller: "approveApplyCreditController",
            controllerAs: "approveApplyCredit"
        })
        //入库审核
        .state('lms.preloan.inbound', {
            url: "/inbound",
            templateUrl: "/dist/tpl/lms/preloan/inbound.html",
            controller: "inboundController",
            controllerAs: "inbound"
        })
        .state('lms.preloan.approveinbound', {
            url: "/inbound/approveinbound",
            templateUrl: "/dist/tpl/lms/preloan/approveinbound.html",
            controller: "approveInboundController",
            controllerAs: "approveInbound"
        })
        //贷中管理
        //产品部审核列表
        .state('lms.inloan.product', {
            url: "/product",
            templateUrl: "/dist/tpl/lms/inloan/productlist.html",
            controller: "productListController",
            controllerAs: "productList"
        })
        //产品部审核详情
        .state('lms.inloan.productcheck', {
            url: "/product/productcheck",
            templateUrl: "/dist/tpl/lms/inloan/productcheck.html",
            controller: "productCheckController",
            controllerAs: "productCheck"
        })
        //金融部审核列表
        .state('lms.inloan.finance', {
            url: "/finance",
            templateUrl: "/dist/tpl/lms/inloan/financelist.html",
            controller: "financeListController",
            controllerAs: "financeList"
        })
        //金融部审核详情
        .state('lms.inloan.financecheck', {
            url: "/finance/financecheck",
            templateUrl: "/dist/tpl/lms/inloan/financecheck.html",
            controller: "financeCheckController",
            controllerAs: "financeCheck"
        })
        //总监审核列表
        .state('lms.inloan.manager', {
            url: "/manager",
            templateUrl: "/dist/tpl/lms/inloan/managerlist.html",
            controller: "managerListController",
            controllerAs: "managerList"
        })
        //总监审核详情
        .state('lms.inloan.managercheck', {
            url: "/manager/managercheck",
            templateUrl: "/dist/tpl/lms/inloan/managercheck.html",
            controller: "managerCheckController",
            controllerAs: "managerCheck"
        })
        //待放款
        .state('lms.inloan.inreceiptforloan', {
            url: "/inreceiptforloan",
            templateUrl: "/dist/tpl/lms/inloan/inreceiptforloan.html",
            controller: "inReceiptForLoanController",
            controllerAs: "inReceiptForLoan"
        })
        //确认放款
        .state('lms.inloan.confirmextend', {
            url: "/inreceiptforloan/confirmextend",
            templateUrl: "/dist/tpl/lms/inloan/confirmextend.html",
            controller: "confirmExtendController",
            controllerAs: "confirmExtend"
        })
        //确认放款
        .state('lms.inloan.extendloan', {
            url: "/extendloan",
            templateUrl: "/dist/tpl/lms/inloan/extendloan.html",
            controller: "extendLoanController",
            controllerAs: "extendLoan"
        })
        //出库审核
        .state('lms.afterloan.outbound', {
            url: "/outbound",
            templateUrl: "/dist/tpl/lms/afterloan/outbound.html",
            controller: "outboundController",
            controllerAs: "outbound"
        })
        .state('lms.afterloan.approveoutbound', {
            url: "/outbound/approveoutbound",
            templateUrl: "/dist/tpl/lms/afterloan/approveoutbound.html",
            controller: "approveOutboundController",
            controllerAs: "approveOutbound"
        })
        .state('lms.afterloan.settleoutbound', {
            url: "/outbound/settleoutbound",
            templateUrl: "/dist/tpl/lms/afterloan/settleoutbound.html",
            controller: "settleOutboundController",
            controllerAs: "settleOutbound"
        })
        //核销列表
        .state('lms.afterloan.receiptforreturn', {
            url: "/receiptforreturn",
            templateUrl: "/dist/tpl/lms/afterloan/receiptforreturn.html",
            controller: "receiptForReturnController",
            controllerAs: "receiptForReturn"
        })
        .state('lms.afterloan.settlebycustomer', {
            url: "/receiptforreturn/settlebycustomer",
            templateUrl: "/dist/tpl/lms/afterloan/settlebycustomer.html",
            controller: "settleByCustomerController",
            controllerAs: "settleByCustomer"
        })
        .state('lms.afterloan.settlebyorder', {
            url: "/receiptforreturn/settlebyorder",
            templateUrl: "/dist/tpl/lms/afterloan/settlebyorder.html",
            controller: "settleByOrderController",
            controllerAs: "settleByOrder"
        })

}


function  lazyLoad($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        debug:  false,
        events: true,
        modules: [
            {
                name: 'datatables',
                files: [
                    '../assets/plugins/datatables/datatables.all.min.js',
                ]
            },
            {
                name:'timepicker',
                insertBefore: '#ng_load_plugins_before',
                files:[
                    // "../assets/plugins/moment.min.js",
                    "../assets/plugins/bootstrap-daterangepicker/daterangepicker.min.js",
                    "../assets/plugins/bootstrap-daterangepicker/daterangepicker.min.css",
                    // "../components/time.component.js",
                    // "../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js",
                    // "../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js",
                    // "../assets/global/plugins/clockface/js/clockface.js",
                ]
            }
        ]
    });
}



