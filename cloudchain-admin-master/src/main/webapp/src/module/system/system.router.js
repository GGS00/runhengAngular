angular
    .module('MetronicApp')
    .config(systemRouter)

systemRouter.$inject= ['$stateProvider']

function  systemRouter($stateProvider) {

    $stateProvider
        .state('sys', {
            url: '/sys',
            template: '<div ui-view></div>'
        })
        .state('sys.store', {
            url: '/store',
            template: '<div ui-view></div>'
        })
        .state('sys.traffic', {
            url: '/store',
            template: '<div ui-view></div>'
        })
        .state('sys.menu', {
            url: "/menu",
            templateUrl: "/dist/tpl/system-menu.html",
            data: {pageTitle: '系统菜单管理'},
            controller: "MenuListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })
        .state('sys.orguser', {
            url: "/orguser",
            templateUrl: "/dist/tpl/system/orguser/system-orguser.html",
            data: {pageTitle: '部门员工管理'},
            controller: "OrgnizationController",
            controllerAs:"org",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })
        .state('sys.roleauth', {
            url: "/roleauth",
            templateUrl: "/dist/tpl/system/roleauth/system-roleauth.html",
            data: {pageTitle: '岗位权限管理'},
            controller: "OrgRoleController",
            controllerAs:"role",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })
        .state('sys.store.chaimi', {
            url: "/chaimi",
            templateUrl: "/dist/tpl/system/storemange/system-store-chaimi.html",
            data: {pageTitle: '仓储管理'},
            controller: "wareHouseMangeController",
            controllerAs:"wareHouseMange"
        })
        .state('sys.traffic.chaimi', {
            url: "/traffic",
            templateUrl: "/dist/tpl/system/trafficmange/system-traffic-chaimi.html",
            data: {pageTitle: '运输管理'},
            controller: "addTmsChaimiCooperController",
            controllerAs:"addTmsChaimiCooper"
        })
        .state('sys.traffic.esheettemplate', {
            url: "/traffic/esheettemplate",
            templateUrl: "/dist/tpl/system/trafficmange/esheettemplate.html",
            data: {pageTitle: '运单打印模板'},
            controller: "eSheetTemplateController",
            controllerAs:"eSheetTemplate"
        })
        .state('sys.traffic.addtemplate', {
            url: "/traffic/addtemplate",
            templateUrl: "/dist/tpl/system/trafficmange/addtemplate.html",
            data: {pageTitle: '增加运单打印模板'},
            controller: "addTemplateController",
            controllerAs:"addTemplate"
        })
        .state('sys.traffic.esheetorigin', {
            url: "/traffic/esheetorigin",
            templateUrl: "/dist/tpl/system/trafficmange/esheetorigin.html",
            data: {pageTitle: '电子面单来源'},
            controller: "eSheetOriginController",
            controllerAs:"eSheetOrigin"
        })
        .state('sys.traffic.addorigin', {
            url: "/traffic/addorigin",
            templateUrl: "/dist/tpl/system/trafficmange/addorigin.html",
            data: {pageTitle: '添加电子面单来源'},
            controller: "addOriginController",
            controllerAs:"addOrigin"
        })
        .state('sys.traffic.logisticscomp', {
            url: "/traffic/logisticscomp",
            templateUrl: "/dist/tpl/system/trafficmange/logisticscomp.html",
            data: {pageTitle: '物流公司管理'},
            controller: "logisticsCompController",
            controllerAs:"logisticsComp"
        })
        .state('sys.traffic.addlogisticscomp', {
            url: "/traffic/addlogisticscomp",
            templateUrl: "/dist/tpl/system/trafficmange/addlogisticscomp.html",
            data: {pageTitle: '添加物流公司'},
            controller: "addLogisticsCompController",
            controllerAs:"addLogisticsComp"
        })
        .state('sys.traffic.updatelogisticscomp', {
            url: "/traffic/updatelogisticscomp",
            templateUrl: "/dist/tpl/system/trafficmange/updatelogisticscomp.html",
            data: {pageTitle: '修改物流公司'},
            controller: "updateLogisticsCompController",
            controllerAs:"updateLogisticsComp"
        })
        .state('sys.traffic.logisticsmatchrule', {
            url: "/traffic/logisticsmatchrule",
            templateUrl: "/dist/tpl/system/trafficmange/logisticsmatchrule.html",
            data: {pageTitle: '物流匹配规则'},
            controller: "logisticsMatchRuleController",
            controllerAs:"logisticsMatchRule"
        })
        .state('sys.traffic.addmatchrule', {
            url: "/traffic/addmatchrule",
            templateUrl: "/dist/tpl/system/trafficmange/addmatchrule.html",
            data: {pageTitle: '添加物流匹配规则'},
            controller: "addMatchRuleController",
            controllerAs:"addMatchRule"
        })
        .state('sys.traffic.updatematchrule', {
            url: "/traffic/updatematchrule",
            templateUrl: "/dist/tpl/system/trafficmange/updatematchrule.html",
            data: {pageTitle: '修改物流匹配规则'},
            controller: "updateMatchRuleController",
            controllerAs:"updateMatchRule"
        })
        .state('sys.sysaddress', {
            url: "/sysaddress",
            templateUrl: "/dist/tpl/system/sysaddress/sysaddress.html",
            data: {pageTitle: '地址管理'},
            controller: "sysaddressCtrl",
            controllerAs:"sysaddress"
        })
        .state('sys.addwarehouse', {
            url: "/addwarehouse",
            templateUrl: "/dist/tpl/system/addwarehouse/addwarehouse.html",
            data: {pageTitle: '增加地址'},
            controller: "addwarehouseCtrl",
            controllerAs:"addwarehouse",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        })
        .state('sys.updatewarehouse', {
            url: "/updatewarehouse/:Id",
            templateUrl: "/dist/tpl/system/updatewarehouse/updatewarehouse.html",
            data: {pageTitle: '修改地址'},
            controller: "updatewarehouseCtrl",
            controllerAs:"updatewarehouse"
        })
}
