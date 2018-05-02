//新建运单
angular.module('MetronicApp').controller('valetOrderController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','order','commonUtil','citySelect', function($rootScope, $scope, $http, uiGridConstants,settings, order,commonUtil,citySelect) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    vm.invoicex = 3;
    vm.sendWarehouse = 1;
    vm.goodsList = [];

    vm.pageParamsTwo = {
        bean:'user',
        method:'pageGetUserList',
        // types:[1,2].join(),
        page:1,
        rows:10,
        userType:'1'
    }


    vm.columnTwo = [
        {   field: "userName",
            displayName: '账号',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "nickName",
            displayName: '分销网点',
            enableCellEdit: true,
            width:300,
            enableCellEditOnFocus:true
        },
        {  field: "mobile",
            displayName: '联系电话',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "email",
            displayName: '邮箱',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:500
        }
    ]

    vm.pageParams = {
        bean:'goods',
        method:'pageSku',
        page:1,
        rows:10
    }

    vm.column = [
        {   field: "skuId",
            displayName: '商品编码',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "title",
            displayName: '商品名称',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
       /* {   field: "spec",
            displayName: '属性',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },*/
        {  field: "price",
            displayName: '建议销售单价(元)',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.price/100}}</div>"
        }
    ]


    initial();
    function initial(){

    }

    vm.getPageTwo = function () {
        commonUtil.getList(vm.pageParamsTwo).success(function(data) {
            vm.dataTwo = data;
        });
    };


    vm.getPage = function () {
        commonUtil.getList(vm.pageParams).success(function(data) {
            vm.data = data;
        });
    };
    vm.getPage();

    vm.getPageByFilter = function(){

        var cneeName = $('input[name="cneeName"]').val();
        //msgAlert.text(cneeName)

        var ctypes = $('.ctypes').val();
        if(ctypes == " "){
            ctypes ="";
        }

      /*  if(cneeName == "" || ctypes == ""){
            msgAlert.text('搜索条件不能为空');
            return false;
        }*/
        vm.pageParamsTwo = {
            bean:'user',
            method:'pageGetUserList',
            userType:1,
            nickName:cneeName,
            page:1,
            rows:10
        }
        vm.getPageTwo();
    }
    vm.addCustomer = function(){
        vm.getPageTwo();
        $('#selectCustomer').modal('show');
    }

    vm.confirmCustomer = function(){
        if(vm.entityTwo.getSelectedRows().length == 0){

            msgAlert.text('请先选择客户');
            return false;

        }else if(vm.entityTwo.getSelectedRows().length > 1){

            msgAlert.text('只能选择一个客户信息');
            return false;

        }else{
                vm.customerInfo = vm.entityTwo.getSelectedRows()[0];
                vm.entityTwo.clearSelectedRows();
                $('#selectCustomer').modal('hide');

                vm.pageParamsThree = {
                    bean:'umsAddress',
                    method:'page',
                    qryUserId:vm.customerInfo.userId,
                    addrType:'111',
                    page:1,
                    rows:10
                }
                commonUtil.getList(vm.pageParamsThree).success(function(data) {
                    vm.customerInfoList = data.rows;
                    if(vm.customerInfoList==''){
                        msgAlert.text('该客户下没有地址');
                        return false;
                    }
                });
        }

    }

    vm.addNewGoods = function(){

        $('#selectGoods').modal('show');

    };

    vm.addPrice = function(){
        alert(1)
    }

    vm.addGoods = function(){

        if(vm.selectGoodsentity.getSelectedRows().length == 0){

            msgAlert.text('请先选择商品');
            return false;

        }else{
            for(var i = 0 ; i < vm.selectGoodsentity.getSelectedRows().length ; i++){
                vm.goodsList.push({
                    skuId:vm.selectGoodsentity.getSelectedRows()[i].skuId,
                    spuId:vm.selectGoodsentity.getSelectedRows()[i].spuId,
                    skuTitle:vm.selectGoodsentity.getSelectedRows()[i].title,
                    count:'1',
                    price:vm.selectGoodsentity.getSelectedRows()[i].price/100,
                    subTotal:''
                });
            }
                vm.selectGoodsentity.clearSelectedRows();
                $('#selectGoods').modal('hide');

        }

    }


    vm.removeGoods = function(index){

        vm.goodsList.splice(index,1)

    };


    vm.submit = function() {
        vm.checkAddress= $('input[name="address"]:checked');
        if(vm.customerInfo == undefined){
            msgAlert.text('请先选择客户');
            return false;
        }

        if(vm.checkAddress.val() == undefined){
            msgAlert.text('请选择有地址的用户');
            return false;
        }

        if(!vm.checkAddress.val()){
            msgAlert.text('请先选择地址');
            return false;
        }

        if(vm.goodsList == ''){
            msgAlert.text('请先选择商品');
            return false;
        }

        $('input[name="logistics.cneeName"]').val(vm.checkAddress.attr('cneeName'));
        $('input[name="logistics.cneeMobile"]').val(vm.checkAddress.attr('cneeMobile'));
        $('input[name="logistics.provinceId"]').val(vm.checkAddress.attr('proId'));
        $('input[name="logistics.cityId"]').val(vm.checkAddress.attr('cityId'));
        $('input[name="logistics.districtId"]').val(vm.checkAddress.attr('countyId'));
        $('input[name="logistics.provinceName"]').val(vm.checkAddress.attr('proName'));
        $('input[name="logistics.cityName"]').val(vm.checkAddress.attr('cityName'));
        $('input[name="logistics.districtName"]').val(vm.checkAddress.attr('countyName'));
        $('input[name="logistics.address"]').val(vm.checkAddress.attr('address'));

        var boxQuantity =  parseFloat(0.00);
        var expectedQuantity = parseInt(0);
        for (var i = 0; i < vm.goodsList.length; i++) {
            var goodsCount = $(".goods_"+i).find('input[name="originItems['+ i +'].count"]').val();
            var goodsPrice = $(".goods_"+i).find('input[name="originItems['+ i +'].price"]').val();
            var goodsTotal = $(".goods_"+i).find('input[name="originItems['+ i +'].subTotal"]').val();
            if(goodsCount=="" || goodsPrice ==""){
                msgAlert.text('请将商品单价和数量填写完整');
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

            if(goodsTotal==''){
                msgAlert.text('请输入正确的数量及单价格式');
                return false;
            }
            expectedQuantity += parseInt(goodsCount);
            boxQuantity += parseInt(goodsTotal);

        }
        var invoiceTitle = $('input[name="invoice.invoiceTitle"]').val();

        if(vm.invoicex!=3 && invoiceTitle==''){
            msgAlert.text('请先填写发票抬头');
            return false;
        }

        $('#orderGoods').val(expectedQuantity);
        $('#expectedQuantity').val(expectedQuantity);
        $('#actualMoney').val(boxQuantity);
        $('#payMoney').val(boxQuantity);
        $('#originPaypayMoney').val(boxQuantity);


        var settlementWay = $('select[name="originOrder.settlementWay"]').val();
        if(settlementWay == ''){
            msgAlert.text('请先选择结算方式');
            return false;
        }
        var payWay = $('select[name="originPay.payWay"]').val();
        if(payWay == ''){
            msgAlert.text('请先选择支付方式');
            return false;
        }

        var transFee = $('input[name="originOrder.transFee"]').val();
        if(transFee == ''){
            msgAlert.text('请先填写配送金额');
            return false;
        }

        vm.form = $("#newWayCommit").serialize();

        vm.form = decodeURIComponent(vm.form,true);

        $.ajax({
            url:"/sale/addOriginOrder",
            data:vm.form,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.status==00){

                    msgAlert.text('下单成功');
                    window.location.href="#/order/salesOrder/neworder";

                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');

                }

            },
            error:function(){
                msgAlert.text('系统繁忙 >﹏<');
            }
        })

    };


}])



