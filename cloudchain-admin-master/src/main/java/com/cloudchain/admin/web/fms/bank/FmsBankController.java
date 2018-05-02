package com.cloudchain.admin.web.fms.bank;

import com.cloudchain.fms.api.admin.bis.FmsBankService;
import com.cloudchain.fms.pojo.bo.bank.FmsBankRequest;
import com.cloudchain.fms.pojo.bo.bank.FmsBankResponse;
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

@Api(value = "fms-bank-api", description = "银行接口")
@Controller
@RequestMapping("/fmsBank")
public class FmsBankController {
    private static final Logger logger = LoggerFactory.getLogger(FmsBankController.class);

    @Autowired
    private FmsBankService fmsBankService;

    /**
     * 获取密保问题列表
     * @param request
     * @return
     */
    @ApiOperation(value = "获取银行列表")
    @RequestMapping(value = "/getBankList", method = RequestMethod.GET)
    @ResponseBody
    public FmsBankResponse getBankList(HttpServletRequest request) {
        logger.info("[FmsBankController.getBankList] IN");
        long begin = System.currentTimeMillis();

        FmsBankRequest req = new FmsBankRequest();
        CommonParamUtil.setUmsUserId(request, req);
        FmsBankResponse resp = fmsBankService.getBankList(req);

        logger.info("has {} bankList.", resp.getFmsBanks() == null ? 0 : resp.getFmsBanks().size());
        long end = System.currentTimeMillis();
        logger.info("[FmsBankController.getBankList] OUT,cost time:{}s", (end - begin) / 1000d);

        return resp;
    }
}
