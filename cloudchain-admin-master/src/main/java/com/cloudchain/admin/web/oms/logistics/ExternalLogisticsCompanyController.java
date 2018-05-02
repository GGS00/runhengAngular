package com.cloudchain.admin.web.oms.logistics;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.oms.api.logistics.OmsExternalLogisticsCompanyService;
import com.cloudchain.oms.pojo.bo.logistics.externallogisticscomp.ExternalLogisticsCompanyRequest;
import com.cloudchain.oms.pojo.bo.logistics.externallogisticscomp.ExternalLogisticsCompanyResponse;
import com.cloudchain.oms.pojo.po.logistics.ExternalLogisticsCompany;
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
 * Created by liwei on 2017/7/3.
 */
@Controller
@RequestMapping("/externalLogisticsCompany")
public class ExternalLogisticsCompanyController {

    private static final Logger logger= LoggerFactory.getLogger(ExternalLogisticsCompanyController.class);
    @Autowired
    private OmsExternalLogisticsCompanyService externalLogisticsCompanyService;

    @ResponseBody
    @ApiOperation(value = "新建外部物流公司")
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public ExternalLogisticsCompanyResponse add(HttpServletRequest request, ExternalLogisticsCompany externalLogisticsCompany){
        logger.info("ExternalLogisticsCompanyController.add() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        ExternalLogisticsCompanyRequest externalLogisticsCompanyRequest = new ExternalLogisticsCompanyRequest();
        CommonParamUtil.setOperator(request,externalLogisticsCompanyRequest);
        externalLogisticsCompanyRequest.setExternalLogisticsCompany(externalLogisticsCompany);
        ExternalLogisticsCompanyResponse response = externalLogisticsCompanyService.addExternalLogisticsCompany(externalLogisticsCompanyRequest);
        logger.info("ExternalLogisticsCompanyController.add() OUT");
        return response;
    }

    @ResponseBody
    @ApiOperation(value = "修改外部物流公司")
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public ExternalLogisticsCompanyResponse update(HttpServletRequest request, ExternalLogisticsCompany externalLogisticsCompany){
        logger.info("ExternalLogisticsCompanyController.update() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        ExternalLogisticsCompanyRequest externalLogisticsCompanyRequest = new ExternalLogisticsCompanyRequest();
        CommonParamUtil.setOperator(request,externalLogisticsCompanyRequest);
        externalLogisticsCompanyRequest.setExternalLogisticsCompany(externalLogisticsCompany);
        ExternalLogisticsCompanyResponse response = externalLogisticsCompanyService.updateExternalLogisticsCompany(externalLogisticsCompanyRequest);
        logger.info("ExternalLogisticsCompanyController.update() OUT");
        return response;
    }

    @ResponseBody
    @ApiOperation(value = "修改外部物流公司状态")
    @RequestMapping(value = "/updateStatus", method = RequestMethod.POST)
    public ExternalLogisticsCompanyResponse updateStatus(HttpServletRequest request,String ids,String status){
        logger.info("ExternalLogisticsCompanyController.updateStatus() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        ExternalLogisticsCompanyRequest externalLogisticsCompanyRequest = new ExternalLogisticsCompanyRequest();
        CommonParamUtil.setOperator(request,externalLogisticsCompanyRequest);
        externalLogisticsCompanyRequest.setId(ids);
        externalLogisticsCompanyRequest.setStatus(status);
        ExternalLogisticsCompanyResponse response = externalLogisticsCompanyService.updateStatusExternalLogisticsCompany(externalLogisticsCompanyRequest);
        logger.info("ExternalLogisticsCompanyController.updateStatus() OUT");
        return response;
    }

    @ResponseBody
    @ApiOperation(value = "获取单条物流公司信息")
    @RequestMapping(value = "/load", method = RequestMethod.POST)
    public ExternalLogisticsCompanyResponse load(HttpServletRequest request,String id){
        logger.info("ExternalLogisticsCompanyController.load() IN");
        ExternalLogisticsCompanyRequest externalLogisticsCompanyRequest = new ExternalLogisticsCompanyRequest();
        externalLogisticsCompanyRequest.setId(id);
        ExternalLogisticsCompanyResponse response = externalLogisticsCompanyService.loadExternalLogisticsCompany(externalLogisticsCompanyRequest);
        logger.info("ExternalLogisticsCompanyController.load() OUT");
        return response;
    }
}
