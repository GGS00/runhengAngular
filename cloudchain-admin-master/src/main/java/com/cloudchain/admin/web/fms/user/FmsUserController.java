package com.cloudchain.admin.web.fms.user;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.fms.api.account.FmsActAccountService;
import com.cloudchain.fms.api.admin.bis.FmsUserService;
import com.cloudchain.fms.pojo.bo.account.FmsActAccountRequest;
import com.cloudchain.fms.pojo.bo.account.FmsActAccountResponse;
import com.cloudchain.fms.pojo.bo.user.FmsUserRequest;
import com.cloudchain.fms.pojo.bo.user.FmsUserResponse;
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

@Api(value = "fms-user-api", description = "用户接口")
@Controller
@RequestMapping("/fmsUser")
public class FmsUserController {
    private static final Logger logger = LoggerFactory.getLogger(FmsUserController.class);

    @Autowired
    private FmsUserService fmsUserService;
    @Autowired
    private FmsActAccountService fmsActAccountService;
    /**
     * 获取 FMS_USER
     * @param request
     * @return
     */
    @ApiOperation(value = "获取 FMS_USER")
    @RequestMapping(value = "/obtainUserInfo", method = RequestMethod.GET)
    @ResponseBody
    public String obtainUserInfo(HttpServletRequest request) {
        logger.info("[FmsUserController.obtainUserInfo] IN");
        long begin = System.currentTimeMillis();

        String retString = null;

        FmsUserRequest req = new FmsUserRequest();
        CommonParamUtil.setUmsUserId(request, req);

        FmsUserResponse resp = fmsUserService.obtainFmsUser(req);

        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        } else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }

        long end = System.currentTimeMillis();
        logger.info("[FmsUserController.obtainUserInfo] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

    /**
     * 获取用户信息，根据手机号s
     * @param request
     * @param mobile
     * @return
     */
    @ApiOperation(value = "获取用户信息，根据手机号")
    @RequestMapping(value = "/obtainUserByPhone", method = RequestMethod.GET)
    @ResponseBody
    public FmsUserResponse obtainUserByPhone(HttpServletRequest request, String mobile) {
        logger.info("[FmsUserController.obtainUserByPhone] IN");
        long begin = System.currentTimeMillis();

        FmsUserRequest req = new FmsUserRequest();
        req.setMobile(mobile);
        CommonParamUtil.setUmsUserId(request, req);
        FmsUserResponse resp = fmsUserService.obtainUserByPhone(req);

        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            FmsActAccountRequest actReq = new FmsActAccountRequest();
            CommonParamUtil.setUmsUserId(request, actReq);
            FmsActAccountResponse actResp = fmsActAccountService.obtainActAccount(actReq);
            resp.setActAccount(actResp.getActAccount());
        }

        long end = System.currentTimeMillis();
        logger.info("[FmsUserController.obtainUserByPhone] OUT,cost time:{}s", (end - begin) / 1000d);
        return resp;
    }

}
