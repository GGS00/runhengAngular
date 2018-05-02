/**
 * Created by shaobinhua on 2017/2/20.
 */
angular
    .module('MetronicApp')
    .factory('User', User)

function User($http){
    return {
        getUserInfo:function(id){
            return $http({url:"/user/getUserInfo/"+ id +"",method: "get"});
        },
        commitDrivers:function(vm){
            return $http({url:"/user/addUser"/*"/process"*/,method: "post",
                params:{
                    "userName":vm.userName,
                    "nickName":vm.nickName,
                    "userType":3,
                    "mobile":vm.mobile,
                    "email":vm.email,
                    "password":vm.password,
                    "regSource":0
                }
            });
        },
        commitUser:function (params){
            return $http({url:"/user/addUser"/*"/process"*/,method: "post",
                params:params,
            });
        },
        commitSupplier:function (params){
            return $http({url:"/user/addSupplier"/*"/process"*/,method: "post",
                params:params,
            });
        },
        updataUser:function (params) {
            return $http({url:"/user/updateSubacctUserExtInfo",method: "post",
                params:params,
            });
        },
        addTopContacts:function (params) {
            return $http({url:"/user/addTopContacts",method: "post",
                params:params,
            });
        },
        addAddress:function (params) {
            return $http({url:"/user/consignee/add",method: "post",
                params:params,
            });
        },
        removeContacts:function (vm) {
            return $http({url:"/user/consignee/del/"+vm.selectListRemove,method: "post",
            });
        },
        getAddressInfo:function (vm) {
            return $http({url:"/user/consignee/address/"+vm.userId,method: "get",
                params:{
                    isDefault:-1
                },
            });
        },

        //添加合作商信息
        addCooper:function (vm) {
            return $.ajax({url:"/user/cooper/addCooper",
                method:"post",
                data:vm.form,
                dataType:"json"
            });
        },
        //更新合作商信息
        updCooper:function (vm) {
            return $.ajax({url:"/user/cooper/updCooper/"+vm.cooperId,
                method:"post",
                data:vm.updParams,
                dataType:"json"
            });
        },
        //批量删除合作商信息
        delCooper:function (vm) {
            return $http({url:"/user/cooper/delCooper/"+vm.selectListDelete.join(),
                method: "post",
                params:{}
            });
        },
        //根据用户名查询用户信息
        getUserByName:function(name){
            return $http({url:"/user/getUserByName/"+ name +"",method: "get"});
        },
        //根据功能ID获取用户开通功能信息
        getUserFuncById:function(vm){
            return $http({url:"/user/getUserFuncById",
                method: "post",
                params:vm.funcParams
            });
        },

    }

    //修改司机信息查询


}




