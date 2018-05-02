
angular
    .module('MetronicApp')
    .config(homepageRouter)
    .config(lazyLoad)




homepageRouter.$inject= ['$stateProvider'];
lazyLoad.$inject= ['$ocLazyLoadProvider'];

function  homepageRouter($stateProvider) {

    $stateProvider

        .state('homepage', {
            url: '/homepage',
            template: '<div ui-view></div>'
        })

        .state('homepage.index', {
            url: '/index',
            templateUrl: "/dist/tpl/homepage/home/home.html",
            data: {pageTitle: '柴米优仓'},
            controller: "homeIndexController",
            controllerAs: "homeIndex",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/d2w/d2w.css"
                        ]
                    });
                }]
            }
        })

        .state('homepage.finance', {
            url: '/finance',
            templateUrl: "/dist/tpl/homepage/home/finance.html",
            data: {pageTitle: '供应链金融'},
            controller: "financeController",
            controllerAs: "finance",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/d2w/d2w.css"
                        ]
                    });
                }]
            }
        })

        .state('homepage.waredis', {
            url: '/waredis',
            templateUrl: "/dist/tpl/homepage/home/waredis.html",
            data: {pageTitle: '仓配一体化'},
            controller: "waredisController",
            controllerAs: "waredis",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/d2w/d2w.css"
                        ]
                    });
                }]
            }
        })

        .state('homepage.saas', {
            url: '/saas',
            templateUrl: "/dist/tpl/homepage/home/saas.html",
            data: {pageTitle: 'SAAS云平台'},
            controller: "saasController",
            controllerAs: "saas",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/d2w/d2w.css"
                        ]
                    });
                }]
            }
        })

        .state('homepage.aboutus', {
            url: '/aboutus',
            templateUrl: "/dist/tpl/homepage/home/aboutus.html",
            data: {pageTitle: '关于我们'},
            controller: "aboutusController",
            controllerAs: "aboutus",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "../assets/pages/css/d2w/d2w.css"
                        ]
                    });
                }]
            }
        })

}




