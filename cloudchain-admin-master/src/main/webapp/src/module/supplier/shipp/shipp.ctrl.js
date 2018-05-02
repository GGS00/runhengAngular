angular.module('MetronicApp').controller('shippCtrl', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','User','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, User,commonUtil,Table) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    /**************************************************发货区域************************************************************************************************/
    vm.column_fahuo = [
        {
            field: 'OWNER_ID',
            displayName: '编号',
        },
        {
            field: "WAREHOUSE_ID",
            displayName: '商品',
        },
        {
            field: "WAREHOUSE_NAME",
            displayName: '发货区域',

        },
        {
            field: "OWNER_NAME",
            displayName: '生效时间',
        },
        {
            field: "OWNER_NAME",
            displayName: '失效时间',
        },
        {
            field: "OWNER_NAME",
            displayName: '当前状态',
        },
        {
            field: "OWNER_NAME",
            displayName: '操作',
        }
    ]
    vm.fahuo_params = {
        bean: 'wmsOutbound',
        method: 'page',
        page: 1,
        rows: 10
    }
    vm.getFahuoPage = function () {
        // commonUtil.getList(vm.outbound_params).success(function (data) {
        //
        //     if (data.additionalMsg.status == '00') {
        //         vm.data = data;
        //     } else  {
        //         msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
        //     }
        // });

    };
    vm.getFahuoPage();

}]);

