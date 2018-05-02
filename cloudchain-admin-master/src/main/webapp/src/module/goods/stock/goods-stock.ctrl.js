
angular.module('MetronicApp').controller('GoodsStockController', function($rootScope, $scope, $stateParams,Goods) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    var spuId = $stateParams.Id;
    function getSku() {
        Goods.getSaleInvList(spuId).success(function (data) {
            $scope.sku = data.resultMap.skuInvMap;
            for(var i in  $scope.sku){
                $scope.sku[i].active = false;
            }
            $scope.spu = data.resultMap.spu;
            $scope.totalSpuInv = data.resultMap.totalSpuInv
            $scope.getList(data.resultMap.skuInvMap[0].skuId)
            $scope.imgs = data.resultMap.imgs
        })
    }
    getSku()


    $scope.getList = function (id) {
        for(var key in  $scope.sku){
            $scope.sku[key].active = false;
            if($scope.sku[key].skuId == id){
                $scope.sku[key].active = true;
                $scope.selfWh = $scope.sku[key].selfWh
                $scope.selfInvCount = $scope.sku[key].selfInvCount
                $scope.shopWh = $scope.sku[key].shopWh
                $scope.shopInvCount = $scope.sku[key].shopInvCount
                $scope.supplierWh = $scope.sku[key].supplierWh
                $scope.supplierInvCount = $scope.sku[key].supplierInvCount
            }
        }
    }


    $scope.show = function (spuId,id,value) {
        $scope.stock = {
            skuId:id,
            quantity:value,
            spuId:spuId,
        }
        $("#show").modal('show')
    }

    $scope.add = function () {
        var info = "" + $scope.stock.skuId + ":" + $scope.stock.quantity + ""
        var spuId = $scope.stock.spuId
        Goods.addStock(spuId,info).success(function (data) {
            if(data.status == 00){
                getSku();
                $("#show").modal('hide')
            }else{
                $("#show").modal('hide')
                msgAlert.text('修改失败');
            }
        })
    }
    
    $scope.relate = function (spuId,skuId,isRelate) {

        var info = {
            spuId:spuId,
            skuId:skuId,
            isRelate:isRelate?0:1,
        }
        Goods.relate(info).success(function(data){
            if(data.status == 00){
                getSku();
            }else{

                msgAlert.text(data.msg);
            }
        })
    }
    
})

