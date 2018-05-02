angular.module('MetronicApp').controller('receiptSignController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','receipt','commonUtil', function($rootScope, $scope, $http, uiGridConstants,settings, receipt,commonUtil) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    vm.pageParams = {
        bean:'tmsSign',
        method:'page',
        sort: 'created_time',
        order: 'desc',
        isSign: 1,
        isFinal:1,
        page:1,
        rows:10
    }


    vm.column = [
        {   field: "status",
            displayName: '状态',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:100,
            cellTemplate:"<span class='label label-{{row.entity.status==\"OPEN\"?\"warning\":(row.entity.status==\"ACTIVE\"?\"danger\":(row.entity.status==\"ENTERED\"?\"primary\":(row.entity.status==\"DISPATCHED\"?\"danger\":(row.entity.status==\"ON_ROAD\"?\"info\":(row.entity.status==\"ARRIVED\"?\"danger\":(row.entity.status==\"SIGNED\"?\"success\":(row.entity.status==\"CANCEL\"?\"default\":(row.entity.status==\"TRUCKED\"?\"success\":(row.entity.status==\"UN_DISPATCH\"?\"default\":(row.entity.status==\"PART_SIGNED\"?\"default\":\"\"))))))))))}}' style='display:block;margin: 5px'>{{row.entity.status=='OPEN'?'打开':(row.entity.status=='ACTIVE'?'生效':(row.entity.status=='ENTERED'?'入场':(row.entity.status=='DISPATCHED'?'已调度':(row.entity.status=='ON_ROAD'?'在途':(row.entity.status=='ARRIVED'?'运抵':(row.entity.status=='SIGNED'?'签收':(row.entity.status=='CANCEL'?'取消':(row.entity.status=='TRUCKED'?'已装车':(row.entity.status=='UN_DISPATCH'?'未调度':(row.entity.status=='PART_SIGNED'?'部分签收':''))))))))))}}</span>"
        },
        {   field: "code",
            displayName: '订单号',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true
        },
        {   field: "way_bill_code",
            displayName: '运单号',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true,
            cellTemplate:'<a ui-sref="transport.receiptdetail({id:row.entity.id})" style="display: block;margin: 5px;">{{row.entity.way_bill_code}}</a>'
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
        {  field: "fromProvince",
            displayName: '发货地',
            enableCellEdit: true,
            width:300,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.fromProvince}}{{row.entity.fromCity}}{{row.entity.fromDistrict}}</div>'
        },
        {  field: "fromAddress",
            displayName: '发货地详情',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.fromAddress}}</div>'
        },
        {  field: "toContactor",
            displayName: '收货联系人',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "toProvince",
            displayName: '收货地',
            enableCellEdit: true,
            width:300,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.toProvince}}{{row.entity.toCity}}{{row.entity.toDistrict}}</div>'
        },
        {  field: "toAddress",
            displayName: '收货地详情',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.toAddress}}</div>'
        },
    ]




    vm.getPage = function () {

        commonUtil.getList(vm.pageParams).success(function(data) {
            vm.data = data;
        });
    };
    vm.getPage();

    vm.toSign = function(){
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要签收的运单');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能签收一个运单');
            return false;

        }else{
            window.location.href="#/transport/receipt/sign/detail?id="+ vm.entity.getSelectedRows()[0].id;
        }

    }

    vm.getPageByFilter = function(){
        var code = $('input[name="code"]').val();
        var wayBillCode = $('input[name="wayBillCode"]').val();
        if(code == "" && wayBillCode == ""){
            msgAlert.text('搜索条件不能为空');
            return false;
        }
        vm.pageParams = {
            bean:'tmsSign',
            method:'page',
            isFinal:1,
            code:code,
            wayBillCode:wayBillCode,
            page:1,
            rows:10
        }
        vm.getPage();
    }


}])