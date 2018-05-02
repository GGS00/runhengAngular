//新建运单
angular.module('MetronicApp').controller('addpurchaseController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','order','commonUtil','citySelect', function($rootScope, $scope, $http, uiGridConstants,settings, order,commonUtil,citySelect) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;

    vm.goodsList = [];

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
            isSupply:1,
            page:1,
            rows:10,
            userType:4
        };

        vm.wareParams = {
            bean: 'wmsWarehouse',
            method: 'page',
            qryType:'02',
            page: 1,
            rows: 10
        }

        commonUtil.getList(vm.supParams).success(function(data) {
            vm.supplierList = data.rows;
            vm.supplierID=vm.supplierList[0].userId;
            vm.pageParams = {
                bean:'gmsSupplier',
                method:'pageGetSupplierSkuList',
                qryType:'03',
                supplierId: vm.supplierID,
                page:1,
                rows:10
            }
        });

        commonUtil.getList(vm.wareParams).success(function(data) {
            vm.wareList = data.rows;
            vm.wareHouseID=vm.wareList[0].wareHouseId;
        });
    }



    vm.getPage = function () {
        vm.pageParams = {
            bean:'gmsSupplier',
            method:'pageGetSupplierSkuList',
            qryType:'03',
            supplierId: $('.supplierId').val().substring(7),
            page:1,
            rows:10
        }

        commonUtil.getList(vm.pageParams).success(function(data) {
            vm.data = data;
        });
    };

    vm.addNewGoods = function(){

        $('#selectGoods').modal('show');

        vm.getPage();
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

        vm.supplierId = $('.supplierId').val().substring(7);
        vm.supplierName = $('.supplierId').find("option:selected").text();
        if(vm.supplierId == "" ||vm.supplierId ==" "){
            msgAlert.text("请先选择供应商");
            return false;
        }

        vm.warehouseId = $('.warehouseId').val().substring(7);
        vm.warehouseName = $('.warehouseId').find("option:selected").text();
        if(vm.warehouseId == "" ||vm.warehouseId ==" "){
            msgAlert.text("请先选择收货仓库");
            return false;
        }

        if(vm.goodsList.length == 0){
            msgAlert.text("请先选择商品添加");
            return false;
        }

        vm.goodsDeliveryWay = $('.goodsDeliveryWay').val();
        if(vm.goodsDeliveryWay == "" ||vm.goodsDeliveryWay ==" "){
            msgAlert.text("请先选择交割方式");
            return false;
        }

        vm.settlementWay = $('.settlementWay').val();
        if(vm.settlementWay == "" ||vm.settlementWay ==" "){
            msgAlert.text("请先选择结款方式");
            return false;
        }

        vm.prepayProportion =  $('input[name="prepayProportion"]').val();
        /*if(vm.prepayProportion == ""){
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

        vm.arrivalDate = $('.arrivalDate span').html();

        order.addPurchase(vm).success(function(data) {
            if(data.status==00){

                msgAlert.text('新增成功');
                window.location.href="#/order/purchaseOrder/purchase";

            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
            }

        });
    };


}])