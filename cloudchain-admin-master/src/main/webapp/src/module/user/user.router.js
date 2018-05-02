
angular
    .module('MetronicApp')
    .config(userRouter)
    .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
        // 配置oclazyload文件异步加载
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
    }])

userRouter.$inject= ['$stateProvider'];

function  userRouter($stateProvider) {

    $stateProvider
        .state('user', {
            url: '/user',
            template: '<div ui-view></div>'
        })

        .state('user.drivers', {
            url: "/drivers",
            templateUrl: "/dist/tpl/user/driver/user-driver.html",
            data: {pageTitle: '司机管理'},
            controller: "driverShowController",
            controllerAs:"driverShow"
        })
        .state('user.addNewDrivers', {
            url: "/addNewDrivers",
            templateUrl: "/dist/tpl/user/driver/user-driverAdd.html",
            data: {pageTitle: '新增司机'},
            controller: "addNewDriverController",
            controllerAs:"addNewDriver"
        })
        .state('user.partner', {
            url: "/partner",
            templateUrl: "/dist/tpl/user/partner/user-partner.html",
            data: {pageTitle: '伙伴管理'},
            controller: "userPartnerController",
            controllerAs:"partner"
        })
        .state('user.addpartner', {
            url: "/addpartner",
            templateUrl: "/dist/tpl/user/partner/user-partnerAdd.html",
            data: {pageTitle: '新增伙伴'},
            controller: "addPartnerController",
            controllerAs:"addPartner"
        })
        .state('user.point', {
            url: "/point",
            templateUrl: "/dist/tpl/user/point/user-point.html",
            data: {pageTitle: '分销网点管理'},
            controller: "userPointController",
            controllerAs:"point"
        })
        .state('user.addpoint', {
            url: "/addpoint",
            templateUrl: "/dist/tpl/user/point/user-pointAdd.html",
            data: {pageTitle: '新增分销网点'},
            controller: "addPointController",
            controllerAs:"addPoint"
        })
        .state('user.contacts', {
            url: "/contacts",
            templateUrl: "/dist/tpl/user/contacts/user-contacts.html",
            data: {pageTitle: '常用联系人管理'},
            controller: "userContactsController",
            controllerAs:"contacts"
        })
        .state('user.addcontacts', {
            url: "/addcontacts",
            templateUrl: "/dist/tpl/user/contacts/user-contactsAdd.html",
            data: {pageTitle: '新增常用联系人'},
            controller: "addContactsController",
            controllerAs:"addContacts"
        })
        .state('user.supplier', {
            url: "/supplier",
            templateUrl: "/dist/tpl/user/supplier/user-supplier.html",
            data: {pageTitle: '供应商管理'},
            controller: "userSupplierController",
            controllerAs:"supplier"
        })
        .state('user.addsupplier', {
            url: "/addsupplier",
            templateUrl: "/dist/tpl/user/supplier/user-addsupplier.html",
            data: {pageTitle: '新增供应商'},
            controller: "addSupplierController",
            controllerAs:"addSupplier"
        })
}



