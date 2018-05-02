angular.module('MetronicApp').controller('outboundImportCtrl',
function ($rootScope, $scope, $http, $location, uiGridConstants, settings, BillManage, commonUtil, Table, suppServer) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;

    // =====================================================================
    function initial() {
        vm.dictTypeName ='出库单据类型';
        BillManage.getBillTypeList(vm).success(function(data) {
            vm.billTypeList = data.rows;
        });
    }
    initial();

    //导入出库单
    vm.importFile = function () {
        if ($('#id_billType').val() == "") {
            msgAlert.text('请选择单据类型');
            return false;
        }

        if ($("#excelFile").val() == "") {
            msgAlert.text('请导入excel文件');
            return false;
        } else {
            var reg = /^.*\.(?:xls|xlsx)$/i;//文件名可以带空格
            if (!reg.test($("#excelFile").val())) {//校验不通过
                msgAlert.text('请上传excel格式的文件!');
                return false;
            }
        }

        var text = $("#id_billType").find("option:selected").text();

        var url = getImportUrl($('#id_billType').val());
        if (url != "") {
            msgAlert.confirm('确认导入【' + text + '】？', '确定', function () {
                $.ajaxFileUpload({
                    url: "/wmsOutboundDefaultImport/importData",
                    type: 'post',
                    fileElementId: 'excelFile',
                    dataType: 'JSON',
                    success: function (data, status) {
                        vm.mdata = JSON.parse(data);
                        console.log(vm.mdata)
                    },
                    error: function (data, status, e) {
                        vm.mdata = JSON.parse(data);
                        console.log(vm.mdata)
                    },
                    finish: function () {
                        alert('finished')
                    }
                });
            });
        }
    }

    function getImportUrl(billType) {
        if(billType == "10007001"){
            return "/wmsOutboundDefaultImport/importData";
        }else if(billType == "10007002"){
            return "/wmsOutboundSaleImport/importData";
        }else if(billType == "10007003"){
            return "/wmsOutboundDepositImport/importData";
        }else if(billType == "10007004"){
            return "/wmsOutboundPurchaseImport/importData";
        }else if(billType == "10007005"){
            return "/wmsOutboundAllotImport/importData";
        }else if(billType == "10007006"){
            return "/wmsOutboundImpawnImport/importData";
        }else {
            return "";
        }
    }

    vm.toWmsOrder = function () {
        window.history.back(-1);
    }
});


