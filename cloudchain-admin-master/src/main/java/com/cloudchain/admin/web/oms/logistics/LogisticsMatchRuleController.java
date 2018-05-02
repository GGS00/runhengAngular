package com.cloudchain.admin.web.oms.logistics;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.oms.api.logistics.OmsExternalLogisticsCompanyService;
import com.cloudchain.oms.api.logistics.OmsLogisticsMatchRuleService;
import com.cloudchain.oms.pojo.bo.logistics.externallogisticscomp.ExternalLogisticsCompanyRequest;
import com.cloudchain.oms.pojo.bo.logistics.externallogisticscomp.ExternalLogisticsCompanyResponse;
import com.cloudchain.oms.pojo.bo.logistics.logisticsmatchrule.LogisticsMatchRuleRequest;
import com.cloudchain.oms.pojo.bo.logistics.logisticsmatchrule.LogisticsMatchRuleResponse;
import com.cloudchain.oms.pojo.po.logistics.ExternalLogisticsCompany;
import com.cloudchain.oms.pojo.po.logistics.LogisticsMatchRule;
import com.cloudchain.util.param.CommonParamUtil;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;

/**
 * Created by liwei on 2017/7/3.
 */
@Controller
@RequestMapping("/logisticsMatchRule")
public class LogisticsMatchRuleController {

    private static final Logger logger= LoggerFactory.getLogger(LogisticsMatchRuleController.class);
    @Autowired
    private OmsLogisticsMatchRuleService omsLogisticsMatchRuleService;

    @ResponseBody
    @ApiOperation(value = "新建物流匹配规则")
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public LogisticsMatchRuleResponse add(HttpServletRequest request, LogisticsMatchRule logisticsMatchRule,String ruleItemString,String shipAreas,
                                          @DateTimeFormat(pattern = "yyyy-MM-dd") Date invalidDate, @DateTimeFormat(pattern = "yyyy-MM-dd") Date activeDate){
        logger.info("LogisticsMatchRuleController.add() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        if(invalidDate!=null){
            logisticsMatchRule.setInvalidTime(invalidDate);
        }
        logisticsMatchRule.setActiveTime(activeDate);
        LogisticsMatchRuleRequest logisticsMatchRuleRequest = new LogisticsMatchRuleRequest();
        CommonParamUtil.setOperator(request,logisticsMatchRuleRequest);
        logisticsMatchRuleRequest.setRuleItemString(ruleItemString);
        logisticsMatchRuleRequest.setShipAreas(shipAreas);
        logisticsMatchRuleRequest.setLogisticsMatchRule(logisticsMatchRule);
        LogisticsMatchRuleResponse response = omsLogisticsMatchRuleService.addMatchRule(logisticsMatchRuleRequest);
        logger.info("LogisticsMatchRuleController.add() OUT");
        return response;
    }

    @ResponseBody
    @ApiOperation(value = "修改物流匹配规则")
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public LogisticsMatchRuleResponse update(HttpServletRequest request,LogisticsMatchRule logisticsMatchRule,String ruleItemString,String shipAreas,
                                             @DateTimeFormat(pattern = "yyyy-MM-dd") Date invalidDate, @DateTimeFormat(pattern = "yyyy-MM-dd") Date activeDate){
        logger.info("LogisticsMatchRuleController.add() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        if(invalidDate!=null){
            logisticsMatchRule.setInvalidTime(invalidDate);
        }
        logisticsMatchRule.setActiveTime(activeDate);
        LogisticsMatchRuleRequest logisticsMatchRuleRequest = new LogisticsMatchRuleRequest();
        CommonParamUtil.setOperator(request,logisticsMatchRuleRequest);
        logisticsMatchRuleRequest.setRuleItemString(ruleItemString);
        logisticsMatchRuleRequest.setShipAreas(shipAreas);
        logisticsMatchRuleRequest.setLogisticsMatchRule(logisticsMatchRule);
        LogisticsMatchRuleResponse response = omsLogisticsMatchRuleService.editMatchRule(logisticsMatchRuleRequest);
        logger.info("LogisticsMatchRuleController.add() OUT");
        return response;
    }

    @ResponseBody
    @ApiOperation(value = "获取单条物流匹配规则信息")
    @RequestMapping(value = "/load", method = RequestMethod.POST)
    public LogisticsMatchRuleResponse load(HttpServletRequest request,String id){
        logger.info("LogisticsMatchRuleController.add() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        LogisticsMatchRuleRequest logisticsMatchRuleRequest = new LogisticsMatchRuleRequest();
        CommonParamUtil.setOperator(request,logisticsMatchRuleRequest);
        logisticsMatchRuleRequest.setId(id);
        LogisticsMatchRuleResponse response = omsLogisticsMatchRuleService.loadMatchRule(logisticsMatchRuleRequest);
        logger.info("LogisticsMatchRuleController.add() OUT");
        return response;
    }

    @ResponseBody
    @ApiOperation(value = "删除物流匹配规则")
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public LogisticsMatchRuleResponse delete(HttpServletRequest request,String id){
        logger.info("LogisticsMatchRuleController.delete() IN");
        LogisticsMatchRuleRequest logisticsMatchRuleRequest = new LogisticsMatchRuleRequest();
        logisticsMatchRuleRequest.setId(id);
        LogisticsMatchRuleResponse response = omsLogisticsMatchRuleService.deleteMatchRule(logisticsMatchRuleRequest);
        logger.info("LogisticsMatchRuleController.delete() OUT");
        return response;
    }
}
