package com.cloudchain.admin.web.wms;

import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.requisition.WmsRequisitionService;
import com.cloudchain.wms.pojo.bo.requisition.WmsRequisitionRequest;
import com.cloudchain.wms.pojo.bo.requisition.WmsRequisitionResponse;
import com.cloudchain.wms.pojo.po.WmsRequisition;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;


/**
 * Created by liwei on 2017/7/26.
 */
@Controller
@RequestMapping("/wmsRequisition")
public class WmsRequisitionController {

    private static final Logger logger = LoggerFactory.getLogger(WmsRequisitionController.class);
    @Autowired
    private WmsRequisitionService requisitionService;

    /**
     * @Title: add
     * @Description: 新建调拨单
     * @return: String
     */
    @ApiOperation(value = "新建调拨单")
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public WmsRequisitionResponse add(HttpServletRequest request, @RequestBody WmsRequisition wmsRequisition) {
        logger.debug("WmsRequisitionController.add IN");
        WmsRequisitionRequest req = new WmsRequisitionRequest();
        CommonParamUtil.setOperator(request,req);
        req.setWmsRequisition(wmsRequisition);
        WmsRequisitionResponse response = requisitionService.addRequisition(req);
        logger.debug("WmsRequisitionController.add OUT");
        return response;

    }
    /**
     * @Title: update
     * @Description: 修改调拨单
     * @return: String
     */
    @ApiOperation(value = "修改调拨单")
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public WmsRequisitionResponse update(HttpServletRequest request,@RequestBody WmsRequisition wmsRequisition) {
        logger.debug("WmsRequisitionController.update IN");
        WmsRequisitionRequest req = new WmsRequisitionRequest();
        CommonParamUtil.setOperator(request,req);
        req.setWmsRequisition(wmsRequisition);
        WmsRequisitionResponse response = requisitionService.updateRequisition(req);
        logger.debug("WmsRequisitionController.update OUT");
        return response;
    }
    /**
     * @Title: delete
     * @Description: 删除调拨单
     * @return: String
     */
    @ApiOperation(value = "删除调拨单")
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public WmsRequisitionResponse delete(String id) {
        logger.debug("WmsRequisitionController.delete IN");
        WmsRequisitionRequest req = new WmsRequisitionRequest();
        req.setId(id);
        WmsRequisitionResponse response = requisitionService.deleteRequisition(req);
        logger.debug("WmsRequisitionController.delete OUT");
        return response;
    }

    /**
     * @Title: load
     * @Description: 查询单条调拨单
     * @return: String
     */
    @ApiOperation(value = "查询单条调拨单")
    @RequestMapping(value = "/load", method = RequestMethod.POST)
    @ResponseBody
    public WmsRequisitionResponse load(String id) {
        logger.debug("WmsRequisitionController.load IN");
        WmsRequisitionRequest req = new WmsRequisitionRequest();
        req.setId(id);
        WmsRequisitionResponse response = requisitionService.loadRequisition(req);
        logger.debug("WmsRequisitionController.load OUT");
        return response;
    }
    /**
     * @Title: active
     * @Description: 生效调拨单
     * @return: String
     */
    @ApiOperation(value = "生效调拨单")
    @RequestMapping(value = "/active", method = RequestMethod.POST)
    @ResponseBody
    public WmsRequisitionResponse active(HttpServletRequest request,String id) {
        logger.debug("WmsRequisitionController.active IN");
        WmsRequisitionRequest req = new WmsRequisitionRequest();
        CommonParamUtil.setOperator(request,req);
        req.setId(id);
        WmsRequisitionResponse response = requisitionService.active(req);
        logger.debug("WmsRequisitionController.active OUT");
        return response;
    }

    /**
     * @Title: active
     * @Description: 失效调拨单
     * @return: String
     */
    @ApiOperation(value = "失效调拨单")
    @RequestMapping(value = "/invalid", method = RequestMethod.POST)
    @ResponseBody
    public WmsRequisitionResponse invalid(HttpServletRequest request,String id) {
        logger.debug("WmsRequisitionController.invalid IN");
        WmsRequisitionRequest req = new WmsRequisitionRequest();
        CommonParamUtil.setOperator(request,req);
        req.setId(id);
        WmsRequisitionResponse response = requisitionService.invalid(req);
        logger.debug("WmsRequisitionController.invalid OUT");
        return response;
    }
}
