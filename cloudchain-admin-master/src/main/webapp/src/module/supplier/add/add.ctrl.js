/* Setup blank page controller */
angular.module('MetronicApp').controller('addCtrl', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','User','commonUtil','citySelect','multicitySelect', function($rootScope, $scope, $http, uiGridConstants,settings, User,commonUtil,citySelect,multicitySelect) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    $scope.provideForm = {};


    vm.sendAddressList = [{id:''}];

    vm.addNewSend = function(){
        vm.sendAddressList.push({id:''});
    };

    vm.removeSend = function(index){
        vm.sendAddressList.splice(index,1);
    };
    $("#ext9_id").hide();
    vm.radioChecked1 = function () {
        // console.info(vm.ext9);
        if (vm.ext9==0){
            $("#ext10_id").hide();
            $("#ext11_id").hide();
            $("#ext12_id").hide();
            $("div[id*='fahuo_id_']").hide();
            $("#fahuo_add_id").hide();
        }else if(vm.ext9==1){
            $("#ext10_id").show();
            $("#ext11_id").show();
            $("#ext12_id").show();
            vm.ext12=1;
            if(vm.ext12==1){
                $("div[id*='fahuo_id_']").show();
                $("#fahuo_add_id").show();
            }
        }
    }
    vm.radioChecked2 = function () {
        // console.info(vm.ext10);
        if (vm.ext10==1){
            $("#ext11_id").hide();
            $("#ext12_id").hide();
            $("div[id*='fahuo_id_']").hide();
            $("#fahuo_add_id").hide();
            vm.ext12 =0;
        }else if(vm.ext10==0){
            $("#ext11_id").show();
            $("#ext12_id").show();
            vm.ext12=1;
            if(vm.ext12==1){
                $("div[id*='fahuo_id_']").show();
                $("#fahuo_add_id").show();
            }
        }

    }
    vm.radioChecked3 = function () {
        // console.info(vm.ext11);
        if (vm.ext11==1){
            $("#ext12_id").hide();
            $("div[id*='fahuo_id_']").hide();
            $("#fahuo_add_id").hide();
        }else if(vm.ext11==0){
            $("#ext12_id").show();
            vm.ext12=1;
            if(vm.ext12==1){
                $("div[id*='fahuo_id_']").show();
                $("#fahuo_add_id").show();
            }
        }
    }
    vm.radioChecked4 = function () {
        // console.info(vm.ext11);
        if (vm.ext12==0){
            $("#fahuo_id")
            $("div[id*='fahuo_id_']").hide();
            $("#fahuo_add_id").hide();

        }else if(vm.ext12==1){
            $("div[id*='fahuo_id_']").show();
            $("#fahuo_add_id").show();
        }
    }

    $scope.submitUser = function(){
        $scope.provideForm.province = $('.provideAddress').find('.selectPro :selected').html();
        $scope.provideForm.city = $('.provideAddress').find('.selectCity :selected').html();
        $scope.provideForm.area = $('.provideAddress').find('.selectArea :selected').html();




        if($scope.provideForm.company == ""||$scope.provideForm.company == undefined){
            msgAlert.text('请填写公司');
            return false;
        }
        if($scope.provideForm.ext1 == undefined||$scope.provideForm.ext1==""){
            $scope.provideForm.nickName =$scope.provideForm.company;
            $scope.provideForm.ext1 = '';
        }else {
            $scope.provideForm.nickName=  $scope.provideForm.ext1;
        }

        if($scope.provideForm.addressDetail == ""||$scope.provideForm.addressDetail ==undefined){
            msgAlert.text('请填写详细地址');
            return false;
        }
        $scope.provideForm.ext9 = $("input[name='ext9']:checked").val();
        $scope.provideForm.ext10 =$("input[name='ext10']:checked").val();
        $scope.provideForm.ext11 =$("input[name='ext11']:checked").val();
        $scope.provideForm.ext12 =$("input[name='ext12']:checked").val();
      if( $scope.provideForm.ext12==1){
          var addressList= [];
          debugger
          for (var i = 0; i < vm.sendAddressList.length; i++) {
              if ($('.sendAddress_'+i).find('.selectPro :selected').val()!='') {
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
              }else {
                  addressList[i] = {
                      province: "all",
                      provinceName: "全国",
                  }
              }
          }
          $scope.provideForm.shipAreas =  angular.toJson(addressList);
        }
        $scope.provideForm.regSource = 1;
        User.commitSupplier($scope.provideForm).success(function(data) {
            if(data.status == 00){
                msgAlert.text('添加成功');
                window.location.href="#/supplier/manage";
            }else{
                $scope.provideForm.password = {}
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                return false;
            }
        });

    }


}]);