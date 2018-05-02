angular.module('MetronicApp').controller('homeIndexController', ['$rootScope', '$scope','$location','$http','uiGridConstants', 'settings','commonUtil', 'd2w', function($rootScope, $scope, $location,$http, uiGridConstants,settings,commonUtil, d2w)  {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    var vm = this;

    $('.finance a').removeClass('selectOn');
    $('.yiti a').removeClass('selectOn');
    $('.saas a').removeClass('selectOn');
    $('.about a').removeClass('selectOn');
    $('.homepage a').addClass('selectOn');

    $('.banner-show').css({'background':'url(../assets/pages/img/d2w/backone.jpg) center center no-repeat','background-size':'cover'});

    $scope.toWare = function(){
        window.location.href="#/d2w/waresource?type=0"
    }

    $scope.toGoods = function(){
        window.location.href="#/d2w/waresource?type=1"
    }

    $scope.toWareDetail = function(id){
        window.location.href="#/d2w/waresourceDetail?id="+id
    }

    $scope.toGoodsDetail = function(id){
        window.location.href="#/d2w/d2wgoodsdetail?id="+id
    }


    // vm.pageParams = {
    //     bean:'d2WWareHouse',
    //     method:'pageHome',
    //     page:1,
    //     rows:6
    // }
    vm.getPage = function () {
        d2w.recommend().success(function(data) {
            vm.dataList = data.rows;
        });
    };
    vm.getPage();

    vm.goodspageParams = {
        bean:'d2WGoods',
        method:'pageHome',
        page:1,
        rows:6
    }
    vm.getgoodsPage = function () {
        commonUtil.getList(vm.goodspageParams).success(function(data) {
            vm.goodsdataList = data.rows;
        });
    };

    vm.getgoodsPage();

}])

    .controller('financeController', ['$rootScope', '$scope','$location','$http','uiGridConstants', 'settings','commonUtil', function($rootScope, $scope, $location,$http, uiGridConstants,settings,commonUtil)  {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        var vm = this;

        $('.homepage a').removeClass('selectOn');
        $('.yiti a').removeClass('selectOn');
        $('.saas a').removeClass('selectOn');
        $('.about a').removeClass('selectOn');
        $('.finance a').addClass('selectOn');

        $('.banner-show').css({'background':'url(../assets/pages/img/d2w/finance_back.jpg) center center no-repeat','background-size':'cover'});

    }])

    .controller('waredisController', ['$rootScope', '$scope','$location','$http','uiGridConstants', 'settings','commonUtil', function($rootScope, $scope, $location,$http, uiGridConstants,settings,commonUtil)  {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        var vm = this;

        $('.homepage a').removeClass('selectOn');
        $('.finance a').removeClass('selectOn');
        $('.saas a').removeClass('selectOn');
        $('.about a').removeClass('selectOn');
        $('.yiti a').addClass('selectOn');

        $('.banner-show').css({'background':'url(../assets/pages/img/d2w/waredis_back.jpg) center center no-repeat','background-size':'cover'});

    }])

    .controller('saasController', ['$rootScope', '$scope','$location','$http','uiGridConstants', 'settings','commonUtil', function($rootScope, $scope, $location,$http, uiGridConstants,settings,commonUtil)  {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        var vm = this;

        $('.homepage a').removeClass('selectOn');
        $('.finance a').removeClass('selectOn');
        $('.yiti a').removeClass('selectOn');
        $('.about a').removeClass('selectOn');
        $('.saas a').addClass('selectOn');

        $('.banner-show').css({'background':'url(../assets/pages/img/d2w/saas_back.jpg) center center no-repeat','background-size':'cover'});

    }])

    .controller('aboutusController', ['$rootScope', '$scope','$location','$http','uiGridConstants', 'settings','commonUtil', function($rootScope, $scope, $location,$http, uiGridConstants,settings,commonUtil)  {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        var vm = this;

        $('.homepage a').removeClass('selectOn');
        $('.finance a').removeClass('selectOn');
        $('.yiti a').removeClass('selectOn');
        $('.saas a').removeClass('selectOn');
        $('.about a').addClass('selectOn');

        $('.banner-show').css({'background':'url(../assets/pages/img/d2w/aboutus.jpg) center center no-repeat','background-size':'cover'});

    }])