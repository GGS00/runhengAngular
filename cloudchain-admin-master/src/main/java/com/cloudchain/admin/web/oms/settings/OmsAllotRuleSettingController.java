package com.cloudchain.admin.web.oms.settings;

import com.alibaba.fastjson.JSON;
import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.oms.api.settings.OmsAllotRuleSettingService;
import com.cloudchain.oms.pojo.bo.settings.OmsSettingRequest;
import com.cloudchain.oms.pojo.bo.settings.OmsSettingResponse;
import com.cloudchain.oms.pojo.po.settings.OmsCoverareaWarehousePriority;
import com.cloudchain.oms.pojo.vo.settings.AllotRuleModel;
import com.cloudchain.oms.pojo.vo.settings.CoverareaWarehousePriorityRuleModel;
import com.cloudchain.platform.util.JacksonUtils;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.warehouse.WmsWarehouseService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 2017/6/27.
 */
@Api(value = "allot-rule-setting-api", description = "配仓规则配置接口")
@Controller
@RequestMapping("/allotsetting")
public class OmsAllotRuleSettingController {
    private static final Logger LOGGER = LoggerFactory.getLogger(OmsAllotRuleSettingController.class);

    @Autowired
    OmsAllotRuleSettingService ruleSettingService;

    @Autowired
    WmsWarehouseService warehouseService;

    /**
     * 保存配仓规则
     * @param request
     * @param ruleModel
     * @return
     */
    @ApiOperation(value = "保存配仓规则")
    @ResponseBody
    @RequestMapping(value = "/saveAllotRule", method = RequestMethod.POST)
    public OmsSettingResponse saveAllotRule(HttpServletRequest request, AllotRuleModel ruleModel){
        LOGGER.info("OmsAllotRuleSettingController.saveAllotRule() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        ruleModel.setUserId(user.getUserId());

        OmsSettingRequest req = new OmsSettingRequest();
        req.setAllotRule(ruleModel);
        OmsSettingResponse resp = ruleSettingService.saveAllotRule(req);
        LOGGER.info("OmsAllotRuleSettingController.saveAllotRule() OUT");
        return resp;
    }

    /**
     * 查询配仓规则
     * @param request
     * @return
     */
    @ApiOperation(value = "查询配仓规则")
    @ResponseBody
    @RequestMapping(value = "/queryAllotRule", method = RequestMethod.GET)
    public OmsSettingResponse queryAllotRule(HttpServletRequest request){
        LOGGER.info("OmsAllotRuleSettingController.queryAllotRule() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        OmsSettingRequest req = new OmsSettingRequest();
        req.setUserId(user.getUserId());

        OmsSettingResponse resp = ruleSettingService.queryAllotRule(req);
        LOGGER.info("OmsAllotRuleSettingController.queryAllotRule() OUT");
        return resp;
    }

    /**
     * 保存仓库优先级规则
     * @param priorityRuleModel
     * @return
     */
    @ApiOperation(value = "保存仓库优先级规则")
    @ResponseBody
    @RequestMapping(value = "/saveWarehousePriorityRule", method = RequestMethod.POST)
    public OmsSettingResponse saveWarehousePriorityRule(@RequestBody CoverareaWarehousePriorityRuleModel priorityRuleModel){
        LOGGER.info("OmsAllotRuleSettingController.saveWarehousePriorityRule() IN");
        OmsSettingRequest req = new OmsSettingRequest();
        req.setPriorityRuleModel(priorityRuleModel);

        OmsSettingResponse resp = ruleSettingService.saveWarehousePriorityRule(req);
        LOGGER.info("OmsAllotRuleSettingController.saveWarehousePriorityRule() OUT");
        return resp;
    }

    /**
     * 删除仓库优先级规则
     * @param priorityId
     * @return
     */
    @ApiOperation(value = "删除仓库优先级规则")
    @ResponseBody
    @RequestMapping(value = "/deleteWarehousePriorityRule/{priorityId}", method = RequestMethod.POST)
    public OmsSettingResponse deleteWarehousePriorityRule(@PathVariable String priorityId){
        LOGGER.info("OmsAllotRuleSettingController.deleteWarehousePriorityRule() IN");
        OmsSettingRequest req = new OmsSettingRequest();
        req.setPriorityId(priorityId);
        OmsSettingResponse resp = ruleSettingService.deleteWarehousePriorityRule(req);
        LOGGER.info("OmsAllotRuleSettingController.deleteWarehousePriorityRule() OUT");
        return resp;
    }

    /**
     * 删除仓库优先级
     * @param wRuleId
     * @return
     */
    @ApiOperation(value = "删除仓库优先级规则")
    @ResponseBody
    @RequestMapping(value = "/deleteWarehousePriority/{wRuleId}", method = RequestMethod.POST)
    public OmsSettingResponse deleteWarehousePriority(@PathVariable String wRuleId){
        LOGGER.info("OmsAllotRuleSettingController.deleteWarehousePriorityRule() IN");
        OmsSettingRequest req = new OmsSettingRequest();
        req.setwRuleId(wRuleId);
        OmsSettingResponse resp = ruleSettingService.deleteWarehousePriority(req);
        LOGGER.info("OmsAllotRuleSettingController.deleteWarehousePriorityRule() OUT");
        return resp;
    }

    /**
     * 查询仓库优先级规则
     * @param priorityId
     * @return
     */
    @ApiOperation(value = "查询仓库优先级规则")
    @ResponseBody
    @RequestMapping(value = "/queryWarehousePriorityRule/{priorityId}", method = RequestMethod.GET)
    public OmsSettingResponse queryWarehousePriorityRule(@PathVariable String priorityId){
        LOGGER.info("OmsAllotRuleSettingController.queryWarehousePriorityRule() IN");
        OmsSettingRequest req = new OmsSettingRequest();
        req.setPriorityId(priorityId);
        OmsSettingResponse resp = ruleSettingService.queryWarehousePriorityRule(req);
        LOGGER.info("OmsAllotRuleSettingController.queryWarehousePriorityRule() OUT");
        return resp;
    }

    /**
     *
     * @param request
     * @return
     */
    @ApiOperation(value = "查询收货地区可发货仓库列表")
    @ResponseBody
    @RequestMapping(value = "/queryCoverAreaWarehouses", method = RequestMethod.GET)
    public OmsSettingResponse queryCoverAreaWarehouses(HttpServletRequest request){
        LOGGER.info("OmsAllotRuleSettingController.queryCoverAreaWarehouses() IN");
        String provinceId = request.getParameter("provinceId");
        String cityId = request.getParameter("cityId");
        String districtId = request.getParameter("districtId");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("qryProvince", provinceId);
        params.put("qryCity", cityId);
        params.put("qryDistrict", districtId);
        params.put("userId", user.getUserId());

        params.put("qryType", "01");
        String warehouseJson = warehouseService.qryUsableWareByUserIdNoPage(params);
        Map<String, Object> warehouseMap = JacksonUtils.json2object(warehouseJson, Map.class);
        OmsSettingResponse resp = new OmsSettingResponse();
        resp.setObj(warehouseMap);
        LOGGER.info("OmsAllotRuleSettingController.queryCoverAreaWarehouses() IN");
        return resp;
    }
    /**
     * 上下移动仓库顺序
     * @return
     */
    @ApiOperation(value = "上下移动仓库顺序")
    @ResponseBody
    @RequestMapping(value = "/moveWarehousePriority", method = RequestMethod.POST)
    public OmsSettingResponse moveWarehousePriority(HttpServletRequest request){
        LOGGER.info("OmsAllotRuleSettingController.moveWarehousePriority() IN");
        String jsonStr = request.getParameter("jsonStr");
        List<OmsCoverareaWarehousePriority> list = JSON.parseArray(jsonStr, OmsCoverareaWarehousePriority.class);
        OmsSettingRequest req = new OmsSettingRequest();
        req.setMovePriorityList(list);

        OmsSettingResponse resp = ruleSettingService.moveWarehousePriority(req);
        LOGGER.info("OmsAllotRuleSettingController.moveWarehousePriority() OUT");
        return resp;
    }

}
