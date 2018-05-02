//新建运单
angular.module('MetronicApp').controller('editpurchaseController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','order','commonUtil','citySelect', function($rootScope, $scope, $http, uiGridConstants,settings, order,commonUtil,citySelect) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;

    vm.pageParams = {
        bean:'gmsSupplier',
        method:'pageGetSupplierSkuList',
        page:1,
        rows:10
    }

    vm.column = [
        {   field: "skuId",
            displayName: '商品编码',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "skuName",
            displayName: '商品名称',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "spec",
            displayName: '属性',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "price",
            displayName: '采购单价',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        }
    ]


    initial();
    function initial(){
        vm.supParams = {
            bean:'user',
            method:'pageGetUserList',
            ownerType:2,
            page:1,
            rows:10,
            userType:4
        };

        vm.wareParams = {
            bean: 'wmsWarehouse',
            method: 'page',
            page: 1,
            rows: 10
        }

        commonUtil.getList(vm.supParams).success(function(data) {
            vm.supplierList = data.rows;
        });

        commonUtil.getList(vm.wareParams).success(function(data) {
            vm.wareList = data.rows;
        });
        vm.goodsDeliveryWayList = [
            {name:'仓库内货权转移',id:0},
            {name:'自提',id:1},
            {name:'供应商送货',id:2}
        ];

        vm.settlementWayList = [
            {name:'预付',id:0},
            {name:'到货结算',id:1}
        ];

        var storage = window.localStorage;
        vm.purchaseSelect = JSON.parse(storage["purchaseSelect"]);
        console.log(vm.purchaseSelect)
        vm.goodsList = vm.purchaseSelect.itemList;
        vm.goodsDeliveryWaySelected =vm.purchaseSelect.goodsDeliveryWay;
        vm.settlementWaySelected =vm.purchaseSelect.settlementWay;
        $('#remarks').val(vm.purchaseSelect.remark);
    }

    vm.getPage = function () {
        commonUtil.getList(vm.pageParams).success(function(data) {
            vm.data = data;
        });
    };
    vm.getPage();

    vm.addNewGoods = function(){

        $('#selectGoods').modal('show');

    };

    vm.toPurchase = function(){
        window.location.href="#/order/purchaseOrder/purchase";
    }

    vm.addGoods = function(){

        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择商品');
            return false;

        }else{
            for(var i = 0 ; i < vm.entity.getSelectedRows().length ; i++){
                vm.goodsList.push({
                    skuId:vm.entity.getSelectedRows()[i].skuId,
                    spuId:vm.entity.getSelectedRows()[i].spuId,
                    skuName:vm.entity.getSelectedRows()[i].skuName,
                    spec:vm.entity.getSelectedRows()[i].spec,
                    price:vm.entity.getSelectedRows()[i].price
                });
            }
                vm.entity.clearSelectedRows();
                $('#selectGoods').modal('hide');

        }

    }


    vm.removeGoods = function(index){

        vm.goodsList.splice(index,1)

    };



    vm.submit = function() {

        vm.supplierId = $('.supplierId').val();
        if(vm.supplierId == "" ||vm.supplierId ==" "){
            msgAlert.text("请先选择供应商");
            return false;
        }

        vm.warehouseId = $('.warehouseId').val();
        if(vm.warehouseId == "" ||vm.warehouseId ==" "){
            msgAlert.text("请先选择收货仓库");
            return false;
        }

        if(vm.goodsList.length == 0){
            msgAlert.text("请先选择商品添加");
            return false;
        }

        vm.prepayProportion =  $('input[name="prepayProportion"]').val();
    /*    if(vm.prepayProportion == ""){
            msgAlert.text("请先填写预付比例");
            return false;
        }*/

        vm.balanceSettlementDays =  $('input[name="balanceSettlementDays"]').val();
       /* if(vm.balanceSettlementDays == ""){
            msgAlert.text("请先填写余款结算周期");
            return false;
        }*/

        vm.remarks = $('textarea[name="remark"]').val();

        vm.goodList = "["
        for (var i = 0; i < vm.goodsList.length; i++) {
            var goodsCount = $(".goods_"+i).find('input[name="count"]').val();
            var goodsRemark = $(".goods_"+i).find('input[name="remark"]').val();
            if(goodsCount==""){
                msgAlert.text('请将商品信息填写完整');
                return false;
            }
            var jsonText = {};
            jsonText["skuId"] = $(".goods_"+i).find('input[name="skuId"]').val();
            jsonText["spuId"] = $(".goods_"+i).find('input[name="spuId"]').val();
            jsonText["count"] = goodsCount;
            jsonText["price"] =  $(".goods_"+i).find('input[name="price"]').val();
            jsonText["remark"] = goodsRemark;

            if(i<(vm.goodsList.length-1)){
                vm.goodList+=JSON.stringify(jsonText)+",";
            }else{
                vm.goodList+=JSON.stringify(jsonText);
            }
        }
        vm.goodList += "]";

        vm.arrivalDate = $('input[name="arrivalDate"]').val();

        order.updatePurchase(vm).success(function(data) {
            if(data.status==00){

                msgAlert.text('修改成功');
                window.location.href="#/order/purchaseOrder/purchase";

            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
            }

        });
    };


}])