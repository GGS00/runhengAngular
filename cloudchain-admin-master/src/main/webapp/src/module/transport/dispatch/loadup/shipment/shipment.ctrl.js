angular.module('MetronicApp').controller('distributeController', ['$rootScope', '$scope','$http','$location','uiGridConstants', 'settings','loadUp','commonUtil', function($rootScope, $scope, $http, $location, uiGridConstants,settings, loadUp,commonUtil) {

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
        loadUp.getList(vm).success(function(data) {
            console.log(data)
            vm.dispatchDriver =  data.dispatchDriver;
            vm.dispatchVehicle = data.dispatchVehicle;
        });
    }

    vm.pageParams = {
        bean:'tmsShip',
        method:'pageSegmentDriver',
        ddId:vm.id,
        page:1,
        rows:10
    }
    vm.column = [
        {   field: "status",
            displayName: '状态',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:80,
            cellTemplate:"<span class='label label-{{row.entity.truckStatus==\"UN_TRUCK\"?\"warning\":(row.entity.truckStatus==\"TRUCKED\"?\"danger\":(row.entity.truckStatus==\"CANCEL\"?\"default\":(row.entity.truckStatus==\"ARRIVED\"?\"danger\":(row.entity.truckStatus==\"ON_ROAD\"?\"info\":\"\"))))}}' style='display:block;margin: 5px'>{{row.entity.truckStatus=='UN_TRUCK'?'未装车':(row.entity.truckStatus=='TRUCKED'?'装车':(row.entity.truckStatus=='ON_ROAD'?'在途':(row.entity.truckStatus=='ARRIVED'?'已运抵':(row.entity.truckStatus=='CANCEL'?'取消':''))))}}</span>"
        },
        {   field: "orderCode",
            displayName: '订单号',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        },
        {  field: "wayBillCode",
            displayName: '运单号',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        },
        {  field: "fromAddress",
            displayName: '发货地址',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        },
        {  field: "fromContactor",
            displayName: '发货联系人',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "fromMobile",
            displayName: '发货联系人电话',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        },
        {  field: "toAddress",
            displayName: '收货地址',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        },
        {  field: "toContactor",
            displayName: '收货联系人',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "toMobile",
            displayName: '收货联系人电话',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        }
    ]




    vm.getPage = function () {

        commonUtil.getList(vm.pageParams).success(function(data) {
            console.log(data)
            vm.data = data;
        });
    };
    vm.getPage();

    vm.toLoadUp = function(){
        window.location.href = "#/transport/dispatch/loadup";
    }

    vm.shipment = function(){
        $('#confirmShipment').modal('show');
    }

    vm.confirmShipment = function(){
        loadUp.shipment(vm).success(function(data) {
            if(data.additionalMsg.status==00){
                $('#confirmShipment').modal('hide');
                msgAlert.text('发运成功');
                vm.getPage();
            }else if(data.additionalMsg.status==01){
                $('#confirmShipment').modal('hide');
                msgAlert.text('失败 >﹏< ['+ data.additionalMsg.message+']');
            }
        });
    }

    vm.addLoadUp  = function(){
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择运单');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能选择一条运单');
            return false;
        }else{
            vm.tmsOrderId = vm.entity.getSelectedRows()[0].tmsOrderId;
            vm.segmentId = vm.entity.getSelectedRows()[0].segmentId;
            loadUp.getGoodsList(vm).success(function(data) {
                vm.tmsOrder = data.tmsOrder;
                vm.selectOrderList = data.goodsList;
            });

            $('#selectCommonContacts').modal('show');

        }
    }

    vm.confirmGoodsAdd = function(){
        for (var i = 0; i < vm.selectOrderList.length; i++) {
            var truckWeight = $(".goodsFill"+i).find('input[name="goods['+i+'].truckWeight"]').val();
            var truckQuantity = $(".goodsFill"+i).find('input[name="goods['+i+'].truckQuantity"]').val();
            if( truckWeight == " "){
                msgAlert.text('请填写第'+ (i+1) +'条货物的装载重量');
                return false;
            }
            if(truckQuantity == ""){
                msgAlert.text('请填写第'+ (i+1) +'条货物的装载件数');
                return false;
            }
        }

        vm.form = $("#orderSelect").serialize();

        vm.form = decodeURIComponent(vm.form,true)
        console.log(vm.form)

        $.ajax({
            url:"/transport/dispatch/loadup/doTruck",
            data:vm.form,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.additionalMsg.status==00){
                    $('#selectCommonContacts').modal('hide');
                    msgAlert.text('装车成功');
                    vm.entity.clearSelectedRows();
                    vm.getPage();

                }else if(data.additionalMsg.status==01){
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');

                }

            },
            error:function(){
                msgAlert.text('系统繁忙 >﹏<');
            }
        })
    }


}])