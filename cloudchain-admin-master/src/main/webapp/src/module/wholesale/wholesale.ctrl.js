/* Setup TmsController page controller */
angular.module('MetronicApp').controller('wholesaleController', ['$state','$rootScope', '$scope','$http','uiGridConstants', 'settings','wholesale','pickCount','commonUtil', function($state, $rootScope, $scope, $http, uiGridConstants,settings, wholesale,pickCount,commonUtil) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    $('.cart').removeClass('headerOn');
    $('.orderPage').removeClass('headerOn');
    $('.goodsPage').addClass('headerOn');
    $scope.reduce = function(index){
        var t = $(".text_box_"+index);
        if (parseInt(t.val())==1){
            $('.min_'+index).attr('disabled',true);
            return false;
        }
        if(t.val() == ''){
            t.val(parseInt(0)+1)
        }else{
            t.val(parseInt(t.val())-1);
        }
    }

    $scope.add = function(index){
        var t = $(".text_box_"+index);
        if (parseInt(t.val())!=1){
            $('.min_'+index).attr('disabled',false);
        }
        if(t.val() == ''){
            t.val(parseInt(0)+1)
        }else{
            t.val(parseInt(t.val())+1);
        }
    }

    vm.pages = [
        {name:'10',id:'10'},
        {name:'20',id:'20'},
        {name:'50',id:'50'},
        {name:'100',id:'100'}
    ];

    vm.selected=vm.pages[0].id;//如果想要第一个值
    vm.page = 1; //默认当前页数
    vm.maxSize = 5; //最大页码
    vm.pageSize = 10; //1页多少个
    vm.cId=0,

    wholesale.getGoodsNode(vm).success(function(data) {

        if(data.status==00){
            $scope.menu = data.data;
        }else{
            msgAlert.tips('请求失败');
        }

    });

    wholesale.getCartList(vm).success(function(data) {
            if(data.isLogin==1){
                $rootScope.isLogin = data.isLogin;
            }
    });

    vm.getByType = function(cId){
        vm.goodsParams = {
            bean:'d2DGoodsShelve',
            method:'pageGetShelvesByCategory',
            page:1,
            rows:10
        }
        $('.priceSort').removeClass('onSelect');
        $('.defaultSort').addClass('onSelect');
        getGoodsList();
    }

    vm.defaults = {
        speed: 300,
        showDelay: 0,
        hideDelay: 0,
        singleOpen: true,
        clickEffect: true
    };

    $scope.toggleMenu= function(cId,e,isLeaf){
        e.stopPropagation();
        e.preventDefault();
        if(isLeaf==1){
            vm.goodsParams.cateId = cId;
            vm.goodsParams.page = 1; //默认当前页数
            getGoodsList();
        }
        if ($('.index_'+cId).children(".submenu").length > 0) {
            if ($('.index_'+cId).children(".submenu").css("display") == "none") {
                $('.index_'+cId).children(".submenu").delay(vm.defaults.showDelay).slideDown(vm.defaults.speed);
                $('.index_'+cId).children(".submenu").siblings("a").addClass("submenu-indicator-minus");
                if (vm.defaults.singleOpen) {
                    $('.index_'+cId).siblings().children(".submenu").slideUp(vm.defaults.speed);
                    $('.index_'+cId).siblings().children(".submenu").siblings("a").removeClass("submenu-indicator-minus")
                }
                return false
            } else {
                $('.index_'+cId).children(".submenu").delay(vm.defaults.hideDelay).slideUp(vm.defaults.speed)
            }
            if ($('.index_'+cId).children(".submenu").siblings("a").hasClass("submenu-indicator-minus")) {
                $('.index_'+cId).children(".submenu").siblings("a").removeClass("submenu-indicator-minus")
            }
        }
    }


    vm.goodsParams = {
        bean:'d2DGoodsShelve',
        method:'pageGetShelvesByCategory',
        page:1,
        rows:10
    }

    /*每页不同条数展示*/
    vm.packChange = function(x){
        vm.goodsParams.rows = x;
        getGoodsList();
    }

    vm.getGoodsList = function(){
        getGoodsList();
    }

    getGoodsList();

    function getGoodsList(){
        commonUtil.getList(vm.goodsParams).success(function(data) {
            if(data.additionalMsg.status==00){
                vm.pageCount = data.total;
                vm.goodsList  = data.rows;
            }else{
                msgAlert.tips('请求失败');
            }
        });
    }

    vm.addCart = function(index){
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
        wholesale.addToCart(vm).success(function(data) {
            if(data.status==00){
                if(data.isLogin == 1){
                    $rootScope.isLogin = data.isLogin;
                    loginModal.show()
                }else{
                    msgAlert.tips('加入购物车成功');
                    wholesale.getCartList(vm).success(function(data) {
                        $rootScope.cartTotal = data.total;
                    });
                }
            }else{
                msgAlert.tips('加入购物车失败 ['+ data.msg+']');
            }
        });
    }

    vm.sortType = function(type){
        if(type==0){
            $('.priceSort').removeClass('onSelect');
            $('.defaultSort').addClass('onSelect');
            vm.goodsParams.page = 1;
            vm.goodsParams.sort ='';
            vm.goodsParams.order = '';
            getGoodsList();
        }else if(type==1){
            vm.goodsParams.sort ='salePrice';
            vm.goodsParams.page = 1;
            $('.defaultSort').removeClass('onSelect');
            $('.priceSort').addClass('onSelect');
            if($('.priceSort i').hasClass("fa-caret-down")){
                $('.priceSort i').removeClass("fa-caret-down");
                $('.priceSort i').addClass("fa-caret-up");
                vm.goodsParams.order = 'asc';
            }else{
                $('.priceSort i').removeClass("fa-caret-up");
                $('.priceSort i').addClass("fa-caret-down");
                vm.goodsParams.order = 'desc';
            }
            getGoodsList();
        }
    }


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



}])