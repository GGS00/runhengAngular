package com.cloudchain.admin.model.base;

import java.util.Map;

/**
 * Created by zhuhao on 2017/3/15.
 */
public class CommUserModel {

    private String userId;

    private String userName;

    private String nickName;

    private String userTel;

    private String operatorId;

    private String operatorName;

    private String operatorTel;

    private String roleId;

    private String industryIds;

    private Map<String, Object> functionMap;

    public Map<String, Object> getFunctionMap() {
        return functionMap;
    }

    public void setFunctionMap(Map<String, Object> functionMap) {
        this.functionMap = functionMap;
    }

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getOperatorId() {
        return operatorId;
    }

    public void setOperatorId(String operatorId) {
        this.operatorId = operatorId;
    }

    public String getOperatorName() {
        return operatorName;
    }

    public void setOperatorName(String operatorName) {
        this.operatorName = operatorName;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public String getUserTel() {
        return userTel;
    }

    public void setUserTel(String userTel) {
        this.userTel = userTel;
    }

    public String getOperatorTel() {
        return operatorTel;
    }

    public void setOperatorTel(String operatorTel) {
        this.operatorTel = operatorTel;
    }

    public String getIndustryIds() {
        return industryIds;
    }

    public void setIndustryIds(String industryIds) {
        this.industryIds = industryIds;
    }

    @Override
    public String toString() {
        return "CommUserModel [userId=" + userId + ", userName=" + userName + ", operatorId="
                + operatorId + ", operatorName=" + operatorName + "]";
    }
}
