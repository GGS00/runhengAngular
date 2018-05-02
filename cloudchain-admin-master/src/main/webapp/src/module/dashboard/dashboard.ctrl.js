/**
 * Created by shaobinhua on 2017/3/16.
 */
angular.module('MetronicApp').controller('dashboardController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','Table','commonUtil', function($rootScope, $scope, $http, uiGridConstants,settings,Table,commonUtil) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;



}]);