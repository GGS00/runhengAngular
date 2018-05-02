package com.cloudchain.admin.web.lms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.lms.api.admin.bis.LmsBankAccountService;
import com.cloudchain.lms.api.admin.bis.LmsCustomerService;
import com.cloudchain.lms.pojo.bo.admin.account.LmsBankAccountRequest;
import com.cloudchain.lms.pojo.bo.admin.account.LmsBankAccountResponse;
import com.cloudchain.lms.pojo.bo.admin.customer.LmsCustomerRequest;
import com.cloudchain.lms.pojo.bo.admin.customer.LmsCustomerResponse;
import com.cloudchain.lms.pojo.po.LmsBankAccount;
import com.cloudchain.lms.pojo.po.LmsCustomer;
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
 * Created by liwei on 2017/5/13.
 */
@Controller
@RequestMapping("/lmsBankAccount")
public class LmsBankAccountController {

    @Autowired
    private LmsBankAccountService lmsBankAccountService;

    private static final Logger logger = LoggerFactory.getLogger(LmsBankAccountController.class);

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public String add(HttpServletRequest request, LmsBankAccount lmsBankAccount) {
        logger.info("[LmsBankAccountController.add] IN");
        LmsBankAccountRequest lmsBankAccountRequest=new LmsBankAccountRequest();
        lmsBankAccountRequest.setLmsBankAccount(lmsBankAccount);
        CommonParamUtil.setLmsOperator(request,lmsBankAccountRequest);
        LmsBankAccountResponse lmsBankAccountResponse=lmsBankAccountService.addAccount(lmsBankAccountRequest);
        String retString = null;
        if (ResultCode.SUCCESS.equals(lmsBankAccountResponse.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(lmsBankAccountResponse.getMsg());
        }
        logger.info("[LmsBankAccountController.add] OUT");
        return retString;
    }

    @RequestMapping(value = "/updateStatus", method = RequestMethod.POST)
    @ResponseBody
    public String updateStatus(HttpServletRequest request, String ids,String command) {
        logger.info("[LmsBankAccountController.updateStatus] IN");
        LmsBankAccountRequest lmsBankAccountRequest=new LmsBankAccountRequest();
        lmsBankAccountRequest.setCommand(command);
        lmsBankAccountRequest.setId(ids);
        CommonParamUtil.setLmsOperator(request,lmsBankAccountRequest);
        LmsBankAccountResponse lmsBankAccountResponse=lmsBankAccountService.updateAccountStatus(lmsBankAccountRequest);
        String retString = null;
        if (ResultCode.SUCCESS.equals(lmsBankAccountResponse.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(lmsBankAccountResponse.getMsg());
        }
        logger.info("[LmsBankAccountController.updateStatus] OUT");
        return retString;
    }



    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    @ResponseBody
    public String edit(HttpServletRequest request, LmsBankAccount lmsBankAccount ) {
        logger.info("[LmsBankAccountController.edit] IN");
        LmsBankAccountRequest lmsBankAccountRequest=new LmsBankAccountRequest();
        lmsBankAccountRequest.setLmsBankAccount(lmsBankAccount);
        CommonParamUtil.setLmsOperator(request,lmsBankAccountRequest);
        LmsBankAccountResponse lmsBankAccountResponse=lmsBankAccountService.editAccount(lmsBankAccountRequest);
        String retString = null;
        if (ResultCode.SUCCESS.equals(lmsBankAccountResponse.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(lmsBankAccountResponse.getMsg());
        }
        logger.info("[LmsBankAccountController.edit] OUT");
        return retString;
    }

    @RequestMapping(value = "/load", method = RequestMethod.POST)
    @ResponseBody
    public LmsBankAccount getDetail(String id ) {
        logger.info("[LmsBankAccountController.getDetail] IN");
        LmsBankAccount lmsBankAccount=lmsBankAccountService.load(Long.parseLong(id));
        logger.info("[LmsBankAccountController.getDetail] OUT");
        return lmsBankAccount;
    }
}
