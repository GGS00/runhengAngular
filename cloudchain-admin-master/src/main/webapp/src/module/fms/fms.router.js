angular.module('MetronicApp').config(securityRouter).config(lazyLoad)

securityRouter.$inject= ['$stateProvider'];
lazyLoad.$inject= ['$ocLazyLoadProvider'];

function securityRouter($stateProvider) {
    $stateProvider
        .state('fms', {
            url: "/fms",
            template: '<div ui-view></div>'
        })
        .state('fms.security', {
            url: "/security",
            template: '<div ui-view></div>'
        })
        .state('fms.account', {
            url: "/account",
            template: '<div ui-view></div>'
        })
        .state('fms.bank', {
            url: "/bank",
            template: '<div ui-view></div>'
        })
        .state('fms.nouser', {
            url: "/nouser",
            template: '<div ui-view></div>'
        })
        .state('fms.tradelist', {
            url: "/tradelist",
            template: '<div ui-view></div>'
        })
        .state('fms.tradelist.tradelist', {
            url: "/tradelist",
            templateUrl: "/dist/tpl/fms/tradelist/tradelist.html",
            controller: "tradelistController",
            controllerAs: "tradelist"
        })
        .state('fms.nouser.nouser', {
            url: "/nouser",
            templateUrl: "/dist/tpl/fms/nouser/nouser.html",
            controller: "nouserController",
            controllerAs: "nouser",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            "../assets/pages/css/fms/fms.css"
                        ]
                    });
                }]
            }
        })
        .state('fms.security.security', {
            url: "/security",
            templateUrl: "/dist/tpl/fms/security/security.html",
            controller: "securityController",
            controllerAs: "security"
        })
        .state('fms.security.realnameauth', {
            url: "/realnameauth",
            templateUrl: "/dist/tpl/fms/security/realnameauth.html",
            controller: "realnameauthController",
            controllerAs: "realnameauth",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.css",
                            "../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.js",
                            "../assets/plugins/bootstrap-summernote/summernote.css",
                            "../assets/plugins/bootstrap-summernote/summernote.min.js",
                        ]
                    });
                }]
            }
        })
        .state('fms.security.question', {
            url: "/question",
            templateUrl: "/dist/tpl/fms/security/question.html",
            controller: "questionController",
            controllerAs: "question"
        })
        .state('fms.security.mobileauth', {
            url: "/mobileauth",
            templateUrl: "/dist/tpl/fms/security/mobileauth.html",
            controller: "mobileauthController",
            controllerAs: "mobileauth",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            "../assets/pages/css/fms/fms.css"
                        ]
                    });
                }]
            }
        })
        .state('fms.security.validatemobile', {
            url: "/validatemobile",
            templateUrl: "/dist/tpl/fms/security/validatemobile.html",
            controller: "validatemobileController",
            controllerAs: "validatemobile",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            "../assets/pages/css/fms/fms.css"
                        ]
                    });
                }]
            }
        })
        .state('fms.security.artificialaudit', {
            url: "/artificialaudit",
            templateUrl: "/dist/tpl/fms/security/artificialaudit.html",
            controller: "artificialauditController",
            controllerAs: "artificialaudit",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            "../assets/pages/css/fms/fms.css"
                        ]
                    });
                }]
            }
        })
        .state('fms.security.paypwd', {
            url: "/paypwd",
            templateUrl: "/dist/tpl/fms/security/paypwd.html",
            controller: "paypwdController",
            controllerAs: "paypwd",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            "../assets/pages/css/fms/fms.css"
                        ]
                    });
                }]
            }
        })
        .state('fms.bank.bank', {
            url: "/bank",
            templateUrl: "/dist/tpl/fms/bank/bank.html",
            controller: "bankController",
            controllerAs: "bank"
        })
        .state('fms.bank.addbank', {
            url: "/addbank",
            templateUrl: "/dist/tpl/fms/bank/addbank.html",
            controller: "addbankController",
            controllerAs: "addbank"
        })
        .state('fms.account.account', {
            url: "/account",
            templateUrl: "/dist/tpl/fms/account/account.html",
            controller: "accountController",
            controllerAs: "account"
        })
        .state('fms.account.withdraw', {
            url: "/withdraw",
            templateUrl: "/dist/tpl/fms/account/withdraw.html",
            controller: "withdrawController",
            controllerAs: "withdraw"
        })
        .state('fms.account.withdrawResult', {
            url: "/withdrawResult",
            templateUrl: "/dist/tpl/fms/account/withdrawResult.html",
            controller: "withdrawResultController",
            controllerAs: "withdrawResult"
        })
        .state('fms.account.transfer', {
            url: "/transfer",
            templateUrl: "/dist/tpl/fms/account/transfer.html",
            controller: "transferController",
            controllerAs: "transfer"
        })
        .state('fms.account.transferResult', {
            url: "/transferResult",
            templateUrl: "/dist/tpl/fms/account/transferResult.html",
            controller: "transferResultController",
            controllerAs: "transferResult"
        })
}

function lazyLoad($ocLazyLoadProvider) {
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
                    "../assets/plugins/bootstrap-daterangepicker/daterangepicker.min.js",
                    "../assets/plugins/bootstrap-daterangepicker/daterangepicker.min.css",
                ]
            }
        ]
    });
}



