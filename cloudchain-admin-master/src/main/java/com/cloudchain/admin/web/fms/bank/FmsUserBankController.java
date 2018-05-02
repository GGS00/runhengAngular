package com.cloudchain.admin.web.fms.bank;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.admin.model.fms.FmsUserBankModel;
import com.cloudchain.fms.api.admin.bis.FmsUserBankService;
import com.cloudchain.fms.pojo.bo.bank.FmsUserBankRequest;
import com.cloudchain.fms.pojo.bo.bank.FmsUserBankResponse;
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

@Api(value = "fms-userBank-api", description = "用户银行接口")
@Controller
@RequestMapping("/fmsUserBank")
public class FmsUserBankController {
    private static final Logger logger = LoggerFactory.getLogger(FmsUserBankController.class);

    @Autowired
    private FmsUserBankService fmsUserBankService;

    /**
     * 保存银行卡
     * @param request
     * @param model
     * @return
     */
    @ApiOperation(value = "保存银行卡")
    @RequestMapping(value = "/saveUserBank", method = RequestMethod.POST)
    @ResponseBody
    public String saveUserBank(HttpServletRequest request, FmsUserBankModel model) {
        logger.info("[FmsUserBankController.saveUserBank] IN");
        long begin = System.currentTimeMillis();
        String retString = null;

        FmsUserBankRequest req = new FmsUserBankRequest();
        req.setBankId(model.getBankId());
        req.setBankAccout(model.getBankAccout());
        req.setBankAddr(model.getBankAddr());
        req.setIsDefault(model.getIsDefault());

        CommonParamUtil.setUmsUserId(request, req);

        FmsUserBankResponse resp = fmsUserBankService.saveUserBank(req);


        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        } else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }

        long end = System.currentTimeMillis();
        logger.info("[FmsUserBankController.saveUserBank] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

    /**
     * 删除银行卡
     * @param request
     * @param ids
     * @return
     */
    @ApiOperation(value = "删除银行卡")
    @RequestMapping(value = "/batchDeleteUserBank", method = RequestMethod.POST)
    @ResponseBody
    public String batchDeleteUserBank(HttpServletRequest request, String ids) {
        logger.info("[FmsUserBankController.deleteUserBank] IN");
        long begin = System.currentTimeMillis();
        String retString = null;

        FmsUserBankRequest req = new FmsUserBankRequest();
        req.setIds(ids);
        CommonParamUtil.setUmsUserId(request, req);

        FmsUserBankResponse resp = fmsUserBankService.batchDeleteUserBank(req);


        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        } else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }

        long end = System.currentTimeMillis();
        logger.info("[FmsUserBankController.deleteUserBank] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

    /**
     * 设置默认银行卡
     * @param request
     * @param model
     * @return
     */
    @ApiOperation(value = "设置默认银行卡")
    @RequestMapping(value = "/setDefaultUserBank", method = RequestMethod.POST)
    @ResponseBody
    public String setDefaultUserBank(HttpServletRequest request, FmsUserBankModel model) {
        logger.info("[FmsUserBankController.setDefaultUserBank] IN");
        long begin = System.currentTimeMillis();
        String retString = null;

        FmsUserBankRequest req = new FmsUserBankRequest();
        req.setId(model.getId());
        CommonParamUtil.setUmsUserId(request, req);

        FmsUserBankResponse resp = fmsUserBankService.setDefaultUserBank(req);


        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        } else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }

        long end = System.currentTimeMillis();
        logger.info("[FmsUserBankController.setDefaultUserBank] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

    /**
     * 获取用户银行列表
     * @param request
     * @return
     */
    @ApiOperation(value = "获取用户银行列表")
    @RequestMapping(value = "/getUserBankList", method = RequestMethod.GET)
    @ResponseBody
    public FmsUserBankResponse getUserBankList(HttpServletRequest request) {
        logger.info("[FmsUserBankController.getUserBankList] IN");
        long begin = System.currentTimeMillis();

        FmsUserBankRequest req = new FmsUserBankRequest();
        CommonParamUtil.setUmsUserId(request, req);
        FmsUserBankResponse resp = fmsUserBankService.getUserBankList(req);

        long end = System.currentTimeMillis();
        logger.info("[FmsUserBankController.getUserBankList] OUT,cost time:{}s", (end - begin) / 1000d);
        return resp;
    }
}
