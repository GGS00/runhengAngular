angular
    .module('MetronicApp')
    .config(supplierRouter)

supplierRouter.$inject = ['$stateProvider']

function supplierRouter($stateProvider) {

    $stateProvider
        .state('supplier', {
            url: '/supplier',
            template: '<div ui-view></div>'
        })
        .state('supplier.bind', {
            url: "/bind",
            templateUrl: "/dist/tpl/supplier/bind/bind.html",
            data: {pageTitle: '供应商绑定'},
            controller: "bindCtrl",
            controllerAs: "bind",
        })
        .state('supplier.setting', {
            url: "/setting/:Id",
            templateUrl: "/dist/tpl/supplier/setting/setting.html",
            data: {pageTitle: '供应商设置'},
            controller: "settingCtrl",
            controllerAs: "setting",
        })

        .state('supplier.manage', {
            url: "/manage",
            templateUrl: "/dist/tpl/supplier/manage/manage.html",
            data: {pageTitle: '供应商管理'},
            controller: "manageCtrl",
            controllerAs: "manage"
        })
        .state('supplier.add', {
            url: "/add",
            templateUrl: "/dist/tpl/supplier/add/add.html",
            data: {pageTitle: '新增供应商'},
            controller: "addCtrl",
            controllerAs: "add"
        })
        .state('supplier.goodmanage', {
            url: "/goodmanage/:Id",
            templateUrl: "/dist/tpl/supplier/goodmanage/goodmanage.html",
            data: {pageTitle: '商品管理'},
            controller: "goodmanageCtrl",
            controllerAs: "goodmanage",

        })
        .state('supplier.addgood', {
            url: "/addgood/:Id",
            templateUrl: "/dist/tpl/supplier/addgood/addgood.html",
            data: {pageTitle: '添加商品'},
            controller: "addgoodCtrl",
            controllerAs: "addgood",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            "../assets/plugins/jstree/dist/themes/default/style.css",
                        ]
                    });
                }]
            }
        }).state('supplier.identity', {
        url: "/identity/:Id",
        templateUrl: "/dist/tpl/supplier/identity/identity.html",
        data: {pageTitle: '添加主账号'},
        controller: "identityCtrl",
        controllerAs: "identity"
    })
        .state('supplier.address', {
            url: "/address/:Id",
            templateUrl: "/dist/tpl/supplier/address/address.html",
            data: {pageTitle: '地址库管理'},
            controller: "addressCtrl",
            controllerAs: "address"
        })
        .state('supplier.shipp', {
            url: "/shipp/:Id",
            templateUrl: "/dist/tpl/supplier/shipp/shipp.html",
            data: {pageTitle: '设置发货区域'},
            controller: "shippCtrl",
            controllerAs: "shipp"
        })
        .state('supplier.contacts', {
            url: "/contacts/:Id",
            templateUrl: "/dist/tpl/supplier/contacts/contacts.html",
            data: {pageTitle: '添加联系人'},
            controller: "contactsCtrl",
            controllerAs: "contacts"
        })

        .state('supplier.update', {
            url: "/update/:Id",
            templateUrl: "/dist/tpl/supplier/update/update.html",
            data: {pageTitle: '修改供应商'},
            controller: "updateCtrl",
            controllerAs: "update"
        })
        .state('supplier.look', {
            url: "/look/:Id",
            templateUrl: "/dist/tpl/supplier/look/look.html",
            data: {pageTitle: '修改供应商'},
            controller: "lookCtrl",
            controllerAs: "look"
        })


}
