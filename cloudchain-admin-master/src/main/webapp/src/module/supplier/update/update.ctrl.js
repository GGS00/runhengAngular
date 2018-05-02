/*
 * 修改供应商
 */
angular.module('MetronicApp').controller('updateCtrl', ['$rootScope', '$scope', '$http', '$stateParams', 'uiGridConstants', 'settings', 'suppServer', 'commonUtil', 'citySelect', 'multicitySelect', function ($rootScope, $scope, $http, $stateParams, uiGridConstants, settings, suppServer, commonUtil, citySelect, multicitySelect) {

    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    var userid = $stateParams.Id;
    vm.fahuoSwitch = [];
    var address = "";
    vm.shipAreas = "";
    vm.user = "";
    vm.fahuoflag = 1;
    vm.sendAddressList = [];
    vm.fahuoVal = [];
    vm.getuserinfo = function () {
        suppServer.getUserInfo(userid).success(function (data) {
            if (data.status == 00) {

                vm.user = data.resultMap.user;
                $("#company_id").val(vm.user.ownerSubacctExt.company);
                $("#nickName_id").val(vm.user.nickName);
                address = vm.user.ownerSubacctExt.province + "/" + vm.user.ownerSubacctExt.city + "/" + vm.user.ownerSubacctExt.area
                $("#addr_id").val(address);
                $("#companyAddr_id").val(vm.user.ownerSubacctExt.addressDetail);
                vm.ext9 = vm.user.ownerSubacctExt.ext9;
                vm.ext10 = vm.user.ownerSubacctExt.ext10;
                vm.ext11 = vm.user.ownerSubacctExt.ext11;
                vm.ext12 = vm.user.ownerSubacctExt.ext12;
                vm.shipAreas = data.resultMap.shipAreas;
                if (vm.ext9 == 0) {
                    $("#ext10_id").hide();
                    $("#ext11_id").hide();
                    $("#ext12_id").hide();
                    vm.fahuoflag = 1;
                } else if (vm.ext9 == 1) {
                    $("#ext10_id").show();
                    if (vm.ext10 == 1) {
                        $("#ext11_id").hide();
                        $("#ext12_id").hide();
                        vm.fahuoflag = 1;
                    } else if (vm.ext10 == 0) {
                        $("#ext11_id").show();
                        if (vm.ext11 == 1) {
                            $("#ext12_id").hide();
                            vm.fahuoflag = 1;
                        } else if (vm.ext11 == 0) {
                            $("#ext12_id").show();
                            if (vm.ext12 == 0) {
                                vm.fahuoflag = 1;
                            } else if (vm.ext12 == 1) {
                                vm.fahuoflag = 0;

                                for (var i = 0; i < vm.shipAreas.length; i++) {
                                    vm.sendAddressList.push({id: ''});
                                    if (vm.shipAreas[i].cityName == null && vm.shipAreas[i].districtName == null) {
                                        vm.fahuoVal.push(vm.shipAreas[i].provinceName);
                                    } else if (vm.shipAreas[i].cityName != null && vm.shipAreas[i].districtName == null) {
                                        vm.fahuoVal.push(vm.shipAreas[i].provinceName + "/" + vm.shipAreas[i].cityName);
                                    } else if (vm.shipAreas[i].cityName != null && vm.shipAreas[i].districtName != null) {
                                        vm.fahuoVal.push(vm.shipAreas[i].provinceName + "/" + vm.shipAreas[i].cityName + "/" + vm.shipAreas[i].districtName);
                                    }
                                    vm.fahuoSwitch.push(i);
                                }
                            }

                        }
                    }
                }


            } else {
                msgAlert.text(data.msg);

            }
        });
    }
    vm.getuserinfo();


    $scope.provideForm = {};
    vm.citySwitch = 0;
    vm.updateAddr = function () {
        vm.citySwitch = 1;
    }
    vm.cancelAddr = function () {
        vm.citySwitch = 0;
    }


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
    $("#ext9_id").hide();
    vm.radioChecked1 = function () {
        // console.info(vm.ext9);
        if (vm.ext9 == 0) {
            $("#ext10_id").hide();
            $("#ext11_id").hide();
            $("#ext12_id").hide();
            vm.fahuoflag = 1;
        } else if (vm.ext9 == 1) {
            $("#ext10_id").show();
            $("#ext11_id").show();
            $("#ext12_id").show();
            if (vm.ext10 == 1) {
                $("#ext11_id").hide();
                $("#ext12_id").hide();
                vm.fahuoflag = 1;
            } else if (vm.ext10 == 0) {
                $("#ext11_id").show();
                $("#ext12_id").show();
                if (vm.ext11 == 1) {
                    $("#ext12_id").hide();
                    vm.fahuoflag = 1;
                } else if (vm.ext11 == 0) {
                    $("#ext12_id").show();
                    if (vm.ext12 == 1) {
                        vm.fahuoflag = 0;
                    } else {
                        vm.fahuoflag = 1;
                    }
                }
            }
        }
    }
    vm.radioChecked2 = function () {
        // console.info(vm.ext10);
        if (vm.ext10 == 1) {
            $("#ext11_id").hide();
            $("#ext12_id").hide();
            vm.fahuoflag = 1;
        } else if (vm.ext10 == 0) {
            $("#ext11_id").show();
            $("#ext12_id").show();
            if (vm.ext11 == 1) {
                $("#ext12_id").hide();
                vm.fahuoflag = 1;
            } else if (vm.ext11 == 0) {
                $("#ext12_id").show();
                if (vm.ext12 == 1) {
                    vm.fahuoflag = 0;
                } else {
                    vm.fahuoflag = 1;
                }
            }
        }

    }
    vm.radioChecked3 = function () {
        // console.info(vm.ext11);
        if (vm.ext11 == 1) {
            $("#ext12_id").hide();
            vm.fahuoflag = 1;
        } else if (vm.ext11 == 0) {
            $("#ext12_id").show();
            if (vm.ext12 == 1) {
                vm.fahuoflag = 0;
            } else {
                vm.fahuoflag = 1;
            }
        }
    }
    vm.radioChecked4 = function () {

        // console.info(vm.ext11);
        if (vm.ext12 == 0) {
            vm.fahuoflag = 1;
        } else if (vm.ext12 == 1) {
            vm.fahuoflag = 0;
            vm.sendAddressList = [];
            vm.fahuoVal = [];
            for (var i = 0; i < vm.shipAreas.length; i++) {
                vm.sendAddressList.push({id: ''});
                if (vm.shipAreas[i].cityName == null && vm.shipAreas[i].districtName == null) {
                    vm.fahuoVal.push(vm.shipAreas[i].provinceName);
                } else if (vm.shipAreas[i].cityName != null && vm.shipAreas[i].districtName == null) {
                    vm.fahuoVal.push(vm.shipAreas[i].provinceName + "/" + vm.shipAreas[i].cityName);
                } else if (vm.shipAreas[i].cityName != null && vm.shipAreas[i].districtName != null) {
                    vm.fahuoVal.push(vm.shipAreas[i].provinceName + "/" + vm.shipAreas[i].cityName + "/" + vm.shipAreas[i].districtName);
                }
                vm.fahuoSwitch.push(i);
            }
        }
    }
    $scope.submitUser = function () {
        if (vm.citySwitch == 1) {
            $scope.provideForm.province = $('.provideAddress').find('.selectPro :selected').html();
            $scope.provideForm.city = $('.provideAddress').find('.selectCity :selected').html();
            $scope.provideForm.area = $('.provideAddress').find('.selectArea :selected').html();
        } else {
            $scope.provideForm.province = vm.user.ownerSubacctExt.province;
            $scope.provideForm.city = vm.user.ownerSubacctExt.city;
            $scope.provideForm.area = vm.user.ownerSubacctExt.area;
        }

        // $("#nickName_id").val(vm.user.nickName);
        if ($("#company_id").val() == "" || $("#company_id").val() == undefined) {
            msgAlert.text('请填写公司');
            return false;
        }
        $scope.provideForm.company = $("#company_id").val();

        if ($("#nickName_id").val() == undefined || $("#nickName_id").val() == "") {
            $scope.provideForm.nickName = $("#company_id").val();
            $scope.provideForm.ext1 = '';
        } else {
            $scope.provideForm.nickName = $("#nickName_id").val();
        }

        if ($("#companyAddr_id").val() == "" || $("#companyAddr_id").val() == undefined) {
            msgAlert.text('请填写详细地址');
            return false;
        }
        $scope.provideForm.addressDetail = $("#companyAddr_id").val();
        $scope.provideForm.ext9 = $("input[name='ext9']:checked").val();
        $scope.provideForm.ext10 = $("input[name='ext10']:checked").val();
        $scope.provideForm.ext11 = $("input[name='ext11']:checked").val();
        $scope.provideForm.ext12 = $("input[name='ext12']:checked").val();
        if ($scope.provideForm.ext12 == 1) {
            var addressList = [];
            var flag = 0;
            for (var i = 0; i < vm.sendAddressList.length; i++) {
                if (vm.fahuoSwitch[i] != i) {
                    flag = 1;
                }
            }
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
                            province: vm.shipAreas[i].province,
                            provinceName: vm.shipAreas[i].provinceName,
                            city: vm.shipAreas[i].city,
                            cityName: vm.shipAreas[i].cityName,
                            district: vm.shipAreas[i].district,
                            districtName: vm.shipAreas[i].districtName
                        }
                    }

                }
                $scope.provideForm.shipAreas = angular.toJson(addressList);
            } else {
                $scope.provideForm.shipAreas = null;
            }


        }
        $scope.provideForm.regSource = 1;
        $scope.provideForm.userId = userid;

        suppServer.updateSupplier($scope.provideForm).success(function (data) {
            if (data.status == 00) {
                msgAlert.text('修改成功');
                window.location.href = "#/supplier/manage";
            } else {
                $scope.provideForm.password = {}
                msgAlert.text('系统繁忙 >﹏< [' + data.msg + ']');
                return false;
            }
        });

    }


}]);