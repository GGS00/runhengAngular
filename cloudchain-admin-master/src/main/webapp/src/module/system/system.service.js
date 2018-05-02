angular
    .module('MetronicApp')
    .service('System', System)

function System($http){
    return {
        getBisTree:function (id){
            return $http({url:"/sys/resource/tree/"+id+"",method: "get"});
        },
        addBis:function (params) {
            return $http({url:"/sys/resource/add",method: "post",
                params:params
            });
        },
        editBis:function (params) {
            return $http({url:"/sys/resource/update",method: "post",
                params:params
            });
        },
        getIdepartment:function (params) {
        return $http({url:"/sys/orguser/org ",method: "get"});
        },

        getWarehouseDetail:function (id) {
            return $http({url:"/wmsWarehouse/qryWarehouseDetailById/"+id+"",method: "get"});
        },
        delBis:function (id) {
            return $http({url:"/sys/resource/del",method: "post",
                params:{
                    resoId:id
                }
            });
        },
        funcGroup:function () {
            return $http({url:"/sys/resource/getBisSysFunction",method: "get"});
        },
        sysId:function () {
            return $http({url:"/sys/resource/getBisSysCode",method: "get"});
        },



        getOrg:function (id) {
            return $http({url:"/sys/orguser/org",method: "get",

            });
        },
        addOrg:function (form) {
            return $http({url:"/sys/orguser/addorg",method: "post",
                params:form
            });
        },
        editOrg:function (form) {
            return $http({url:"/sys/orguser/updateorg",method: "post",
                params:form
            });
        },
        delOrg:function (id) {
            return $http({url:"/sys/orguser/delorg",method: "post",
                params:{
                    orgId: id
                }
            });
        },


        // getOrg:function(params){
        //     return $http({url:"/process",method: "post",
        //         params:params
        //     });
        // },
        addEmylee:function (form) {
            return $http({url:"/sys/orguser/adduser",method: "post",
                params:form
            });
        },
        editEmylee:function (form) {
            return $http({url:"/sys/orguser/updateuser",method: "post",
                params:form
            });
        },
        delEmylee:function (id) {
            return $http({url:"/sys/orguser/deluser",method: "post",
                params:{
                    empId: id
                }
            });
        },



        getRole:function (id) {
            return $http({url:"/sys/roleauth/role",method: "get",

            });
        },
        addRole:function (form) {
            return $http({url:"/sys/roleauth/add",method: "post",
                params:form
            });
        },
        editRole:function (form) {
            return $http({url:"/sys/roleauth/update",method: "post",
                params:form
            });
        },
        delRole:function (id) {
            return $http({url:"/sys/roleauth/del",method: "post",
                params:{
                    roleId: id
                }
            });
        },


        getResoList:function (id) {
            return $http({url:"/sys/roleauth/"+ id +"",method: "get",

            });
        },

        updtRoleResoRel:function (params) {
            return $http({url:"/sys/roleauth/updtRoleResoRel",method: "post",
                params:params
            });
        },

        getPrintCol:function (data) {
            return $http({url:"/wmsPrint/getPrintCol",
                method: "post",
                data: data
            });
        },

        tmpAdd:function (data) {
            return $http({url:"/wmsPrint/add",
                method: "post",
                data: data
            });
        },

    }
}

