package com.cloudchain.admin.web.fms.security;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.admin.model.fms.FmsUserAuthModel;
import com.cloudchain.fms.api.admin.bis.FmsUserAuthService;
import com.cloudchain.fms.pojo.bo.security.FmsUserAuthRequest;
import com.cloudchain.fms.pojo.bo.security.FmsUserAuthResponse;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

@Api(value = "fms-userAuth-api", description = "认证接口")
@Controller
@RequestMapping("/fmsUserAuth")
public class FmsUserAuthController {
    private static final Logger logger = LoggerFactory.getLogger(FmsUserAuthController.class);

    @Autowired
    private FmsUserAuthService fmsUserAuthService;

    /**
     * 保存认证申请
     * @param request
     * @param model
     * @return
     */
    @ApiOperation(value = "保存认证申请")
    @RequestMapping(value = "/saveAuthApply", method = RequestMethod.POST)
    @ResponseBody
    public String saveAuthApply(HttpServletRequest request, FmsUserAuthModel model) {
        logger.info("[FmsUserAuthController.saveAuthApply] IN");
        long begin = System.currentTimeMillis();

        String retString = null;

        FmsUserAuthRequest req = new FmsUserAuthRequest();
        req.setRealName(model.getRealName());
        req.setCertificateType(model.getCertificateType());
        req.setCertificateNo(model.getCertificateNo());
        req.setCertificateFrontPic(model.getCertificateFrontPic());
        req.setCertificateBackPic(model.getCertificateBackPic());
        CommonParamUtil.setUmsUserId(request, req);

        FmsUserAuthResponse resp = fmsUserAuthService.saveAuthApply(req);

        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        } else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }

        long end = System.currentTimeMillis();
        logger.info("[FmsUserAuthController.saveAuthApply] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }
}
