package com.cloudchain.admin.web.lms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.lms.api.admin.pre.LmsPreApplyCreditService;
import com.cloudchain.lms.pojo.bo.admin.customer.LmsCustomerResponse;
import com.cloudchain.lms.pojo.bo.admin.loanrule.LmsLoanRuleResponse;
import com.cloudchain.lms.pojo.bo.admin.preapplycredit.LmsPreApplyCreditRequest;
import com.cloudchain.lms.pojo.bo.admin.preapplycredit.LmsPreApplyCreditResponse;
import com.cloudchain.lms.pojo.po.LmsPreApplyCredit;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by liwei on 2017/5/16.
 */
@Controller
@RequestMapping("/lmsPreApplyCredit")
public class LmsPreApplyCreditController {


    private static final Logger logger = LoggerFactory.getLogger(LmsPreApplyCreditController.class);
    @Autowired
    private LmsPreApplyCreditService applyCreditService;

    @RequestMapping(value = "/load", method = RequestMethod.POST)
    @ResponseBody
    public LmsPreApplyCredit getDetail(String id ) {
        logger.info("[LmsPreApplyCreditController.getDetail] IN");
        LmsPreApplyCredit applyCredit=applyCreditService.load(id);
        logger.info("[LmsPreApplyCreditController.getDetail] OUT");
        return applyCredit;
    }

    @RequestMapping(value = "/approve",method = RequestMethod.POST)
    @ResponseBody
    public String approve(HttpServletRequest request,LmsPreApplyCredit applyCredit){
        logger.info("[LmsPreApplyCreditController.approve] IN");
        LmsPreApplyCreditRequest applyCreditRequest=new LmsPreApplyCreditRequest();
        applyCreditRequest.setPreApplyCredit(applyCredit);
        CommonParamUtil.setLmsOperator(request,applyCreditRequest);
        LmsPreApplyCreditResponse applyCreditResponse=applyCreditService.approveApplyCredit(applyCreditRequest);
        String retString = null;
        if (ResultCode.SUCCESS.equals(applyCreditResponse.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(applyCreditResponse.getMsg());
        }
        logger.info("[LmsPreApplyCreditController.approve] OUT");
        return retString;
    }
}
