//新建仓库
angular.module('MetronicApp').controller('addwarehouseCtrl', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'd2p', 'settings', 'System', 'BillManage', 'commonUtil', 'citySelect', 'multicitySelect', 'Goods', function ($rootScope, $scope, $http, uiGridConstants, d2p, settings, System, BillManage, commonUtil, citySelect, multicitySelect, Goods) {

    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    /********************************************初始化地区*********************************************/
    vm.sendSwitch = 0;
    vm.sendAddressList = [{id: ''}];
    //添加地区
    vm.addNewSend = function () {
        vm.sendAddressList.push({id: ''});
    };
    //移除最近的添加地区
    vm.removeSend = function (index) {
        vm.sendAddressList.splice(index, 1);
    };
    vm.idepartmentList = "";
    //取消新建仓库
    vm.cancel = function () {
        window.location.href = "#/sys/store/chaimi";
    }
    /*************************************************************获取部门信息**********************************/
    System.getIdepartment().success(function (data) {
        if (data.status == '00') {
            vm.idepartmentList = data.data;
        } else {
            msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
        }
    });
    /*************************************************************配置树的数据*******************************************************************/
    function categoryTree() {
        $("#categoryTree").jstree({
            "core": {
                "themes": {
                    "responsive": false
                },
                // so that create works
                "check_callback": true,
            },
            "types": {
                "default": {
                    "icon": "fa fa-folder icon-state-warning icon-lg"
                },
                "file": {
                    "icon": "fa fa-file icon-state-warning icon-lg"
                }
            },
            "state": {"key": "demo2"},
            "plugins": ["dnd", "state", "types", "checkbox"]
        })

    }

    //查询商品分类
    d2p.queryAllNodes().success(function (data) {
        console.log(data)
        var oldbox = data.data;
        var row = new Array();

        row.push({"id": 0, "parent": "#", "text": "根节点"})
        if (oldbox != null) {
            for (var i = 0; i < oldbox.length; i++) {
                row.push({"id": oldbox[i].cId, "parent": oldbox[i].parentCId, "text": oldbox[i].name})
            }
        }
        categoryTree()
        $("#categoryTree").jstree(true).settings.core.data = row;
        $("#categoryTree").jstree(true).refresh();
        $("#categoryTree").on('changed.jstree', function (e, data) {
            $scope.clickedNode = [];
            var i, j;
            for (i = 0, j = data.selected.length; i < j; i++) {
                var node = data.instance.get_node(data.selected[i]);
                if (data.instance.is_leaf(node)) {
                    $scope.clickedNode.push(node.id);
                }
            }
            console.log($scope.clickedNode)
        });
    })
    vm.regList = [];
    //商品分类模态框弹出监听
    vm.setShowClassify = function () {
        $('#confirmEdit').modal('show');
        Goods.getCategoryList().success(function (data) {
            var oldbox = data.data;
            var row = new Array();
            if (oldbox != null) {
                for (var m = 0; m < oldbox.length; m++) {
                    if (oldbox[m].parentCId == 0) {
                        row.push({"id": oldbox[m].cId, "parent": "#", "text": oldbox[m].name})
                    } else {
                        row.push({"id": oldbox[m].cId, "parent": oldbox[m].parentCId, "text": oldbox[m].name})
                    }
                }
            }
            categoryTree()
            $("#categoryTree").jstree().settings.core.data = row;
            $("#categoryTree").jstree().refresh(true);
            $("#categoryTree").on('changed.jstree', function (e, data) {

                var i, j;
                vm.regList = [];
                var dataSelect = data.selected;
                for (i = 0, j = dataSelect.length; i < j; i++) {
                    var node = data.instance.get_node(dataSelect[i]);
                    if (node.parent == "#" && node.children.length == 0) {
                        $("#categoryTree").jstree('uncheck_node', node.id);//将节点选中
                        return;
                    } else if (data.instance.is_leaf(node)) {
                        vm.regList.push(node.id);
                    }
                }
                console.log(vm.regList);
            });

        })
    }

    /*************************************************************获取部门下的员工******************************************************************************************/
    vm.grade = "";
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

            if (data.additionalMsg.status == '00') {
                vm.adminData = data;
            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });
    };
    vm.Administrator = function () {
        vm.adminParams = {
            bean: 'umsEmployee',
            method: 'pageGetEmployees',
            page: 1,
            rows: 10,
            orgId: vm.grade,
        }
        vm.adminPage();
    }

    vm.upradioFlag = 1;

    /******************************************************************************提交************************************************************************/
    vm.submitUser = function () {
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
        vm.PROVINCE_NAME = $('.warehouseAddress').find('.selectPro :selected').html();
        vm.CITY_NAME = $('.warehouseAddress').find('.selectCity :selected').html();
        vm.DISTRICT_NAME = $('.warehouseAddress').find('.selectArea :selected').html();
        vm.PROVINCE_ID = citySelect.getSelect().proId;//省id
        vm.CITY_ID = citySelect.getSelect().cityId;//市id
        vm.DISTRICT_ID = citySelect.getSelect().areaId;//区id
        vm.ADDRESS = $('#id_wareAddr').val();//地址
        vm.usageMode = "";
        var rangeFlag = 0;
        $("input:checkbox[name=range]:checked").each(function () {
            vm.usageMode += $(this).val() + ",";
            rangeFlag++;
        })
        if (rangeFlag == 0) {
            msgAlert.text('请选择使用范围');
            return false;
        }
        if (vm.usageMode.charAt(vm.usageMode.length - 1) == ",") {
            vm.usageMode = vm.usageMode.substring(0, vm.usageMode.length - 1);
        }

        vm.storeMent = "";
        var surelyFlag = 0;
        $("input:checkbox[name=surely]:checked").each(function () {
            vm.storeMent += $(this).val() + ",";
            surelyFlag++;
        })
        if (surelyFlag == 0) {
            msgAlert.text('请选择保管条件');
            return false;
        }
        if (vm.storeMent.charAt(vm.storeMent.length - 1) == ",") {
            vm.storeMent = vm.storeMent.substring(0, vm.storeMent.length - 1);
        }
        vm.useIntent = "";
        var useFlag = 0;
        $("input:checkbox[name=use]:checked").each(function () {
            vm.useIntent += $(this).val() + ",";
            useFlag++;
        })
        if (useFlag == 0) {
            msgAlert.text('请选择仓库用途');
            return false;
        }
        if (vm.useIntent.charAt(vm.useIntent.length - 1) == ",") {
            vm.useIntent = vm.useIntent.substring(0, vm.useIntent.length - 1);
        }
        var addressList = [];
        for (var i = 0; i < vm.sendAddressList.length; i++) {
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
        }


        vm.sendlist = angular.toJson(addressList);
        vm.goodsFlg = $('input[name="radio22"]:checked').val();//商品分类标志位

        if (vm.goodsFlg == 1) {
            vm.cateIds = "";//商品分类
        } else if (vm.goodsFlg == 0) {
            vm.cateIds = "";
            if (vm.regList.length == 0) {
                msgAlert.info("请选择商品分类");
                return;
            }

            for (var i = 0; i < vm.regList.length; i++) {
                vm.cateIds += vm.regList[i] + ",";
            }
            if (vm.cateIds.charAt(vm.cateIds.length - 1) == ",") {
                vm.cateIds = vm.cateIds.substring(0, vm.cateIds.length - 1);
            }
        }

        vm.empIds = "";
        for (var i = 0; i < vm.userList.length; i++) {
            vm.empIds += vm.userList[i].empId + ",";
        }
        if (vm.empIds.charAt(vm.empIds.length - 1) == ",") {
            vm.empIds = vm.empIds.substring(0, vm.empIds.length - 1);
        }

        vm.controller = "";
        vm.controllerId = "";
        vm.orgId = "";
        vm.tel = "";
        if (vm.adminEntity.getSelectedRows()[0] != null) {
            vm.controller = vm.adminEntity.getSelectedRows()[0].realName;
            vm.controllerId = vm.adminEntity.getSelectedRows()[0].empId;
            vm.orgId = vm.adminEntity.getSelectedRows()[0].orgId;
            vm.tel = vm.adminEntity.getSelectedRows()[0].mobile;
        }
        vm.addParam = {
            code: vm.CODE,
            name: vm.NAME,
            provinceName: vm.PROVINCE_NAME,
            cityName: vm.CITY_NAME,
            districtName: vm.DISTRICT_NAME,
            provinceId: vm.PROVINCE_ID,
            cityId: vm.CITY_ID,
            districtId: vm.DISTRICT_ID,
            address: vm.ADDRESS,
            usageMode: vm.usageMode,
            storeMent: vm.storeMent,
            useIntent: vm.useIntent,
            shipAreas: vm.sendlist,
            goodsFlg: vm.goodsFlg,
            controller: vm.controller,
            controllerId: vm.controllerId,
            orgId: vm.orgId,
            tel: vm.tel,
            cateIds: vm.cateIds,
            empIds: vm.empIds,
        }
        BillManage.WarehouseAdd(vm).success(function (data) {
            if (data.additionalMsg.status == '00') {
                msgAlert.info('添加成功');
                window.location.href = "#/sys/store/chaimi";
            } else {
                msgAlert.text(' >﹏< [' + data.additionalMsg.message + ']');
            }
        })
    }
    /***********************************************************获取员工******************************************************************************************/
    //弹出选择员工模态框
    vm.aaaa = function () {
        $('#lar11ge').modal('show');
        vm.skuPage();
    }
    vm.skuColumn = [
        {
            field: 'id',
            displayName: '编号',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            visible: false,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        },
        {
            field: "userName",
            displayName: '账号',
            width: 150,
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }, {
            field: "realName",
            displayName: '真实姓名',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }

    ]
    vm.placeholder_skuName = '请输入货品';
    vm.icon_sku = 'plus';

    //请求获取员工信息接口
    vm.skuPage = function () {

        vm.skuParams = {
            bean: 'umsEmployee',
            method: 'pageGetEmployees',
            page: 1,
            rows: 10,
            orgId: $scope.orgId
        }

        commonUtil.getList(vm.skuParams).success(function (data) {
            if (data.additionalMsg.status == '成功' || data.additionalMsg.status == '00') {
                vm.skuData = data;
            } else if (data.additionalMsg.status == '01') {
                msgAlert.text('获取商品列表失败 >﹏< [' + data.additionalMsg.message + ']');
            }
        });
    };
    //配置员工树
    function categoryTree2() {
        $("#categoryTree2").jstree({
            "core": {
                "themes": {
                    "responsive": false
                },
                // so that create works
                "check_callback": true,
            },
            "types": {
                "default": {
                    "icon": "fa fa-folder icon-state-warning icon-lg"
                },
                "file": {
                    "icon": "fa fa-file icon-state-warning icon-lg"
                }
            },
            "state": {"key": "demo2"},
            "plugins": ["dnd", "state", "types"]
        })
    }

    //获取员工树结构数据接口
    System.getOrg().success(function (data) {
        console.log(data)
        var oldbox = data.data;
        var row = new Array();

        row.push({"id": 0, "parent": "#", "text": "根节点"})
        if (oldbox != null) {
            for (var i = 0; i < oldbox.length; i++) {
                if (oldbox[i].parentCId == 0) {
                    row.push({"id": oldbox[i].orgId, "parent": "#", "text": oldbox[i].orgName})
                } else {
                    row.push({"id": oldbox[i].orgId, "parent": oldbox[i].orgParentId, "text": oldbox[i].orgName})
                }
            }
        }
        categoryTree2()
        $("#categoryTree2").jstree(true).settings.core.data = row;
        $('#categoryTree2').jstree(true).deselect_all();
        $("#categoryTree2").jstree(true).refresh('true');
        $("#categoryTree2").on('changed.jstree', function (e, data) {
            $scope.orgId = "";
            var i, j;
            for (i = 0, j = data.selected.length; i < j; i++) {
                var node = data.instance.get_node(data.selected[i]);
                if (data.instance.is_leaf(node)) {
                    if (node.id == 0) {
                        node.id = ""
                    }
                    $scope.orgId = node.id;
                    vm.skuPage()
                }
            }
        });
    })
    //确认选择员工
    vm.overClick = function () {
        if (vm.skuEntity.getSelectedRows().length == 0) {
            msgAlert.info('请至少选择一个员工');
            return false;
        } else {
            if (vm.skuEntity.getSelectedRows().length == 1) {
                for (var i = 0; i < vm.userList.length; i++) {
                    if (vm.skuEntity.getSelectedRows()[0].empId == vm.userList[i].empId) {
                        vm.userList.splice(i, 1);
                    }
                }
                vm.userList.push({
                    empId: vm.skuEntity.getSelectedRows()[0].empId,
                    accounts: vm.skuEntity.getSelectedRows()[0].userName,
                    realName: vm.skuEntity.getSelectedRows()[0].realName,
                    department: vm.skuEntity.getSelectedRows()[0].orgName,
                    role: vm.skuEntity.getSelectedRows()[0].roleName,
                    phone: vm.skuEntity.getSelectedRows()[0].mobile,
                    email: vm.skuEntity.getSelectedRows()[0].email
                });
            } else {
                for (var i = 0; i < vm.userList.length; i++) {
                    for (var j = 0; j < vm.skuEntity.getSelectedRows().length; j++) {
                        if (vm.userList[i].empId == vm.skuEntity.getSelectedRows()[j].empId) {
                            vm.userList.splice(i, 1);
                        }
                    }
                }
                for (var i = 0; i < vm.skuEntity.getSelectedRows().length; i++) {
                    vm.userList.push({
                        empId: vm.skuEntity.getSelectedRows()[i].empId,
                        accounts: vm.skuEntity.getSelectedRows()[i].userName,
                        realName: vm.skuEntity.getSelectedRows()[i].realName,
                        department: vm.skuEntity.getSelectedRows()[i].orgName,
                        role: vm.skuEntity.getSelectedRows()[i].roleName,
                        phone: vm.skuEntity.getSelectedRows()[i].mobile,
                        email: vm.skuEntity.getSelectedRows()[i].email
                    });
                }
            }
            $('#lar11ge').modal('hide');
        }
    }
    vm.userList = []
    //搜索员工
    vm.serachGoods = function () {
        $scope.orgId = "";
        vm.skuPage()
    }
    //移除员工
    vm.removeGoods = function (empId) {
        for (var j = 0; j < vm.userList.length; j++) {
            if (empId == vm.userList[j].empId) {
                vm.userList.splice(j, 1);
            }
        }
    }
}])



