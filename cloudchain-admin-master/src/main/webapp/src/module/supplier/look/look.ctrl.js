angular.module('MetronicApp')
    .controller('lookCtrl', ['$rootScope', '$scope', '$http', '$stateParams', 'uiGridConstants', 'settings', 'citySelect', 'suppServer', 'commonUtil', 'Table', function ($rootScope, $scope, $http, $stateParams, uiGridConstants, settings, citySelect, suppServer, commonUtil, Table) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;

        var userid = $stateParams.Id;
        var emailreg = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/;
        var mobilereg = /^((13[0-9])|(15[0-9])|(18[0-9])|(14[0-9])|(17[0-9]))\d{8}$/;
        var postreg = /^[0-9]{6}$/;
        /**************************************************************************************************************************************************************/
        /*****************************************************************标签切换加载**********************************************************************************/
        vm.showTab = function (index) {
            if (index == 0) {//账号
                vm.getIdentPage();
            } else if (index == 1) {//联系人
                vm.getContactsPage();
            } else if (index == 2) {//发货区域
                vm.getFahuoPage();
            } else if (index == 3) {//供应商品
                vm.getGoodsPage();
            } else if (index == 4) {//地址库管理
                vm.getAddrPage()
            }

        }
        /***********************************************************************************************************************************************************/
        /**************************************************添加联系人************************************************************************************************/
        //添加联系人弹框
        vm.addContacts = function () {
            $('#addContacts').modal('show');
        }
        vm.column_contacts = [{
            field: "ID",
            displayName: 'ID',
            width: '10%',
            visible: false,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
        },
            {
                field: 'OWNER_ID',
                displayName: '联系人',
            },
            {
                field: "WAREHOUSE_ID",
                displayName: '联系电话',
            },
            {
                field: "WAREHOUSE_NAME",
                displayName: '联系邮箱',

            },
            {
                field: "OWNER_NAME",
                displayName: '操作',
            }
        ]
        vm.contacts_params = {}
        vm.getContactsPage = function () {
            vm.qryUserId = userid;
            vm.userType = 6;
            suppServer.getContacts(vm).success(function (data) {
                debugger
                if (data.status == '00') {
                    vm.contactsdata = data.data;
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
                }
            });

        };
        //添加联系人
        vm.btaddContacts = function () {
            vm.nickName = $.trim($("#id_nickname").val());
            vm.mobile = $.trim($("#id_mobile").val());
            vm.email = $.trim($("#id_email").val());
            vm.id = userid;
            if (vm.nickName == "" && vm.nickName !== undefined) {
                msgAlert.text('联系人不能为空');
                return;
            }
            if (vm.mobile != "" && vm.mobile != undefined) {
                if (vm.mobile.match(mobilereg) == null) {
                    msgAlert.text('请输入正确格式的手机号码');
                    return;
                }
            } else {
                msgAlert.text('手机号码不能为空');
                return;
            }
            if (vm.email != "" && vm.email != undefined) {
                if (vm.email.match(emailreg) == null) {
                    msgAlert.text('请输入正确格式的邮箱地址');
                    return;
                }
            } else {
                msgAlert.text('邮箱地址不能为空');
                return;
            }
            suppServer.addContacts(vm).success(function (data) {
                debugger
                if (data.status == '00') {
                    $('#addContacts').modal('hide');
                    msgAlert.text('添加成功');
                    vm.getContactsPage();

                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
                }
            });
        }

        /*******************************************************************************************************************************************************/
        /**************************************************添加账号************************************************************************************************/
        vm.Ident_column = [{
            field: "userId",
            displayName: '用户id',
            visible: false,
        },
            {
                field: "userType",
                displayName: '账号类型',
                cellTemplate:'<div style="padding:5px">{{row.entity.userType==4?"主账号":""}}</div>'
            },
            {
                field: "userName",
                displayName: '账号',
            },
            {
                name: "操作",
                displayName: '操作',

            }
        ]
        vm.identity_params = {}
        vm.identdata;
        vm.getIdentPage = function () {
            $http({
                url: "/user/qryUserInfoByUserId/" + userid, method: "get",
            }).success(function (data) {
                if (data.additionalMsg.status == '00') {
                    if (data.rows[0].userName == null || data.rows[0].userName == "") {
                        vm.identdata = null;
                    } else {
                        vm.identdata = data;
                    }

                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });

        };


        //添加账号
        vm.addIdent = function () {
            if ( vm.identdata== null ||  vm.identdata == "") {
                $('#addIdent').modal('show');
            }else  if(   vm.identdata.rows.length>=1){
                msgAlert.text('已有账号，不能再次添加');
                return;
            }
        }
        //确认添加账号
        vm.btaddIdent = function () {

            var namereg = /^(?![0-9]*$)[a-zA-Z0-9]{6,20}$/;
            vm.userName = $.trim($("#id_name").val());
            vm.password = $.trim($("#id_passwd").val());
            vm.userId = userid;
            if (vm.userName == "" && vm.userName !== undefined) {
                msgAlert.text('账号不能为空');
                return;
            }

            if (vm.userName.match(namereg) == null) {
                msgAlert.text('登入账号必须为字母+数字/纯字母/大于6个字');
                return false;
            }
            if (vm.password == "" && vm.password !== undefined) {
                msgAlert.text('密码不能为空');
                return;
            }
            bodyRSA();
            /* encodeURIComponent*/
            vm.password = encryptedString(key, encodeURIComponent($.trim($("#id_passwd").val())));
            suppServer.addAccounts(vm).success(function (data) {
                if (data.status == '00') {
                    $('#addIdent').modal('hide');
                    msgAlert.text('添加成功');
                    vm.getIdentPage();

                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
                }
            });
        }
        var key;

        function bodyRSA() {
            setMaxDigits(130);
            key = new RSAKeyPair("10001", "", "f5e769a799b21ffb5eb358006f110e3653eaf7ade25e764fb722c912fa049156ea851a4929428059cddbc269cd868bc089df30fb22bcb89b79c965f4fee81c516a147b777c5361d63d11e8504b0a416f8cf69f7e810ced126137911010fb72e15ba2d700fcb8663a64e6bffcece7c45d7414a795281420f508387b6017b56037");
        }
        /********************************************************************************************************************************************************/
        /**************************************************供应商品***********************************************************************************************/
        vm.column_goods = [
            {
                field: 'skuId',
                displayName: '商品SKU编号',
                visible: false,
                width: 100,
            },
            {
                field: "skuName",
                displayName: '商品名称',
                width: 150,
            },
            {
                field: "skuName",
                displayName: '商品图片',
                width: 150,
                cellTemplate: ' <div style=" text-align: center;"><img style="height: 40px;width: 40px;" ng-click="grid.appScope.$parent.look.showAddImg(row.good_entity.img)" src="{{row.good_entity.img}}"></div>'
            },
            {
                field: "cName",
                width: 100,
                displayName: '商品分类',

            },
            {
                field: "spec",
                width: 100,
                displayName: '规格',
            },
            {
                field: "priceStr",
                width: 100,
                displayName: '成本价格',
            },
            {
                field: "qty",
                width: 100,
                displayName: '库存',
            },
            {
                field: "channel",
                width: 200,
                displayName: '销售渠道',
                cellTemplate:'<div style="padding:5px" ng-model="look.addrType1[row.entity.index]">{{grid.appScope.$parent.look.addrType1[row.entity.index]}}</div>'

            }
        ]
        vm.goods_params = {
            supplierId: userid,
            bean: 'gmsSupplier',
            method: 'pageGetSupplierSkuList',
            page: 1,
            rows: 10
        }
        vm.addrType1 = new Array();
        vm.getGoodsPage = function () {

            commonUtil.getList(vm.goods_params).success(function (data) {
                if (data.additionalMsg.status == '00') {
                    vm.addrType1 = new Array();
                    for(var i =0;i < data.rows.length;i++) {
                        data.rows[i].index = i;
                    }
                    for(var i =0;i < data.rows.length;i++){
                        vm.addrType1[i] = "";
                        if( data.rows[i].addrType==null){
                            data.rows[i].addrType ="";
                        }
                        var a= data.rows[i].channel.substr(0,1);
                        var b= data.rows[i].channel.substr(1,1);
                        var c= data.rows[i].channel.substr(2,1);
                        var d= data.rows[i].channel.substr(3,1);
                        if(a== 1){ //批发
                            vm.addrType1[i] =vm.addrType1[i]+"批发/";
                        }else {
                            vm.addrType1[i] =vm.addrType1[i]+"";
                        }
                        if (b==1){ //零售
                            vm.addrType1[i]=vm.addrType1[i]+"零售/";
                        }else {
                            vm.addrType1[i]=vm.addrType1[i]+"";
                        }
                        if (c==1){//门店
                            vm.addrType1[i] =vm.addrType1[i]+"门店/";
                        }else {
                            vm.addrType1[i] =vm.addrType1[i]+"";
                        }
                        if (d==1){//采购
                            vm.addrType1[i] =vm.addrType1[i]+"采购";
                        }else {
                            vm.addrType1[i] =vm.addrType1[i]+"";
                        }
                        if (  vm.addrType1[i].charAt( vm.addrType1[i].length-1)== "/") {
                            vm.addrType1[i]= vm.addrType1[i].substring(0, vm.addrType1[i].length-1);
                        }
                    }
                    vm.good_data = data;
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });

        };
        vm.getGoodsPage();
        //管理供应商品

        vm.manageGoods = function () {
            window.location.href = "#/supplier/addgood/"+ userid ;
        }
        vm.imgURL = "";
        //放大图片弹框
        vm.showAddImg = function (index) {
            vm.imgURL = index;
            $("#showAddImg").modal("show");

        }
        /***********************************************************************************************************************************************************/
        /**************************************************地址库管理***********************************************************************************************/

        vm.addrType1 = "";
        vm.column_addr = [
            {
                field: 'addressId',
                displayName: '编号',
                width: '10%',
            },
            {
                field: "contactName",
                displayName: '联系人',
                width: '10%',
            },
            {
                field: "mobile",
                displayName: '联系电话',
                width: '10%',

            },
            {
                name: "所在区域",
                cellTemplate: '<div style="padding:5px">{{row.entity.provinceName+"/"+row.entity.cityName+"/"+row.entity.countyName}}</div>',
                width: '20%',
            },
            {
                field: "address",
                displayName: '街道地址',
                width: '20%',
            },
            {
                field: "postcode",
                displayName: '邮编',
                width: '10%',
            }, {
                name: "地址类型",
                displayName: '地址类型',
                width: '20%',
                cellTemplate: '<div style="padding:5px" ng-model="look.addrType1[row.entity.index]">{{grid.appScope.$parent.look.addrType1[row.entity.index]}}</div>'
            },
            {
                name: "qty",
                displayName: '操作',
                width: '15%',
                // cellTemplate:'<button class ="btn warning" ng-click="grid.appScope.$parent.address.removeAddress(row.entity.addressId)" ">删除</button>'
                // +'<button class ="btn green"  ui-sref="supplier.look({Id:row.entity.userId})" >查看</button>' +
                // '<button class ="btn yellow" ui-sref="goods.supplier({Id:row.entity.spuId})">绑定供应商</button>'

            }]
        vm.addr_params = {
            qryUserId: userid,
            bean: 'umsAddress',
            method: 'page',
            page: 1,
            rows: 10
        }
        vm.addrType1 = new Array();
        vm.getAddrPage = function () {
            commonUtil.getList(vm.addr_params).success(function (data) {
                if (data.additionalMsg.status == '00') {
                    vm.addrType1 = new Array();
                    var strs = new Array(); //定义一数组
                    for (var i = 0; i < data.rows.length; i++) {
                        data.rows[i].index = i;
                    }
                    for (var i = 0; i < data.rows.length; i++) {
                        vm.addrType1[i] = "";
                        strs = data.rows[i].addrType.split(","); //字符分割
                        for (var j = 0; j < strs.length; j++) {
                            if (strs[j] == "111") { //收货地址
                                vm.addrType1[i] = vm.addrType1[i] + "收货地址/";
                            } else if (strs[j] == "112") { //发货地址
                                vm.addrType1[i] = vm.addrType1[i] + "发货地址/";
                            } else if (strs[j] == "120") {//退货地址
                                vm.addrType1[i] = vm.addrType1[i] + "退货地址/";
                            } else if (strs[j] == "130") {//自提地址
                                vm.addrType1[i] = vm.addrType1[i] + "自提地址";
                            }
                        }
                        if (vm.addrType1[i].charAt(vm.addrType1[i].length - 1) == "/") {
                            vm.addrType1[i] = vm.addrType1[i].substring(0, vm.addrType1[i].length - 1);
                        }
                    }

                    vm.addr_data = data;
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });

        };

        //地址库弹窗
        vm.addAddress = function () {
            $("#id_contacts").val("");
            $("#id_phone").val("");
            $("#id_streetAddr").val("");
            $("#id_postcode").val("");
            $("#checkbox14").prop("checked", false);
            $("#checkbox15").prop("checked", false);
            $("#checkbox16").prop("checked", false);
            $("#checkbox17").prop("checked", false);
            $('#addAddress').modal('show');
        }
        vm.removeAddress = function () {
            if (vm.addrEntity.getSelectedRows().length == 0) {
                msgAlert.info('请先选择要修改的地址单');
                return false;
            } else if (vm.addrEntity.getSelectedRows().length > 1) {
                msgAlert.info('每次只能选择一条地址单');
                return false;
            } else {
                var index = vm.addrEntity.getSelectedRows()[0].addressId;
                suppServer.delUserAddress(index).success(function (data) {
                    if (data.status == '00') {
                        msgAlert.text('删除成功');
                        vm.getAddrPage();

                    } else {
                        msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
                    }
                });
            }
        }
        //增加收货地址
        vm.addrTypes = "";
        vm.btaddAddress = function () {
            vm.addrTypes = "";
            if ($("#id_contacts").val() == undefined || $("#id_contacts").val() == "") {
                msgAlert.text('请输入联系人地址');
                return;
            }

            if ($("#id_phone").val() != undefined || $("#id_phone").val() != "") {
                if ($("#id_phone").val().match(mobilereg) == null) {
                    msgAlert.text('请输入正确格式的手机号码');
                    return;
                }
            } else {
                msgAlert.text('手机号码不能为空');
                return;
            }

            if ($("#id_postcode").val() != undefined && $("#id_postcode").val() != "") {
                if ($("#id_postcode").val().match(postreg) == null) {
                    msgAlert.text('请输入正确的邮政编码格式');
                    return;
                }
            }
            if ($("#id_streetAddr").val() == undefined || $("#id_streetAddr").val() == "") {
                msgAlert.text('请输入所在街道');
                return;
            }

            // 收件地址111 发件地址112 退货地址120 自提地址130
            if ($('#checkbox14').is(':checked')) {
                vm.addrTypes = vm.addrTypes + "111,";
            }
            if ($('#checkbox15').is(':checked')) {
                vm.addrTypes = vm.addrTypes + "112,";
            }
            if ($('#checkbox16').is(':checked')) {
                vm.addrTypes = vm.addrTypes + "120,";
            }
            if ($('#checkbox17').is(':checked')) {
                vm.addrTypes = vm.addrTypes + "130";
            }
            vm.addrParams = {
                contactName: $("#id_contacts").val(),
                mobile: $("#id_phone").val(),
                province: $('.provideAddress').find('.selectPro :selected').val().substr(7),
                provinceName: $('.provideAddress').find('.selectPro :selected').html(),
                city: $('.provideAddress').find('.selectCity :selected').val().substr(7),
                cityName: $('.provideAddress').find('.selectCity :selected').html(),
                county: $('.provideAddress').find('.selectArea :selected').val().substr(7),
                countyName: $('.provideAddress').find('.selectArea :selected').html(),
                address: $("#id_streetAddr").val(),
                postcode: $("#id_postcode").val(),
                addrTypes: vm.addrTypes,
            }
            suppServer.addUserAddress(userid, vm.addrParams).success(function (data) {
                if (data.status == '00') {
                    $('#addAddress').modal('hide');
                    msgAlert.text('添加成功');
                    vm.getAddrPage();
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
                }
            });

        }
        vm.citySwitch = 0;
        vm.updateAddress = function () {
            if (vm.addrEntity.getSelectedRows().length == 0) {
                msgAlert.info('请先选择要修改的地址单');
                return false;
            } else if (vm.addrEntity.getSelectedRows().length > 1) {
                msgAlert.info('每次只能选择一条地址单');
                return false;
            } else {

                $("#update_checkbox14").prop("checked", false);
                $("#update_checkbox15").prop("checked", false);
                $("#update_checkbox16").prop("checked", false);
                $("#update_checkbox17").prop("checked", false);
                $("#id_update_contacts").val(vm.addrEntity.getSelectedRows()[0].contactName);
                $("#id_update_phone").val(vm.addrEntity.getSelectedRows()[0].mobile);
                $("#id_area").val(vm.addrEntity.getSelectedRows()[0].provinceName + "/" + vm.addrEntity.getSelectedRows()[0].cityName + "/" + vm.addrEntity.getSelectedRows()[0].countyName);
                $("#id_update_streetAddr").val(vm.addrEntity.getSelectedRows()[0].address);
                $("#id_update_postcode").val(vm.addrEntity.getSelectedRows()[0].postcode);


                var strs = new Array(); //定义一数组
                strs = vm.addrEntity.getSelectedRows()[0].addrType.split(","); //字符分割
                for (i = 0; i < strs.length; i++) {
                    if (strs[i] == "111") { //收货地址
                        $("#update_checkbox14").prop("checked", true);
                    } else if (strs[i] == "112") { //发货地址
                        $("#update_checkbox15").prop("checked", true);
                    } else if (strs[i] == "120") {//退货地址
                        $("#update_checkbox16").prop("checked", true);
                    } else if (strs[i] == "130") {//自提地址
                        $("#update_checkbox17").prop("checked", true);
                    }
                }
                $('#updateAddress').modal('show');
            }
        }
        vm.addrTypes2 = "";
        vm.btupdateAddress = function () {

            if ($("#id_update_contacts").val() == undefined || $("#id_update_contacts").val() == "") {
                msgAlert.text('请输入联系人地址');
                return;
            }
            if ($("#id_update_phone").val() != undefined || $("#id_update_phone").val() != "") {
                if ($("#id_update_phone").val().match(mobilereg) == null) {
                    msgAlert.text('请输入正确格式的手机号码');
                    return;
                }
            } else {
                msgAlert.text('手机号码不能为空');
                return;
            }
            if ($("#id_update_streetAddr").val() == undefined || $("#id_update_streetAddr").val() == "") {
                msgAlert.text('请输入所在街道');
                return;
            }
            if ($("#id_update_postcode").val() != undefined && $("#id_update_postcode").val() != "") {
                if ($("#id_update_postcode").val().match(postreg) == null) {
                    msgAlert.text('请输入正确的邮政编码格式');
                    return;
                }
            }
            // 收件地址111 发件地址112 退货地址120 自提地址130
            if ($('#update_checkbox14').is(':checked')) {
                vm.addrTypes2 = vm.addrTypes2 + "111,";
            }
            if ($('#update_checkbox15').is(':checked')) {
                vm.addrTypes2 = vm.addrTypes2 + "112,";
            }
            if ($('#update_checkbox16').is(':checked')) {
                vm.addrTypes2 = vm.addrTypes2 + "120,";
            }
            if ($('#update_checkbox17').is(':checked')) {
                vm.addrTypes2 = vm.addrTypes2 + "130,";
            }
            if (vm.addrTypes2.charAt(vm.addrTypes2.length - 1) == ",") {
                vm.addrTypes2 = vm.addrTypes2.substring(0, vm.addrTypes2.length - 1);
            }
            if (vm.citySwitch == 1) {
                vm.province = $('.provideAddress2').find('.selectPro :selected').val().substr(7);
                vm.provinceName = $('.provideAddress2').find('.selectPro :selected').html();
                vm.city = $('.provideAddress2').find('.selectCity :selected').val().substr(7);
                vm.cityName = $('.provideAddress2').find('.selectCity :selected').html();
                vm.county = $('.provideAddress2').find('.selectArea :selected').val().substr(7);
                vm.countyName = $('.provideAddress2').find('.selectArea :selected').html();
            } else {
                vm.province = null;
                vm.provinceName = null;
                vm.city = null;
                vm.cityName = null;
                vm.county = null;
                vm.countyName = null;
            }
            vm.addrParams = {
                contactName: $("#id_update_contacts").val(),
                mobile: $("#id_update_phone").val(),
                province: vm.province,
                provinceName: vm.provinceName,
                city: vm.city,
                cityName: vm.cityName,
                county: vm.county,
                countyName: vm.countyName,
                address: $("#id_update_streetAddr").val(),
                postcode: $("#id_update_postcode").val(),
                addrTypes: vm.addrTypes2,
                addressId: vm.addrEntity.getSelectedRows()[0].addressId,
            }
            suppServer.updateUserAddress(userid, vm.addrParams).success(function (data) {
                if (data.status == '00') {
                    $('#updateAddress').modal('hide');
                    msgAlert.text('修改成功');
                    vm.addrTypes2 = "";
                    vm.getAddrPage();

                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
                }
            });
        }
        vm.updateArea = function () {
            vm.citySwitch = 1;
        }
        vm.cancelArea = function () {
            vm.citySwitch = 0;
        }
        /**********************************************************************************************************************************************************/
        /**************************************************发货区域************************************************************************************************/
        vm.column_fahuo = [
            {
                field: 'OWNER_ID',
                displayName: '编号',
            },
            {
                field: "WAREHOUSE_ID",
                displayName: '商品',
            },
            {
                field: "WAREHOUSE_NAME",
                displayName: '发货区域',

            },
            {
                field: "OWNER_NAME",
                displayName: '生效时间',
            },
            {
                field: "OWNER_NAME",
                displayName: '失效时间',
            },
            {
                field: "OWNER_NAME",
                displayName: '当前状态',
            },
            {
                field: "OWNER_NAME",
                displayName: '操作',
            }
        ]
        vm.fahuo_params = {
            bean: 'wmsOutbound',
            method: 'page',
            page: 1,
            rows: 10
        }
        vm.getFahuoPage = function () {

            // commonUtil.getList(vm.outbound_params).success(function (data) {
            //
            //     if (data.additionalMsg.status == '00') {
            //         vm.data = data;
            //     } else  {
            //         msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            //     }
            // });

        };


        //返回按钮
        vm.returnButton = function () {
            window.history.back(-1);
        }

        /**************************************************************************************************************************************************/
        /**************************************************************************************************************************************************/


    }]);