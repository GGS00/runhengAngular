package com.cloudchain.admin.web.fms.account;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.admin.model.fms.FmsTransferModel;
import com.cloudchain.fms.api.transfer.FmsTradeTransferAccountService;
import com.cloudchain.fms.pojo.bo.transfer.TradeTransferAccountRequest;
import com.cloudchain.fms.pojo.bo.transfer.TradeTransferAccountResponse;
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

@Api(value = "fms-transfer-api", description = "转账接口")
@Controller
@RequestMapping("/fmsTransfer")
public class FmsTransferController {
    private static final Logger logger = LoggerFactory.getLogger(FmsTransferController.class);

    @Autowired
    private FmsTradeTransferAccountService fmsTradeTransferAccountService;

    /**
     * 转账
     * @param request
     * @param model
     * @return
     */
    @ApiOperation(value = "转账")
    @RequestMapping(value = "/transfer", method = RequestMethod.POST)
    @ResponseBody
    public String transfer(HttpServletRequest request, FmsTransferModel model) {
        logger.info("[FmsTransferController.transfer] IN");
        long begin = System.currentTimeMillis();
        String retString = null;

        TradeTransferAccountRequest req = new TradeTransferAccountRequest();
        CommonParamUtil.setUmsUserId(request, req);
        req.setAmount(BigDecimal.valueOf(Double.parseDouble(model.getAmount())).multiply(new BigDecimal(1000)).longValue());
        req.setPayPwd(model.getPayPwd());
        req.setMobile(model.getMobile());
        req.setInUserId(model.getInUserId());
        req.setRemark(model.getRemark());

        TradeTransferAccountResponse resp = fmsTradeTransferAccountService.transfer(req);

        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        } else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }

        long end = System.currentTimeMillis();
        logger.info("[FmsTransferController.transfer] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }
}
