package com.cloudchain.admin.model.fms;

public class FmsLaborEntryModel {

    private String mobile;
    private String type;
    private String code;
    private String checkUuid;
    private String realName;
    private String identityCard;

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public String getIdentityCard() {
        return identityCard;
    }

    public void setIdentityCard(String identityCard) {
        this.identityCard = identityCard;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCheckUuid() {
        return checkUuid;
    }

    public void setCheckUuid(String checkUuid) {
        this.checkUuid = checkUuid;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
