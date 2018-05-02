/* Setup TmsController page controller */
angular.module('MetronicApp').controller('arrivalOrderController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','order','commonUtil', function($rootScope, $scope, $http, uiGridConstants,settings, order,commonUtil) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    /*vm.page = 1; //默认当前页数
     vm.maxSize = 5; //最大页码
     vm.pageSize = 20; //1页多少个
     vm.pageCount = 92;//总条数*/

    vm.pageParams = {
        bean:'omsPurchaseOrder',
        method:'pageGetPurchaseArrival',
        page:1,
        rows:10
    }


    vm.column = [
        {   field: "state",
            displayName: '当前状态',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:"<span class='label label-{{row.entity.state==\"0\"?\"default\":(row.entity.state==\"1\"?\"warning\":(row.entity.state==\"2\"?\"success\":\"\"))}}' style='display:block;margin: 5px'>{{row.entity.state=='0'?'未到货':(row.entity.state=='1'?'部分到货':(row.entity.state=='2'?'全部到货':''))}}</span>"
        },
        {   field: "arrivalId",
            displayName: '到货单编号',
            enableCellEdit: true,
            width:300,
            enableCellEditOnFocus:true
        },
        {   field: "purchaseId",
            displayName: '采购单编号',
            enableCellEdit: true,
            width:300,
            enableCellEditOnFocus:true
        },
        {   field: "supplierName",
            displayName: '供应商名称',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true
        },
        {   field: "arrivalTime",
            displayName: '应到货时间',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        },
        {   field: "remark",
            displayName: '备注',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true
        },
        {   field: "operatorName",
            displayName: '发起员',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {   field: "createdTime",
            displayName: '发起时间',
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

    vm.getPageByFilter = function(){
        var purchaseId = $('input[name="purchaseId"]').val();
        var supplierName = $('input[name="supplierName"]').val();
        var warehouseName = $('input[name="warehouseName"]').val();
        var operatorName = $('input[name="operatorName"]').val();
        var state = $('.state').val();
        if(state == " "){
            state ="";
        }
        var arrivalBeginTime = $('.arrivalTime span').html();
        if(arrivalBeginTime == undefined || arrivalBeginTime == "-"){
            arrivalBeginTime ="";
            var arrivalEndTime ="";
        }else{
            arrivalBeginTime = $('.arrivalTime span').html().slice(0,10);
            var arrivalEndTime = $('.arrivalTime span').html().slice(11,21);
        }

        var createdTimeBeginTime = $('.createdTime span').html();
        if(createdTimeBeginTime == undefined || createdTimeBeginTime == "-"){
            createdTimeBeginTime ="";
            var createdTimeEndTime ="";
        }else{
            createdTimeBeginTime = $('.createdTime span').html().slice(0,10);
            var createdTimeEndTime = $('.createdTime span').html().slice(11,21);
        }


        if(purchaseId == "" && supplierName == "" && warehouseName =="" && operatorName =="" && state == "" && arrivalBeginTime==""&&createdTimeBeginTime==""){
            msgAlert.text('搜索条件不能为空');
            return false;
        }
        vm.pageParams = {
            purchaseId:purchaseId,
            supplierName:supplierName,
            warehouseName:warehouseName,
            state:state,
            operatorName:operatorName,
            arrivalBeginTime:arrivalBeginTime,
            arrivalEndTime:arrivalEndTime,
            createdTimeBeginTime:createdTimeBeginTime,
            createdTimeEndTime:createdTimeEndTime,
            bean:'omsPurchaseOrder',
            method:'pageGetPurchaseArrival',
            page:1,
            rows:10
        }
        vm.getPage();
    }

    /*到货*/
    vm.arrival = function(){
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要进行到货操作的到货单');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能操作一条到货单');
            return false;

        }else if(vm.entity.getSelectedRows()[0].state == 2){

            msgAlert.text('该到货单已经全部到货啦');
            return false;

        }else{
            vm.supplierName = vm.entity.getSelectedRows()[0].supplierName;
            vm.arrivalTime = vm.entity.getSelectedRows()[0].arrivalTime;
            vm.warehouseName = vm.entity.getSelectedRows()[0].warehouseName;
            vm.arrivalId = vm.entity.getSelectedRows()[0].arrivalId;
            order.itemToArrival(vm).success(function(data) {
                console.log(data)
                vm.goodsList = data.rows;
            });
            $('#confirmArrival').modal('show');
        }

    }


    /*到货明细*/
    vm.arrivalDetail = function(){
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要查看的到货单');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能查看一条到货单明细');

        }else{
            vm.arrivalId = vm.entity.getSelectedRows()[0].arrivalId;
            order.arrivalDetail(vm).success(function(data) {
                console.log(data);
                vm.arrivalDetailList = data.rows;
            });
            $('#arrivalDetail').modal('show');
        }

    }
    /*确认到货数量*/
    vm.confirmArrival = function(){
        vm.arrivalList = "["
        for (var i = 0; i < vm.goodsList.length; i++) {
            var arrivalCount = $(".goods_" + i).find('input[name="balance"]').val();
            var incount = $(".goods_" + i).find('input[name="count"]').val();
            if(arrivalCount == ""){
                msgAlert.text('请填写第'+ (i+1) +'条商品的实际到货数量');
                return false;
            }

            if(parseFloat(arrivalCount) > parseFloat(incount)){
                msgAlert.text('第'+ (i+1) +'条商品的实际到货数量不能大于采购数量');
                return false;
            }
            var jsonText = {};
            jsonText["arrivalId"] = vm.arrivalId;
            jsonText["purchaseItemId"] = $(".goods_"+i).find('input[name="itemId"]').val();
            jsonText["shouldArrivalCount"] = $(".goods_"+i).find('input[name="count"]').val();
            jsonText["arrivalCount"] = $(".goods_"+i).find('input[name="balance"]').val();;
            jsonText["price"] =  $(".goods_"+i).find('input[name="price"]').val();

            if(i<(vm.goodsList.length-1)){
                vm.arrivalList+=JSON.stringify(jsonText)+",";
            }else{
                vm.arrivalList+=JSON.stringify(jsonText);
            }
        }
        vm.arrivalList += "]";

        order.arrivalConfirm(vm).success(function(data) {
            if(data.status==00){

                msgAlert.text('到货成功');
                $('#confirmArrival').modal('hide');
                vm.getPage();

            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                $('#confirmArrival').modal('hide');
            }

        });
    }





}])