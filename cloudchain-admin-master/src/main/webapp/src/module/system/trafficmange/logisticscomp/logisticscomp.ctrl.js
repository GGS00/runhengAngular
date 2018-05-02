angular.module('MetronicApp').controller('logisticsCompController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','order','User','commonUtil','Table','citySelect', function($rootScope, $scope, $http, uiGridConstants,settings, order,User,commonUtil,Table,citySelect) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    vm.menuLen = 6;
    vm.showTabs = function(index){
        switch (index)
        {
            case 0:
                vm.getAllExternalLogisticsCompanyPage();
                break;
            case 1:
                vm.getCooperPage();
                break;
            case 2:
                vm.getFinanceExaminePage();
                break;
        }
    }
    /**=================================================外部物流公司==========================================================**/


    vm.addLogisticsComp=function () {
        window.location.href="#/sys/store/traffic/addlogisticscomp";
    }
    vm.externalLogisticsCompanyPageParams = {
        bean:'omsExternalLogisticsCompany',
        method:'page',
        page:1,
        rows:10
    }
    vm.externalLogisticsCompanyColumn= [
        {   field: "id",
            displayName:'ID',
            visible: false,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
        },
        {   field: "code",
            displayName: '编号',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {   field: "name",
            displayName:'公司名称',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {
            name:'地址',
            cellTemplate:'<div style="padding:5px" ng-model="logisticsComp.Address[row.entity.index]">{{grid.appScope.$parent.logisticsComp.Address[row.entity.index]}}</div>',
            width: 250,
        },
        {
            field: "address",
            displayName:'详细地址',
        },
        {
            field: "parent_logistic_comp_id",
            displayName:'电商物流',
        },
        {
            field: "sheet_type",
            displayName: '面单类型',
        },
        {
            field: "sheet_origin_id",
            displayName: '单号来源',
        },
        {
            field: "sheet_template_id",
            displayName: '打印模板',
        },
        {
            field: "status",
            displayName: '状态',
        }
    ]
    vm.getAllExternalLogisticsCompanyPage=function () {
        commonUtil.getList(vm.externalLogisticsCompanyPageParams).success(function (data) {

            if (data.additionalMsg.status == '00') {
                for (var i = 0; i < data.rows.length; i++) {
                    data.rows[i].index = i;
                }
                vm.Address = new Array();
                for (var i = 0; i < data.rows.length; i++) {
                    if (data.rows[i].province_name != null || data.rows[i].province_name != undefined || data.rows[i].city_name != null || data.rows[i].city_name != undefined || data.rows[i].district_name != null || data.rows[i].district_name != undefined) {
                        vm.Address[i] = data.rows[i].province_name + "/" + data.rows[i].city_name + "/" + data.rows[i].district_name;
                    } else {
                        vm.Address[i] = "";
                    }
                }
                vm.externalLogisticsCompanyData = data;
            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });
    }
    vm.getAllExternalLogisticsCompanyPage();
    //修改
    vm.editLogisticsComp=function () {
        if(vm.externalLogisticsCompanyEntity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要修改的外部物流公司');
            return false;

        }else if(vm.externalLogisticsCompanyEntity.getSelectedRows().length > 1){

            msgAlert.text('每次只能修改一条外部物流公司');

        }else {

            window.location.href = "#/sys/store/traffic/updatelogisticscomp?id="+vm.externalLogisticsCompanyEntity.getSelectedRows()[0].id;
        }
    }
    //生效
    vm.activeLogisticsComp=function () {
        vm.selectListActive = [];
        if (vm.externalLogisticsCompanyEntity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择要失效的客户');
            return false;
        }
        else {
            for (var i = 0; i < vm.externalLogisticsCompanyEntity.getSelectedRows().length; i++) {
                if (vm.externalLogisticsCompanyEntity.getSelectedRows()[i].status == 'ACTIVE') {
                    msgAlert.info('选中的数据包含已经生效的客户，请小心勾选');
                    return false;
                }
            }
        }
        for(var i = 0 ;i < vm.externalLogisticsCompanyEntity.getSelectedRows().length ; i++){
            vm.selectListActive.push(vm.externalLogisticsCompanyEntity.getSelectedRows()[i].id);
        }
        $http({url:"/externalLogisticsCompany/updateStatus",
            method: "post",
            params:{
                ids:vm.selectListActive.join(),
                status:"ACTIVE"
            }
        }).success(function (data) {

            if (data.status == '00') {
                msgAlert.info('生效成功');
                vm.getAllExternalLogisticsCompanyPage();
            } else {
                msgAlert.text(' >﹏< [' + data.message + ']');
            }
        }).error(function () {
            msgAlert.text(' 系统繁忙 >﹏< ');
        })
    }
    //失效
    vm.InvalidLogisticsComp=function () {
        vm.selectListActive = [];
        if (vm.externalLogisticsCompanyEntity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择要失效的客户');
            return false;
        }
        else {
            for (var i = 0; i < vm.externalLogisticsCompanyEntity.getSelectedRows().length; i++) {
                if (vm.externalLogisticsCompanyEntity.getSelectedRows()[i].status == 'INVALID') {
                    msgAlert.info('选中的数据包含已经生效的客户，请小心勾选');
                    return false;
                }
            }
        }
        for(var i = 0 ;i < vm.externalLogisticsCompanyEntity.getSelectedRows().length ; i++){
            vm.selectListActive.push(vm.externalLogisticsCompanyEntity.getSelectedRows()[i].id);
        }
        $http({url:"/externalLogisticsCompany/updateStatus",
            method: "post",
            params:{
                ids:vm.selectListActive.join(),
                status:"INVALID"
            }
        }).success(function (data) {

            if (data.status == '00') {
                msgAlert.info('失效成功');
                vm.getAllExternalLogisticsCompanyPage();
            } else {
                msgAlert.text(' >﹏< [' + data.message + ']');
            }
        }).error(function () {
            msgAlert.text(' 系统繁忙 >﹏< ');
        });
    }

    vm.getLogisticsPageByFilter = function(){
        var name=$("input[name='name']").val();

        var parentLogisticCompId = $('#parentLogisticCompId option:selected').val();
        var sheetTemplateId = $('#sheetTemplateId option:selected').val();
        var status = $('#status option:selected').val();

        var provinceName = $('.companyAddress').find('.selectPro :selected').html();
        var cityName = $('.companyAddress').find('.selectCity :selected').html();
        var districtName = $('.companyAddress').find('.selectArea :selected').html();
        var provinceId= citySelect.getSelect().proId;//省id
        var cityId = citySelect.getSelect().cityId;//市id
        var districtId = citySelect.getSelect().areaId;//区id

        if(status == " "){
            status ="";
        }
        if(parentLogisticCompId == " "){
            parentLogisticCompId ="";
        }
        if(sheetTemplateId == " "){
            sheetTemplateId ="";
        }

        if(name == "" && status == ""&& parentLogisticCompId == ""&& sheetTemplateId == ""&& provinceId == ""&& cityId == ""&& districtId == ""){
            msgAlert.info('搜索条件不能为空');
            return false;
        }
        vm.externalLogisticsCompanyPageParams = {
            bean:'omsExternalLogisticsCompany',
            method:'page',
            page:1,
            rows:10,
            parentLogisticCompId:parentLogisticCompId,
            status:status,
            sheetTemplateId:sheetTemplateId,
            name:name,
            provinceId:provinceId,
            cityId:cityId,
            districtId:districtId
        }
        vm.getAllExternalLogisticsCompanyPage();
    }
    /**======================================================柴米承运商==========================================================**/
    vm.end_time_switch = 0;  //修改页面的合作开始时间控件显示标志
    vm.add_end_time_switch = 1; //添加页面的合作开始时间控件显示标志
    vm.qryRole = $('#qry_cooperRole').val();
    vm.cooperPageParams = {
        bean:'umsCooper',
        method:'page',
        qryType:'T',
        qryRole:vm.qryRole,
        page:1,
        rows:10
    }
    vm.cooperColumn = [
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
    //加载承运商页面数据
    vm.getCooperPage = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params: vm.cooperPageParams
        }).success(function (data) {
            vm.cooperData = data;
        })
    };

    //添加
    vm.addCooper = function () {
        $.fn.modal.Constructor.prototype.enforceFocus = function () {}
        $('#add_cooper_model').modal('show');
        vm.clearForm();
        $('#add_cooperScope_all').attr("checked",true);
        $('#add_cooperScope_part').removeAttr('checked');
        $('#submitAddCooper').attr("disabled", true);
    }

    //监听对方账号的输入
    $('#add_cooperUserNm').change(function(){
        $('#add_cooperNicknm').val('');
        $('#add_cooperPhone').val('');
        $('#add_cooperEmail').val('');
        //查询A用户信息
        User.getUserByName($('#add_cooperUserNm').val()).success(function(data) {
            if(data.status == '00'){
                //验证用户是否开通对应的功能
                vm.funcParams = {
                    userId:data.obj.userId,
                    funcId:$('#qry_function').val()
                }
                User.getUserFuncById(vm).success(function(data_func){
                    if(data_func.status == '00'){
                        $('#add_cooperUserId').val(data.obj.userId);
                        $('#add_cooperNicknm').val(data.obj.nickName);
                        $('#add_cooperNicknmHere').val(data.obj.nickName);
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
                return false;
            }else{
                $('#submitAddCooper').attr("disabled", true);
                msgAlert.text('系统处理错误 >﹏< ['+ data.msg+']');
                return false;
            }
        });
    });

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
    vm.editCooper = function () {
        if (vm.cooperEntity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择要修改的记录');
            return false;
        }else if(vm.cooperEntity.getSelectedRows().length != 1){
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
                $('#upd_settlFeePrd').val(vm.cooperEntity.getSelectedRows()[0].settl_fee_prd);

                $('#upd_cooperRole').val('承运人');
                $('#updCooperRole').val('3');
            }

            $('#upd_acc_name').val(vm.cooperEntity.getSelectedRows()[0].taker_acc);
            $('#upd_nick_name').val(vm.cooperEntity.getSelectedRows()[0].taker_nicknm);
            $('#upd_cooperNicknmHere').val(vm.cooperEntity.getSelectedRows()[0].taker_nicknm);
            $('#upd_phone').val(vm.cooperEntity.getSelectedRows()[0].mobile);
            $('#upd_email').val(vm.cooperEntity.getSelectedRows()[0].email);
            $('#upd_foreverFlg').val(vm.cooperEntity.getSelectedRows()[0].forever_flg);

            //时间
            if(vm.cooperEntity.getSelectedRows()[0].start_time != null){
                $('#upd_startTime').val(vm.cooperEntity.getSelectedRows()[0].start_time);
            }

            if(vm.cooperEntity.getSelectedRows()[0].end_time != null){
                vm.testTime = vm.cooperEntity.getSelectedRows()[0].end_time;
                vm.upd_end_time_switch = 1;
            }

            //判断永久有效标志是否选中
            if(vm.cooperEntity.getSelectedRows()[0].forever_flg == '1'){
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
        if($('#upd_cooperNicknmHere').val() == vm.cooperEntity.getSelectedRows()[0].taker_nicknm &&
            $('.updEndTime span').html() == vm.cooperEntity.getSelectedRows()[0].end_time){
            msgAlert.info('信息没有变动,无需提交修改');
            return false;
        }
        vm.cooperId = vm.cooperEntity.getSelectedRows()[0].id;
        vm.updParams = {
            cooperRole:$('#updCooperRole').val(),
            cooperNicknmHere:$('#upd_cooperNicknmHere').val(),
            endTime:$('.updEndTime span').html(),
            foreverFlg:$('#upd_foreverFlg').val()
        }
        User.updCooper(vm).success(function(data) {
            if(data.status == 00){
                msgAlert.info('修改成功');
                $('#upd_cooper_model').modal('hide');
                vm.getCooperPage();
            }else{
                msgAlert.text(data.msg);
            }
        });
    }


    //删除
    vm.deleteCooper = function () {
        vm.selectListDelete = [];
        if (vm.cooperEntity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择要删除的记录');
            return false;
        }
        else{
            for(var i = 0 ;i < vm.cooperEntity.getSelectedRows().length ; i++){
                vm.selectListDelete.push(vm.cooperEntity.getSelectedRows()[i].id);
            }
            User.delCooper(vm).success(function(data) {
                if(data.status == '00'){
                    msgAlert.info('删除成功');
                    vm.getCooperPage();
                    vm.cooperEntity.clearSelectedRows();

                }else if(data.status=='01'){
                    msgAlert.text('系统处理错误 >﹏< ['+ data.msg+']');
                    vm.cooperEntity.clearSelectedRows();
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
        vm.cooperPageParams = {
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
        vm.getCooperPage();
    }

    /**========================================================== ==============================================**/


}])