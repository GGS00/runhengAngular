package com.cloudchain.admin.web.oms.settings;

import com.alibaba.fastjson.JSONArray;
import com.cloudchain.oms.api.settings.OmsFlowSettingService;
import com.cloudchain.oms.pojo.bo.settings.OmsSettingRequest;
import com.cloudchain.oms.pojo.bo.settings.OmsSettingResponse;
import com.cloudchain.oms.pojo.po.settings.OmsFlowEmployee;
import com.cloudchain.oms.pojo.po.settings.OmsFlowSetting;
import com.cloudchain.util.param.CommonParamUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by lihao on 2017/4/21.
 */
@Api(value = "goods-api", description = "业务流程配置接口")
@Controller
@RequestMapping("/flowsetting")
public class OmsFlowSettingController {
    private static final Logger LOGGER = LoggerFactory.getLogger(OmsFlowSettingController.class);

    @Autowired
    OmsFlowSettingService flowSettingService;

    /**
     * 获取流程设置
     * @param request
     * @return
     */
    @ApiOperation(value = "查询业务流程的所有配置")
    @ResponseBody
    @RequestMapping(value = "/getFlows", method = RequestMethod.GET)
    public OmsSettingResponse getFlows(HttpServletRequest request){
        LOGGER.info("OmsFlowSettingController.getFlows() IN");
        String userId = CommonParamUtil.getUserFromSession(request).getUserId();
        OmsSettingRequest req = new OmsSettingRequest();
        req.setUserId(userId);
        OmsSettingResponse resp = flowSettingService.getAllFlowSettings(req);
        LOGGER.info("OmsFlowSettingController.getFlows() OUT");
        return resp;
    }

    /**
     *
     * @param request
     * @return
     */
    @ApiOperation(value = "保存流程配置")
    @ResponseBody
    @RequestMapping(value= "/saveFlowSettings", method = RequestMethod.POST)
    public OmsSettingResponse saveFlowSettings(HttpServletRequest request){
        LOGGER.info("OmsFlowSettingController.saveFlowSettings() IN");
        OmsSettingRequest req = new OmsSettingRequest();
        List<OmsFlowSetting> flowSettings = JSONArray.parseArray(request.getParameter("flowSettings"), OmsFlowSetting.class);
        req.setFlowSettings(flowSettings);
        OmsSettingResponse resp = flowSettingService.saveFlowSetting(req);
        LOGGER.info("OmsFlowSettingController.saveFlowSettings() OUT");
        return resp;
    }

    /**
     *
     * @return
     */
    @ApiOperation(value = "给每一个步骤绑定员工")
    @ResponseBody
    @RequestMapping(value = "/bindEmp", method = RequestMethod.POST)
    public OmsSettingResponse bindEmp(HttpServletRequest request){
        LOGGER.info("OmsFlowSettingController.bindEmp() IN");
        OmsSettingRequest req = new OmsSettingRequest();
        List<OmsFlowEmployee> emps = JSONArray.parseArray(request.getParameter("emps"), OmsFlowEmployee.class);
        req.setEmps(emps);
        OmsSettingResponse resp = flowSettingService.bindEmp(req);
        LOGGER.info("OmsFlowSettingController.bindEmp() OUT");
        return resp;
    }

    /**
     *
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getBindedEmp/{flowId}", method = RequestMethod.GET)
    public OmsSettingResponse getBindedEmp(@PathVariable String flowId){
        LOGGER.info("OmsFlowSettingController.getBinded() IN");
        OmsSettingRequest req = new OmsSettingRequest();
        req.setFlowId(flowId);
        OmsSettingResponse resp = flowSettingService.getBindedEmps(req);
        LOGGER.info("OmsFlowSettingController.getBinded() OUT");
        return resp;
    }
}
