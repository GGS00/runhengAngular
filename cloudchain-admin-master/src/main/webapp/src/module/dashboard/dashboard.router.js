

angular
    .module('MetronicApp')
    .config(dashboardRouter)
    .config(lazyLoad)




dashboardRouter.$inject= ['$stateProvider'];
lazyLoad.$inject= ['$ocLazyLoadProvider'];

function  dashboardRouter($stateProvider) {
    $stateProvider
    //首页

        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "/dist/tpl/dashboard/dashboard.html",
            data: {pageTitle: '首页'},
            controller: "dashboardController",
            controllerAs: "dash"
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



