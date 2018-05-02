package com.cloudchain.admin.web.fms.checkcode;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.admin.model.fms.FmsCheckCodeModel;
import com.cloudchain.fms.api.admin.bis.FmsCheckCodeService;
import com.cloudchain.fms.pojo.bo.checkcode.FmsCheckCodeRequest;
import com.cloudchain.fms.pojo.bo.checkcode.FmsCheckCodeResponse;
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

@Api(value = "fms-checkCode-api", description = "验证码接口")
@Controller
@RequestMapping("/fmsCheckCode")
public class FmsCheckCodeController {
    private static final Logger logger = LoggerFactory.getLogger(FmsCheckCodeController.class);

    @Autowired
    private FmsCheckCodeService fmsCheckCodeService;

    /**
     * 发送验证码
     * @param request
     * @param model
     * @return
     */
    @ApiOperation(value = "发送验证码")
    @RequestMapping(value = "/sendCheckCode", method = RequestMethod.POST)
    @ResponseBody
    public FmsCheckCodeResponse sendCheckCode(HttpServletRequest request, FmsCheckCodeModel model) {
        logger.info("[FmsCheckCodeController.sendCheckCode] IN");
        long begin = System.currentTimeMillis();

        FmsCheckCodeRequest req = new FmsCheckCodeRequest();
        req.setType(model.getType());
        req.setMobile(model.getMobile());
        CommonParamUtil.setUmsUserId(request, req);

        FmsCheckCodeResponse resp = fmsCheckCodeService.sendCheckCode(req);

        long end = System.currentTimeMillis();
        logger.info("[FmsCheckCodeController.sendCheckCode] OUT,cost time:{}s", (end - begin) / 1000d);
        return resp;
    }

    /**
     * 发送验证码,当前登录用户
     * @param request
     * @param model
     * @return
     */
    @ApiOperation(value = "发送验证码,当前登录用户")
    @RequestMapping(value = "/sendCheckCodeByUser", method = RequestMethod.POST)
    @ResponseBody
    public FmsCheckCodeResponse sendCheckCodeByUser(HttpServletRequest request, FmsCheckCodeModel model) {
        logger.info("[FmsCheckCodeController.sendCheckCodeByUser] IN");
        long begin = System.currentTimeMillis();

        FmsCheckCodeRequest req = new FmsCheckCodeRequest();
        req.setType(model.getType());
        CommonParamUtil.setUmsUserId(request, req);

        FmsCheckCodeResponse resp = fmsCheckCodeService.sendCheckCodeByUser(req);

        long end = System.currentTimeMillis();
        logger.info("[FmsCheckCodeController.sendCheckCodeByUser] OUT,cost time:{}s", (end - begin) / 1000d);
        return resp;
    }

    /**
     * 校验 验证码
     * @param request
     * @param model
     * @return
     */
    @ApiOperation(value = "校验 验证码")
    @RequestMapping(value = "/validateCheckCode", method = RequestMethod.POST)
    @ResponseBody
    public String validateCheckCode(HttpServletRequest request, FmsCheckCodeModel model) {
        logger.info("[FmsCheckCodeController.validateCheckCode] IN");
        long begin = System.currentTimeMillis();

        String retString = null;

        FmsCheckCodeRequest req = new FmsCheckCodeRequest();
        req.setType(model.getType());
        req.setCode(model.getCode());
        req.setCheckUuid(model.getCheckUuid());
        CommonParamUtil.setUmsUserId(request, req);

        FmsCheckCodeResponse resp = fmsCheckCodeService.validateCheckCode(req);

        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        } else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }

        long end = System.currentTimeMillis();
        logger.info("[FmsCheckCodeController.validateCheckCode] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }
}
