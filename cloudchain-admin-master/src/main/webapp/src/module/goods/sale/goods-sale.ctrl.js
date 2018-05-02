angular.module('MetronicApp').controller('GoodSaleController', function($rootScope, $scope, $timeout,Goods,$stateParams) {

    var spuId = $stateParams.Id

    Goods.getSkuBySpu(spuId).success(function (data) {
            $scope.skus = data.data
    })

    $scope.setInfo = function () {
        for(key in  $scope.skus){
            if($scope.quantity != undefined){
                $scope.skus[key].quantity = $scope.quantity
            }
        }
    }
    
    
    $scope.save = function () {
        var info
        if($scope.skus[0].specDesc == null){
            if($scope.quantity == undefined || $scope.quantity == ""){
                msgAlert.text("请设置一个库存");
                return
            }
            info = {
                spuId:spuId,
                skus:[{skuId:$scope.skus[0].skuId,quantity:$scope.quantity}]
            }
        }else{
            var skulist = [];
            for(var a in $scope.skus){
                if($scope.skus[a].quantity == undefined || $scope.skus[a].quantity == ""){
                    msgAlert.text("有未设置的库存");
                    return
                }
                skulist.push({
                    skuId:$scope.skus[a].skuId,
                    quantity:$scope.skus[a].quantity
                })
            }
            info = {
                spuId:spuId,
                skus:skulist
            }
        }
        Goods.invSetting(info).success(function (data) {
             if(data.status == "00"){
                 window.history.back(-1);
             }else{
                 msgAlert.text(data.msg);
             }
        })
    }

})