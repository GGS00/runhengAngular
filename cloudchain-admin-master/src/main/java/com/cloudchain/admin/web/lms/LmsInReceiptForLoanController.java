package com.cloudchain.admin.web.lms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.lms.api.admin.in.LmsInReceiptForLoanService;
import com.cloudchain.lms.pojo.bo.admin.inreceiptforloan.LmsInReceiptForLoanRequest;
import com.cloudchain.lms.pojo.bo.admin.inreceiptforloan.LmsInReceiptForLoanResponse;
import com.cloudchain.lms.pojo.po.LmsInReceiptForLoan;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by liwei on 2017/5/20.
 */
@Controller
@RequestMapping("/LmsInReceiptForLoan")
public class LmsInReceiptForLoanController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(LmsInReceiptForLoanController.class);

    @Autowired
    protected LmsInReceiptForLoanService inReceiptForLoanService;


    @ApiOperation(value = "加载审批信息")
    @RequestMapping(value = "/load",method = RequestMethod.POST)
    @ResponseBody
    public LmsInReceiptForLoan load(HttpServletRequest request, String id) {
        logger.info("[LmsInboundController.loadInbound] IN");
        LmsInReceiptForLoan inReceiptForLoan = inReceiptForLoanService.load(id);
        logger.info("[LmsInboundController.loadInbound] OUT");
        return inReceiptForLoan;
    }

    @ApiOperation(value = "产品部审批")
    @RequestMapping(value = "/productCheck",method = RequestMethod.POST)
    @ResponseBody
    public String productCheck(HttpServletRequest request, LmsInReceiptForLoan inReceiptForLoan) {
        logger.info("[LmsInReceiptForLoanController.productCheck] IN");
        LmsInReceiptForLoanRequest inReceiptForLoanRequest = new LmsInReceiptForLoanRequest();
        CommonParamUtil.setLmsOperator(request,inReceiptForLoanRequest);
        inReceiptForLoanRequest.setInReceiptForLoan(inReceiptForLoan);
        LmsInReceiptForLoanResponse resp = inReceiptForLoanService.doProductCheck(inReceiptForLoanRequest);
        String retString = null;
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[LmsInReceiptForLoanController.productCheck] OUT");
        return retString;
    }

    @ApiOperation(value = "金融部审批")
    @RequestMapping(value = "/financeCheck",method = RequestMethod.POST)
    @ResponseBody
    public String financeCheck(HttpServletRequest request, LmsInReceiptForLoan inReceiptForLoan) {
        logger.info("[LmsInReceiptForLoanController.productCheck] IN");
        LmsInReceiptForLoanRequest inReceiptForLoanRequest = new LmsInReceiptForLoanRequest();
        CommonParamUtil.setLmsOperator(request,inReceiptForLoanRequest);
        inReceiptForLoanRequest.setInReceiptForLoan(inReceiptForLoan);
        LmsInReceiptForLoanResponse resp = inReceiptForLoanService.doFinanceCheck(inReceiptForLoanRequest);
        String retString = null;
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[LmsInReceiptForLoanController.productCheck] OUT");
        return retString;
    }
    @ApiOperation(value = "总监审批")
    @RequestMapping(value = "/mangerCheck",method = RequestMethod.POST)
    @ResponseBody
    public String mangerCheck(HttpServletRequest request, LmsInReceiptForLoan inReceiptForLoan) {
        logger.info("[LmsInReceiptForLoanController.mangerCheck] IN");
        LmsInReceiptForLoanRequest inReceiptForLoanRequest = new LmsInReceiptForLoanRequest();
        CommonParamUtil.setLmsOperator(request,inReceiptForLoanRequest);
        inReceiptForLoanRequest.setInReceiptForLoan(inReceiptForLoan);
        LmsInReceiptForLoanResponse resp = inReceiptForLoanService.doMangerCheck(inReceiptForLoanRequest);
        String retString = null;
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[LmsInReceiptForLoanController.mangerCheck] OUT");
        return retString;
    }
}
