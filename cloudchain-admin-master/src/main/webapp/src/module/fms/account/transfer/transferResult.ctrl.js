angular.module('MetronicApp').controller('transferResultController',
    function ($rootScope, $scope, $http, uiGridConstants, settings, commonUtil,Table) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        //----------------------------------------------------------------------------------------------
    }
);


