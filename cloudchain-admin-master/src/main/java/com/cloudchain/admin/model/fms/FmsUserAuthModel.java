package com.cloudchain.admin.model.fms;

import com.cloudchain.tms.pojo.po.TmsOrder;
import com.cloudchain.tms.pojo.po.TmsOrderFee;
import com.cloudchain.tms.pojo.po.TmsOrderGoods;

import java.util.List;

public class FmsUserAuthModel {

    private String certificateType;
    private String certificateNo;
    private String realName;
    private String certificateFrontPic;
    private String certificateBackPic;
    private String certificateHoldPic;

    public String getCertificateType() {
        return certificateType;
    }

    public void setCertificateType(String certificateType) {
        this.certificateType = certificateType;
    }

    public String getCertificateNo() {
        return certificateNo;
    }

    public void setCertificateNo(String certificateNo) {
        this.certificateNo = certificateNo;
    }

    public String getCertificateFrontPic() {
        return certificateFrontPic;
    }

    public void setCertificateFrontPic(String certificateFrontPic) {
        this.certificateFrontPic = certificateFrontPic;
    }

    public String getCertificateBackPic() {
        return certificateBackPic;
    }

    public void setCertificateBackPic(String certificateBackPic) {
        this.certificateBackPic = certificateBackPic;
    }

    public String getCertificateHoldPic() {
        return certificateHoldPic;
    }

    public void setCertificateHoldPic(String certificateHoldPic) {
        this.certificateHoldPic = certificateHoldPic;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }
}
