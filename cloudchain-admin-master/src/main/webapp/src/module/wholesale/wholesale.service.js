/**
 * Created by shaobinhua on 2017/2/20.
 */
angular
    .module('MetronicApp')
    .factory('wholesale', wholesale)


function wholesale($http){
    return {
        getGoodsNode:getGoodsNode,
        getGoods:getGoods,
        addToCart:addToCart,
        getCartList:getCartList,
        queryByOrder:queryByOrder,
        toAddInfo:toAddInfo,
        getUserConsignee:getUserConsignee,
        addNewOrder:addNewOrder,
        orderDetail:orderDetail,
        deleteCart:deleteCart,
        logisticsInfo:logisticsInfo,
        confirmReceive:confirmReceive,
        getOrderList:getOrderList
    }
    //获取商品分类
    function getGoodsNode(vm){
        return $http({url:"/d2d/category/listCategory"/*"/process"*/,method: "get",
            params:{

            }
        });
    }

    //获取商品
    function getGoods(vm){
        return $http({url:"/d2d/goods/queryByCate/"+ vm.cId,method: "post",
            params:{
                page:vm.page,
                pageSize:vm.pageSize
            }
        });
    }

    //按价格排序
    function queryByOrder(vm){
        return $http({url:"/d2d/goods/queryByCate/"+ vm.cId,method: "post",
            params:{
                page:vm.page,
                pageSize:vm.pageSize,
                sort:'salePrice',
                order:vm.order
            }
        });
    }

    //加入购物车
    function addToCart(vm){
        return $http({url:"/d2d/cart/add",method: "post",
            params:{
                dataList: vm.dataList
            }
        });
    }

    //购物车删除
    function deleteCart(vm){
        return $http({url:"/d2d/cart/delete",method: "post",
            params:{
                dataList: vm.dataList
            }
        });
    }

    //购物车列表
    function getCartList(vm){
        return $http({url:"/d2d/cart/list",method: "get",
            params:{

            }
        });
    }

    //结算信息
    function toAddInfo(vm){
        return $http({url:"/d2d/order/toAdd",method: "post",
            params:{
                dataList: vm.dataList
            }
        });
    }

    //地址获取
    function getUserConsignee(vm){
        return $http({url:"/user/address/list",method: "get",
            params:{

            }
        });
    }

    //新增订单
    function addNewOrder(vm){
        return $http({url:"/d2d/order/add",method: "post",
            params:{
                itemData:vm.itemData
            }
        });
    }

    //获取订单列表
    function getOrderList(vm){
        return $http({url:"/d2d/order/list",method: "get",
            params:{
                page:vm.page,
                rows:vm.pageSize
            }
        });
    }

    //订单详情
    function orderDetail(vm){
        return $http({url:"/d2d/order/detail/" + vm.orderId,method: "get",
            params:{
            }
        });
    }

    //物流信息
    function logisticsInfo(vm){
        return $http({url:"/d2d/order/logistics/"+ vm.orderId,method: "get",
            params:{
                skuId:vm.skuId,
                spuId:vm.spuId
            }
        });
    }

    //确认收货
    function confirmReceive(vm){
        return $http({url:"/d2d/order/confirmReceive",method: "post",
            params:{
                logisticsItemId:vm.logisticsItemId
            }
        });
    }

}





