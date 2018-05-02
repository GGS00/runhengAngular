/* Setup TmsController page controller */
angular.module('MetronicApp').controller('wholesaleorderController', ['$state','$rootScope', '$scope','$http','uiGridConstants', 'settings','wholesale','pickCount','commonUtil', function($state, $rootScope, $scope, $http, uiGridConstants,settings, wholesale,pickCount,commonUtil) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });


    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    $('.cart').removeClass('headerOn');
    $('.goodsPage').removeClass('headerOn');
    $('.orderPage').addClass('headerOn');
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

    vm.orderParams = {
        bean:'d2DOrder',
        method:'page',
        page:1,
        rows:10
    }

    /*每页不同条数展示*/
    vm.packChange = function(x){
        vm.orderParams.rows = x;
        getGoodsList();
    }

    vm.getGoodsList = function(){
        getGoodsList();
    }

    getGoodsList();

    function getGoodsList(){
        commonUtil.getList(vm.orderParams).success(function(data) {
            if(data.additionalMsg.status==00){
                if(data.isLogin==1){
                    $rootScope.isLogin = data.isLogin;
                    loginModal.show()
                }else{
                    vm.orderList = data.rows;
                    vm.pageCount = data.total;
                }
            }else{
                msgAlert.tips('请求失败');
            }
        });
    }

    vm.toOrderDetail = function(id){
        window.location.href="#/wholesale/orderdetail?orderId="+id;
    }

}])

    .controller('orderdetailController', ['$location','$state','$rootScope', '$scope','$http','uiGridConstants', 'settings','wholesale','pickCount', function($location,$state, $rootScope, $scope, $http, uiGridConstants,settings, wholesale,pickCount) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        $('.cart').removeClass('headerOn');
        $('.goodsPage').removeClass('headerOn');
        $('.orderPage').addClass('headerOn');
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
            window.location.href="#/wholesale/orderlogistics?orderId="+vm.orderId + "&skuId=" + skuId + "&spuId=" + spuId;
        }


    }])


    .controller('logisticsController', ['$location','$state','$rootScope', '$scope','$http','uiGridConstants', 'settings','wholesale','pickCount', function($location,$state, $rootScope, $scope, $http, uiGridConstants,settings, wholesale,pickCount) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        $('.cart').removeClass('headerOn');
        $('.goodsPage').removeClass('headerOn');
        $('.orderPage').addClass('headerOn');
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
            window.location.href="#/wholesale/orderdetail?orderId="+vm.orderId;
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