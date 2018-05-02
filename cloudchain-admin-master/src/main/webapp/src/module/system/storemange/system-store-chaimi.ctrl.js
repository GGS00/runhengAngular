/**
 * Created by wangqing on 2017/4/28.
 */
angular.module('MetronicApp').controller('wareHouseMangeController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','User','BillManage','commonUtil','Table','citySelect','multicitySelect', function($rootScope, $scope, $http, uiGridConstants,settings, User,BillManage,commonUtil,Table,citySelect,multicitySelect) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
   vm.end_time_switch = 0;  //修改页面的合作开始时间控件显示标志
   vm.add_end_time_switch = 1; //添加页面的合作开始时间控件显示标志
    vm.qryRole = $('#qry_cooperRole').val();
    vm.pageParams = {
        bean:'umsCooper',
        method:'page',
        qryType:'T',
        qryRole:vm.qryRole,
        page:1,
        rows:10
    }
    vm.column = [
        {   field: "id",
            displayName: 'ID',
            visible: false,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
        },
        {   field: "taker_acc",
            displayName: '账号',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {   field: "nick_name",
            displayName: '服务商名称',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {   field: "taker_nicknm",
            displayName: '昵称',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "mobile",
            displayName: '手机',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "email",
            displayName: '邮箱',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {   field: "cooper_type",
            displayName: '服务商类型',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.cooper_type=="01"?"承储人":(row.entity.cooper_type=="02"?"承运人":row.entity.cooper_type)}}</div>'
        },
        {
            field: "status",
            displayName: '状态',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.status=="01"?"有效":(row.entity.status=="02"?"无效":row.entity.status)}}</div>'
        },
        {
            name:'操作',
            width: '10%',
            visible: (vm.qryRole == '4'),
            cellTemplate:'<button class ="btn yellow" ng-click="grid.appScope.$parent.qryCooperWareHouse(row.entity)">查看</button>'
        }
    ]
    vm.getPage = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params: vm.pageParams
        }).success(function (data) {
            vm.data = data;
        })
    };
    //vm.getPage();

    /******************************************************************获取仓库表*********************************************************************************/
    vm.warehouseColumn = [{
        field: "ID",
        displayName: '编号',
        width: 100,
        visible: false,
        enableColumnMenu: false,// 是否显示列头部菜单按钮
    }, {
            field: 'CODE',
            displayName: '仓库编码',
            width: 100,
        },
        {
            field: "NAME",
            displayName: '仓库名称',
            width: 100,
        },
        {
            name: "仓库地址",
            cellTemplate:'<div style="padding:5px" ng-model="wareHouseMange.Address[row.entity.index]">{{grid.appScope.$parent.wareHouseMange.Address[row.entity.index]}}</div>',
            width: 250,
        },
        {
            field: "ADDRESS",
            displayName: '详细地址',
            width: 250,

        },
        {
            name: "使用范围",
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            width: 150,
            cellTemplate:'<div style="padding:5px" ng-model="wareHouseMange.usageMode[row.entity.index]">{{grid.appScope.$parent.wareHouseMange.usageMode[row.entity.index]}}</div>',

        },
        {
            name: "保管条件",
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            width:200,
            cellTemplate:'<div style="padding:5px" ng-model="wareHouseMange.storeMent[row.entity.index]">{{grid.appScope.$parent.wareHouseMange.storeMent[row.entity.index]}}</div>',

        },
        {

            name: '仓库用途',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            width: 200,
            cellTemplate:'<div style="padding:5px" ng-model="wareHouseMange.useIntent[row.entity.index]">{{grid.appScope.$parent.wareHouseMange.useIntent[row.entity.index]}}</div>',

        },
        {

            name: '存放物品',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            width: 120,
            cellTemplate:'<div style="padding:5px" ng-model="wareHouseMange.goodsFlg[row.entity.index]">{{grid.appScope.$parent.wareHouseMange.goodsFlg[row.entity.index]}}</div>',

        },
        {
            field: "CONTROLLER",
            displayName: '管理员',
            width: 140,
        },
        {
            field: "TEL",
            displayName: '联系电话',
            width: 140,

        },
        {
            name: "当前状态",
            width: 100,
            cellTemplate: '<div style="padding:5px">{{row.entity.STATUS=="ACTIVE"?"有效":"无效"}}</div>'
        }
    ]

    vm.warehouseParams = {
            bean: 'wmsWarehouse',
        method: 'page',
        page: 1,
        rows: 10
    }
    vm.getPageByFilter11 =function () {

        if ($('.warehouseaddr').find('.selectPro :selected').val() != '') {
            if ($('.warehouseaddr' ).find('.selectCity :selected').val() != '') {
                if ($('.warehouseaddr').find('.selectArea :selected').val() != '') {
                    vm.PROVINCE_ID = $('.warehouseaddr').find('.selectPro :selected').val();
                    vm.CITY_ID =  $('.warehouseaddr').find('.selectCity :selected').val();
                    vm.DISTRICT_ID = $('.warehouseaddr' ).find('.selectArea :selected').val();
                } else {
                    vm.PROVINCE_ID = $('.warehouseaddr').find('.selectPro :selected').val();
                    vm.CITY_ID =  $('.warehouseaddr').find('.selectCity :selected').val();
                    vm.DISTRICT_ID = "";
                }
            } else {
                vm.PROVINCE_ID = $('.warehouseaddr').find('.selectPro :selected').val();
                vm.CITY_ID = "";
                vm.DISTRICT_ID = "";
            }
        } else {
            vm.PROVINCE_ID ="";
            vm.CITY_ID = "";
            vm.DISTRICT_ID = "";
        }


        vm.warehouseParams = {
            bean: 'wmsWarehouse',
            method: 'page',
            page: 1,
            rows: 10,
            name:$.trim($("#id_wareNmae").val()),
            useIntent:$.trim($("#id_useIntent").val()),
            status:$.trim($("#id_status2").val()),
            provinceId:  vm.PROVINCE_ID,
            cityId:  vm.CITY_ID ,
            districtId:   vm.DISTRICT_ID
        }
        vm.getWarehousePage();

    }

    vm.getWarehousePage = function () {

        commonUtil.getList(vm.warehouseParams).success(function (data) {

            if (data.additionalMsg.status == '00') {
                for(var i =0;i < data.rows.length;i++) {
                    data.rows[i].index = i;
                }
                vm.Address = new Array();
                for(var i =0;i < data.rows.length;i++){
                    if(  data.rows[i].PROVINCE_NAME!=null||  data.rows[i].PROVINCE_NAME!=undefined|| data.rows[i].CITY_NAME!=null||  data.rows[i].CITY_NAME!=undefined|| data.rows[i].DISTRICT_NAME!=null||  data.rows[i].DISTRICT_NAME!=undefined){
                        vm.Address[i] =  data.rows[i].PROVINCE_NAME+"/"+ data.rows[i].CITY_NAME+"/"+ data.rows[i].DISTRICT_NAME;
                    }else {
                        vm.Address[i] = "";
                    }
                }
                /***********************************************使用范围******************************************************/
                vm.usageMode = new Array();
                var strs= new Array(); //定义一数组
                for(var i =0;i < data.rows.length;i++){
                    vm.usageMode[i] = "";
                    strs=  data.rows[i].usage_mode.split(","); //字符分割
                    for (var j=0;j<strs.length ;j++ )
                    {
                        if(strs[j]=="01"){ //收货地址
                            vm.usageMode[i] =vm.usageMode[i]+"营业/";
                        } else if (strs[j]=="02"){ //发货地址
                            vm.usageMode[i]=vm.usageMode[i]+"自用/";
                        }
                    }
                    if (  vm.usageMode[i].charAt( vm.usageMode[i].length-1)== "/") {
                        vm.usageMode[i]= vm.usageMode[i].substring(0, vm.usageMode[i].length-1);
                    }
                }
                /***********************************************保管条件******************************************************/
                vm.storeMent = new Array();
                var strs= new Array(); //定义一数组
                for(var i =0;i < data.rows.length;i++){
                    vm.storeMent[i] = "";
                    strs=  data.rows[i].store_ment.split(","); //字符分割
                    for (var j=0;j<strs.length ;j++ )
                    {
                        if(strs[j]=="01"){ //收货地址
                            vm.storeMent[i] =vm.storeMent[i]+"普通/";
                        } else if (strs[j]=="02"){ //发货地址
                            vm.storeMent[i]=vm.storeMent[i]+"冷藏/";
                        }else if (strs[j]=="03"){ //发货地址
                            vm.storeMent[i]=vm.storeMent[i]+"恒温/";
                        }else if (strs[j]=="04"){ //发货地址
                            vm.storeMent[i]=vm.storeMent[i]+"特种/";
                        }else if (strs[j]=="05"){ //发货地址
                            vm.storeMent[i]=vm.storeMent[i]+"气调/";
                        }
                    }
                    if (  vm.storeMent[i].charAt( vm.storeMent[i].length-1)== "/") {
                        vm.storeMent[i]= vm.storeMent[i].substring(0, vm.storeMent[i].length-1);
                    }
                }
                /***********************************************仓库用途******************************************************/
                vm.useIntent = new Array();
                var strs= new Array(); //定义一数组
                for(var i =0;i < data.rows.length;i++){
                    vm.useIntent[i] = "";
                    strs=  data.rows[i].use_intent.split(","); //字符分割
                    for (var j=0;j<strs.length ;j++ )
                    {
                        if(strs[j]=="01"){ //收货地址
                            vm.useIntent[i] =vm.useIntent[i]+"发货/";
                        } else if (strs[j]=="02"){ //发货地址
                            vm.useIntent[i]=vm.useIntent[i]+"备货/";
                        }else if (strs[j]=="03"){ //发货地址
                            vm.useIntent[i]=vm.useIntent[i]+"融资监管/";
                        }
                    }
                    if (  vm.useIntent[i].charAt( vm.useIntent[i].length-1)== "/") {
                        vm.useIntent[i]= vm.useIntent[i].substring(0, vm.useIntent[i].length-1);
                    }
                }
                /***********************************************存放物品******************************************************/
                vm.goodsFlg = new Array();
                var strs= new Array(); //定义一数组
                for(var i =0;i < data.rows.length;i++){
                    vm.goodsFlg[i] = "";
                    strs=  data.rows[i].goods_flg.split(","); //字符分割
                    for (var j=0;j<strs.length ;j++ )
                    {
                        if(strs[j]=="1"){ //收货地址
                            vm.goodsFlg[i] =vm.goodsFlg[i]+"全部分类/";
                        } else if (strs[j]=="0"){ //发货地址
                            vm.goodsFlg[i]=vm.goodsFlg[i]+"部分分类/";
                        }
                    }
                    if (  vm.goodsFlg[i].charAt( vm.goodsFlg[i].length-1)== "/") {
                        vm.goodsFlg[i]= vm.goodsFlg[i].substring(0, vm.goodsFlg[i].length-1);
                    }
                }

                vm.warehouseData = data;
            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });
    };
    vm.getWarehousePage();

    //tab页选择控制器
    vm.showTabs = function(index){
        switch (index)
        {
            case 0:
                $('#myTab a[href="#tab_simple"]').tab('show');
                vm.getWarehousePage();
                break;
            case 1:
                $('#myTab a[href="#tab_chaimi"]').tab('show');
                vm.getPage();
                break;
        }

    }

    //添加
    vm.addCooper = function () {
        $.fn.modal.Constructor.prototype.enforceFocus = function () {}
        $('#add_model').modal('show');
        vm.clearForm();
        $('#add_cooperScope_all').attr("checked",true);
        $('#add_cooperScope_part').removeAttr('checked');
        $('#submitAddCooper').attr("disabled", true);
    }
    vm.userid="";
    //监听对方账号的输入
    $('#add_cooperUserNm').change(function(){
        $('#add_cooperNicknm').val('');
        $('#add_cooperPhone').val('');
        $('#add_cooperEmail').val('');
        //查询A用户信息
        User.getUserByName($('#add_cooperUserNm').val()).success(function(data) {
            if(data.status == '00'){
                //验证用户是否开通  对应的功能
                vm.userid =data.obj.userId;
                vm.funcParams = {
                    userId:  vm.userid,
                    funcId:$('#qry_function').val()
                }
                User.getUserFuncById(vm).success(function(data_func){
                    if(data_func.status == '00'){
                        $('#add_cooperUserId').val(data.obj.userId);
                        $('#add_cooperNicknm').val(data.obj.nickName);
                        $('#add_cooperPhone').val(data.obj.mobile);
                        $('#add_cooperEmail').val(data.obj.email);
                        $('#submitAddCooper').removeAttr("disabled");
                    }else {
                        $('#submitAddCooper').attr("disabled", true);
                        msgAlert.text('系统处理错误 >﹏< ['+ data_func.msg+']');
                        return false;
                    }
                });
            }else if(data.status == '2001001'){
                $('#submitAddCooper').attr("disabled", true);
                msgAlert.info('用户'+$('#add_cooperUserNm').val()+'不存在');
                vm.userid ="";
                return false;
            }else{
                vm.userid ="";
                $('#submitAddCooper').attr("disabled", true);
                msgAlert.text('系统处理错误 >﹏< ['+ data.msg+']');
                return false;
            }
        });
    });
     vm.selectWarehouseFlag =false;
    //监听仓库单选按钮事件
    vm.warehouseLinsener = function (index) {

        if(index== 1){
            vm.selectWarehouseFlag =false;
        }else{
            vm.selectWarehouseFlag =true;
            if(  vm.userid==""){
                msgAlert.info('请先输入对方账号');
                return false;
            }
            vm.warehouseList =[];
            vm.warehouseParams= {
                bean: 'wmsWarehouse',
                method: 'page',
                page: 1,
                rows: 10,
                qryUserId: vm.userid

            }
            vm.getWarehousePage();
        }
    }

    vm.removeWarehouse = function (code) {
        for (var j = 0; j < vm.warehouseList.length; j++) {
            if (code == vm.warehouseList[j].code) {
                vm.warehouseList.splice(j, 1);
            }
        }
    }

    //仓库选中确认
    vm.selectWarehouseSure  = function () {
        if (vm.warehouseEntity2.getSelectedRows().length == 0) {
            msgAlert.info('请先选择至少一条仓库');
            return false;
        } else {
            for (var i = 0; i < vm.warehouseEntity2.getSelectedRows().length; i++) {
                var flag = true;
                for (var j = 0; j < vm.warehouseList.length; j++) {
                    if (vm.warehouseEntity2.getSelectedRows()[i].CODE == vm.warehouseList[j].code) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    vm.warehouseList.push(
                        {   id:vm.warehouseEntity2.getSelectedRows()[i].ID,
                            code:vm.warehouseEntity2.getSelectedRows()[i].CODE,
                            name: vm.warehouseEntity2.getSelectedRows()[i].NAME,
                        }
                    );
                }
            }
            $('#lar11ge').modal('hide');
        }
    }
    //选择部分仓库
    vm.selectWarehouse = function () {
        $('#lar11ge').modal('show');
    }

    //监听添加页面永久有效事件
    vm.addCheckFlg = function(){
        if($('#add_check_flg').is(':checked')){
            $('#add_foreverFlg').val(1);
            vm.add_end_time_switch = 0;
        }else {
            $('#add_foreverFlg').val(0);
            vm.add_end_time_switch = 1;
        }
    }

    //监听修改页面永久有效事件
    vm.updCheckFlg = function(){
        if($('#upd_check_flg').is(':checked')){
            $('#upd_foreverFlg').val(1);
            vm.upd_end_time_switch = 0;
        }else {
            $('#upd_foreverFlg').val(0);
            vm.upd_end_time_switch = 1;
        }
    }

    //提交合作商信息
    vm.submitAddCooper = function(){
        if( vm.selectWarehouseFlag ){
             var string ="";
            for (var j = 0; j < vm.warehouseList.length; j++) {
                string  += vm.warehouseList[j].id+",";
            }
            if (  string.charAt( string.length-1)== ",") {
                string= string.substring(0, string.length-1);
            }
            $('#idcooperScope').val(string);
        }else {
            $('#idcooperScope').val("");
        }

        if($('#add_cooperUserNm').val() == null || $('#add_cooperUserNm').val()  == ''){
            msgAlert.info('请输入对方账号信息');
            return false;
        }
        //合作时间赋值
        if($('.addStartTime span').html() >= $('.addEndTime span').html()){
            msgAlert.info('结束时间不能早于或等于开始时间...');
            return false;
        }

        $('#add_startTime').val($('.addStartTime span').html());
        $('#add_endTime').val($('.addEndTime span').html());
        vm.form = $('#UmsCooperInfo').serialize();
        vm.form = decodeURIComponent(vm.form,true);
        User.addCooper(vm).success(function(data) {
            if(data.status == 00){
                msgAlert.info('添加成功');
                $('#add_model').modal('hide');
                vm.getPage();
            }else{
                msgAlert.text(data.msg);
            }
        });
    }

    //清除model中表单信息
    vm.clearForm = function(){
        $('#add_cooperUserId').val('');
        $('#add_cooperUserNm').val('');
        $('#add_cooperNicknm').val('');
        $('#add_cooperPhone').val('');
        $('#add_cooperEmail').val('');
    }

    //修改
    vm.updCooper = function () {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择要修改的记录');
            return false;
        }else if(vm.entity.getSelectedRows().length != 1){
            msgAlert.info('每次只能修改一条记录');
            return false;
        }else{
            $.fn.modal.Constructor.prototype.enforceFocus = function () {}
            $('#upd_cooper_model').modal('show');
            //$('#submitUpdCooper').attr("disabled", true);
            //判断服务商类型
            if(vm.qryRole == '4'){
                $('#upd_cooperRole').val('承储人');
                $('#updCooperRole').val('4');
            }else {
                //设置物流费用结算周期
                $('#upd_settlFeePrd').val(vm.entity.getSelectedRows()[0].settl_fee_prd);

                $('#upd_cooperRole').val('承运人');
                $('#updCooperRole').val('3');
            }

            $('#upd_acc_name').val(vm.entity.getSelectedRows()[0].taker_acc);
            $('#upd_nick_name').val(vm.entity.getSelectedRows()[0].taker_nicknm);
            $('#upd_phone').val(vm.entity.getSelectedRows()[0].mobile);
            $('#upd_email').val(vm.entity.getSelectedRows()[0].email);
            $('#upd_foreverFlg').val(vm.entity.getSelectedRows()[0].forever_flg);

            //时间
            if(vm.entity.getSelectedRows()[0].start_time != null){
                $('#upd_startTime').val(vm.entity.getSelectedRows()[0].start_time);
            }

            if(vm.entity.getSelectedRows()[0].end_time != null){
                vm.testTime = vm.entity.getSelectedRows()[0].end_time;
                vm.upd_end_time_switch = 1;
            }

            //判断永久有效标志是否选中
            if(vm.entity.getSelectedRows()[0].forever_flg == '1'){
                $('#upd_check_flg').attr("checked", true);
            }
        }

    }
    $('#upd_nick_name').change(function(){
        $('#submitUpdCooper').removeAttr("disabled");
    });
    //提交修改信息
    vm.submitUpdCooper = function(){
        if($('#upd_startTime').val() >= $('.updEndTime span').html()){
            msgAlert.info('结束时间不能早于或等于开始时间...');
            return false;
        }
        if($('#upd_nick_name').val() == vm.entity.getSelectedRows()[0].taker_nicknm &&
            $('.updEndTime span').html() == vm.entity.getSelectedRows()[0].end_time){
            msgAlert.info('货主信息没有变动,无需提交修改');
            return false;
        }
        vm.cooperId = vm.entity.getSelectedRows()[0].id;
        vm.updParams = {
            cooperRole:$('#updCooperRole').val(),
            cooperNicknm:$('#upd_nick_name').val(),
            endTime:$('.updEndTime span').html(),
            foreverFlg:$('#upd_foreverFlg').val()
        }
        User.updCooper(vm).success(function(data) {
            if(data.status == 00){
                msgAlert.info('修改成功');
                $('#upd_cooper_model').modal('hide');
                vm.getPage();
            }else{
                msgAlert.text(data.msg);
            }
        });
    }


    //删除
    vm.delCooper = function () {
        vm.selectListDelete = [];
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择要删除的记录');
            return false;
        }
        else{
            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.selectListDelete.push(vm.entity.getSelectedRows()[i].id);
            }
            User.delCooper(vm).success(function(data) {
                if(data.status == '00'){
                    msgAlert.info('删除成功');
                    vm.getPage();
                    vm.entity.clearSelectedRows();
                    $scope.warehouseLst = null;
                }else if(data.status=='01'){
                    msgAlert.text('系统处理错误 >﹏< ['+ data.msg+']');
                    vm.entity.clearSelectedRows();
                }
            });
        }
    }

    //搜索
    vm.getPageByFilter = function(){
        var qryName = $('#qryName').val();
        if(qryName == " "){
            qryName ="";
        }
        var qryNick = $('#qryNick').val();
        if(qryNick == " "){
            qryNick ="";
        }
        var qryTel = $('#qryTel').val();
        if(qryTel == " "){
            qryTel ="";
        }
        var qryMail = $('#qryMail').val();
        if(qryMail == " "){
            qryMail ="";
        }
        var status = $('#id_status').val();
        if(status == " "){
            status ="";
        }
        vm.pageParams = {
            bean:'umsCooper',
            method:'page',
            qryType:'T',
            qryRole:vm.qryRole,
            qryName:qryName,
            qryNick:qryNick,
            qryTel:qryTel,
            qryMail:qryMail,
            status:status,
            page:1,
            rows:10
        }
        vm.getPage();
    }

    //查看按钮操作
    $scope.qryCooperWareHouse = function(row){
        //判断合作商类型
        if(vm.qryRole == '4'){
            //查询用户仓库信息
            vm.qryWareHouseByUserId = row.taker_id;
            vm.qryScope = row.cooper_scope;
            vm.wareHouseParam = {
                userId:vm.qryWareHouseByUserId,
                qryScope:vm.qryScope
            }
            BillManage.getWareHosuseByUserId(vm).success(function (resp) {
                if (resp.status == '00') {
                    $scope.warehouseLst = resp.data;
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + resp.msg + ']');
                }
            })
        }
    }

    /*********** **************************************************自建仓库页js************************************************************************************/
    /*********** **************************************************获取员工信息************************************************************************************/
    vm.employColumn = [
        {
            field: 'empId',
            displayName: '员工ID',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        },
        {
            field: "realName",
            displayName: '员工名称',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }
    ]
    vm.placeholder_employName = '请输入员工';
    vm.icon_employ = 'plus';
    vm.employParams = {
        bean: 'umsEmployee',
        method: 'pageGetEmployees',
        page: 1,
        rows: 10
    }
    vm.employPage = function () {
        commonUtil.getList(vm.employParams).success(function (data) {
            if (data.additionalMsg.status == '00') {
                vm.employData = data;
            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });
    }

    /**
     * 新建仓库
     * @returns {boolean}
     */
    vm.newWarehouse = function () {
        // $('#newWarehouse').modal('show');
        window.location.href = "#/sys/addwarehouse";
        vm.employPage();
    }

    vm.updataWarehouse = function () {
        if (vm.warehouseEntity.getSelectedRows().length == 0) {
            msgAlert.text('请先选择一条要修改的单子');
            return false;
        }
        if (vm.warehouseEntity.getSelectedRows().length > 1) {
            msgAlert.text('只能选择一条单子');
            return false;
        }
        window.location.href="#/sys/updatewarehouse/"+vm.warehouseEntity.getSelectedRows()[0].ID;
    }


    vm.sendSwitch = 0;

    vm.sendAddressList = [{id:''}];

    vm.addNewSend = function(){
        vm.sendAddressList.push({id:''});
    };

    vm.removeSend = function(index){
        vm.sendAddressList.splice(index,1);
    };


    vm.add = function () {
        if ($.trim($('#id_wareName').val()) == "") {
            msgAlert.text('请输入仓库名称');
            return false;
        }
        if ($.trim($('#id_model').val()) == "") {
            msgAlert.text('请选择仓库模式');
            return false;
        }
        if ($.trim($('#id_type').val()) == "") {
            msgAlert.text('请选择仓库类型');
            return false;
        }
        if ($.trim($('#id_wareAddr').val()) == "") {
            msgAlert.text('请输入仓库详细地址');
            return false;
        }
        if (vm.employEntity.getSelectedRows()[0].empId == "") {
            msgAlert.text('请输入员工信息');
            return false;
        }else {
            $('#id_controller').val(vm.employEntity.getSelectedRows()[0].realName);
        }
        if ($.trim($('#id_tel').val()) == "") {
            msgAlert.text('请输入负责人手机号码');
            return false;
        }
        var mobilereg =/^((13[0-9])|(15[0-9])|(18[0-9])|(14[0-9])|(17[0-9]))\d{8}$/;
        if($.trim($('#id_tel').val()).match(mobilereg) == null){
            msgAlert.text('请输入正确格式的手机号码');
            return false;
        }
        vm.CODE = $('#id_wareId').val();//仓库编码
        vm.NAME = $('#id_wareName').val();//仓库名
        vm.MODEL = $('#id_model').val();//仓库模式
        vm.TYPE = $('#id_type').val(); //仓库类型
        vm.DESCRIPTION = $('#id_wareDescript').val();//描述
        vm.ADDRESS = $('#id_wareAddr').val();//地址

        vm.PROVINCE_NAME = $('.warehouseAddress').find('.selectPro :selected').html();
        vm.CITY_NAME = $('.warehouseAddress').find('.selectCity :selected').html();
        vm.DISTRICT_NAME = $('.warehouseAddress').find('.selectArea :selected').html();

        vm.PROVINCE_ID = citySelect.getSelect().proId;//省id
        vm.CITY_ID = citySelect.getSelect().cityId;//市id
        vm.DISTRICT_ID = citySelect.getSelect().areaId;//区id

        var addressList= [];
        for (var i = 0; i < vm.sendAddressList.length; i++) {
            if($('.sendAddress_'+i).find('.selectCity :selected').val()!=''){
                if($('.sendAddress_'+i).find('.selectArea :selected').val()!=''){
                    addressList[i] ={
                        province:$('.sendAddress_'+i).find('.selectPro :selected').val().substr(7),
                        city:$('.sendAddress_'+i).find('.selectCity :selected').val(),
                        district:  $('.sendAddress_'+i).find('.selectArea :selected').val()
                    }
                }else{
                    addressList[i] ={
                        province:$('.sendAddress_'+i).find('.selectPro :selected').val().substr(7),
                        city:$('.sendAddress_'+i).find('.selectCity :selected').val(),
                        district:'all'
                    }
                }
            }else{
                addressList[i] ={
                    province:$('.sendAddress_'+i).find('.selectPro :selected').val().substr(7),
                    city:'all',
                    district:'all'
                }
            }
        }
        vm.sendlist =  angular.toJson(addressList);

        vm.addParam = {
            code: vm.CODE,
            name: vm.NAME,
            model: vm.MODEL,
            type: vm.TYPE,
            description: vm.DESCRIPTION,
            address: vm.ADDRESS,
            provinceName: vm.PROVINCE_NAME,
            cityName: vm.CITY_NAME,
            districtName: vm.DISTRICT_NAME,
            provinceId: vm.PROVINCE_ID,
            cityId: vm.CITY_ID,
            districtId: vm.DISTRICT_ID,
            tel: $('#id_tel').val(),
            shipAreas: vm.sendlist,
            controller: $('#id_controller').val(),
        }
        BillManage.WarehouseAdd(vm).success(function (data) {
            if (data.additionalMsg.status == '00') {
                msgAlert.info('添加成功');
                //hidden.bs.modal当模态框完全对用户隐藏时触发
                $('#newWarehouse').modal('hide');
                vm.getWarehousePage();
            } else {
                msgAlert.text(' >﹏< [' + data.additionalMsg.message + ']');
            }
        })
    }

    vm.update = function () {
        vm.updateParam = {
            id:vm.warehouseEntity.getSelectedRows()[0].ID,
            description: $('#id_updateDescript').val(),
        }
        BillManage.WarehouseUpdate(vm).success(function (data) {
            if (data.additionalMsg.status == '00') {
                msgAlert.text('修改成功');
                $('#updateWarehouse').modal('hide');
                vm.getWarehousePage();
            } else {
                msgAlert.text(' >﹏< [' + data.additionalMsg.message + ']');
            }
        })
    }
    $(function () {
        $('#updateWarehouse').on('hide.bs.modal', function () {
            $('#id_updateDescript').val("");
        })
    });


    vm.invalidWarehouse = function () {
        if (vm.warehouseEntity.getSelectedRows().length == 0) {
            msgAlert.text('请先选择一条要失效的单子');
            return false;
        }
        if (vm.warehouseEntity.getSelectedRows().length > 1) {
            msgAlert.text('只能选择一条单子');
            return false;
        }
        vm.invalidParam = {
            id:vm.warehouseEntity.getSelectedRows()[0].ID,
        }
        BillManage.WarehouseInvalid(vm).success(function (data) {
            if (data.additionalMsg.status == '00') {
                msgAlert.text('失效成功');
                vm.getWarehousePage();
            } else {
                msgAlert.text(' >﹏< [' + data.additionalMsg.message + ']');
            }
        })
    }

}])
