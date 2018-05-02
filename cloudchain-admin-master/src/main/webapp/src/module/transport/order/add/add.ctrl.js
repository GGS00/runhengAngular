//新建运单
angular.module('MetronicApp').controller('newWaybillController',function($rootScope, $scope, $http, uiGridConstants,settings, tmsNewWaybill,commonUtil,Goods) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    vm.contactOrAddress = 1;
    vm.goodsList = [{name:''}];
    vm.payList = [0];
    vm.searchSwitch = 'on';
    vm.payWay = 0;

    vm.fromReceiverCMobile ='';
    vm.fromReceiverCContactor = '';
    vm.toReceiverCContactor ='';
    vm.toReceiverCMobile = '';
    vm.saddressDetail ='';
    vm.raddressDetail ='';
    vm.sendSwitch = 0;
    vm.receiveSwitch = 0;

        /*常用地址*/
        vm.pageParamsTwo = {
            bean:'user',
            method:'pageGetTopContacts',
            types:[1,4,5,6].join(),
            page:1,
            rows:10
        }


        vm.columnTwo = [
            {   field: "cneeName",
                displayName: '联系人',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            },
            {  field: "company",
                displayName: '公司',
                enableCellEdit: true,
                width:300,
                enableCellEditOnFocus:true
            },
            {  field: "cneeMobile",
                displayName: '联系方式',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            },
            {  field: "address",
                displayName: '地址',
                enableCellEdit: true,
                enableCellEditOnFocus:true,
                width:500,
                cellTemplate:'<div style="padding:5px">{{row.entity.province}}{{row.entity.city}}{{row.entity.county}}{{row.entity.address}}</div>'
            }
        ]

        /*常用货品*/
        vm.pageParamsThree = {
            bean:'goods',
            method:'page',
            page:1,
            rows:10,
            showType:'sku'
        }
        vm.columnThree = [
            {  field: "spuId",
                displayName: '商品编码',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            },
            {   field: "title",
                displayName: '货品名',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            }
        ]


    vm.ownerName = 'initOwner';
    /*msgAlert.text('系统繁忙 >﹏<');*/
    initial();

    function initial(){
        vm.dictTypeName ='tms单据类型';
        tmsNewWaybill.getList(vm).success(function(data) {
            vm.selectList = data.rows;
        });
        /*tmsNewWaybill.getBillTypeList(vm).success(function(data) {
            vm.billTypeList = data.rows;
        });*/
        vm.dictTypeName ='计量单位';
        tmsNewWaybill.getBillTypeList(vm).success(function(data) {
            vm.unitList = data.rows;
        });

    }

    vm.ownerChange = function(){
        var userType = $('#ownerNameType').find('option:selected').attr('userType');
        if(userType==0){
            vm.dictTypeName ='tms单据类型';
            tmsNewWaybill.getBillTypeList(vm).success(function(data) {
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
        commonUtil.getList(vm.pageParamsThree).success(function(data) {
            vm.dataThree = data;

        });
    };
    vm.getPageThree();


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
            vm.sendSwitch = 1;
            vm.saddressDetail = vm.entityTwo.getSelectedRows()[0].address;
            vm.selectsProvince = vm.entityTwo.getSelectedRows()[0].provinceName;
            vm.selectsCity = vm.entityTwo.getSelectedRows()[0].cityName;
            vm.selectsDistrict = vm.entityTwo.getSelectedRows()[0].countyName;
            vm.fromReceiverCCompany = vm.entityTwo.getSelectedRows()[0].company;
            vm.fromReceiverCContactor = vm.entityTwo.getSelectedRows()[0].contactName;
            vm.fromReceiverCMobile = vm.entityTwo.getSelectedRows()[0].mobile;
            vm.fromReceiverCCId= vm.entityTwo.getSelectedRows()[0].addressId;
            $('#selectCommonAddress').modal('hide');
            vm.entityTwo.clearSelectedRows();

        }else if(vm.whichL == 2){
            vm.receiveSwitch = 1;
            vm.raddressDetail = vm.entityTwo.getSelectedRows()[0].address;
            vm.selectrProvince = vm.entityTwo.getSelectedRows()[0].provinceName;
            vm.selectrCity = vm.entityTwo.getSelectedRows()[0].cityName;
            vm.selectrDistrict = vm.entityTwo.getSelectedRows()[0].countyName;
            vm.toReceiverCCompany = vm.entityTwo.getSelectedRows()[0].company;
            vm.toReceiverCContactor = vm.entityTwo.getSelectedRows()[0].contactName;
            vm.toReceiverCMobile = vm.entityTwo.getSelectedRows()[0].mobile;
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
                name:vm.entityThree.getSelectedRows()[0].title
            };
            for(var i = 1 ; i < vm.entityThree.getSelectedRows().length ; i++){
                    vm.goodsList.push({
                        name:vm.entityThree.getSelectedRows()[i].title
                    });

            }

                vm.entityThree.clearSelectedRows();
                $('#selectCommonGoods').modal('hide');

        }

    }

    vm.toTmsOrder = function(){

        window.location.href="#/transport/order";

    }

    vm.addNewGoods = function(){

        vm.goodsList.push({name:''});

    };

    vm.removeGoods = function(index){

        vm.goodsList.splice(index,1)

    };

    vm.addNewPay = function(){

        vm.payList.push(vm.payList[vm.payList.length-1]+1);

    };

    vm.removePay = function(index){

        vm.payList.splice(index,1)

    };

    vm.submit = function() {
        //提交入参
        /*货主信息*/
        var ownerId = $('.ownerName').val();
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
        if(toReceiverName == "" || receiverName=="" || receiverTel ==""||receiverAddressDetail ==""){
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
        vm.payWay = $('input[name="pay"]:checked').val();
        if(vm.payWay == 0){
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


        vm.tmsOrderFee.feeType =vm.payWay;

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
        $('#ownerName').val($('select[name="tmsOrder.ownerId"] :checked').html());

        if(vm.sendSwitch==0){
            $('#fromReceiverCProvince').val($('.senderAddress').find('.selectPro :selected').html());
            $('#fromReceiverCCity').val($('.senderAddress').find('.selectCity :selected').html());
            $('#fromReceiverCDistrict').val($('.senderAddress').find('.selectArea :selected').html());
        }
        if(vm.receiveSwitch==0){
            $('#toReceiverCProvince').val($('.receiverAddress').find('.selectPro :selected').html());
            $('#toReceiverCCity').val($('.receiverAddress').find('.selectCity :selected').html());
            $('#toReceiverCDistrict').val($('.receiverAddress').find('.selectArea :selected').html());
        }

        /*tmsOrderFee;

         orderGoodsList;*/

        vm.form = $("#newWayCommit").serialize();

        vm.form = decodeURIComponent(vm.form,true)

        $.ajax({
            url:"/transport/order/add",
            data:vm.form,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.additionalMsg.status==00){

                    msgAlert.text('新增成功');
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

    function categoryTree() {
        $("#categoryTree").jstree({
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

    Goods.getCategoryList().success(function (data) {
        console.log(data)
        var oldbox = data.data;
        var row =  new Array();

        row.push({"id":0,"parent":"#","text":"全部商品"})
        if(oldbox != null){
            for(var i=0;i<oldbox.length;i++){
                if(oldbox[i].parentCId == 0){
                    row.push({"id":oldbox[i].cId,"parent":"#","text":oldbox[i].name})
                }else{
                    row.push({"id":oldbox[i].cId,"parent":oldbox[i].parentCId,"text":oldbox[i].name})
                }
            }
        }
        categoryTree()
        $("#categoryTree").jstree(true).settings.core.data = row;
        $('#categoryTree').jstree(true).deselect_all();
        $("#categoryTree").jstree(true).refresh('true');
        $("#categoryTree").on('changed.jstree',function(e,data){
            $scope.cIds="";
            var i, j;
            for (i = 0, j = data.selected.length; i < j; i++) {
                var node = data.instance.get_node(data.selected[i]);
                if (data.instance.is_leaf(node)) {
                    if(node.id == 0){
                        node.id = ""
                    }
                    $scope.cIds = node.id;
                    vm.pageParamsThree.cId = $scope.cIds,
                        vm.getPageThree()
                }
            }
        });
    })    


    vm.serachGoods = function () {
        vm.pageParamsThree.title = $scope.skuName,

        vm.getPageThree()
    }

})