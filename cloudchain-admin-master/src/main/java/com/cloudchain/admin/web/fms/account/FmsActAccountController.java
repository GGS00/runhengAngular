package com.cloudchain.admin.web.fms.account;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.fms.api.account.FmsActAccountService;
import com.cloudchain.fms.pojo.bo.account.FmsActAccountRequest;
import com.cloudchain.fms.pojo.bo.account.FmsActAccountResponse;
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

@Api(value = "fms-fmsActAccount-api", description = "帐户接口")
@Controller
@RequestMapping("/fmsActAccount")
public class FmsActAccountController {
    private static final Logger logger = LoggerFactory.getLogger(FmsActAccountController.class);

    @Autowired
    private FmsActAccountService fmsActAccountService;

    /**
     * 获取账户信息
     * @param request
     * @return
     */
    @ApiOperation(value = "获取账户信息")
    @RequestMapping(value = "/obtainActAccount", method = RequestMethod.GET)
    @ResponseBody
    public FmsActAccountResponse obtainActAccount(HttpServletRequest request) {
        logger.info("[FmsActAccountController.obtainActAccount] IN");
        long begin = System.currentTimeMillis();

        FmsActAccountRequest req = new FmsActAccountRequest();
        CommonParamUtil.setUmsUserId(request, req);
        FmsActAccountResponse resp = fmsActAccountService.obtainActAccount(req);
        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);
        resp.setUserName(userModel.getUserName());
        long end = System.currentTimeMillis();
        logger.info("[FmsActAccountController.obtainActAccount] OUT,cost time:{}s", (end - begin) / 1000d);
        return resp;
    }
}
