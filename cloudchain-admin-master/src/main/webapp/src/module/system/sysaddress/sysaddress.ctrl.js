angular.module('MetronicApp').controller('sysaddressCtrl', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','suppServer','$stateParams','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, suppServer,$stateParams,commonUtil,Table) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    // var userid = $stateParams.Id;
    var userid ="A";
     var emailreg = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/;
    var mobilereg = /^((13[0-9])|(15[0-9])|(18[0-9])|(14[0-9])|(17[0-9]))\d{8}$/;
    var postreg = /^[0-9]{6}$/;
    /**************************************************地址库管理***********************************************************************************************/
    vm.addrType1="";
    vm.column_addr = [
        {
            field: 'addressId',
            displayName: '编号',
        },
        {
            field: "contactName",
            displayName: '联系人',
        },
        {
            field: "mobile",
            displayName: '联系电话',

        },
        {
            name: "所在区域",
            cellTemplate:'<div style="padding:5px">{{row.entity.provinceName+"/"+row.entity.cityName+"/"+row.entity.countyName}}</div>',
            width: '150',
        },
        {
            field: "address",
            displayName: '街道地址',
        },
        {
            field: "postcode",
            displayName: '邮编',
        }, {
            name: "地址类型",
            displayName: '地址类型',
            cellTemplate:'<div style="padding:5px" ng-model="sysaddress.addrType1[row.entity.index]">{{grid.appScope.$parent.sysaddress.addrType1[row.entity.index]}}</div>',
            width: '300',
        },
        {
            name: "qty",
            displayName: '操作',

            // cellTemplate:'<button class ="btn warning" ng-click="grid.appScope.$parent.sysaddress.removeAddress(row.entity.addressId)" ">删除</button>'
             // +'<button class ="btn green"  ui-sref="supplier.look({Id:row.entity.userId})" >查看</button>' +
            // '<button class ="btn yellow" ui-sref="goods.supplier({Id:row.entity.spuId})">绑定供应商</button>'

        }]
    vm.addr_params = {
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
                var strs= new Array(); //定义一数组
                for(var i =0;i < data.rows.length;i++) {
                    data.rows[i].index = i;
                }
                for(var i =0;i < data.rows.length;i++){
                    vm.addrType1[i] = "";
                    strs=  data.rows[i].addrType.split(","); //字符分割
                    for (var j=0;j<strs.length ;j++ )
                    {
                        if(strs[j]=="111"){ //收货地址
                            vm.addrType1[i] =vm.addrType1[i]+"收货地址/";
                        } else if (strs[j]=="112"){ //发货地址
                            vm.addrType1[i]=vm.addrType1[i]+"发货地址/";
                        }else if (strs[j]=="120"){//退货地址
                            vm.addrType1[i] =vm.addrType1[i]+"退货地址/";
                        }else if (strs[j]=="130"){//自提地址
                            vm.addrType1[i] =vm.addrType1[i]+"自提地址";
                        }
                    }
                    if (  vm.addrType1[i].charAt( vm.addrType1[i].length-1)== "/") {
                        vm.addrType1[i]= vm.addrType1[i].substring(0, vm.addrType1[i].length-1);
                    }
                }

                vm.addr_data = data;
            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });

    };
    vm.getAddrPage();
    //地址库弹窗
    vm.addAddress =function () {
        $("#id_contacts").val("");
        $("#id_phone").val("");
        $("#id_streetAddr").val("");
        $("#id_postcode").val("");
        $("#checkbox14").prop("checked", true);
        $("#checkbox15").prop("checked", true);
        $("#checkbox16").prop("checked", false);
        $("#checkbox17").prop("checked", false);
        $('#addAddress').modal('show');
    }
    vm.removeAddress = function () {
        if(vm.addrEntity.getSelectedRows().length == 0){
            msgAlert.info('请先选择要修改的地址单');
            return false;
        }else if(vm.addrEntity.getSelectedRows().length > 1){
            msgAlert.info('每次只能选择一条地址单');
            return false;
        }else{
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
    vm.btaddAddress= function () {
        vm.addrTypes = "";
        if( $("#id_contacts").val()==undefined|| $("#id_contacts").val()==""){
            msgAlert.text('请输入联系人');
            return ;
        }

        if( $("#id_phone").val()!=undefined|| $("#id_phone").val()!=""){
            if ($("#id_phone").val().match(mobilereg) == null) {
                msgAlert.text('请输入正确格式的手机号码');
                return;
            }
        }else {
            msgAlert.text('手机号码不能为空');
            return;
        }
        if ($("#id_streetAddr").val() == undefined ||$("#id_streetAddr").val()==""){
            msgAlert.text('请输入所在街道');
            return ;
        }
        if( $("#id_postcode").val()!=undefined&& $("#id_postcode").val()!=""){
            if ($("#id_postcode").val().match(postreg) == null) {
                msgAlert.text('请输入正确的邮政编码格式');
                return;
            }
        }
        // 收件地址111 发件地址112 退货地址120 自提地址130
        if($('#checkbox14').is(':checked')) {
            vm.addrTypes = vm.addrTypes+"111,";
        }
        if($('#checkbox15').is(':checked')) {
            vm.addrTypes = vm.addrTypes+"112,";
        }
        if($('#checkbox16').is(':checked')) {
            vm.addrTypes = vm.addrTypes+"120,";
        }
        if($('#checkbox17').is(':checked')) {
            vm.addrTypes = vm.addrTypes+"130";
        }
        if( vm.addrTypes=="") {
            msgAlert.text('请至少勾选一种地址类型');
            return ;
        }
        vm.addrParams ={
            contactName :$("#id_contacts").val(),
            mobile : $("#id_phone").val(),
            province :$('.provideAddress').find('.selectPro :selected').val().substr(7),
            provinceName : $('.provideAddress').find('.selectPro :selected').html(),
            city :$('.provideAddress').find('.selectCity :selected').val().substr(7),
            cityName:$('.provideAddress').find('.selectCity :selected').html(),
            county :$('.provideAddress').find('.selectArea :selected').val().substr(7),
            countyName : $('.provideAddress').find('.selectArea :selected').html(),
            address :$("#id_streetAddr").val(),
            postcode :$("#id_postcode").val(),
            addrTypes:vm.addrTypes,
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
    vm.citySwitch  =0;
    vm.updateAddress = function () {
        if(vm.addrEntity.getSelectedRows().length == 0){
            msgAlert.info('请先选择要修改的地址单');
            return false;
        }else if(vm.addrEntity.getSelectedRows().length > 1){
            msgAlert.info('每次只能选择一条地址单');
            return false;
        }else{
            $("#update_checkbox14").prop("checked", false);
            $("#update_checkbox15").prop("checked", false);
            $("#update_checkbox16").prop("checked", false);
            $("#update_checkbox17").prop("checked", false);
            $("#id_update_contacts").val( vm.addrEntity.getSelectedRows()[0].contactName);
            $("#id_update_phone").val( vm.addrEntity.getSelectedRows()[0].mobile);
            $("#id_area").val( vm.addrEntity.getSelectedRows()[0].provinceName+"/"+ vm.addrEntity.getSelectedRows()[0].cityName+"/"+ vm.addrEntity.getSelectedRows()[0].countyName);
            $("#id_update_streetAddr").val( vm.addrEntity.getSelectedRows()[0].address);
            $("#id_update_postcode").val( vm.addrEntity.getSelectedRows()[0].postcode);
            var strs= new Array(); //定义一数组
            strs= vm.addrEntity.getSelectedRows()[0].addrType.split(","); //字符分割
            for (i=0;i<strs.length ;i++ )
            {
                if(strs[i]=="111"){ //收货地址
                    $("#update_checkbox14").prop("checked", true);
                } else if (strs[i]=="112"){ //发货地址
                    $("#update_checkbox15").prop("checked", true);
                }else if (strs[i]=="120"){//退货地址
                    $("#update_checkbox16").prop("checked", true);
                }else if (strs[i]=="130"){//自提地址
                    $("#update_checkbox17").prop("checked", true);
                }
            }
            $('#updateAddress').modal('show');
        }
    }
    vm.addrTypes2="";
    vm.btupdateAddress =function () {
        vm.addrTypes2="";
        if( $("#id_update_contacts").val()==undefined|| $("#id_update_contacts").val()==""){
            msgAlert.text('请输入联系人');
            return ;
        }
        if( $("#id_update_phone").val()!=undefined|| $("#id_update_phone").val()!=""){
            if ($("#id_update_phone").val().match(mobilereg) == null) {
                msgAlert.text('请输入正确格式的手机号码');
                return;
            }
        }else {
            msgAlert.text('手机号码不能为空');
            return;
        }
        if ($("#id_update_streetAddr").val() == undefined ||$("#id_update_streetAddr").val()==""){
            msgAlert.text('请输入所在街道');
            return ;
        }
        if( $("#id_update_postcode").val()!=undefined&& $("#id_update_postcode").val()!=""){
            if ($("#id_update_postcode").val().match(postreg) == null) {
                msgAlert.text('请输入正确的邮政编码格式');
                return;
            }
        }
        // 收件地址111 发件地址112 退货地址120 自提地址130
        if($('#update_checkbox14').is(':checked')) {
            vm.addrTypes2 = vm.addrTypes2+"111,";
        }
        if($('#update_checkbox15').is(':checked')) {
            vm.addrTypes2 = vm.addrTypes2+"112,";
        }
        if($('#update_checkbox16').is(':checked')) {
            vm.addrTypes2 = vm.addrTypes2+"120,";
        }
        if($('#update_checkbox17').is(':checked')) {
            vm.addrTypes2 = vm.addrTypes2+"130,";
        }
        if (  vm.addrTypes2.charAt( vm.addrTypes2.length-1)== ",") {
            vm.addrTypes2= vm.addrTypes2.substring(0, vm.addrTypes2.length-1);
        }
        if( vm.addrTypes2=="") {
            msgAlert.text('请至少勾选一种地址类型');
            return ;
        }
        if(vm.citySwitch==1){
            vm.province =$('.provideAddress2').find('.selectPro :selected').val().substr(7);
            vm.provinceName =$('.provideAddress2').find('.selectPro :selected').html();
            vm.city =$('.provideAddress2').find('.selectCity :selected').val().substr(7);
            vm.cityName=$('.provideAddress2').find('.selectCity :selected').html();
            vm.county=$('.provideAddress2').find('.selectArea :selected').val().substr(7);
            vm.countyName = $('.provideAddress2').find('.selectArea :selected').html();
        }else {
            vm.province = null;
            vm.provinceName = null;
            vm.city = null;
            vm.cityName= null;
            vm.county= null;
            vm.countyName = null;
        }
        vm.addrParams ={
            contactName :$("#id_update_contacts").val(),
            mobile : $("#id_update_phone").val(),
            province :  vm.province ,
            provinceName : vm.provinceName,
            city : vm.city,
            cityName:vm.cityName,
            county :vm.county,
            countyName :vm.countyName,
            address :$("#id_update_streetAddr").val(),
            postcode :$("#id_update_postcode").val(),
            addrTypes:vm.addrTypes2,
            addressId:vm.addrEntity.getSelectedRows()[0].addressId,
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
    //返回按钮
    vm.returnButton = function () {
        window.history.back(-1);
    }
}]);

