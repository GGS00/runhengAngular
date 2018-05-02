angular.module('MetronicApp').controller('updateexpenseCtrl', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', '$stateParams', 'commonUtil', 'Table', '$location', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, $stateParams, commonUtil, Table, $location) {

    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.fId = $location.search().fId;
    vm.fName = $location.search().fName;
    vm.description = $location.search().description;
    vm.price = $location.search().price;
    vm.mainUnit = $location.search().mainUnit;

    //返回按钮
    vm.returnButton = function () {
        window.location.href="#/wms/setting/expense";
    }
    vm.fName = $location.search().fName;
    vm.description = $location.search().description;
    vm.price = $location.search().price;
    vm.mainUnit = $location.search().mainUnit;

    $('#id_fName').val( vm.fName)
    $('#id_description').val( vm.description)
    $('#id_price').val( vm.price/100)
    $('#id_mainUnit').val(vm.mainUnit)
    vm.submitUser = function () {
        if ($.trim($('#id_fName').val()) == "") {
            msgAlert.text('请输入费用名称');
            return false;
        }
        if ($.trim($('#id_price').val()) == "") {
            msgAlert.text('请输入单价');
            return false;
        }
       var pric= $('#id_price').val()*100;
        vm.params = {
            fId:vm.fId,
            fName: $('#id_fName').val(),
            description :$('#id_description').val(),
            price: pric,
            mainUnit: $('#id_mainUnit').val(),
        }
        BillManage.wmsFeeTypeUpdate(vm).success(function (data) {
            if (data.status == '00') {
                msgAlert.text('修改费用类型成功');
                window.location.href = "#/wms/setting/expense";
            } else {
                msgAlert.text(' >﹏< [' + data.message + ']');
            }
        })
    }
}
]);

