/* Setup TmsController page controller */
angular.module('MetronicApp').controller('shopcartController', ['$state','$rootScope', '$scope','$http','uiGridConstants', 'settings','wholesale','pickCount', function($state, $rootScope, $scope, $http, uiGridConstants,settings, wholesale,pickCount) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });


    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    $('.orderPage').removeClass('headerOn');
    $('.goodsPage').removeClass('headerOn');
    $('.cart').addClass('headerOn');
    $scope.toPage = function (index) {
        if(index==1){
            window.location.href="#/wholesale/goods"
        }else if(index==2){
            msgAlert.tips('暂未开发');
            return false;
        }else if(index == 3){
            window.location.href="#/wholesale/shopcart"
        }else if(index == 4){
            window.location.href="#/wholesale/order"
        }
    }
    $scope.reduce = function(index){
        var t = $(".text_box_"+index);
        if (parseInt(t.val())==1){
            $('.min_'+index).attr('disabled',true);
            return false;
        }
        if(t.val() == ''){
            /*t.val(parseInt(0)+1);*/
            vm.cartList[index].count = parseInt(0)+1;
            vm.getCountTotal();
        }else{
            /*t.val(parseInt(t.val())-1);*/
            vm.cartList[index].count = parseInt(t.val())-1;
            vm.getCountTotal();
        }
    }

    $scope.add = function(index){
        var t = $(".text_box_"+index);
        if (parseInt(t.val())!=1){
            $('.min_'+index).attr('disabled',false);
        }
        if(t.val() == ''){
           /* t.val(parseInt(0)+1);*/
            vm.cartList[index].count = parseInt(0)+1;
            vm.getCountTotal();
        }else{
           /* t.val(parseInt(t.val())+1);*/
            vm.cartList[index].count = parseInt(t.val())+1;
            vm.getCountTotal();
        }
    }

    initial();

    function initial(){
        wholesale.getCartList(vm).success(function(data) {
            if(data.additionalMsg.status==00){
                if(data.isLogin==1){
                    $rootScope.isLogin = data.isLogin;
                    loginModal.show()
                }else{
                    vm.cartData = data;
                    vm.cartList = data.rows;
                    vm.getCountTotal();
                }
            }else{
                msgAlert.tips('请求失败 ['+ data.msg+']');
            }
        });
    }

    vm.getCountTotal = function(){
        vm.countTotal = 0;
        vm.priceCount = 0;
        for(var i = 0 ; i < vm.cartList.length ; i++){
            vm.countTotal += parseInt(vm.cartList[i].count);
            vm.priceCount += vm.cartList[i].count*vm.cartList[i].price;
        }
    }

    vm.removeCart = function(index){
        vm.goodsSkuId = $('.goodsPrice_'+index).find('input[name="skuId_'+ index +'"]').val();
        vm.goodsSpuId = $('.goodsPrice_'+index).find('input[name="spuId_'+ index +'"]').val();
        vm.goodsUserId = $('.goodsPrice_'+index).find('input[name="userId_'+ index +'"]').val();
        vm.goodsCount = $('.text_box_'+index).val();
        var reg = /^[1-9]\d*$/;
        if(reg.test(vm.goodsCount)==false){
            msgAlert.tips('采购数量只能为大于1的正整数');
            $('.text_box_'+index).val(1);
            return false;
        }
        vm.dataList = "["
        var jsonText = {};
        jsonText["skuId"] = vm.goodsSkuId;
        jsonText["spuId"] = vm.goodsSpuId;
        jsonText["count"] = vm.goodsCount;
        jsonText["userId"] = vm.goodsUserId;
        vm.dataList+=JSON.stringify(jsonText);
        vm.dataList += "]";
        wholesale.deleteCart(vm).success(function(data) {
            if(data.status==00){
                msgAlert.tips('删除成功');
                initial();
            }else{
                msgAlert.tips('请求失败 ['+ data.msg+']');
            }
        });
    }

    vm.cartSwitch = 0;
    vm.goToFee = function(){
        vm.dataList = "["
        for (var i = 0; i < vm.cartList.length; i++) {
            vm.goodsSkuId = $('.goodsPrice_'+i).find('input[name="skuId_'+ i +'"]').val();
            vm.goodsSpuId = $('.goodsPrice_'+i).find('input[name="spuId_'+ i +'"]').val();
            vm.goodsUserId = $('.goodsPrice_'+i).find('input[name="userId_'+ i +'"]').val();
            vm.goodsCount = $('.text_box_'+i).val();
            var jsonText = {};
            jsonText["skuId"] = vm.goodsSkuId;
            jsonText["spuId"] = vm.goodsSpuId;
            jsonText["count"] = vm.goodsCount;
            jsonText["userId"] = vm.goodsUserId;
            if(i<(vm.cartList.length-1)){
                vm.dataList+=JSON.stringify(jsonText)+",";
            }else{
                vm.dataList+=JSON.stringify(jsonText);
            }
        }
        vm.dataList += "]";
        wholesale.toAddInfo(vm).success(function(data) {
            if(data.status==00){
               vm.cartSwitch = 1;
               vm.feeData = data;
               vm.feeInfo = data.data;
            }else{
                msgAlert.tips('请求失败 ['+ data.msg+']');
                return false;
            }
        });

        wholesale.getUserConsignee(vm).success(function(data) {
            if(data.status==00){
                vm.addressData = data.data;
                if(data.data.length == 0 ){
                    msgAlert.tips('请先添加收货地址');
                    return false;
                }
            }else{
                msgAlert.tips('收货地址请求失败 ['+ data.msg+']');
                return false;
            }
        });
    }

    vm.cofirmOrder = function(){
       /* vm.order.settlementWay=0;
        vm.order.distributionWay='';*/
        vm.checkAddress= $('input[name="address"]:checked');
        if(!vm.checkAddress.val()){
            msgAlert.tips('请先选择地址');
            return false;
        }
        vm.itemData = "["
        for (var i = 0; i < vm.feeInfo.length; i++) {

            var jsonText = {};
            jsonText["skuId"] = vm.feeInfo[i].skuId;
            jsonText["spuId"] = vm.feeInfo[i].spuId;
            jsonText["count"] = vm.feeInfo[i].count;
            jsonText["userId"] = vm.feeInfo[i].userId;
            if(i<(vm.feeInfo.length-1)){
                vm.itemData+=JSON.stringify(jsonText)+",";
            }else{
                vm.itemData+=JSON.stringify(jsonText);
            }
        }
        vm.itemData += "]";

        vm.remarks=$('.remarks').val();

        vm.test ='order.settlementWay=0&order.distributionWay='+$('input[name="paytype"]').val()+
            '&order.remark='+vm.remarks+
            '&itemData='+vm.itemData+
            '&orderLogistics.cneeName='+vm.checkAddress.attr('cneeName')+
            '&orderLogistics.cneeMobile='+vm.checkAddress.attr('cneeMobile')+
            '&orderLogistics.provinceName='+vm.checkAddress.attr('proName')+
            '&orderLogistics.provinceId='+vm.checkAddress.attr('proId')+
            '&orderLogistics.cityName='+vm.checkAddress.attr('cityName')+
            '&orderLogistics.cityId='+vm.checkAddress.attr('cityId')+
            '&orderLogistics.districtName='+vm.checkAddress.attr('countyName')+
            '&orderLogistics.districtId='+vm.checkAddress.attr('countyId')+
            '&orderLogistics.street='+vm.checkAddress.attr('street')+
            '&orderLogistics.address='+vm.checkAddress.attr('address');
        $.ajax({
            url:"/d2d/order/add",
            data: vm.test,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.status==00){
                    msgAlert.tips('提交成功');
                    wholesale.getCartList(vm).success(function(data) {
                        $rootScope.cartTotal = data.total;
                        window.location.href="#/wholesale/order";
                    });
                }else{
                    msgAlert.tips('请求失败 ['+ data.msg+']');
                }
            },
            error:function(){
                msgAlert.text('系统繁忙 >﹏<');
            }
        })
    }

}])