package com.cloudchain.admin.web.oms.settings;


import com.cloudchain.oms.api.rule.OmsRuleSettingService;
import com.cloudchain.oms.pojo.bo.rule.OmsRuleSettingRequest;
import com.cloudchain.oms.pojo.bo.rule.OmsRuleSettingResponse;
import com.cloudchain.oms.pojo.po.rule.RuleItem;
import com.cloudchain.platform.pojo.bo.Request;
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
import java.util.ArrayList;
import java.util.List;

/**
 * Created by liwei on 2017/7/19.
 */
@Controller
@RequestMapping("/orderDealRule")
public class OmsOrderDealRuleController {
    private static final Logger logger= LoggerFactory.getLogger(OmsOrderDealRuleController.class);
    @Autowired
    private OmsRuleSettingService omsRuleSettingService;


    @ApiOperation(value = "新增审单规则")
    @ResponseBody
    @RequestMapping(value ="/examineRule/saveExamineRule", method = RequestMethod.POST)
    public OmsRuleSettingResponse saveExamineRule(HttpServletRequest request, String ruleType,String ruleName, String autoExamine,String autoDelivery){
        logger.debug("OmsOrderDealRuleController.saveExamineRule IN");

        List<RuleItem> list=new ArrayList<>();
        RuleItem ruleItem1 = new RuleItem();
        ruleItem1.setParamName("IS_AUTO_GENERATE_INVOICE");
        ruleItem1.setParamValue(autoDelivery);
        list.add(ruleItem1);
        RuleItem ruleItem2 = new RuleItem();
        ruleItem2.setParamName("IS_AUTO_AUDIT_ORDER");
        ruleItem2.setParamValue(autoExamine);
        list.add(ruleItem2);

        OmsRuleSettingRequest omsRuleSettingRequest = new OmsRuleSettingRequest();
        CommonParamUtil.setOperator(request,omsRuleSettingRequest);
        omsRuleSettingRequest.setGroupCode(ruleType);
        omsRuleSettingRequest.setGroupDesc(ruleName);
        omsRuleSettingRequest.setRuleItems(list);
        OmsRuleSettingResponse omsRuleSettingResponse = omsRuleSettingService.saveRule(omsRuleSettingRequest);
        logger.debug("OmsOrderDealRuleController.saveExamineRule OUT");
        return omsRuleSettingResponse;
    }


    @ApiOperation(value = "查询审单规则")
    @ResponseBody
    @RequestMapping(value ="/examineRule/queryExamineRule",method = RequestMethod.POST)
    public OmsRuleSettingResponse queryExamineRule(HttpServletRequest request, String ruleType){
        logger.debug("OmsOrderDealRuleController.queryExamineRule IN");
        OmsRuleSettingRequest omsRuleSettingRequest = new OmsRuleSettingRequest();
        CommonParamUtil.setOperator(request,omsRuleSettingRequest);
        omsRuleSettingRequest.setGroupCode(ruleType);
        OmsRuleSettingResponse omsRuleSettingResponse = omsRuleSettingService.queryRule(omsRuleSettingRequest);
        logger.debug("OmsOrderDealRuleController.queryExamineRule OUT");
        return omsRuleSettingResponse;
    }
}
