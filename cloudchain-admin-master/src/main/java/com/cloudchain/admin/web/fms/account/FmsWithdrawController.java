package com.cloudchain.admin.web.fms.account;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.admin.model.fms.FmsWithdrawModel;
import com.cloudchain.fms.api.account.FmsActAccountService;
import com.cloudchain.fms.api.admin.bis.FmsUserBankService;
import com.cloudchain.fms.api.withdraw.FmsTradeWithdrawOrderService;
import com.cloudchain.fms.pojo.bo.account.FmsActAccountRequest;
import com.cloudchain.fms.pojo.bo.account.FmsActAccountResponse;
import com.cloudchain.fms.pojo.bo.bank.FmsUserBankRequest;
import com.cloudchain.fms.pojo.bo.bank.FmsUserBankResponse;
import com.cloudchain.fms.pojo.bo.withdraw.FmsTradeWithdrawOrderRequest;
import com.cloudchain.fms.pojo.bo.withdraw.FmsTradeWithdrawOrderResponse;
import com.cloudchain.fms.pojo.bo.withdraw.FmsWithdrawResponse;
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
import java.math.BigDecimal;

@Api(value = "fms-withdraw-api", description = "提现接口")
@Controller
@RequestMapping("/fmsWithdraw")
public class FmsWithdrawController {
    private static final Logger logger = LoggerFactory.getLogger(FmsWithdrawController.class);

    @Autowired
    private FmsTradeWithdrawOrderService fmsTradeWithdrawOrderService;
    @Autowired
    private FmsActAccountService fmsActAccountService;
    @Autowired
    private FmsUserBankService fmsUserBankService;

    /**
     * 提现
     * @param request
     * @param model
     * @return
     */
    @ApiOperation(value = "提现")
    @RequestMapping(value = "/withdraw", method = RequestMethod.POST)
    @ResponseBody
    public String withdraw(HttpServletRequest request, FmsWithdrawModel model) {
        logger.info("[FmsWithdrawController.withdraw] IN");
        long begin = System.currentTimeMillis();
        String retString = null;

        FmsTradeWithdrawOrderRequest req = new FmsTradeWithdrawOrderRequest();
        req.setBankId(model.getBankId());
        req.setAmount(BigDecimal.valueOf(Double.parseDouble(model.getAmount())).multiply(new BigDecimal(1000)).longValue());
        req.setPayPwd(model.getPayPwd());
        CommonParamUtil.setUmsUserId(request, req);
        FmsTradeWithdrawOrderResponse resp = fmsTradeWithdrawOrderService.withdraw(req);

        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        } else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }

        long end = System.currentTimeMillis();
        logger.info("[FmsWithdrawController.withdraw] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

    /**
     * 初始化提现页面
     * @param request
     * @return
     */
    @ApiOperation(value = "初始化提现页面")
    @RequestMapping(value = "/initWithdraw", method = RequestMethod.GET)
    @ResponseBody
    public FmsWithdrawResponse initWithdraw(HttpServletRequest request) {
        logger.info("[FmsWithdrawController.initWithdraw] IN");
        long begin = System.currentTimeMillis();

        // 获取银行卡列表
        FmsUserBankRequest userBankRequest = new FmsUserBankRequest();
        CommonParamUtil.setUmsUserId(request, userBankRequest);
        FmsUserBankResponse userBankResponse = fmsUserBankService.getUserBankList(userBankRequest);

        // 获取帐户信息
        FmsActAccountRequest actAccountRequest = new FmsActAccountRequest();
        CommonParamUtil.setUmsUserId(request, actAccountRequest);
        FmsActAccountResponse actAccountResponse = fmsActAccountService.obtainActAccount(actAccountRequest);

        // 将银行卡、帐户 返回给页面
        FmsWithdrawResponse resp = new FmsWithdrawResponse();
        resp.setFmsUserBanks(userBankResponse.getFmsUserBanks());
        resp.setActAccount(actAccountResponse.getActAccount());

        long end = System.currentTimeMillis();
        logger.info("[FmsWithdrawController.initWithdraw] OUT,cost time:{}s", (end - begin) / 1000d);
        return resp;
    }
}
