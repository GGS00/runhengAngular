angular.module('MetronicApp').controller('neworderpurchaseController', ['$rootScope', '$scope','$location','$http','uiGridConstants', 'settings','order','commonUtil','citySelect', function($rootScope, $scope, $location,$http, uiGridConstants,settings, order,commonUtil,citySelect)  {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.orderId =  $location.search().ids;
        vm.provinceId =  $location.search().provinceId;
        vm.cityId =  $location.search().cityId;
        vm.districtId =  $location.search().districtId;

        order.getAllotWarehouses(vm).success(function(data) {
            if(data.status==00){
                vm.wList = data.data;
                vm.wareHouseID=vm.wList[0].warehouseId;
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
            }

        });

        order.getSaleOrderDetail(vm).success(function(data) {
           console.log(data)
            if(data.status==00){
               vm.goodsList = data.obj.items;
                for(var i = 0 ; i < vm.goodsList.length ; i++){
                    vm.goodsList[i].supplierName ='';
                    vm.goodsList[i].supplierId ='';
                   /* vm.goodsList[i].price ='';*/
                    vm.goodsList[i].buycount =vm.goodsList[i].count;
                    vm.goodsList[i].subTotal ='';
                }
               console.log(vm.goodsList)
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
            }

        });

        vm.supplierSwitch = 0;

        vm.addLines = function(index){
            vm.supplierSwitch = 1;
            vm.indexList = index;
            vm.pageParams = {
                bean:'user',
                method:'pageGetUserList',
                userType:4,
                ownerType:2,
               /* isPurchase:'1',*/
                page:1,
                rows:10
            }
            vm.column = [
                {  field: "userId",
                    displayName: '编号',
                    enableCellEdit: true,
                    enableCellEditOnFocus:true
                },
                {   field: "nickName",
                    displayName: '供应商名称',
                    enableCellEdit: true,
                    enableCellEditOnFocus:true
                },
                {   field: "ownerSubacctExt.ext3",
                    displayName: '联系人',
                    enableCellEdit: true,
                    enableCellEditOnFocus:true
                },
                {   field: "ownerSubacctExt.ext4",
                    displayName: '联系电话',
                    enableCellEdit: true,
                    enableCellEditOnFocus:true
                }
            ]

            vm.getPage = function () {
                commonUtil.getList(vm.pageParams).success(function(data) {
                    vm.data = data;
                });
            };
            vm.getPage();
            $('#selectSupplier').modal('show')
        }

        vm.orderFinSelect = [];
        vm.addSupplier = function(){

            if(vm.entity.getSelectedRows().length == 0){

                msgAlert.text('请先选择供应商');
                return false;

            }else if(vm.entity.getSelectedRows().length > 1){

                msgAlert.text('只能选择一个供应商');
                return false;

            }else{
                vm.supplierName = vm.entity.getSelectedRows()[0].nickName;
                vm.goodsList[vm.indexList].supplierName = vm.supplierName;
                vm.goodsList[vm.indexList].supplierId= vm.entity.getSelectedRows()[0].userId;
                console.log(vm.goodsList)
                $('#selectSupplier').modal('hide');
            }

        }

        vm.toNewOrder = function(){
            window.location.href = "#/order/salesOrder/neworder";
        }


        vm.commitPurchase = function(){
            console.log(vm.goodsList)
            for (var i = 0; i < vm.goodsList.length; i++) {
                vm.itemData = "["
                vm.warehouseId =  $(".goodsPrice_"+i).find('select[name="warehouseId"]').find("option:selected").val().substring(7);
                vm.warehouseName= $(".goodsPrice_"+i).find('select[name="warehouseId"]').find("option:selected").text();
                if(vm.warehouseId == "" ||vm.warehouseId ==" "){
                    msgAlert.text("请先选择仓库");
                    return false;
                }
                if(vm.goodsList[i].supplierName==''){
                    msgAlert.text("请先选择供应商");
                    return false;
                }
                var goodsCount = $(".goodsPrice_"+i).find('input[name="buycount"]').val();
                var goodsPrice = $(".goodsPrice_"+i).find('input[name="price"]').val();
                var goodsTotal = $(".goodsPrice_"+i).find('input[name="subTotal"]').val();
                if(goodsCount==""){
                    msgAlert.text('请将商品数量填写完整');
                    return false;
                }

                if(goodsTotal==''){
                    msgAlert.text('请输入正确的单价格式');
                    return false;
                }

                if(goodsPrice ==""){
                    msgAlert.text('请将商品单价填写完整');
                    return false;
                }

                if(goodsCount < 0 ){
                    msgAlert.text('数量不能小于零');
                    return false;
                }

                if(goodsPrice< 0){
                    msgAlert.text('单价不能小于零');
                    return false;
                }


                var jsonText = {};
                jsonText["skuId"] = $(".goodsPrice_"+i).find('input[name="skuId"]').val();
                jsonText["spuId"] = $(".goodsPrice_"+i).find('input[name="spuId"]').val();
                jsonText["count"] = goodsCount;
                jsonText["price"] =  goodsPrice;
                jsonText["remark"] = '';
                if(i<(vm.goodsList.length-1)){
                    vm.itemData+=JSON.stringify(jsonText)+",";
                }else{
                    vm.itemData+=JSON.stringify(jsonText);
                }
                vm.itemData += "]";
                vm.goodList = vm.itemData;
                vm.supplierId = vm.goodsList[i].supplierId;
                vm.supplierName = vm.goodsList[i].supplierName;
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
               /* if(vm.prepayProportion == ""){
                    msgAlert.text("请先填写预付比例");
                    return false;
                }*/

                vm.balanceSettlementDays =  $('input[name="balanceSettlementDays"]').val();
               /* if(vm.balanceSettlementDays == ""){
                    msgAlert.text("请先填写余款结算周期");
                    return false;
                }*/

                vm.remarks = $('textarea[name="remark"]').val();
                console.log(vm.itemData)
                $.ajax({
                    url:"/purchase/add",
                    data:{
                        itemData:vm.goodList,
                        arrivalDate:$('.arrivalDate span').html(),
                        supplierId:vm.goodsList[i].supplierId,
                        supplierName:vm.goodsList[i].supplierName,
                        warehouseId:vm.warehouseId,
                        warehouseName:vm.warehouseName,
                        goodsDeliveryWay:vm.goodsDeliveryWay,
                        settlementWay:vm.settlementWay,
                        prepayProportion:vm.prepayProportion,
                        balanceSettlementDays:vm.balanceSettlementDays,
                        remark:vm.remarks
                    },
                    async:false,
                    type:"post",
                    dataType:"json",
                    success:function(data){
                        if(data.status==00){

                            msgAlert.info('新增成功');
                            window.location.href="#/order/salesOrder/neworder";

                        }else{
                            msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');

                        }
                    },
                    error:function(){
                        msgAlert.text('系统繁忙 >﹏<');
                    }
                })

            }


        }



    }])