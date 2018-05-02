
/**
 * Created by shaobinhua on 2017/2/20.
 */
angular
    .module('MetronicApp')
    .factory('d2w', d2w)


function d2w($http){
    return {
        getTypeList:getTypeList,
        d2wWarehouseUpdate:d2wWarehouseUpdate,
        publish:publish,
        doShelve:doShelve,
        cancelShelve:cancelShelve,
        warehouseDetail:warehouseDetail,
        toAddOrder:toAddOrder,
        getGoodsImgs:getGoodsImgs,
        addOrder:addOrder,
        valet:valet,
        saveGoods:saveGoods,
        goodsDetail:goodsDetail,
        warehouselist:warehouselist,
        goodsOffer:goodsOffer,
        chooseOrder:chooseOrder,
        cancelOffer:cancelOffer,
        isLogin:isLogin,
        recommend:recommend
    }

    function getTypeList(vm){
        return $http({url:"/sys/dict/list"/*"/process"*/,method: "get",
            params:{
                dictTypeName:vm.dictTypeName,
            }
        });
    }
    /*上架*/
    function doShelve(vm){
        return $http({url:"/d2w/warehouse/doShelve/" + vm.doShelveList.join(),method: "post",
            params:{

            }
        });
    }
    /*下架*/pub
    function cancelShelve(vm){
        return $http({url:"/d2w/warehouse/cancelShelve/" + vm.cancelShelveList.join(),method: "post",
            params:{

            }
        });
    }

    function d2wWarehouseUpdate(vm){
        return $http({url:"/d2w/warehouse/update",method: "post",
            data:{
                imgList:vm.imgList,
                dwWarehouseId:vm.wsourceSelect[0].id,
                type:vm.wsourceSelect[0].type,
                typeName:vm.typeName,
                temperatureRange:vm.temperatureRange,
                humidityRange:vm.humidityRange,
                storageSqm:vm.storageSqm,
                storageCum:vm.storageCum,
                rentPrice:vm.rentPrice*100,
                keepPrice:vm.keepPrice*100,
                keepUnit:vm.goodsUnit,
                addedService:JSON.stringify(vm.serviceList),
                warehouseName:vm.warehouseName
            }
        });
    }

    /*优仓详情*/
    function warehouseDetail(vm){
        return $http({url:"/d2w/warehouse/detail/" + vm.id,method: "get",
            params:{

            }
        });
    }

    /*去下单*/
    function toAddOrder(vm){
        return $http({url:"/d2w/order/toAdd/" + vm.id,method: "post",
            params:{

            }
        });
    }

    /*通过货物名查询货物图片*/
    function getGoodsImgs(vm){
        return $http({url:"/d2w/order/getGoodsImgs",method: "get",
            params:{
                goodsName:vm.goodsName,
                goodsType:vm.goodsType,
                userId:vm.userId
            }
        });
    }

    /*柴米优仓下单*/
    function addOrder(params){
        return $http({url:"/d2w/order/add",method: "post",
            data:params
        });
    }

    /*柴米优仓代客下单*/
    function valet(params){
        return $http({url:"/d2w/order/valet",method: "post",
            data:params
        });
    }

    /*货源发布*/
    function saveGoods(params){
        return $http({url:"/d2w/goods/save",method: "post",
            data:params
        });
    }

    /*仓源发布*/
    function publish(params){
        return $http({url:"/d2w/warehouse/publish",method: "post",
            data:params
        });
    }

    /*货源详情*/
    function goodsDetail(vm){
        return $http({url:"/d2w/goods/detail/"+ vm.id,method: "get",
            params:{

            }
        });
    }

    /*仓源列表*/
    function warehouselist(vm){
        return $http({url:"/d2w/warehouse/list",method: "get",
            params:{
                provinceId:vm.goodsDetailData.provinceId,
                cityId:vm.goodsDetailData.cityId,
                districtId:vm.goodsDetailData.districtId
            }
        });
    }

    /*报价提交*/
    function goodsOffer(vm){
        return $http({url:"/d2w/goods/offer",method: "post",
            params:{
                userId:vm.goodsDetailData.userId,
                goodsId:vm.goodsDetailData.id,
                dwWarehouseId:vm.dwWarehouseId,
                price:vm.rentPrice*100
            }
        });
    }

    /*选择仓库提交*/
    function chooseOrder(params){
        return $http({url:"/d2w/order/choose",method: "post",
            data:params
        });
    }

    /*取消报价*/
    function cancelOffer(vm){
        return $http({url:"/d2w/goods/cancelOffer/" + vm.id,method: "post",
            params:{

            }
        });
    }

    /*是否登入*/
    function isLogin(){
        return $http({url:"/isLogin",method: "get",
            params:{

            }
        });
    }

    /*获取仓源推荐列表*/
    function recommend(){
        return $http({url:"/d2w/warehouse/recommend",method: "get",
            params:{

            }
        });
    }



}



