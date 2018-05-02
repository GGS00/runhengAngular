package com.cloudchain.admin.web.wms;

import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.requisition.WmsRequisitionItemService;
import com.cloudchain.wms.pojo.bo.requisition.WmsRequisitionRequest;
import com.cloudchain.wms.pojo.bo.requisition.WmsRequisitionResponse;
import com.cloudchain.wms.pojo.po.WmsRequisitionItem;
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
@RequestMapping("/wmsRequisitionItem")
public class WmsRequisitionItemController {

    private static final Logger logger = LoggerFactory.getLogger(WmsRequisitionItemController.class);

    @Autowired
    private WmsRequisitionItemService requisitionItemService;

    /**
     * @Title: add
     * @Description: 新建调拨单明细
     * @return: String
     */
    @ApiOperation(value = "新建调拨单明细")
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public WmsRequisitionResponse add(HttpServletRequest request, @RequestBody WmsRequisitionItem wmsRequisitionItem) {
        WmsRequisitionRequest req = new WmsRequisitionRequest();
        CommonParamUtil.setOperator(request,req);
        req.setWmsRequisitionItem(wmsRequisitionItem);
        WmsRequisitionResponse response = requisitionItemService.addRequisitionItem(req);
        return response;
    }
    /**
     * @Title: add
     * @Description: 更新调拨单明细
     * @return: String
     */
    @ApiOperation(value = "更新调拨单明细")
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public WmsRequisitionResponse update(HttpServletRequest request, @RequestBody WmsRequisitionItem wmsRequisitionItem) {
        WmsRequisitionRequest req = new WmsRequisitionRequest();
        CommonParamUtil.setOperator(request,req);
        req.setWmsRequisitionItem(wmsRequisitionItem);
        WmsRequisitionResponse response = requisitionItemService.updateRequisitionItem(req);
        return response;
    }
    /**
     * @Title: add
     * @Description: 删除调拨单明细
     * @return: String
     */
    @ApiOperation(value = "删除调拨单明细")
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public WmsRequisitionResponse delete(String id) {
        WmsRequisitionRequest req = new WmsRequisitionRequest();
        req.setId(id);
        WmsRequisitionResponse response = requisitionItemService.deleteRequisitionItem(req);
        return response;
    }

}
