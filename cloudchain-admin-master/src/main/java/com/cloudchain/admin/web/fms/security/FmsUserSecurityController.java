package com.cloudchain.admin.web.fms.security;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.admin.model.fms.FmsUserAuthModel;
import com.cloudchain.admin.model.fms.FmsUserBindMobileModel;
import com.cloudchain.admin.model.fms.FmsUserPayPwdModel;
import com.cloudchain.fms.api.admin.bis.FmsUserSecurityService;
import com.cloudchain.fms.pojo.bo.security.FmsUserSecurityRequest;
import com.cloudchain.fms.pojo.bo.security.FmsUserSecurityResponse;
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

@Api(value = "fms-userSecurity-api", description = "用户安全")
@Controller
@RequestMapping("/fmsUserSecurity")
public class FmsUserSecurityController {
    private static final Logger logger = LoggerFactory.getLogger(FmsUserSecurityController.class);

    @Autowired
    private FmsUserSecurityService fmsUserSecurityService;

    /**
     * 获取用户安全信息
     * @param request
     * @param model
     * @return
     */
    @ApiOperation(value = "获取用户安全信息")
    @RequestMapping(value = "/obtainUserSecurityInfo", method = RequestMethod.GET)
    @ResponseBody
    public FmsUserSecurityResponse obtainUserSecurityInfo(HttpServletRequest request, FmsUserAuthModel model) {
        logger.info("[FmsUserSecurityController.obtainUserSecurityInfo] IN");
        long begin = System.currentTimeMillis();


        FmsUserSecurityRequest req = new FmsUserSecurityRequest();
        CommonParamUtil.setUmsUserId(request, req);

        FmsUserSecurityResponse resp = fmsUserSecurityService.obtainUserSecurityInfo(req);

        long end = System.currentTimeMillis();
        logger.info("[FmsUserSecurityController.obtainUserSecurityInfo] OUT,cost time:{}s", (end - begin) / 1000d);
        return resp;
    }

    /**
     * 绑定手机
     * @param request
     * @param model
     * @return
     */
    @ApiOperation(value = "绑定手机")
    @RequestMapping(value = "/bindMobile", method = RequestMethod.POST)
    @ResponseBody
    public String bindMobile(HttpServletRequest request, FmsUserBindMobileModel model) {
        logger.info("[FmsUserSecurityController.bindMobile] IN");
        long begin = System.currentTimeMillis();

        String retString = null;

        FmsUserSecurityRequest req = new FmsUserSecurityRequest();
        req.setType(model.getType());
        req.setMobile(model.getMobile());
        req.setCode(model.getCode());
        req.setCheckUuid(model.getCheckUuid());
        CommonParamUtil.setUmsUserId(request, req);

        FmsUserSecurityResponse resp = fmsUserSecurityService.bindMobile(req);

        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        } else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }

        long end = System.currentTimeMillis();
        logger.info("[FmsUserSecurityController.bindMobile] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

    /**
     * 设置支付密码
     * @param request
     * @param model
     * @return
     */
    @ApiOperation(value = "设置支付密码")
    @RequestMapping(value = "/setPayPwd", method = RequestMethod.POST)
    @ResponseBody
    public String setPayPwd(HttpServletRequest request, FmsUserPayPwdModel model) {
        logger.info("[FmsUserSecurityController.setPayPwd] IN");
        long begin = System.currentTimeMillis();

        String retString = null;

        FmsUserSecurityRequest req = new FmsUserSecurityRequest();
        req.setPayPwd(model.getPassword());
        CommonParamUtil.setUmsUserId(request, req);

        FmsUserSecurityResponse resp = fmsUserSecurityService.savePayPwd(req);

        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        } else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }

        long end = System.currentTimeMillis();
        logger.info("[FmsUserSecurityController.setPayPwd] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }
}
