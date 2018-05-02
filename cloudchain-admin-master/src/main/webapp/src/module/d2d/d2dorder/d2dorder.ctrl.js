angular.module('MetronicApp').controller('d2dorderController',['$rootScope', '$scope','$http','uiGridConstants', 'settings','d2d','commonUtil','wholesale', function($rootScope, $scope, $http, uiGridConstants,settings, d2d,commonUtil,wholesale) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
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

    vm.buypages = [
        {name:'10',id:'10'},
        {name:'20',id:'20'},
        {name:'50',id:'50'},
        {name:'100',id:'100'}
    ];

    vm.buyselected=vm.buypages[0].id;//如果想要第一个值
    vm.buypage = 1; //默认当前页数
    vm.buymaxSize = 5; //最大页码
    vm.buypageSize = 10; //1页多少个

    vm.orderOneParams = {
        bean:'d2DOrder',
        method:'pageGetSaleOrder',
        page:1,
        rows:10
    }

    vm.orderTwoParams = {
        bean:'d2DOrder',
        method:'page',
        page:1,
        rows:10
    }

    /*每页不同条数展示*/
    vm.packBuyChange = function(x){
        vm.orderTwoParams.rows = x;
        getOrderBuyList();
    }

    vm.getOrderBuyList = function(){
        getOrderBuyList();
    }

    /*每页不同条数展示*/
    vm.packChange = function(x){
        vm.orderOneParams.rows = x;
        getSaleList();
    }

    vm.getGoodsList = function(){
        getSaleList();
    }

    getSaleList();

    function getSaleList(){
        commonUtil.getList(vm.orderOneParams).success(function(data) {
            if(data.additionalMsg.status==00){
                vm.orderList = data.rows;
                vm.pageCount = data.total;
            }else{
                msgAlert.tips('请求失败');
            }
        });
    }

    vm.getPageByFilter = function(){
        var orderId = $('input[name="orderId"]').val();
        var orderState = $('.orderState').val();
        if(orderState == " "){
            orderState ="";
        }
        if(orderId == "" && orderState == ""){
            msgAlert.tips('搜索条件不能为空');
            return false;
        }
        vm.orderOneParams = {
            bean:'d2DOrder',
            method:'pageGetSaleOrder',
            page:1,
            rows:10,
            orderId:orderId,
            orderState:orderState
        }
        getSaleList();
    }

    function getOrderBuyList(){
        commonUtil.getList(vm.orderTwoParams).success(function(data) {
            if(data.additionalMsg.status==00){
                vm.orderBuyList = data.rows;
                vm.pageBuyCount = data.total;
            }else{
                msgAlert.tips('请求失败');
            }
        });
    }

    vm.toOrderDetail = function(id){
        window.location.href="#/d2d/d2dgoods/orderdetail?orderId="+id;
    }

    vm.showTabs = function(index){
        switch (index)
        {
            case 0:
                getSaleList();
                break;
            case 1:
                getOrderBuyList();
                break;
        }

    }
}])

    .controller('orderdetailController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','d2d','commonUtil','wholesale', function($rootScope, $scope, $http, uiGridConstants,settings, d2d,commonUtil,wholesale) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = true;
        var vm = this;
        vm.orderId =  $location.search().orderId;
        wholesale.orderDetail(vm).success(function(data) {
            if(data.additionalMsg.status==00){
                vm.orderDetail = data;
                vm.goodsInfo = data.itemList;
            }else{
                msgAlert.tips('请求失败 ['+ data.msg+']');
            }
        });

        vm.toLogistics= function(spuId,skuId){
            window.location.href="/d2d/d2dgoods/orderlogistics?orderId="+vm.orderId + "&skuId=" + skuId + "&spuId=" + spuId;
        }


    }])


    .controller('logisticsController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','d2d','commonUtil','wholesale', function($rootScope, $scope, $http, uiGridConstants,settings, d2d,commonUtil,wholesale) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = true;
        var vm = this;
        vm.orderId =  $location.search().orderId;
        vm.skuId =  $location.search().skuId;
        vm.spuId =  $location.search().spuId;

        initial();

        function initial(){
            wholesale.logisticsInfo(vm).success(function(data) {
                if(data.additionalMsg.status==00){
                    vm.logisticsInfo = data.rows;
                }else{
                    msgAlert.tips('请求失败 ['+ data.msg+']');
                }
            });
        }

        vm.backToDetail = function(){
            window.location.href="#/d2d/d2dgoods/orderdetail?orderId="+vm.orderId;
        }

        vm.confirmR = function(){
            vm.logisticsItemId=vm.logisticsInfo[0].id;
            wholesale.confirmReceive(vm).success(function(data) {
                if(data.status==00){
                    msgAlert.tips('确认收货成功');
                    initial();
                }else{
                    msgAlert.tips('请求失败 ['+ data.msg+']');
                }
            });
        }


    }])