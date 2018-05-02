angular.module('MetronicApp').controller('dispatchLoadUpController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','loadUp','commonUtil', function($rootScope, $scope, $http, uiGridConstants,settings, loadUp,commonUtil) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    vm.pageParams = {
        bean:'tmsShip',
        method:'page',
        page:1,
        rows:10
    }


    vm.column = [
        {   field: "status",
            displayName: '状态',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:100,
            cellTemplate:"<span class='label label-{{row.entity.status==\"OPEN\"?\"warning\":(row.entity.status==\"TRUCKED\"?\"success\":(row.entity.status==\"CANCEL\"?\"default\":(row.entity.status==\"ARRIVED\"?\"danger\":(row.entity.status==\"ON_ROAD\"?\"info\":(row.entity.status==\"ACTIVE\"?\"danger\":\"\")))))}}' style='display:block;margin: 5px'>{{row.entity.status=='OPEN'?'打开':(row.entity.status=='TRUCKED'?'已装车':(row.entity.status=='ON_ROAD'?'在途':(row.entity.status=='ARRIVED'?'已运抵':(row.entity.status=='CANCEL'?'取消':(row.entity.status=='ACTIVE'?'生效':'')))))}}</span>"
        },
        {   field: "disDriveCode",
            displayName: '派车单号',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true
        },
        {   field: "dispatchCode",
            displayName: '调度单号',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true
        },
        {  field: "vehicleCode",
            displayName: '车牌号',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "mainDriverName",
            displayName: '主司机',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "mainDriverMobile",
            displayName: '主司机电话',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "secondDriverName",
            displayName: '副司机',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "secondDriverMobile",
            displayName: '副司机电话',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        }
    ]




    vm.getPage = function () {

        commonUtil.getList(vm.pageParams).success(function(data) {
            vm.data = data;
        });
    };
    vm.getPage();

    vm.getPageByFilter = function(){
        var disDriveCode = $('input[name="disDriveCode"]').val();
        var dispatchCode = $('input[name="dispatchCode"]').val();
        var vehicleCode = $('input[name="vehicleCode"]').val();
        var mainDriverMobile = $('input[name="mainDriverMobile"]').val();
        var mainDriverName = $('input[name="mainDriverName"]').val();
        if(disDriveCode == "" && dispatchCode == "" && vehicleCode == "" && mainDriverMobile == "" && mainDriverName == ""){
            msgAlert.text('搜索条件不能为空');
            return false;
        }
        vm.pageParams = {
            bean:'tmsShip',
            method:'page',
            disDriveCode:disDriveCode,
            dispatchCode:dispatchCode,
            vehicleCode:vehicleCode,
            mainDriverMobile:mainDriverMobile,
            mainDriverName:mainDriverName,
            page:1,
            rows:10
        }
        vm.getPage();
    }

    vm.toDistribute  = function(){
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要装车的派车单');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能选择一条派车单');
            return false;

        }else if(vm.entity.getSelectedRows()[0].status != 'ACTIVE'&& vm.entity.getSelectedRows()[0].status !='TRUCKED'){

            msgAlert.text("只能选择状态为'生效'或'装车'的派车单装车");
            return false;

        }else{
            window.location.href = "#/transport/dispatch/loadup/shipment?id="+vm.entity.getSelectedRows()[0].id;
        }

    }


}])