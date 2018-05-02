/**
 * Created by shaobinhua on 2017/3/16.
 */
//按段拆单
angular.module('MetronicApp').controller('separateByAmountController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','sepOrderByAmount','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, sepOrderByAmount,commonUtil,Table) {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;


    }])

