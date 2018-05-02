angular.module('MetronicApp').controller('neworderdistributeController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','order','commonUtil','citySelect','$location', function($rootScope, $scope, $http, uiGridConstants,settings, order,commonUtil,citySelect,$location) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;

    vm.orderId =  $location.search().orderId;
    vm.provinceId =  $location.search().provinceId;
    vm.cityId =  $location.search().cityId;
    vm.districtId =  $location.search().districtId;

    getNewOrderDetail();
    function  getNewOrderDetail(){
        order.getNewOrderDetail(vm).success(function(data) {
            if(data.status==00){
                if(data.obj!=null){
                    vm.warehouseName = data.obj.warehouseName;
                    vm.pendConfirmGoodsList = data.obj.itemModels;
                    for(var n = 0 ; n <  vm.pendConfirmGoodsList.length ; n++) {
                        vm.pendConfirmGoodsList[n].totalCount = 0;
                        if (vm.pendConfirmGoodsList[n].suppliers != null){
                            for (var m = 0; m < vm.pendConfirmGoodsList[n].suppliers.length; m++) {
                                vm.pendConfirmGoodsList[n].totalCount += parseInt(vm.pendConfirmGoodsList[n].suppliers[m].allotQuantity);
                            }
                        }
                    }
                    console.log(vm.pendConfirmGoodsList)
                }
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
            }

        });
    }

    vm.showTabs = function(index){
        switch (index)
        {
            case 0:
                pendOwnConfirmWarehouse();
                break;
            case 1:
                pendSupplierConfirmWarehouse();
                break;
        }

    }

    pendOwnConfirmWarehouse();

    function ownCategoryTree() {
        $("#ownCategoryTree").jstree({
            "core" : {
                "themes" : {
                    "responsive": false
                },
                // so that create works
                "check_callback" : true,
            },
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "file" : {
                    "icon" : "fa fa-file icon-state-warning icon-lg"
                }
            },
            "state" : { "key" : "demo2" },
            "plugins" : ["dnd", "state", "types"]
        })

    }

    function pendOwnConfirmWarehouse(){
        order.getAllotWarehouses(vm).success(function(data) {
            if(data.status==00){
                var oldbox = data.data;
                if(oldbox =='' || oldbox == null){
                    msgAlert.info('仓库为空,请先去添加仓库');
                    window.location.href = "#/order/salesOrder/neworder";
                    return false;
                }
                var row =  new Array();
                var handleList = [];
                for(var n = 0 ; n < oldbox.length ; n++) {
                    if (oldbox[n].warehouseType == '01') {
                        handleList.push({
                            "id": oldbox[n].warehouseId,
                            "parent": "#",
                            "text": oldbox[n].warehouseName,
                            "data": ""
                        });

                        for(var m = 0 ; m < oldbox[n].items.length ; m++){
                            handleList.push({"id":oldbox[n].items[m].warehouseId+oldbox[n].items[m].itemId,"parent":oldbox[n].items[m].warehouseId,"text":oldbox[n].items[m].skuName,"data":oldbox[n].items[m].itemId+","+oldbox[n].items[m].skuId+","+oldbox[n].warehouseType})
                        }
                    }
                }
                console.log(handleList)
                if(oldbox != null){
                    for(var i=0;i<handleList.length;i++){
                        row.push({"id":handleList[i].id,"parent":handleList[i].parent,"text":handleList[i].text,"data":handleList[i].data})
                    }
                }

                ownCategoryTree()
                $("#ownCategoryTree").jstree(true).settings.core.data = row;
                $("#ownCategoryTree").jstree(true).refresh();
                $("#ownCategoryTree").on('changed.jstree',function(e,data){
                    $scope.clickedNode = {};
                    $scope.clickedNode.id = data.instance.get_node(data.selected[0]).id;
                    $scope.clickedNode.warehouseId = data.instance.get_node(data.selected[0]).parent;
                    $scope.clickedNode.itemId = data.instance.get_node(data.selected[0]).data;
                    $scope.clickedNode.text = data.instance.get_node(data.selected[0]).text;
                    $scope.getList()
                });

            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
            }

        });
    }

    function supplierCategoryTree() {
        $("#supplierCategoryTree").jstree({
            "core" : {
                "themes" : {
                    "responsive": false
                },
                // so that create works
                "check_callback" : true,
            },
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "file" : {
                    "icon" : "fa fa-file icon-state-warning icon-lg"
                }
            },
            "state" : { "key" : "demo2" },
            "plugins" : ["dnd", "state", "types"]
        })

    }

    function pendSupplierConfirmWarehouse(){
        order.getAllotWarehouses(vm).success(function(data) {
            if(data.status==00){
                var oldbox = data.data;
                if(oldbox =='' || oldbox == null){
                    msgAlert.info('仓库为空,请先去添加仓库');
                    window.location.href = "#/order/salesOrder/neworder";
                    return false;
                }
                var row =  new Array();
                var handleList = [];
                for(var n = 0 ; n < oldbox.length ; n++){
                    if (oldbox[n].warehouseType == '02') {
                        handleList.push({
                            "id": oldbox[n].warehouseId,
                            "parent": "#",
                            "text": oldbox[n].warehouseName,
                            "data": ""
                        });

                        for(var m = 0 ; m < oldbox[n].items.length ; m++){
                            handleList.push({"id":oldbox[n].items[m].warehouseId+oldbox[n].items[m].itemId,"parent":oldbox[n].items[m].warehouseId,"text":oldbox[n].items[m].skuName,"data":oldbox[n].items[m].itemId+","+oldbox[n].items[m].skuId+","+oldbox[n].warehouseType})
                        }
                    }
                }
                console.log(handleList)
                if(oldbox != null){
                    for(var i=0;i<handleList.length;i++){
                        row.push({"id":handleList[i].id,"parent":handleList[i].parent,"text":handleList[i].text,"data":handleList[i].data})
                    }
                }
                supplierCategoryTree()
                $("#supplierCategoryTree").jstree(true).settings.core.data = row;
                $("#supplierCategoryTree").jstree(true).refresh();
                $("#supplierCategoryTree").on('changed.jstree',function(e,data){
                    $scope.clickedNode = {};
                    $scope.clickedNode.id = data.instance.get_node(data.selected[0]).id;
                    $scope.clickedNode.warehouseId = data.instance.get_node(data.selected[0]).parent;
                    $scope.clickedNode.itemId = data.instance.get_node(data.selected[0]).data;
                    $scope.clickedNode.text = data.instance.get_node(data.selected[0]).text;
                    $scope.getList()
                });

            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
            }

        });
    }

    /*vm.checkPriceState = false;*/
//获取用户列表
    $scope.getList = function() {
        vm.clicked = $scope.clickedNode;
        if(vm.clicked.itemId!=''&&vm.clicked.itemId!=undefined){
            if(vm.clicked.itemId.split(",")[2]=='01'){
                order.getSuppliers(vm).success(function (data) {
                    if(data.status==00){
                        vm.supplierList = data.data;
                        if(vm.supplierList == null || vm.supplierList == ''){
                            msgAlert.text('暂无数据');
                            return false;
                        }
                    }else{
                        msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                    }

                })
            }else if(vm.clicked.itemId.split(",")[2]=='02'){
                order.getSupplierInv(vm).success(function (data) {
                    if(data.status==00){
                        vm.supplierList = data.data;
                    }else{
                        msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                    }

                })

            }

        }
    }

    vm.submitOwnSupplier = function(){
        vm.submitList = [];
        for(var i = 0 ; i < vm.supplierList.length ; i++){
            if($('.goodsDis_'+i).find("input[name='operateC']").is(':checked')){
                var maxquantity = $(".goodsDis_"+i).find('input[name="maxquantity"]').val();
                var quantity = $(".goodsDis_"+i).find('input[name="quantity"]').val();
                var supplierAllotQuantity = $(".goodsDis_"+i).find('input[name="supplierAllotQuantity"]').val();
                var supplierCost = $(".goodsDis_"+i).find('input[name="supplierCost"]').val();
                var supplierId = $(".goodsDis_"+i).find('input[name="supplierId"]').val();
                var supplierName = $(".goodsDis_"+i).find('input[name="supplierName"]').val();
                if(quantity==''){
                    msgAlert.text('选中的供应商的出库数量不能为空');
                    return false;
                }
                if(parseInt(quantity)>parseInt(maxquantity)){
                    msgAlert.text('选中的供应商的出库数量不能大于库存');
                    return false;
                }
                vm.submitList.push({
                    "allotQuantity": quantity,
                    "cost": supplierCost,
                    "quantity": maxquantity,
                    "supplierId": supplierId,
                    "supplierName": supplierName
                })
            }
        }
        if(vm.submitList.length == 0){
            msgAlert.text('请先选择供应商及出库数量');
            return false;
        }
        vm.itemModels = [];
        vm.itemModels.push({
            "itemId": vm.clicked.itemId.split(",")[0],
            "skuId": vm.clicked.itemId.split(",")[1],
            "skuName": vm.clicked.text,
            "suppliers": vm.submitList
        })
        vm.params = {};
        vm.params.itemModels = vm.itemModels;
        vm.params.orderId = vm.orderId;
        vm.params.warehouseId = vm.clicked.warehouseId;
        if(vm.clicked.itemId.split(',')[2]=='01'){
            vm.params.warehouseType ='SELF';
        }else if(vm.clicked.itemId.split(',')[2]=='02'){
            vm.params.warehouseType ='SUPPLIER';
        }

        $.ajax({
            url:"/sale/allot",
            data:{
                param:JSON.stringify(vm.params)
            },
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.status==00){

                    if(vm.clicked.itemId.split(",")[2]=='01'){
                        order.getSuppliers(vm).success(function (data) {

                            getNewOrderDetail()
                            vm.supplierList = data.data;

                        })
                    }else if(vm.clicked.itemId.split(",")[2]=='02'){
                        order.getSupplierInv(vm).success(function (data) {

                            getNewOrderDetail()
                            vm.supplierList = data.data;

                        })

                    }

                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                }

            },
            error:function(){
                msgAlert.text('系统繁忙 >﹏<');
            }
        })
    }

    vm.submitSupplier = function(){
        vm.submitList = [];
        for(var i = 0 ; i < vm.supplierList.length ; i++){
            if($('.supplier_GoodsDis_'+i).find("input[name='operateC']").is(':checked')){
                var maxquantity = $(".supplier_GoodsDis_"+i).find('input[name="maxquantity"]').val();
                var quantity = $(".supplier_GoodsDis_"+i).find('input[name="quantity"]').val();
                var supplierAllotQuantity = $(".supplier_GoodsDis_"+i).find('input[name="supplierAllotQuantity"]').val();
                var supplierCost = $(".supplier_GoodsDis_"+i).find('input[name="supplierCost"]').val();
                var supplierId = $(".supplier_GoodsDis_"+i).find('input[name="supplierId"]').val();
                var supplierName = $(".supplier_GoodsDis_"+i).find('input[name="supplierName"]').val();
                if(quantity==''){
                    msgAlert.text('选中的供应商的出库数量不能为空');
                    return false;
                }
                if(parseInt(quantity)>parseInt(maxquantity)){
                    msgAlert.text('选中的供应商的出库数量不能大于库存');
                    return false;
                }
                vm.submitList.push({
                    "allotQuantity": quantity,
                    "cost": supplierCost,
                    "quantity": maxquantity,
                    "supplierId": supplierId,
                    "supplierName": supplierName
                })
            }
        }
        if(vm.submitList.length == 0){
            msgAlert.text('请先选择供应商及出库数量');
            return false;
        }
        vm.itemModels = [];
        vm.itemModels.push({
            "itemId": vm.clicked.itemId.split(",")[0],
            "skuId": vm.clicked.itemId.split(",")[1],
            "skuName": vm.clicked.text,
            "suppliers": vm.submitList
        })
        vm.params = {};
        vm.params.itemModels = vm.itemModels;
        vm.params.orderId = vm.orderId;
        vm.params.warehouseId = vm.clicked.warehouseId;
        if(vm.clicked.itemId.split(',')[2]=='01'){
            vm.params.warehouseType ='SELF';
        }else if(vm.clicked.itemId.split(',')[2]=='02'){
            vm.params.warehouseType ='SUPPLIER';
        }

        $.ajax({
            url:"/sale/allot",
            data:{
                param:JSON.stringify(vm.params)
            },
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.status==00){

                    if(vm.clicked.itemId.split(",")[2]=='01'){
                        order.getSuppliers(vm).success(function (data) {

                            getNewOrderDetail()
                            vm.supplierList = data.data;

                        })
                    }else if(vm.clicked.itemId.split(",")[2]=='02'){
                        order.getSupplierInv(vm).success(function (data) {

                            getNewOrderDetail()
                            vm.supplierList = data.data;

                        })

                    }

                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                }

            },
            error:function(){
                msgAlert.text('系统繁忙 >﹏<');
            }
        })
    }

    vm.submitDis = function(){
        order.seizeInventory(vm).success(function (data) {
            if(data.status==00){
                msgAlert.text('提交成功');
                $scope.getList();
            }else{
                if(data.status == '2004023'){
                    msgAlert.text('提交失败 >﹏< ['+ data.msg+']');
                    window.location.href = "#/order/salesOrder/neworder";

                }else{
                    msgAlert.text('提交失败 >﹏< ['+ data.msg+']');
                    return false;

                }

            }

        })
    }

    vm.backToOrder = function(){
        window.location.href = "#/order/salesOrder/neworder";
    }

    vm.cancelDis = function(){
        $('#confirmCancel').modal('show');
    }

    vm.confirmCancel = function(){
        order.givebackInventory(vm).success(function (data) {
            if(data.status==00){
                $('#confirmCancel').modal('hide');
                window.location.reload();
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                return false;
            }

        })
    }


}])