/* Setup TmsController page controller */
angular.module('MetronicApp').controller('logisticsTrackController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','logisticsTrack','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, logisticsTrack,commonUtil,Table) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;


    vm.pageParams = {
        bean:'tmsTraceability',
        method:'page',
        page:1,
        rows:10
    }




    /*  OPEN、ACTIVE、ENTERED、DISPATCHED、ONWAY、ARRIVED、SIGNED、CANCEL
     打开   生效      入场     已调度       在途    运抵       签收     取消*/

    vm.column = [
        {   field: "status",
            displayName: '状态',
            width:100,
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            cellTemplate:"<span class='label label-{{row.entity.status==\"OPEN\"?\"warning\":(row.entity.status==\"ACTIVE\"?\"danger\":(row.entity.status==\"ENTERED\"?\"primary\":(row.entity.status==\"DISPATCHED\"?\"danger\":(row.entity.status==\"ONWAY\"?\"info\":(row.entity.status==\"ARRIVED\"?\"danger\":(row.entity.status==\"SIGNED\"?\"success\":(row.entity.status==\"CANCEL\"?\"default\":\"\")))))))}}' style='display:block;margin: 5px'>{{row.entity.status=='OPEN'?'打开':(row.entity.status=='ACTIVE'?'生效':(row.entity.status=='ENTERED'?'入场':(row.entity.status=='DISPATCHED'?'已调度':(row.entity.status=='ONWAY'?'在途':(row.entity.status=='ARRIVED'?'运抵':(row.entity.status=='SIGNED'?'签收':(row.entity.status=='CANCEL'?'取消':'')))))))}}</span>"
        },{ field: 'orderCode',
            displayName: '订单编号',
            width: 250,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true // 是否可编辑
        },
        {  field: "wayBillCode",
            displayName: '运单号',
            width: 250,
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            cellTemplate:"<a ui-sref='transport.trackdetail({id:row.entity.id})' style='padding: 5px;display:block'>{{row.entity.wayBillCode}}</a>"
        },
        {  field: "ownerName",
            displayName: '货主',
            width: 150,
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "driverName",
            displayName: '司机姓名',
            width: 150,
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "driverTel",
            displayName: '司机联系方式',
            width: 150,
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "operator",
            displayName: '操作员',
            width: 150,
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "operatorTime",
            displayName: '操作时间',
            width: 150,
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "orderType",
            displayName: '订单归属',
            width: 150,
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style='padding: 5px'>{{row.entity.orderType==0?'TMS':'溯源'}}</div>"
        }
    ]


    vm.getPage = function () {
        commonUtil.getList(vm.pageParams).success(function(data) {
            vm.data = data;
        });
    };
    vm.getPage();


    vm.getPageByFilter = function(){
        var orderCode = $('input[name="orderCode"]').val();
        var wayBillCode = $('input[name="wayBillCode"]').val();
        var carrierName = $('input[name="carrierName"]').val();
        if(orderCode == "" && wayBillCode == "" && carrierName == "" ){
            msgAlert.text('搜索条件不能为空');
            return false;
        }
        vm.pageParams = {
            orderCode:orderCode,
            wayBillCode:wayBillCode,
            carrierName:carrierName,
            bean:'tmsTraceability',
            method:'page',
            page:1,
            rows:10
        }
        vm.getPage();
    }

    //签收
    vm.Sign = function(){
        console.log(vm.entity.getSelectedRows());

        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要签收的运单');
            return false;

        }else{

            for(var i = 0 ; i < vm.entity.getSelectedRows().length ; i++){
                if(vm.entity.getSelectedRows()[i].orderType == 0){
                    msgAlert.text('存在TMS运单，请到TMS回单管理页面签收');
                    return false;
                }

            }

            $('#confirmSign').modal('show');

        }

    };

    vm.confirmSign = function(){

        vm.signList = [];
        for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
            vm.signList.push(vm.entity.getSelectedRows()[i].id);
        }
        logisticsTrack.sign(vm).success(function(data) {

            if(data.additionalMsg.status==00){
                $('#confirmSign').modal('hide');
                msgAlert.text('签收成功');
                vm.getPage();
                vm.entity.clearSelectedRows();

            }else if(data.additionalMsg.status==01){
                $('#confirmSign').modal('hide');
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');

            }
            vm.entity.clearSelectedRows();

        });

    };

    //修改
    vm.modify = function(){
        console.log(vm.entity.getSelectedRows());
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要修改的运单');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能修改一条运单');

        }else{
            vm.driverName=vm.entity.getSelectedRows()[0].driverName;
            vm.driverTel=vm.entity.getSelectedRows()[0].driverTel;
            $('#modifyModal').modal('show');
        }

    };

    vm.confirmModify =function(){
        if(vm.driverName =='' ||vm.driverTel ==''){
            msgAlert.text('司机信息不能为空');
        }else{
            vm.id=vm.entity.getSelectedRows()[0].id;
            logisticsTrack.modify(vm).success(function(data) {

                if(data.additionalMsg.status==00){
                    $('#modifyModal').modal('hide');
                    msgAlert.text('修改成功');
                    vm.getPage();
                    vm.entity.clearSelectedRows();

                }else if(data.additionalMsg.status==01){
                    $('#modifyModal').modal('hide');
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');

                }
                vm.entity.clearSelectedRows();

            });

        }
    }


}])