angular
    .module('MetronicApp')
    .config(traceabilityRouter)
    .config(lazyLoad)
    traceabilityRouter.$inject = ['$stateProvider'];
    lazyLoad.$inject = ['$ocLazyLoadProvider'];
    function traceabilityRouter($stateProvider) {
        $stateProvider

            .state('traceability', {
                url: '/traceability',
                template: '<div ui-view></div>'
            })
            .state('traceability.query', {
                url: "/query",
                templateUrl: "/dist/tpl/traceability/query/query.html",
                data: {pageTitle: '防伪码查询'},
                controller: "traceabilityQueryCtrl",
                controllerAs: "query",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [
                                "../assets/pages/css/tbms/outbound.css"
                            ]
                        });
                    }]
                }

            })
            //添加单条防伪码
            .state('traceability.add', {
                url: "/add",
                templateUrl: "/dist/tpl/traceability/add/add.html",
                data: {pageTitle: '添加单条防伪码'},
                controller: "traceabilityAddCtrl",
                controllerAs: "add",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [
                                "../assets/pages/css/tms/tmsPage.css"
                            ]
                        });
                    }]
                }
            })
            //批量导入防伪码
            .state('traceability.import', {
                url: "/import",
                templateUrl: "/dist/tpl/traceability/import/import.html",
                data: {pageTitle: '批量导入防伪码'},
                controller: "traceabilityImportCtrl",
                controllerAs: "import",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [
                                '../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                '../assets/plugins/bootstrap-fileinput/bootstrap-fileinput.js'
                            ]
                        });
                    }]
                }
            })
            //批量修改防伪码
            .state('traceability.update', {
                url: "/update",
                templateUrl: "/dist/tpl/traceability/update/update.html",
                data: {pageTitle: '批量修改防伪码'},
                controller: "traceabilityUpdateCtrl",
                controllerAs: "update",
            })
            //批量修改防伪码-确认修改
            .state('traceability.updateConfirm', {
                url: "/updateConfirm",
                templateUrl: "/dist/tpl/traceability/update/update-confirm.html",
                data: {pageTitle: '确认修改防伪码'},
                controller:"traceabilityUpdateConfirmCtrl",
                controllerAs: "updateConfirm",
            })

            //批量删除防伪码
            .state('traceability.del', {
                url: "del",
                templateUrl: "/dist/tpl/traceability/del/del.html",
                data: {pageTitle: '批量删除防伪码'},
                controller: "traceabilityDelCtrl",
                controllerAs: "del",
            })
    }

    function lazyLoad($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: [
                {
                    name: 'datatables',
                    files: [
                        '../assets/plugins/datatables/datatables.all.min.js',
                    ]
                },
                {
                    name: 'timepicker',
                    insertBefore: '#ng_load_plugins_before',
                    files: [
                        "../assets/plugins/bootstrap-daterangepicker/daterangepicker.min.js",
                        "../assets/plugins/bootstrap-daterangepicker/daterangepicker.min.css",
                    ]
                }
            ]
        });
    }



