/* Setup TmsController page controller */
angular.module('MetronicApp').controller('TmsController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','tmsOrder','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, tmsOrder,commonUtil,Table) {
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

    vm.menuLen = 6;

    vm.pageParams = {
        bean:'tmsOrder',
        method:'page',
        page:1,
        rows:10
    }


    vm.column = [ {  field: "status",
        displayName: '状态',
        enableCellEdit: true,
        width:100,
        enableCellEditOnFocus:true,
        cellTemplate:"<span class='label label-{{row.entity.status==\"OPEN\"?\"warning\":(row.entity.status==\"ACTIVE\"?\"danger\":(row.entity.status==\"ENTERED\"?\"primary\":(row.entity.status==\"DISPATCHED\"?\"danger\":(row.entity.status==\"ONWAY\"?\"info\":(row.entity.status==\"ARRIVED\"?\"danger\":(row.entity.status==\"SIGNED\"?\"success\":(row.entity.status==\"CANCEL\"?\"default\":(row.entity.status==\"TRUCKED\"?\"success\":\"\"))))))))}}' style='display:block;margin: 5px'>{{row.entity.status=='OPEN'?'打开':(row.entity.status=='ACTIVE'?'生效':(row.entity.status=='ENTERED'?'入场':(row.entity.status=='DISPATCHED'?'已调度':(row.entity.status=='ONWAY'?'在途':(row.entity.status=='ARRIVED'?'运抵':(row.entity.status=='SIGNED'?'签收':(row.entity.status=='CANCEL'?'取消':(row.entity.status=='TRUCKED'?'已装车':''))))))))}}</span>"
    },
        { field: 'code',
            displayName: '订单编号',
            width: 250,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
            cellTemplate:'<a ui-sref="transport.orderdetail({id:row.entity.id})" style="display: block;margin: 5px;">{{row.entity.code}}</a>'
        },
        {  field: "wayBillCode",
            displayName: '运单号',
            enableCellEdit: true,
            width:180,
            enableCellEditOnFocus:true
        },
        {  field: "ownerName",
            displayName: '托运人',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "carrierName",
            displayName: '承运人',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "fromReceiverName",
            displayName: '发货方',
            enableCellEdit: true,
            width:300,
            enableCellEditOnFocus:true
        },
        {  field: "fromReceiverContact.address",
            displayName: '发货地',
            enableCellEdit: true,
            width:300,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.fromReceiverContact.province}}{{row.entity.fromReceiverContact.city}}{{row.entity.fromReceiverContact.district}}</div>'
        },
        {  field: "fromReceiverContact.address",
            displayName: '发货地详情',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.fromReceiverContact.address}}</div>'
        },
        {  field: "toReceiverName",
            displayName: '收货方',
            enableCellEdit: true,
            width:300,
            enableCellEditOnFocus:true
        },
        {  field: "toReceiverContact.address",
            displayName: '收货地',
            enableCellEdit: true,
            width:300,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.toReceiverContact.province}}{{row.entity.toReceiverContact.city}}{{row.entity.toReceiverContact.district}}</div>'
        },
        {  field: "toReceiverContact.address",
            displayName: '收货地详情',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.toReceiverContact.address}}</div>'
        },
        {  field: "description",
            displayName: '描述',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "invoice",
            displayName: '发票',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.invoice==0?"不开票":"开票"}}</div>'
        },
        {  field: "receiptType",
            displayName: '回单要求',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.receiptType==0?"不要回单":(row.entity.receiptType==1?"货物托运单":"发货单")}}</div>'
        },
        {  field: "planShipTime",
            displayName: '计划发货时间',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "planArrivalTime",
            displayName: '计划收货时间',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        }
    ]


    initial();
    function initial(){
        vm.dictTypeName ='单据类型';
        tmsOrder.getBillTypeList(vm).success(function(data) {
            vm.billTypeList = data.rows;
        });
    }

    vm.getPage = function () {

        commonUtil.getList(vm.pageParams).success(function(data) {
            vm.data = data;
        });
    };
    vm.getPage();
    /*    code    wayBillCode   fromReceiverName   toReceiverName  dataFrom   status   arrivalStatus  signStatus   beginTime   endTime    beginShipTime  endShipTime   billType_code_query  ownerName*/

    vm.getPageByFilter = function(){
        var code = $('input[name="code"]').val();
        var wayBillCode = $('input[name="wayBillCode"]').val();
        var ownerName = $('input[name="ownerName"]').val();
        var billType_code_query = $('.billType_code_query').val();
        if(billType_code_query == " "){
            billType_code_query ="";
        }
        var status = $('.status').val();
        if(status == " "){
            status ="";
        }
        var signStatus = $('.signStatus').val();
        if(signStatus == " "){
            signStatus ="";
        }
        var arrivalStatus = $('.arrivalStatus').val();
        if(arrivalStatus == undefined ||arrivalStatus == " "){
            arrivalStatus ="";
        }
        var dataFrom = $('.dataFrom').val();
        if(dataFrom == undefined ||dataFrom == " "){
            dataFrom ="";
        }
        var fromReceiverName = $('input[name="fromReceiverName"]').val();
        if(fromReceiverName == undefined ||fromReceiverName == ""){
            fromReceiverName ="";
        }
        var toReceiverName = $('input[name="toReceiverName"]').val();
        if(toReceiverName == undefined ||toReceiverName == ""){
            toReceiverName ="";
        }

        var beginTime = $('.toOrderTime span').html();
        if(beginTime == undefined || beginTime == "-"){
            beginTime ="";
            var endTime ="";
        }else{
            beginTime = $('.toOrderTime span').html().slice(0,10);;
            var endTime = $('.toOrderTime span').html().slice(11,21);
        }
        var beginShipTime = $('.toShipTime span').html();
        if(beginShipTime == undefined || beginShipTime == "-"){
            beginShipTime ="";
            var endShipTime ="";
        }else{
            beginShipTime = $('.toShipTime span').html().slice(0,10);
            var endShipTime = $('.toShipTime span').html().slice(11,21);
        }


        if(code == "" && wayBillCode == "" && ownerName == "" && billType_code_query == "" && status == "" && signStatus == "" && arrivalStatus == ""&& dataFrom == "" && fromReceiverName == "" && toReceiverName == "" && beginTime =="" &&beginShipTime == ""){
            msgAlert.text('搜索条件不能为空');
            return false;
        }
        vm.pageParams = {
            code:code,
            wayBillCode:wayBillCode,
            fromReceiverName:fromReceiverName,
            toReceiverName:toReceiverName,
            dataFrom:dataFrom,
            status:status,
            arrivalStatus:arrivalStatus,
            signStatus:signStatus,
            beginTime:beginTime,
            endTime:endTime,
            beginShipTime:beginShipTime,
            endShipTime:endShipTime,
            billType_code_query:billType_code_query,
            ownerName:ownerName,
            bean:'tmsOrder',
            method:'page',
            page:1,
            rows:10
        }
        vm.getPage();
    }

    vm.toSeparateOrder = function(){

        window.location.href="#/transport/order/splitbysite";

    }

    vm.toSeparateOrderByAmount = function(){

        window.location.href="#/transport/order/splitbyamount";

    }

    vm.toCreateWaybill = function(){

        window.location.href="#/transport/order/add";

    }

    vm.editTmsOrder = function(){

        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要修改的运单');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能修改一条运单');

        }else{

            window.location.href="#/transport/order/update?id="+vm.entity.getSelectedRows()[0].id;

        }

    }

    /*生效*/
    vm.operateEffect = function(){
        console.log(vm.entity.getSelectedRows())
        vm.selectListActive = [];
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要生效的运单');
            return false;

        }else{


            for(var i = 0 ; i < vm.entity.getSelectedRows().length ; i++){
                if(vm.entity.getSelectedRows()[i].status !='OPEN'){

                    msgAlert.text('请选择状态为打开的运单进行生效操作');
                    return false;

                }

            }

            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.selectListActive.push(vm.entity.getSelectedRows()[i].code);
            }
            console.log( vm.selectListActive.join())
            tmsOrder.activeBatch(vm).success(function(data) {

                if(data.additionalMsg.status==00){

                    msgAlert.text('生效成功');
                    vm.getPage();
                    vm.entity.clearSelectedRows();

                }else if(data.additionalMsg.status==01){

                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                    vm.entity.clearSelectedRows();

                }

            });



        }

    }

    /*失效*/
    vm.invalid = function(){
        console.log(vm.entity.getSelectedRows())
        vm.openBatchList = [];

        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要失效的运单');
            return false;

        }else{

            for(var i = 0 ; i < vm.entity.getSelectedRows().length ; i++){
                if(vm.entity.getSelectedRows()[i].status !='ACTIVE'){

                    msgAlert.text('请选择状态为生效的运单进行失效操作');
                    return false;

                }

            }

            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.openBatchList.push(vm.entity.getSelectedRows()[i].code);
            }
            console.log( vm.openBatchList.join())
            tmsOrder.openBatch(vm).success(function(data) {

                if(data.additionalMsg.status==00){

                    msgAlert.text('失效成功');
                    vm.getPage();
                    vm.entity.clearSelectedRows();

                }else if(data.additionalMsg.status==01){

                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                    vm.entity.clearSelectedRows();

                }

            });



        }

    }



}])

//运单详情
    .controller('tmsOrderDetailController', ['$rootScope', '$scope','$http','$location','uiGridConstants', 'settings','orderDetail','commonUtil','Table', function($rootScope, $scope, $http, $location,uiGridConstants,settings, orderDetail,commonUtil,Table) {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.id =  $location.search().id;

        orderDetail.getDetail(vm).success(function(data) {

            if(data.additionalMsg.status==00){

                vm.orderMap = data.orderMap;
                vm.goodsList = data.goodsList;
                vm.fee = data.fee;

            }else if(data.additionalMsg.status==01){
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');

            }

        });



    }])