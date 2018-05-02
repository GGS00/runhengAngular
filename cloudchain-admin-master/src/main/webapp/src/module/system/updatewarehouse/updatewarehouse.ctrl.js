
angular.module('MetronicApp').controller('updatewarehouseCtrl', ['$rootScope', '$scope','$http','uiGridConstants','d2p', 'settings','System','BillManage','commonUtil','citySelect','multicitySelect','$stateParams', function($rootScope, $scope, $http, uiGridConstants,d2p,settings, System,BillManage,commonUtil,citySelect,multicitySelect,$stateParams) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    var userid = $stateParams.Id;

    $scope.provideForm = {};
    vm.citySwitch = 0;
    vm.updateAddr = function () {
        vm.citySwitch = 1;
    }
    vm.cancelAddr = function () {
        vm.citySwitch = 0;
    }
    vm.sendAddressList = [];
    vm.fahuoSwitch = [];
    vm.fahuoVal = [];
    vm.fahuoflag = 1;
    vm.grade="";
    var mAreasDate = "";
    var mDate = "";
    System.getWarehouseDetail(userid).success(function (data) {
        if (data.status == '00') {
             mDate = data.resultMap.wmsWarehouse;
              $("#id_wareId").val(  mDate.code);
            $("#id_wareName").val(  mDate.name);
            var addr = mDate.provinceName + "/" + mDate.cityName + "/" +mDate.districtName
            $("#addr_id").val(addr);
            $("#id_wareAddr").val(  mDate.address);

            var strs=  mDate.usageMode.split(","); //字符分割
            $("input:checkbox[name=range]").each(function(index){
                for(var i=0 ;i<strs.length;i++){
                    if(strs[i]== $(this).val()){
                        $(this).attr("checked",'true');
                    }
                }

            })
            var strs2=  mDate.storeMent.split(","); //字符分割
            $("input:checkbox[name=surely]").each(function(index){
                for(var i=0 ;i<strs2.length;i++){
                    if(strs2[i]== $(this).val()){
                        $(this).attr("checked",'true');
                    }
                }
                if(strs2[index]== $(this).val()) {
                    $(this).attr("checked", 'true');
                }
            })
            var strs3=  mDate.useIntent.split(","); //字符分割
            var useFlag = false;
            $("input:checkbox[name=use]").each(function(index){
                for(var i=0 ;i<strs3.length;i++){
                    if(strs3[i]== $(this).val()){
                        $(this).attr("checked",'true');
                    }
                    if(strs3[i] == "01"){
                         useFlag = true;

                    }

                }

            })
             mAreasDate = data.resultMap.shipAreas;
            if(useFlag){
                vm.fahuoflag = 0;
                for (var i = 0; i < mAreasDate.length; i++) {
                    vm.sendAddressList.push({id: ''});
                    if (mAreasDate[i].cityName == null && mAreasDate[i].districtName == null) {
                        vm.fahuoVal.push(mAreasDate[i].provinceName);
                    } else if (mAreasDate[i].cityName != null && mAreasDate[i].districtName == null) {
                        vm.fahuoVal.push(mAreasDate[i].provinceName + "/" + mAreasDate[i].cityName);
                    } else if (mAreasDate[i].cityName != null && mAreasDate[i].districtName != null) {
                        vm.fahuoVal.push(mAreasDate[i].provinceName + "/" + mAreasDate[i].cityName + "/" +mAreasDate[i].districtName);
                    }
                    vm.fahuoSwitch.push(i);
                }
            }else {
                vm.fahuoflag = 1;
            }

            vm.upradioFlag  = mDate.goodsFlg;

            System.getIdepartment().success(function (data) {
                if (data.status == '00') {
                   var list  = data.data;
                   var orgname;
                   for (var i=0;i<list.length;i++){
                                if(mDate.orgId == list[i].orgId)       {
                                    orgname = list[i].orgName ;
                                }
                   }
                  $("#admin_id").val("部门 |"+orgname+"  姓名 |"+mDate.controller);
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
                }
            });

        } else {
            msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
        }
    });

    $("#checkbox31").click(function () {
        if($('#checkbox31').is(':checked')) {
            vm.fahuoflag = 0;
            vm.addNewSend();
        }else {
            vm.fahuoflag = 1;
            vm.removeSend();
        }
    });



    /********************************************初始化地区*********************************************/

    vm.updateFahuoAddr = function (index) {
        vm.fahuoSwitch[index] = index + 1;
    }
    vm.cancelFahuoAddr = function (index) {

        vm.fahuoSwitch[index] = index;
    }
    vm.addNewSend = function () {
        vm.fahuoSwitch.push(vm.sendAddressList.length + 1);
        vm.sendAddressList.push({id: ''});
        vm.fahuoVal.push("");

    };

    vm.removeSend = function (index) {
        vm.fahuoSwitch.splice(index, 1);
        vm.fahuoVal.splice(index, 1);
        vm.sendAddressList.splice(index, 1);
        for (var i = vm.fahuoSwitch.length; i > index; i--) {
            vm.fahuoSwitch[i - 1] = vm.fahuoSwitch[i - 1] - 1;
        }
    };
    vm.adminSwitch = 0;
/******************************************修改管理员信息**********************************************************************/
vm.updateAdmin = function () {
    vm.adminSwitch = 1;
}
    vm.cancelAdmin = function () {
        vm.adminSwitch = 0;
    }

    vm.idepartmentList = "";
    /*************************************************************获取部门信息**********************************/

    System.getIdepartment().success(function (data) {
        if (data.status == '00') {
            vm.idepartmentList = data.data;
            vm.Administrator();
        } else {
            msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
        }
    });

    //设置展示分类
    vm.setShowClassify  = function(){
            $('#confirmEdit').modal('show')
    }
    /*************************************************************配置树的数据**********************************/
    function categoryTree() {
        $("#categoryTree").jstree({
            "core" : {
                "themes" : {
                    "responsive": false
                },
                // so that create works
                "check_callback" : true,
            },
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "file" : {
                    "icon" : "fa fa-file icon-state-warning icon-lg"
                }
            },
            "state" : { "key" : "demo2" },
            "plugins" : ["dnd", "state", "types", "checkbox"]
        })

    }
    // d2p.queryAllNodes().success(function (data) {
    //     console.log(data)
    //     var oldbox = data.data;
    //     var row =  new Array();
    //
    //     row.push({"id":0,"parent":"#","text":"根节点"})
    //     if(oldbox != null){
    //         for(var i=0;i<oldbox.length;i++){
    //             row.push({"id":oldbox[i].cId,"parent":oldbox[i].parentCId,"text":oldbox[i].name})
    //         }
    //     }
    //     categoryTree()
    //     $("#categoryTree").jstree(true).settings.core.data = row;
    //     $("#categoryTree").jstree(true).refresh();
    //     $("#categoryTree").on('changed.jstree',function(e,data){
    //         $scope.clickedNode = [];
    //         var i, j;
    //         for (i = 0, j = data.selected.length; i < j; i++) {
    //             var node = data.instance.get_node(data.selected[i]);
    //             if (data.instance.is_leaf(node)) {
    //                 $scope.clickedNode.push(node.id);
    //             }
    //         }
    //         console.log($scope.clickedNode  )
    //     });
    // })
    /*************************************************************获取部门下的员工**********************************/

    vm.adminColumn = [
        {
            field: 'empId',
            displayName: '员工编号',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        },
        {
            field: "realName",
            displayName: '真实姓名',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }
    ]
    vm.placeholder_adminName = '请选择员工';
    vm.icon_admin = 'plus';
    vm.adminPage = function () {
        commonUtil.getList(vm.adminParams).success(function (data) {

            if (data.additionalMsg.status == '00' ) {
                vm.adminData = data;
            } else  {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });
    };
    vm.grade = "";
    vm.Administrator =function () {
        vm.adminParams = {
            bean: 'umsEmployee',
            method: 'pageGetEmployees',
            page: 1,
            rows: 10,
            orgId:vm.grade,
        }
        vm.adminPage();
    }



  /******************************************************************************提交************************************************/
    vm.submitUser  = function () {
        if ($.trim($('#id_wareId').val()) == "") {
            msgAlert.text('请输入仓库编码');
            return false;
        }
        if ($.trim($('#id_wareName').val()) == "") {
            msgAlert.text('请输入仓库名称');
            return false;
        }

        if ($.trim($('#id_wareAddr').val()) == "") {
            msgAlert.text('请输入仓库详细地址');
            return false;
        }

        vm.CODE = $('#id_wareId').val();//仓库编码
        vm.NAME = $('#id_wareName').val();//仓库名
        //仓库地址
        if(vm.citySwitch==0){

            vm.PROVINCE_NAME = mDate.provinceName ;
            vm.CITY_NAME = mDate.cityName;
            vm.DISTRICT_NAME = mDate.districtName;
            vm.PROVINCE_ID =mDate.province;//省id
            vm.CITY_ID = mDate.city;//市id
            vm.DISTRICT_ID = mDate.district;//区id
            vm.ADDRESS = $('#id_wareAddr').val();//地址
        }else if(vm.citySwitch ==1){
            vm.PROVINCE_NAME = $('.warehouseAddress').find('.selectPro :selected').html();
            vm.CITY_NAME = $('.warehouseAddress').find('.selectCity :selected').html();
            vm.DISTRICT_NAME = $('.warehouseAddress').find('.selectArea :selected').html();
            vm.PROVINCE_ID = citySelect.getSelect().proId;//省id
            vm.CITY_ID = citySelect.getSelect().cityId;//市id
            vm.DISTRICT_ID = citySelect.getSelect().areaId;//区id
            vm.ADDRESS = $('#id_wareAddr').val();//地址
        }
        vm.usageMode = "";
        var rangeFlag =0;
        $("input:checkbox[name=range]:checked").each(function(){
            vm.usageMode += $(this).val()+",";
            rangeFlag++;
        })
        if(rangeFlag==0){
            msgAlert.text('请选择使用范围');
            return false;
        }
        if (  vm.usageMode.charAt( vm.usageMode.length-1)== ",") {
            vm.usageMode= vm.usageMode.substring(0, vm.usageMode.length-1);
        }

        vm.storeMent = "";
        var surelyFlag = 0;
        $("input:checkbox[name=surely]:checked").each(function(){
            vm.storeMent += $(this).val()+",";
            surelyFlag++;
        })
        if(surelyFlag==0){
            msgAlert.text('请选择保管条件');
            return false;
        }
        if (  vm.storeMent.charAt( vm.storeMent.length-1)== ",") {
            vm.storeMent= vm.storeMent.substring(0, vm.storeMent.length-1);
        }

        vm.useIntent = "";
        var useFlag = 0;
        $("input:checkbox[name=use]:checked").each(function(){
            vm.useIntent += $(this).val()+",";
            useFlag++;
        })
        if(useFlag==0){
            msgAlert.text('请选择仓库用途');
            return false;
        }
        if (  vm.useIntent.charAt( vm.useIntent.length-1)== ",") {
            vm.useIntent= vm.useIntent.substring(0, vm.useIntent.length-1);
        }

        var addressList = [];
        var flag = 1;
        if (flag == 1) {
            for (var i = 0; i < vm.sendAddressList.length; i++) {
                if (vm.fahuoSwitch[i] !== i) {
                    if ($('.sendAddress_' + i).find('.selectPro :selected').val() != '') {
                        if ($('.sendAddress_' + i).find('.selectCity :selected').val() != '') {
                            if ($('.sendAddress_' + i).find('.selectArea :selected').val() != '') {
                                addressList[i] = {
                                    province: $('.sendAddress_' + i).find('.selectPro :selected').val(),
                                    provinceName: $('.sendAddress_' + i).find('.selectPro :selected').html(),
                                    city: $('.sendAddress_' + i).find('.selectCity :selected').val(),
                                    cityName: $('.sendAddress_' + i).find('.selectCity :selected').html(),
                                    district: $('.sendAddress_' + i).find('.selectArea :selected').val(),
                                    districtName: $('.sendAddress_' + i).find('.selectArea :selected').html()
                                }
                            } else {
                                addressList[i] = {
                                    province: $('.sendAddress_' + i).find('.selectPro :selected').val(),
                                    provinceName: $('.sendAddress_' + i).find('.selectPro :selected').html(),
                                    city: $('.sendAddress_' + i).find('.selectCity :selected').val(),
                                    cityName: $('.sendAddress_' + i).find('.selectCity :selected').html(),
                                }
                            }
                        } else {
                            addressList[i] = {
                                province: $('.sendAddress_' + i).find('.selectPro :selected').val(),
                                provinceName: $('.sendAddress_' + i).find('.selectPro :selected').html(),
                            }
                        }
                    } else {
                        addressList[i] = {
                            province: "all",
                            provinceName: "全国",
                        }
                    }
                } else {
                    addressList[i] = {
                        province: mAreasDate[i].province,
                        provinceName:mAreasDate[i].provinceName,
                        city:mAreasDate[i].city,
                        cityName:mAreasDate[i].cityName,
                        district: mAreasDate[i].district,
                        districtName:mAreasDate[i].districtName
                    }
                }

            }
            vm.sendlist = angular.toJson(addressList);
        } else {
            vm.sendlist = null;
        }
        vm.goodsFlg = $('input[name="radio22"]:checked').val();

        vm.controller = "";
        vm.controllerId= "";
        vm.orgId= "";
        vm.tel= "";

            if(vm.adminEntity.getSelectedRows()[0]!=null){
                vm.controller = vm.adminEntity.getSelectedRows()[0].realName;
                vm.controllerId =vm.adminEntity.getSelectedRows()[0].empId;
                vm.orgId =vm.adminEntity.getSelectedRows()[0].orgId;
                vm.tel =vm.adminEntity.getSelectedRows()[0].mobile;
            }else {
                vm.controller =mDate.controller;
                vm.controllerId =mDate.controllerId;
                vm.orgId =mDate.orgId;
                vm.tel =mDate.tel;
       }

        vm.updateParam = {
            id:userid,
            code: vm.CODE,
            name: vm.NAME,
            provinceName: vm.PROVINCE_NAME,
            cityName: vm.CITY_NAME,
            districtName: vm.DISTRICT_NAME,
            provinceId: vm.PROVINCE_ID,
            cityId: vm.CITY_ID,
            districtId: vm.DISTRICT_ID,
            address: vm.ADDRESS,
            usageMode:vm.usageMode,
            storeMent:vm.storeMent,
            useIntent:vm.useIntent,
            shipAreas: vm.sendlist,
            goodsFlg:vm.goodsFlg,
            controller:  vm.controller,
            controllerId:  vm.controllerId,
            orgId:vm.orgId,
            tel:vm.tel,
            cateIds:""
        }
        BillManage.WarehouseUpdate(vm).success(function (data) {
            if (data.additionalMsg.status == '00') {
                msgAlert.info('修改成功');
                window.location.href="#/sys/store/chaimi";
            } else {
                msgAlert.text(' >﹏< [' + data.additionalMsg.message + ']');
            }
        })
    }

}])



