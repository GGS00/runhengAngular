/***
 Metronic AngularJS App Main Script
 ***/

/* Metronic App */

var MetronicApp = angular.module("MetronicApp", [
    "oc.lazyLoad",
    "ui.router",
    "ui.bootstrap",
    "ngSanitize",
    'ui.grid',
    'ui.grid.selection',
    'ui.grid.autoResize',
    'ui.grid.pagination',
    'ui.grid.resizeColumns',
    'ngJsTree',
    'selectize',
    "ngSelect2",
    "ngMaterial",
    "ngMessages",
    "ngAnimate",
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

MetronicApp.filter('totwo',function(){
    return function(inputArray){
        if(inputArray){
            return inputArray.toFixed(2);
        }
    }
});

MetronicApp.filter('toint',function(){
    return function(inputArray){
        if(inputArray){
            return parseInt(inputArray);
        }
    }
});

MetronicApp.filter('tozero',function(){
    return function(inputArray){
        if(inputArray){
            return inputArray.toFixed(0);
        }
    }
});

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout',
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
    });
}]);

