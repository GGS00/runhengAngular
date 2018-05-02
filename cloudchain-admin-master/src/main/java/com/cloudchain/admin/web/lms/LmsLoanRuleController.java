package com.cloudchain.admin.web.lms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.lms.api.admin.bis.LmsLoanRuleService;
import com.cloudchain.lms.pojo.bo.admin.loanrule.LmsLoanRuleRequest;
import com.cloudchain.lms.pojo.bo.admin.loanrule.LmsLoanRuleResponse;
import com.cloudchain.lms.pojo.po.LmsLoanRule;
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
 * Created by liwei on 2017/5/12.
 */
@Controller
@RequestMapping("/lmsLoanRule")
public class LmsLoanRuleController {

    @Autowired
    private LmsLoanRuleService loanRuleService;

    private static final Logger logger = LoggerFactory.getLogger(LmsLoanRuleController.class);

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public String add(HttpServletRequest request, LmsLoanRule loanRule) {
        logger.info("[LmsLoanRuleController.add] IN");
        LmsLoanRuleRequest loanRuleRequest=new LmsLoanRuleRequest();
        loanRuleRequest.setLoanRule(loanRule);
        CommonParamUtil.setLmsOperator(request,loanRuleRequest);
        LmsLoanRuleResponse loanRuleResponse=loanRuleService.addBisLoanRule(loanRuleRequest);
        String retString = null;
        if (ResultCode.SUCCESS.equals(loanRuleResponse.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(loanRuleResponse.getMsg());
        }
        logger.info("[LmsLoanRuleController.add] OUT");
        return retString;
    }

    @RequestMapping(value = "/updateStatus", method = RequestMethod.POST)
    @ResponseBody
    public String updateStatus(HttpServletRequest request, String ids,String command) {
        logger.info("[LmsLoanRuleController.updateStatus] IN");
        LmsLoanRuleRequest loanRuleRequest=new LmsLoanRuleRequest();
        loanRuleRequest.setCommand(command);
        loanRuleRequest.setId(ids);
        CommonParamUtil.setLmsOperator(request,loanRuleRequest);
        LmsLoanRuleResponse loanRuleResponse=loanRuleService.updateStatus(loanRuleRequest);
        String retString = null;
        if (ResultCode.SUCCESS.equals(loanRuleResponse.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(loanRuleResponse.getMsg());
        }
        logger.info("[LmsLoanRuleController.updateStatus] OUT");
        return retString;
    }

    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    @ResponseBody
    public String edit(HttpServletRequest request, LmsLoanRule loanRule ) {
        logger.info("[LmsLoanRuleController.edit] IN");
        LmsLoanRuleRequest loanRuleRequest=new LmsLoanRuleRequest();
        loanRuleRequest.setLoanRule(loanRule);
        CommonParamUtil.setLmsOperator(request,loanRuleRequest);
        LmsLoanRuleResponse loanRuleResponse=loanRuleService.editBisLoanRule(loanRuleRequest);
        String retString = null;
        if (ResultCode.SUCCESS.equals(loanRuleResponse.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(loanRuleResponse.getMsg());
        }
        logger.info("[LmsLoanRuleController.edit] OUT");
        return retString;
    }

    @RequestMapping(value = "/load", method = RequestMethod.POST)
    @ResponseBody
    public LmsLoanRule getDetail(String id ) {
        logger.info("[LmsLoanRuleController.getDetail] IN");
        LmsLoanRule loanRule=loanRuleService.load(Long.parseLong(id));
        return loanRule;
    }
}
