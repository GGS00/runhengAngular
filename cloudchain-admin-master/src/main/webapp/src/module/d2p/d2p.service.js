/**
 * Created by shaobinhua on 2017/2/20.
 */
angular
    .module('MetronicApp')
    .factory('d2p', d2p)
    .factory('d2pOrderDetail', d2pOrderDetail)


function d2p($http){
    return {
        getGoodsNode:getGoodsNode,
        addChildNode:addChildNode,
        deleteNode:deleteNode,
        queryAllNodes:queryAllNodes,
        setShelveCategory:setShelveCategory,
        getNumPriceList:getNumPriceList,
        doShelve:doShelve,
        cancelShelve:cancelShelve,
        queryBrand:queryBrand,
        changeSort:changeSort
    }
    //获取商品节点
    function getGoodsNode(vm){
        return $http({url:"/d2p/category/queryChildren/" + vm.parentId/*"/process"*/,method: "post",
            params:{

            }
        });
    }

    //新增叶子结点
    function addChildNode(vm){
        return $http({url:"/d2p/category/addChild/" + vm.parentId/*"/process"*/,method: "post",
            params:{
                icon:vm.nodeIcon,
                parentCId:vm.addCId,
                name:vm.nodeName,
                description:vm.nodeDesc
            }
        });
    }

    //删除分类
    function deleteNode(vm){
        return $http({url:"/d2p/category/delete/" + vm.cId/*"/process"*/,method: "post",
            params:{
            }
        });
    }

    //查询全部节点
    function queryAllNodes(vm){
        return $http({url:"/d2p/category/queryAllNodes",method: "post",
            params:{
            }
        });
    }

    //修改展示分类
    function setShelveCategory(vm){
        return $http({url:"/d2p/goods/setShelveCategory/" + vm.goodsId,method: "post",
            params:{
                categoryIds:vm.categoryIdList.join(),
            }
        });
    }

    //价格数量列表
    function getNumPriceList(vm){
        return $http({url:"/d2p/price/getNumPriceList/" + vm.goodsId,method: "get",
            params:{
            }
        });
    }

    //上架
    function doShelve(vm){
        return $http({url:"/d2p/goods/doShelve/" + vm.selectListOnSale.join(),method: "post",
            params:{
            }
        });
    }

    //下架
    function cancelShelve(vm){
        return $http({url:"/d2p/goods/cancelShelve/" + vm.selectListUnSale.join(),method: "post",
            params:{
            }
        });
    }

    //查询品牌
    function queryBrand(vm){
        return $http({url:"/brand/queryBrand",method: "post",
            params:{
            }
        });
    }


    //改变顺序
    function changeSort(vm){
        return $http({url:"/d2p/category/changeSort/" + vm.sortParentId,method: "post",
            params:{
                sortIds:vm.deepList.join()
            }
        });
    }


}

//订单详情
function d2pOrderDetail($http){
    return {
        getDetail:getDetail,
    }
    function getDetail(vm){
        return $http({url:"/d2p/order/detail/" + vm.id/*"/process"*/,method: "get",
            params:{

            }
        });
    }

}




