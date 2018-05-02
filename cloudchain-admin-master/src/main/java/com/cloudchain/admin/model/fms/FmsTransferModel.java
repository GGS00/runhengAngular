package com.cloudchain.admin.model.fms;

public class FmsTransferModel {

    private String amount;

    private String mobile;

    private String inUserId;

    private String payPwd;

    private String remark;

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getInUserId() {
        return inUserId;
    }

    public void setInUserId(String inUserId) {
        this.inUserId = inUserId;
    }

    public String getPayPwd() {
        return payPwd;
    }

    public void setPayPwd(String payPwd) {
        this.payPwd = payPwd;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }
}
