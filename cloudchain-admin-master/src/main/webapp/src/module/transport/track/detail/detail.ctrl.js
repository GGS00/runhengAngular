/**
 * Created by shaobinhua on 2017/3/8.
 */
/* Setup TmsController page controller */
angular.module('MetronicApp').controller('logisticsInfoController', ['$rootScope', '$scope','$http','$location','uiGridConstants', 'settings','logisticsInfo','commonUtil','Table', function($rootScope, $scope, $http,$location, uiGridConstants,settings, logisticsInfo,commonUtil,Table) {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.id =  $location.search().id;

        initial();

        function initial(){
            logisticsInfo.getList(vm).success(function(data) {

                vm.logisticsInfoList = data.orderLogs;

            });
        }


    }])



