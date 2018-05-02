//修改运单

angular.module('MetronicApp').controller('editTmsOrderController', ['$rootScope', '$scope','$http','$location','uiGridConstants', 'settings','editOrderDetail','commonUtil','Table','tmsNewWaybill', function($rootScope, $scope, $http, $location, uiGridConstants,settings, editOrderDetail,commonUtil,Table,tmsNewWaybill) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;

    vm.contactOrAddress = 1;
    vm.payList = [0];
    vm.searchSwitch = 'on';

    vm.id =  $location.search().id;

    initial();

    function initial(){
        /*vm.dictTypeName ='tms单据类型';
        editOrderDetail.getBillTypeList(vm).success(function(data) {
            vm.billTypeList = data.rows;
        });*/
        editOrderDetail.getList(vm).success(function(data) {

            vm.selectList = data.rows;

        });

        vm.dictTypeName ='计量单位';
        tmsNewWaybill.getBillTypeList(vm).success(function(data) {
            vm.unitList = data.rows;
        });



        editOrderDetail.getDetail(vm).success(function(data) {

            if(data.additionalMsg.status==00){
                vm.orderMap = data.orderMap;
                vm.goodsList = data.goodsList;
                vm.fee = data.fee;

                $('#remarks').val(vm.orderMap.description);

                $('.senderTime span').html(vm.orderMap.planShipTime .slice(0,10));
                $('.receiverTime span').html(vm.orderMap.planArrivalTime .slice(0,10));
                vm.tmsOrderFeeId = vm.fee.id;

                tmsNewWaybill.getList(vm).success(function(data) {
                    for(var i = 0 ; i < data.rows.length ; i++){
                        if(vm.orderMap.ownerId == data.rows[i].userId){
                            if(data.rows[i].userType==0){
                                vm.dictTypeName ='tms单据类型';
                                editOrderDetail.getBillTypeList(vm).success(function(data) {
                                    vm.billTypeList = data.rows;
                                });
                            }else if(data.rows[i].userType==4){
                                vm.billTypeList = [{
                                    dataName:"默认运单",
                                    dataValue:"2",
                                    dictValue:"1020110015",
                                    id:"1020210062"
                                }];
                            }
                        }
                    }
                });
            }else if(data.additionalMsg.status==01){
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
            }

        });

    }

    vm.ownerChange = function(){
        var userType = $('#ownerNameType').find('option:selected').attr('userType');
        if(userType==0){
            vm.dictTypeName ='tms单据类型';
            editOrderDetail.getBillTypeList(vm).success(function(data) {
                vm.billTypeList = data.rows;
            });
        }else if(userType==4){
            vm.billTypeList = [{
                dataName:"默认运单",
                dataValue:"2",
                dictValue:"1020110015",
                id:"1020210062"
            }];
        }
    }


    vm.getPageTwo = function () {
        commonUtil.getList(vm.pageParamsTwo).success(function(data) {
            vm.dataTwo = data;
        });
    };


    vm.getPageThree = function () {
        /*常用货品*/
        vm.pageParamsThree = {
            bean:'goods',
            method:'page4Tms',
            page:1,
            rows:10
        }
        vm.columnThree = [
            {  field: "spuId",
                displayName: '商品编码',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            },
            {   field: "spuName",
                displayName: '货品名',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            }
        ]

        commonUtil.getList(vm.pageParamsThree).success(function(data) {
            vm.dataThree = data;

        });
    };
    vm.getPageThree();


    vm.addNewGoods = function(){
        var newGoods = {
            "box_quantity": '',
            "goods_name": '',
            "goods_type":'',
            "id": '',
            "tms_order_id":'',
            "unit": "件",
            "volume":'',
            "weight":''}
        vm.goodsList.push(newGoods);

    };

    vm.removeGoods = function(index){

        vm.goodsList.splice(index,1)

    };

    vm.contactorSwitch = 0;
    vm.showOwner = function(x,y){
        vm.ownerId = $('.ownerName').val();
        if(vm.ownerId == "" ||vm.ownerId =="initOwner"){
            msgAlert.text('请先选择托运人');
            return false;
        }
        vm.contactorSwitch = 1;
        vm.whichL = y;
        vm.columnTwo = [
            {   field: 'addressId',
                displayName: '编号',
                width:250,
            },
            {   field: "company",
                displayName: '所属公司',
                width:150,
            },
            {   field: "contactName",
                displayName: '联系人',
                width:150,
            },
            {   field: "mobile",
                displayName: '联系电话',
                width:150,
            },
            {   name: "地址",
                cellTemplate:'<div style="padding:5px">{{row.entity.provinceName+row.entity.cityName+row.entity.countyName+row.entity.address}}</div>',
                width:350,
            }];

        vm.pageParamsTwo = {
            qryUserId: vm.ownerId,
            bean: 'umsAddress',
            method: 'page',
            addrType1:110,
            page: 1,
            rows: 10
        }
        vm.getPageTwo();
        $('input[name="newCompanyName"]').val('');
        $('input[name="newContactorName"]').val('');
        $('input[name="newContactMobile"]').val('');
        $('input[name="newContactorAddress"]').val('');
        $('.addressDiv').css('display','none');
        $('#selectCommonAddress').modal('show');
    }

    vm.confirmAddNewCommonContactor = function(){
        vm.newCompanyName = $('input[name="newCompanyName"]').val();
        vm.newContactorName = $('input[name="newContactorName"]').val();
        vm.newContactMobile = $('input[name="newContactMobile"]').val();
        vm.newContactorAddress = $('input[name="newContactorAddress"]').val();

        if(vm.newCompanyName==""){
            msgAlert.text('请输入所属公司名');
            return false;
        }
        if(vm.newContactorName==""){
            msgAlert.text('请输入联系人姓名');
            return false;
        }
        if(vm.newContactMobile==""){
            msgAlert.text('请输入联系电话');
            return false;
        }
        if(vm.newContactorAddress==""){
            msgAlert.text('请输入详细地址');
            return false;
        }

        vm.newContactorProvince = $('.provideAddress').find('.selectPro :selected').val().substr(7);
        vm.newContactorCity = $('.provideAddress').find('.selectCity :selected').val().substr(7);
        vm.newContactorCounty = $('.provideAddress').find('.selectArea :selected').val().substr(7);
        vm.newContactorProvinceName = $('.provideAddress').find('.selectPro :selected').html();
        vm.newContactorCityName = $('.provideAddress').find('.selectCity :selected').html();
        vm.newContactorCountyName = $('.provideAddress').find('.selectArea :selected').html();

        tmsNewWaybill.addUserAddress(vm).success(function (data) {
            if (data.status == 00) {
                msgAlert.text('添加成功');
                $('input[name="newCompanyName"]').val('');
                $('input[name="newContactorName"]').val('');
                $('input[name="newContactMobile"]').val('');
                $('input[name="newContactorAddress"]').val('');
                $('.addressDiv').toggle('normal');
                vm.getPageTwo();
            } else {
                msgAlert.text('添加失败 >﹏< [' + data.msg + ']');
            }
        });
    }

    vm.addressType = function(){
        $('.addressDiv').toggle('normal');
    }

    vm.showGodds = function(index){
        vm.goodsIndex  = index;
        $('#selectCommonGoods').modal('show');
    }

    vm.addNewCommonAddress = function(){
        $('.newAddressInfo').toggle('normal')
    }

    vm.confirmAddNewCommonAddress = function(){
        vm.newgoodsName = $('input[name="newgoodsName"]').val();
        vm.newgoodsCountUnit = $('select[name="newgoodsCountUnit"]').val();
        if(vm.newgoodsName == ""){
            msgAlert.text('请将新增商品名称填写完整');
            return false;
        }
        tmsNewWaybill.addNewGoods(vm).success(function(data) {
            if(data.status==00){
                msgAlert.text('新增成功');
                $('.newAddressInfo').toggle('normal');
                $('input[name="newgoodsName"]').val('');
                vm.getPageThree();
            }else{
                msgAlert.text('新增失败 >﹏< ['+ data.msg+']');
            }
        });

    }

    vm.addAddress = function(){
        if(vm.entityTwo.getSelectedRows().length == 0){

            msgAlert.text('请先选择一条常用联系人');
            return false;

        }else if(vm.entityTwo.getSelectedRows().length > 1){

            msgAlert.text('只能选用一条常用联系人');
            return false;

        }else{
            if(vm.whichL == 1){
                vm.orderMap.fromReceiverContact.address = vm.entityTwo.getSelectedRows()[0].address;
                vm.orderMap.fromReceiverContact.province = vm.entityTwo.getSelectedRows()[0].provinceName;
                vm.orderMap.fromReceiverContact.city = vm.entityTwo.getSelectedRows()[0].cityName;
                vm.orderMap.fromReceiverContact.district =vm.entityTwo.getSelectedRows()[0].countyName;
                vm.orderMap.fromReceiverName = vm.entityTwo.getSelectedRows()[0].company;
                vm.orderMap.fromReceiverContact.contactor = vm.entityTwo.getSelectedRows()[0].contactName;
                vm.orderMap.fromReceiverContact.mobile = vm.entityTwo.getSelectedRows()[0].mobile;
                vm.fromReceiverCCId= vm.entityTwo.getSelectedRows()[0].addressId;
                vm.entityTwo.clearSelectedRows();
                $('#selectCommonAddress').modal('hide');
            }else if(vm.whichL == 2){
                vm.orderMap.toReceiverContact.address = vm.entityTwo.getSelectedRows()[0].address;
                vm.orderMap.toReceiverContact.province = vm.entityTwo.getSelectedRows()[0].provinceName;
                vm.orderMap.toReceiverContact.city = vm.entityTwo.getSelectedRows()[0].cityName;
                vm.orderMap.toReceiverContact.district =vm.entityTwo.getSelectedRows()[0].countyName;
                vm.orderMap.toReceiverName = vm.entityTwo.getSelectedRows()[0].company;
                vm.orderMap.toReceiverContact.contactor = vm.entityTwo.getSelectedRows()[0].contactName;
                vm.orderMap.toReceiverContact.mobile = vm.entityTwo.getSelectedRows()[0].mobile;
                vm.toReceiverCCId = vm.entityTwo.getSelectedRows()[0].addressId;
                vm.entityTwo.clearSelectedRows();
                $('#selectCommonAddress').modal('hide');
            }

        }

    }

    vm.addGoods = function(){

        if(vm.entityThree.getSelectedRows().length == 0){

            msgAlert.text('请先选择常用货物');
            return false;

        }else{
            vm.goodsList[vm.goodsIndex]={
                box_quantity: '',
                goods_type:'',
                id: '',
                tms_order_id:'',
                volume:'',
                weight:'',
                goods_name:vm.entityThree.getSelectedRows()[0].spuName,
                unit:'个',
            };
            for(var i = 1 ; i < vm.entityThree.getSelectedRows().length ; i++){
                vm.goodsList.push({
                    box_quantity: '',
                    goods_type:'',
                    id: '',
                    tms_order_id:'',
                    volume:'',
                    weight:'',
                    goods_name:vm.entityThree.getSelectedRows()[i].spuName,
                    unit:'个',
                });
            }

            vm.entityThree.clearSelectedRows();
            $('#selectCommonGoods').modal('hide');


        }

    }

    vm.toTmsOrder = function(){

        window.location.href="#/transport/order";

    };

    vm.addNewPay = function(){

        vm.payList.push(vm.payList[vm.payList.length-1]+1);

    };

    vm.removePay = function(index){

        vm.payList.splice(index,1)

    };

    vm.submit = function() {
        console.log($('select[name="tmsOrder.billTypeId"]').val())

        //提交入参
        /*货主信息*/
        var ownerId= $('.ownerName').val();
        if(ownerId == "" ||ownerId =="initOwner"){
            msgAlert.text('请将托运人信息填写完整');
            return false;
        }
        /*货物信息*/
        var boxQuantity = 0;
        vm.goodList = "["
        for (var i = 0; i < vm.goodsList.length; i++) {
            var goodsName = $(".goods_"+i).find('input[name="orderGoodsList['+ i +'].goodsName"]').val();
            var goodsType = $(".goods_"+i).find('input[name="orderGoodsList['+ i +'].goodsType"]').val();
            var goodsCount = $(".goods_"+i).find('input[name="orderGoodsList['+ i +'].boxQuantity"]').val();
            var goodsCountUnit = $(".goods_"+i).find('select[name="orderGoodsList['+ i +'].unit"]').val();
            var goodsWeight = $(".goods_"+i).find('input[name="orderGoodsList['+ i +'].weight"]').val();
            var goodsVolume = $(".goods_"+i).find('input[name="orderGoodsList['+ i +'].volume"]').val();

            if(goodsName=="" || goodsType ==""|| goodsCount ==""|| goodsWeight =="" ||goodsVolume == ""){
                msgAlert.text('请将货物信息填写完整');
                return false;
            }
            boxQuantity += goodsCount;
            var jsonText = {};
            jsonText["goodsName"] = goodsName;
            jsonText["goodsType"] = goodsType;
            jsonText["boxQuantity"] = goodsCount;
            jsonText["unit"] = goodsCountUnit;
            jsonText["weight"] = goodsWeight;
            jsonText["volume"] = goodsVolume;
            if(i<(vm.goodsList.length-1)){
                vm.goodList+=JSON.stringify(jsonText)+",";
            }else{
                vm.goodList+=JSON.stringify(jsonText);
            }
        }
        vm.goodList += "]";

        /*发货人信息*/
        var fromReceiverName = $('input[name="tmsOrder.fromReceiverName"]').val();
        var senderName = $('input[name="tmsOrder.fromReceiverCContactor"]').val();
        var senderTel = $('input[name="tmsOrder.fromReceiverCMobile"]').val();
        var senderAddressDetail = $('input[name="tmsOrder.fromReceiverCAddress"]').val();
        var senderTime = $('.senderTime span').html();
        if(fromReceiverName == "" || senderName=="" || senderTel ==""|| senderAddressDetail ==""){
            msgAlert.text('请将发货信息填写完整');
            return false;
        }

        /*收货人信息*/
        var toReceiverName = $('input[name="tmsOrder.toReceiverName"]').val();
        var receiverName = $('input[name="tmsOrder.toReceiverCContactor"]').val();
        var receiverTel = $('input[name="tmsOrder.toReceiverCMobile"]').val();
        var receiverAddressDetail = $('input[name="tmsOrder.toReceiverCAddress"]').val();
        var receiverTime = $('.receiverTime span').html();

        if(senderTime>receiverTime){
            msgAlert.text('收货时间不能小于发货时间');
            return;
        }

        if(toReceiverName == "" || receiverName=="" || receiverTel ==""|| receiverAddressDetail ==""){
            msgAlert.text('请将收货信息填写完整');
            return false;
        }
        /*单据类型*/
        var billTypeId = $('select[name="tmsOrder.billTypeId"]').val();
        if(billTypeId==""){
            msgAlert.text('请选择单据类型');
            return false;
        }
        /*订单金额*/
        vm.wholeMoneyNum = $('input[name="tmsOrderFee.totalFee"]').val();
        if(vm.payWay == 'byWhole'){
            //按整单
            if(vm.wholeMoneyNum == ""||vm.wholeMoneyNum==undefined){
                msgAlert.text('请填写完整总运费');
                return false;
            }
        }else{
            //按单价

        }
        var cashFee = $('input[name="tmsOrderFee.cashFee"]').val();
        var monthlyFee = $('input[name="tmsOrderFee.monthlyFee"]').val();
        var receiverPayFee = $('input[name="tmsOrderFee.receiverPayFee"]').val();
        var receiptFee = $('input[name="tmsOrderFee.receiptFee"]').val();
        var toPayFee = $('input[name="tmsOrderFee.toPayFee"]').val();
        if(cashFee == "" && monthlyFee=="" && receiverPayFee ==""&& receiptFee ==""&& toPayFee ==""){
            msgAlert.text('请将付款方式信息填写完整');
            return false;
        }

        if(vm.wholeMoneyNum !=Number(Number(cashFee)+Number(monthlyFee)+Number(receiverPayFee)+Number(receiptFee)+Number(toPayFee))){
            msgAlert.text('合计与付款总额不等，请重新填写');
            return false;
        }

        var invoice = $('input[name="invoice"]:checked').val();
        var receiptType = $('input[name="receipt"]:checked').val();
        var remarks =  $('textarea[name="tmsOrder.description"]').val();

        //提交
        vm.tmsOrder={};
        //货主
        vm.tmsOrder.ownerName = ownerName;
        //发货信息
        vm.tmsOrder.fromReceiverName = fromReceiverName;
        vm.tmsOrder.fromReceiverCProvince = "";
        vm.tmsOrder.fromReceiverCCity = "";
        vm.tmsOrder.fromReceiverCDistrict = "";
        vm.tmsOrder.fromReceiverCAddress = senderAddressDetail;
        vm.tmsOrder.fromReceiverCContactor = senderName;
        vm.tmsOrder.fromReceiverCMobile = senderTel;
        vm.tmsOrder.planShipTime = senderTime;
        //收货信息
        vm.tmsOrder.toReceiverName = toReceiverName;
        vm.tmsOrder.toReceiverCProvince = "";
        vm.tmsOrder.toReceiverCCity = "";
        vm.tmsOrder.toReceiverCDistrict = "";
        vm.tmsOrder.toReceiverCAddress = receiverAddressDetail;
        vm.tmsOrder.toReceiverCContactor = receiverName;
        vm.tmsOrder.toReceiverCMobile = receiverTel;
        vm.tmsOrder.planArrivalTime = receiverTime;

        //单据类型
        vm.tmsOrder.billTypeId = billTypeId;

        //货物总数量
        vm.tmsOrder.boxQuantity = boxQuantity;
        //备注
        vm.tmsOrder.description = remarks;
        //是否开发票 0：不开，1：开发票
        vm.tmsOrder.invoice = invoice;
        //回单要求 0：不要回单，1货物托运单，2发货单
        vm.tmsOrder.receiptType = receiptType;


        //费用信息
        vm.tmsOrderFee = {}

        if(vm.payWay =='byWhole'){
            vm.tmsOrderFee.feeType = 0;
        }else if(vm.payWay =='bySingle'){
            vm.tmsOrderFee.feeType = 1;
        }
        vm.tmsOrderFee.cashFee = cashFee;
        vm.tmsOrderFee.monthlyFee = monthlyFee;
        vm.tmsOrderFee.receiverPayFee = receiverPayFee;
        vm.tmsOrderFee.receiptFee = receiptFee;
        vm.tmsOrderFee.toPayFee = toPayFee;
        vm.tmsOrderFee.totalFee = vm.wholeMoneyNum;

        $('#planShipTime').val(vm.tmsOrder.planShipTime);
        $('#planArrivalTime').val(vm.tmsOrder.planArrivalTime);
        $('#feeType').val(vm.tmsOrderFee.feeType);
        $('#invoice').val(vm.tmsOrder.invoice);
        $('#receiptType').val(vm.tmsOrder.receiptType);
        $('#tmsOrderId').val(vm.id);
        $('#tmsOrderFeeId').val(vm.tmsOrderFeeId);
        $('#ownerName').val($('select[name="tmsOrder.ownerId"] :checked').html());

        /*tmsOrderFee;

         orderGoodsList;*/

        vm.form = $("#newWayCommit").serialize();

        vm.form = decodeURIComponent(vm.form,true)

        $.ajax({
            url:"/transport/order/update",
            data:vm.form,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.additionalMsg.status==00){

                    msgAlert.text('修改成功');
                    window.location.href="#/transport/order";

                }else if(data.additionalMsg.status==01){
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');

                }

            },
            error:function(){
                msgAlert.text('系统繁忙 >﹏<');
            }
        })

    };


}])