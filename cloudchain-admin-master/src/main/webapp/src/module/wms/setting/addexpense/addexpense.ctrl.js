angular.module('MetronicApp').controller('addexpenseCtrl', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', '$stateParams', 'commonUtil', 'Table', 'Goods', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, $stateParams, commonUtil, Table, Goods) {

    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    //返回按钮
    vm.returnButton = function () {
        window.history.back(-1);
    }
    vm.submitUser = function () {
        if ($.trim($('#id_fName').val()) == "") {
            msgAlert.text('请输入费用名称');
            return false;
        }
        if ($.trim($('#id_price').val()) == "") {
            msgAlert.text('请输入单价');
            return false;
        }
        var pric = $('#id_price').val() * 100;
        vm.params = {
            fName: $('#id_fName').val(),
            description: $('#id_description').val(),
            price: pric,
            mainUnit: $('#id_mainUnit').val(),
        }
        BillManage.wmsFeeTypeAdd(vm).success(function (data) {
            if (data.status == '00') {
                msgAlert.text('添加费用类型成功');
                window.location.href = "#/wms/setting/expense";
            } else {
                msgAlert.text(' >﹏< [' + data.message + ']');
            }
        })
    }
}
]);

