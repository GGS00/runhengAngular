angular
    .module('MetronicApp')
    .service('Goods', Goods)

function Goods($http){
    return {
        addSpec:function (info) {
            return $http({url:"/spec/addSpec",method: "post",
                data:info
            });
        },
        loadSpec:function (id) {
           return $http({url:"/spec/loadSpec/"+ id +"",method: "get"});
        },
        updateSpec:function (info) {
            return $http({url:"/spec/updateSpec",method: "post",
                data:info
            });
        },
        addSpecVal:function (params) {
            return $http({url:"/spec/addSpecVal",method: "post",
                data:params
            });
        },

        removeSpec:function (info) {
            return $http({url:"/spec/deleteSpec/"+ info ,method: "POST",
            });
        },

        getSpec:function (id) {
            return $http({url:"/spec/getSpecList/"+ id +"",method: "get"});
        },
        getSpecVal:function (id) {
            return $http({url:"/spec/getSpecValList/"+ id +"",method: "get"});
        },

        getCategoryList:function () {
            return $http({url:"/category/getCategoryList",method: "get",
                // params:{
                //     userId:"A10001"
                // }
            });
        },

        delCat:function (id) {
            return $http({url:"/category/delCategory/"+ id +"",method: "post"});
        },

        getTagList:function (id) {
            return $http({url:"/category/getTagList/"+ id +"",method: "get"});
        },

        addCategory:function (params) {
            return $http({url:"/category/addCategory",method: "post",
                data:params
            });
        },

        addTag:function (params) {
            return $http({url:"/category/addTag",method: "post",
                data:params
            });
        },

        saveGoods:function (params) {
            return $http({url:"/goods/saveGoodsInfo",method: "post",
                data:params
            });
        },
        delGoods:function (info) {
            return $http({url:"/goods/deleteSpu/"+ info ,method: "POST",
            });
        },

        loadBrand:function (id) {
            return $http({url:"/brand/loadBrand/"+ id +"",method: "get"});
        },
        updateBrand:function (info) {
            return $http({url:"/brand/updateBrand",method: "POST",
                data:info
            });
        },
        addBrand:function (info) {
            return $http({url:"/brand/addBrand",method: "POST",
                data:info
            });
        },

        removeBrand:function (info) {
            return $http({url:"/brand/deleteBrand/"+ info ,method: "POST",
            });
        },


        getSku:function (id) {
            return $http({url:"/goods/getVirtualityInvList/"+ id +"",method: "get",

            });
        },

        addStock:function (spuId,info) {
            return $http({url:"/goods/updateVirtualityInv",method: "POST",
                params:{param:info,spuId:spuId}
            });
        },

        getSpu:function (id,type) {
            return $http({url:"/goods/getGoodsInfo/"+ id +"",method: "get",
                params:{queryType:type}
            });
        },

        supplier:function (id) {
            return $http({url:"/goods/supplier/querySkuSupplierRel/"+ id +"",method: "get",
            });
        },

        setSupplier:function (id,supplierId) {
            return $http({url:"/goods/supplier/setSupplierSpuRel/"+ id +"",method: "post",
                params:{supplierIds:supplierId}
            });
        },

        delSupplier:function (id) {
            return $http({url:"/goods/supplier/delete/"+ id +"",method: "post",
            });
        },
        batchSupplier:function (info) {
            return $http({url:"/goods/supplier/batchSetSupplierSkuRel",method: "post",
                params:{relList:info}
            });
        },

        relate:function (params) {
            return $http({url:"/goods/supplier/relateRealInv",method: "post",
                params:params
            });
        },


        addProp: function (info) {
            return $http({url:"/prop/addProp",method: "post",
                data:info
            });
        },

        loadProp:function (id) {
            return $http({url:"/prop/loadProp/"+ id +"",method: "get"});
        },
        updateProp:function (info) {
            return $http({url:"/prop/updateProp",method: "post",
                data:info
            });
        },
        removeProp:function (info) {
            return $http({url:"/prop/deleteProp/"+ info ,method: "POST",
            });
        },



        getPSB:function (cId) {
            return $http({url:"/category/getPSB/" + cId + "",method: "get"});
        },


        getUnit:function(){
            return $http({url:"/sys/dict/list"/*"/process"*/,method: "get",
                params:{
                    dictTypeName:"计量单位",
                }
            });
        },

        getCate:function (id) {
            return $http({url:"/category/getCategoryChildren/" + id+"",method: "get"});
        },

        getSaleInvList:function (id) {
            return $http({url:"/goods/getSaleInvList/" + id+"",method: "get"});
        },

        getUserFunc:function (name) {
            return $http({url:"/user/getUserFunc",method: "get",
                params:{
                    funcId:name,
                }
            });
        },

        updateGoods:function (type,params) {
            return $http({url:"/goods/updateGoodsBase/"+ type + "",method: "post",
                data:params
            });
        },

        updateChannel:function (id,channel) {
            return $http({url:"/goods/channelSetting/"+ id +"",method: "post",
                data:channel
            });
        },
        
        getSkuBySpu:function (id) {
            return $http({url:"/goods/getSkuBySpu/"+ id +"",method: "post"});
        },

        invSetting:function (info) {
            return $http({url:"/goods/invSetting",method: "post",
                data:info
            });
        },




    }
}

