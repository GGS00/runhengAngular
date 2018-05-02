package com.cloudchain.admin.web.wms;

import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.feetype.WmsOperationFeeService;
import com.cloudchain.wms.pojo.bo.fee.WmsFeeRequest;
import com.cloudchain.wms.pojo.bo.fee.WmsFeeResponse;
import com.cloudchain.wms.pojo.po.WmsWhOperationFee;
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
@RequestMapping("/wmsOptFee")
public class WmsOperationFeeController {

    private static final Logger logger = LoggerFactory.getLogger(WmsOperationFeeController.class);

    @Autowired
    private WmsOperationFeeService operationFeeService;

    /**
     * 新增费用
     * @param request HttpServletRequest
     * @param optType WmsFeeType
     * @return WmsFeeResponse
     */
    @ApiOperation(value = "新增费用")
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public WmsFeeResponse add(HttpServletRequest request, @RequestBody WmsWhOperationFee optType){
        logger.info("[WmsOperationFeeController.add] IN");

        WmsFeeRequest req = new WmsFeeRequest();
        CommonParamUtil.setWmsOperator(request, req);
        req.setOptFee(optType);
        WmsFeeResponse resp = operationFeeService.addOperFee(req);
        logger.info("[WmsOperationFeeController.add] OUT");
        return resp;
    }

    /**
     * 修改费用
     * @param request
     * @param optType
     * @return
     */
    @ApiOperation(value = "修改费用")
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public WmsFeeResponse update(HttpServletRequest request, @RequestBody WmsWhOperationFee optType){
        logger.info("[WmsOperationFeeController.update] IN");

        WmsFeeRequest req = new WmsFeeRequest();
        CommonParamUtil.setWmsOperator(request, req);
        req.setOptFee(optType);
        WmsFeeResponse resp = operationFeeService.updateOperFee(req);
        logger.info("[WmsOperationFeeController.update] OUT");
        return resp;
    }


    /**
     *删除费用
     * @param request
     * @param id
     * @return
     */
    @ApiOperation(value = "删除费用")
    @RequestMapping(value = "/delete/{id}", method = RequestMethod.POST)
    @ResponseBody
    public WmsFeeResponse delete(HttpServletRequest request, @PathVariable String id){
        logger.info("[WmsOperationFeeController.delete] IN");

        WmsFeeRequest req = new WmsFeeRequest();
        CommonParamUtil.setWmsOperator(request, req);
        req.setId(id);
        WmsFeeResponse resp = operationFeeService.deleteOperFee(req);
        logger.info("[WmsOperationFeeController.delete] OUT");
        return resp;
    }

    /**
     * 费用详情
     * @param request
     * @param id
     * @return
     */
    @ApiOperation(value = "费用详情")
    @RequestMapping(value = "/load/{id}", method = RequestMethod.GET)
    @ResponseBody
    public WmsFeeResponse load(HttpServletRequest request, @PathVariable String id){
        logger.info("[WmsOperationFeeController.load] IN");

        WmsFeeRequest req = new WmsFeeRequest();
        CommonParamUtil.setWmsOperator(request, req);
        req.setId(id);
        WmsFeeResponse resp = operationFeeService.loadOperFee(req);
        logger.info("[WmsOperationFeeController.load] OUT");
        return resp;
    }


    /**
     * 查询费用
     * @param request HttpServletRequest
     * @param optType
     * @param releaseId
     * @return
     */
    @ApiOperation(value = "查询费用")
    @RequestMapping(value = "/getList", method = RequestMethod.GET)
    @ResponseBody
    public WmsFeeResponse getList(HttpServletRequest request, Integer optType, String releaseId){
        logger.info("[WmsOperationFeeController.load] IN");

        WmsFeeRequest req = new WmsFeeRequest();
        CommonParamUtil.setWmsOperator(request, req);
        Map<String, Object> params = new HashMap<>();
        params.put("userId", req.getUserId());
        params.put("optType", optType);
        params.put("releaseId", releaseId);
        req.setParams(params);
        WmsFeeResponse resp = operationFeeService.getOperFeeList(req);
        logger.info("[WmsOperationFeeController.load] OUT");
        return resp;
    }
}
