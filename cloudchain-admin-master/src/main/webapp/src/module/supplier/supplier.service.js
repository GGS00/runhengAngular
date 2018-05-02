angular
    .module('MetronicApp')
    .service('suppServer', suppServer)

function suppServer($http) {
    return {
        addSpec: function (info) {
            return $http({
                url: "/spec/addSpec/" + info.tId + "", method: "post",
                params: {
                    name: info.name
                }
            });
        },
        addSpecVal: function (params) {
            return $http({
                url: "/spec/addSpecVal", method: "post",
                params: params
            });
        },
        getSpec: function (id) {
            return $http({url: "/spec/getSpecList/" + id + "", method: "get"});
        },
        getSpecVal: function (id) {
            return $http({url: "/spec/getSpecValList/" + id + "", method: "get"});
        },

        getCategoryList: function () {
            return $http({
                url: "/category/getCategoryList", method: "get",
                // params:{
                //     userId:"A10001"
                // }
            });
        },

        getTagList: function (id) {
            return $http({url: "/category/getTagList/" + id + "", method: "get"});
        },

        addCategory: function (params) {
            return $http({
                url: "/category/addCategory", method: "post",
                params: params
            });
        },

        addTag: function (params) {
            return $http({
                url: "/category/addTag", method: "post",
                params: params
            });
        },

        saveGoods: function (params) {
            return $http({
                url: "/goods/saveGoodsInfo", method: "post",
                params: {
                    goodsModel: params
                }
            });
        },
        getContacts: function (vm) {
            return $http({
                url: "/user/qryContactLstForUser", method: "post",
                params: {
                    qryUserId: vm.qryUserId,
                    userType:vm.userType
                }
            });
        },
        addContacts: function (vm) {
            return $http({
                url: "/user/addcContactForUser/" + vm.id , method: "post",
                params: {
                    nickName: vm.nickName,
                    mobile:vm.mobile,
                    email:vm.email
                }
            });
        },
        addAccounts: function (vm) {
            return $http({
                url: "/user/addUserNameForUser/" + vm.userId , method: "post",
                params: {
                    userName: vm.userName,
                    password:vm.password,
                }
            });
        },
        addUserAddress: function (userid,params) {
            return $http({
                url: "/user/address/addUserAddress/" +userid , method: "post",
                params: params
            });
        },
        updateUserAddress: function (userid,params) {
            return $http({
                url: "/user/address/updUserAddress/" +userid , method: "post",
                params: params
            });
        },
        delUserAddress: function (userid) {
            return $http({
                url: "/user/address/delUserAddress/" +userid , method: "get",
            });
        },
        removeBrand: function (vm) {
            return $http({
                url: "/brand/deleteBrand/" + vm.deleteList.join(), method: "POST",
                params: {}
            });
        },
        removeSupplierGoodRel: function (relId) {
            return $http({
                url: "/goods/supplier/delete/" + relId, method: "POST",
                params: {}
            });
        },
        supplierAddSkusRel: function (vm) {
            return $http({
                url: " /goods/supplier/supplierAddSkusRel/" + vm.supplierId, method: "POST",
                params: {
                    skuIds: vm.skuIds,
                }
            });
        },
        getSku: function (id) {
            return $http({
                url: "/goods/getVirtualityInvList/" + id + "", method: "get",

            });
        },

        addStock: function (info) {
            return $http({
                url: "/goods/updateVirtualityInv", method: "POST",
                params: {param: info}
            });
        },

        getSpu: function (id) {
            return $http({
                url: "/goods/getGoodsInfo/" + id + "", method: "get",
            });
        },

        supplier: function (id) {
            return $http({
                url: "/goods/supplier/" + id + "", method: "get",
            });
        },

        setSupplier: function (id, supplierId) {
            return $http({
                url: "/goods/supplier/setSupplierSpuRel/" + id + "", method: "post",
                params: {supplierIds: supplierId}
            });
        },

        delSupplier: function (id) {
            return $http({
                url: "/goods/supplier/delete/" + id + "", method: "post",
            });
        },
        batchSupplier: function (info) {
            return $http({
                url: "/goods/supplier/batchSetSupplierSkuRel", method: "post",
                params: {relList: info}
            });
        },
        getUserInfo: function (userId) {
            return $http({
                url: "/user/getUserInfo/" + userId + "", method: "post",
                params: {
                    userType:4
                }
            });
        },
        updateSupplier:function (params){
            return $http({url:"/user/updateOwnerSubacctExtInfo"/*"/process"*/,method: "post",
                params:params,
            });
        },

    }
}

