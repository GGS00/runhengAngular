package com.cloudchain.admin.web.wms;

import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.feetype.WmsFeeTypeService;
import com.cloudchain.wms.pojo.bo.fee.WmsFeeRequest;
import com.cloudchain.wms.pojo.bo.fee.WmsFeeResponse;
import com.cloudchain.wms.pojo.po.WmsFeeType;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by LiuKai on 2017/7/26.
 */
@Controller
@RequestMapping("/wmsFeeType")
public class WmsFeeTypeController {

    private static final Logger logger = LoggerFactory.getLogger(WmsFeeTypeController.class);

    @Autowired
    private WmsFeeTypeService feeTypeService;

    /**
     * 新增费用类型
     * @param request HttpServletRequest
     * @param feeType WmsFeeType
     * @return WmsFeeResponse
     */
    @ApiOperation(value = "新增费用类型")
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public WmsFeeResponse add(HttpServletRequest request, @RequestBody WmsFeeType feeType){
        logger.info("[WmsFeeTypeController.add] IN");

        WmsFeeRequest req = new WmsFeeRequest();
        CommonParamUtil.setWmsOperator(request, req);
        req.setFeeType(feeType);
        WmsFeeResponse resp = feeTypeService.addFeeType(req);
        logger.info("[WmsFeeTypeController.add] OUT");
        return resp;
    }

    /**
     * 修改费用类型
     * @param request
     * @param feeType
     * @return
     */
    @ApiOperation(value = "修改费用类型")
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public WmsFeeResponse update(HttpServletRequest request, @RequestBody WmsFeeType feeType){
        logger.info("[WmsFeeTypeController.update] IN");

        WmsFeeRequest req = new WmsFeeRequest();
        CommonParamUtil.setWmsOperator(request, req);
        req.setFeeType(feeType);
        WmsFeeResponse resp = feeTypeService.updateFeeType(req);
        logger.info("[WmsFeeTypeController.update] OUT");
        return resp;
    }


    /**
     *删除费用类型
     * @param request
     * @param id
     * @return
     */
    @ApiOperation(value = "删除费用类型")
    @RequestMapping(value = "/delete/{id}", method = RequestMethod.POST)
    @ResponseBody
    public WmsFeeResponse delete(HttpServletRequest request, @PathVariable String id){
        logger.info("[WmsFeeTypeController.delete] IN");

        WmsFeeRequest req = new WmsFeeRequest();
        CommonParamUtil.setWmsOperator(request, req);
        req.setId(id);
        WmsFeeResponse resp = feeTypeService.deleteFeeType(req);
        logger.info("[WmsFeeTypeController.delete] OUT");
        return resp;
    }

    /**
     * 费用类型详情
     * @param request
     * @param id
     * @return
     */
    @ApiOperation(value = "费用类型详情")
    @RequestMapping(value = "/load/{id}", method = RequestMethod.GET)
    @ResponseBody
    public WmsFeeResponse load(HttpServletRequest request, @PathVariable String id){
        logger.info("[WmsFeeTypeController.load] IN");

        WmsFeeRequest req = new WmsFeeRequest();
        CommonParamUtil.setWmsOperator(request, req);
        req.setId(id);
        WmsFeeResponse resp = feeTypeService.lodaFeeType(req);
        logger.info("[WmsFeeTypeController.load] OUT");
        return resp;
    }

    @ApiOperation(value = "费用类型列表")
    @RequestMapping(value = "/getList", method = RequestMethod.GET)
    @ResponseBody
    public WmsFeeResponse getList(HttpServletRequest request){
        logger.info("[WmsFeeTypeController.load] IN");

        WmsFeeRequest req = new WmsFeeRequest();
        CommonParamUtil.setWmsOperator(request, req);
        Map<String, Object> params = new HashMap<>();
        params.put("userId", req.getUserId());

        req.setParams(params);
        WmsFeeResponse resp = feeTypeService.getFeeTypeList(req);
        logger.info("[WmsFeeTypeController.load] OUT");
        return resp;
    }
}
