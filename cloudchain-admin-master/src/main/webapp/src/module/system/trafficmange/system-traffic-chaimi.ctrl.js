/**
 * Created by wangqing on 2017/4/28.
 */
angular.module('MetronicApp').controller('addTmsChaimiCooperController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','User','BillManage','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, User,BillManage,commonUtil,Table) {
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
    vm.getPage();

    //添加
    vm.addCooper = function () {
        $.fn.modal.Constructor.prototype.enforceFocus = function () {}
        $('#add_model').modal('show');
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
            msgAlert.info('信息没有变动,无需提交修改');
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

}])
