//实名认证
angular.module('MetronicApp').controller('questionController',
    function($rootScope, $scope, $http, uiGridConstants,settings, questionService,commonUtil) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        //-----------------------------------------------------------------------------------------------------
        questionService.getPwdQuestionList().success(function (data) {
            $scope.questionList0 = data.fmsPwdQuestions;
            $scope.questionList1 = data.fmsPwdQuestions;
            $scope.questionList2 = data.fmsPwdQuestions;
            $scope.questionList3 = data.fmsPwdQuestions;
        });

        $scope.changeQuestion = function (type) {
            $scope.questionList1 = $scope.questionList0.clone();
            removeObject($scope.questionList1, $scope.form.id2);
            removeObject($scope.questionList1, $scope.form.id3);

            $scope.questionList2 = $scope.questionList0.clone();
            removeObject($scope.questionList2, $scope.form.id1);
            removeObject($scope.questionList2, $scope.form.id3);

            $scope.questionList3 = $scope.questionList0.clone();
            removeObject($scope.questionList3, $scope.form.id1);
            removeObject($scope.questionList3, $scope.form.id2);
        };

        function removeObject(obj , id){
            if(id != undefined && id != ""){
                for(var i = 0; i < obj.length; i++){
                    if(obj[i].id == id){
                        obj.splice(i, 1);
                        break;
                    }
                }
            }
        };

        Array.prototype.clone=function(){ return [].concat(this); }

        vm.toParent = function(){
            window.location.href="#/fms/security/security";
        };

        vm.submit = function() {
            // 验证必填
            var question1 = $("#question1").val();
            var answer1 = $("#answer1").val();
            var question2 = $("#question2").val();
            var answer2 = $("#answer2").val();
            var question3 = $("#question3").val();
            var answer3 = $("#answer3").val();
            if(question1 == undefined || question1 == ""
                || answer1 == undefined || answer1 == ""
                || question2 == undefined || question2 == ""
                || answer2 == undefined || answer2 == ""
                || question3 == undefined || question3 == ""
                || answer3 == undefined || answer3 == ""){
                msgAlert.text('请填写所有内容');
                return ;
            }

            // 组装参数
            var obj = [{questionId:question1, answer:answer1},
                       {questionId:question2, answer:answer2},
                       {questionId:question3, answer:answer3}];
            $.ajax({
                url:"/fmsUserQuestionRef/saveUserQuestionRef",
                data:{itemData: JSON.stringify(obj)},
                type:"post",
                dataType:"json",
                success:function(data){
                    if(data.additionalMsg.status == 00){
                        msgAlert.text('提交成功');
                        window.location.href="#/fms/security/security";
                    }else if(data.additionalMsg.status == 01){
                        msgAlert.text('提交失败 >﹏< ['+ data.additionalMsg.message+']');
                    }
                },
                error:function(){
                    msgAlert.text('系统繁忙 >﹏<');
                }
            })
        };
    }
)