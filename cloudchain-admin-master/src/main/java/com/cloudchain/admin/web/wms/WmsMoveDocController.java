package com.cloudchain.admin.web.wms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.movedoc.WmsMoveDocService;
import com.cloudchain.wms.pojo.bo.movedoc.WmsMoveDocRequest;
import com.cloudchain.wms.pojo.bo.movedoc.WmsMoveDocResponse;
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
import java.math.BigDecimal;

/**
 * Created by wangqing on 2017/6/20.
 */
@Controller
@RequestMapping("/wmsMoveDoc")
public class WmsMoveDocController {
    private static final Logger logger = LoggerFactory.getLogger(WmsMoveDocController.class);

    @Autowired
    WmsMoveDocService wmsMoveDocService;

    @ApiOperation(value = "新建移位申请")
    @RequestMapping(value = "/createMoveDocApply", method = RequestMethod.POST)
    @ResponseBody
    public String createMoveDocApply(HttpServletRequest request){
        logger.info("[WmsMoveDocController.createMoveDocApply] IN");
        String retString = null;
        WmsMoveDocRequest req = new WmsMoveDocRequest();
        CommonParamUtil.setWmsOperator(request,req);

        String oriCode = request.getParameter("oriCode");
        String oriType = request.getParameter("oriType");
        String productKeyId = request.getParameter("productKeyId");
        String productId = request.getParameter("productId");
        String srcLocationId = request.getParameter("srcLocationId");
        String destLocationId = request.getParameter("destLocationId");
        String moveQuantity = request.getParameter("moveQuantity");
        String description = request.getParameter("description");
        String skuName = request.getParameter("skuName");
        String srcLocationMark = request.getParameter("srcLocationMark");

        req.setOriCode(oriCode);
        req.setOriType(oriType);
        req.setProductKeyId(productKeyId);
        req.setSkuName(skuName);
        req.setProductId(productId);
        req.setSrcLocationId(srcLocationId);
        req.setSrcLocationMark(srcLocationMark);
        req.setDestLocationId(destLocationId);
        req.setMoveQuantity(new BigDecimal(moveQuantity));
        req.setDescription(description);

        WmsMoveDocResponse response = wmsMoveDocService.createMoveDocApply(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsMoveDocController.createMoveDocApply] OUT");
        return retString;
    }

    @ApiOperation(value = "移位申请 审批通过")
    @RequestMapping(value = "/passMoveDocApply/{moveDocId}", method = RequestMethod.GET)
    @ResponseBody
    public String passMoveDocApply(HttpServletRequest request, @PathVariable String moveDocId){
        logger.info("[WmsMoveDocController.passMoveDocApply] IN");
        String retString = null;
        WmsMoveDocRequest req = new WmsMoveDocRequest();
        CommonParamUtil.setWmsOperator(request,req);
        req.setId(moveDocId);
        WmsMoveDocResponse response = wmsMoveDocService.passMoveDocApply(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsMoveDocController.passMoveDocApply] OUT");
        return retString;
    }

    @ApiOperation(value = "移位申请 审批驳回")
    @RequestMapping(value = "/rebutMoveDocApply/{moveDocId}", method = RequestMethod.GET)
    @ResponseBody
    public String rebutMoveDocApply(HttpServletRequest request, @PathVariable String moveDocId){
        logger.info("[WmsMoveDocController.rebutMoveDocApply] IN");
        String retString = null;
        WmsMoveDocRequest req = new WmsMoveDocRequest();
        CommonParamUtil.setWmsOperator(request,req);
        req.setId(moveDocId);
        WmsMoveDocResponse response = wmsMoveDocService.rebutMoveDocApply(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsMoveDocController.rebutMoveDocApply] OUT");
        return retString;
    }

    @ApiOperation(value = "移位申请 删除")
    @RequestMapping(value = "/delMoveDocApply/{moveDocId}", method = RequestMethod.GET)
    @ResponseBody
    public String delMoveDocApply(HttpServletRequest request, @PathVariable String moveDocId){
        logger.info("[WmsMoveDocController.delMoveDocApply] IN");
        String retString = null;
        WmsMoveDocRequest req = new WmsMoveDocRequest();
        CommonParamUtil.setWmsOperator(request,req);
        req.setId(moveDocId);
        WmsMoveDocResponse response = wmsMoveDocService.delMoveDocApply(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsMoveDocController.delMoveDocApply] OUT");
        return retString;
    }

    @ApiOperation(value = "新建货权转移申请")
    @RequestMapping(value = "/createMoveOwnerApply", method = RequestMethod.POST)
    @ResponseBody
    public String createMoveOwnerApply(HttpServletRequest request){
        logger.info("[WmsMoveDocController.createMoveOwnerApply] IN");
        String retString = null;
        WmsMoveDocRequest req = new WmsMoveDocRequest();
        CommonParamUtil.setWmsOperator(request,req);

        String oriCode = request.getParameter("oriCode");
        String oriType = request.getParameter("oriType");
        String productKeyId = request.getParameter("productKeyId");
        String productId = request.getParameter("productId");
        String srcLocationId = request.getParameter("srcLocationId");
        String destOwnerId = request.getParameter("destOwnerId");
        String moveQuantity = request.getParameter("moveQuantity");
        String description = request.getParameter("description");
        String skuName = request.getParameter("skuName");

        req.setOriCode(oriCode);
        req.setOriType(oriType);
        req.setProductKeyId(productKeyId);
        req.setSkuName(skuName);
        req.setProductId(productId);
        req.setSrcLocationId(srcLocationId);
        req.setDestOwnerId(destOwnerId);
        req.setMoveQuantity(new BigDecimal(moveQuantity));
        req.setDescription(description);

        WmsMoveDocResponse response = wmsMoveDocService.createMoveOwnerApply(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsMoveDocController.createMoveOwnerApply] OUT");
        return retString;
    }

    @ApiOperation(value = "货权转移 审批通过")
    @RequestMapping(value = "/passMoveOwnerApply/{moveDocId}", method = RequestMethod.GET)
    @ResponseBody
    public String passMoveOwnerApply(HttpServletRequest request, @PathVariable String moveDocId){
        logger.info("[WmsMoveDocController.passMoveOwnerApply] IN");
        String retString = null;
        WmsMoveDocRequest req = new WmsMoveDocRequest();
        CommonParamUtil.setWmsOperator(request,req);
        req.setId(moveDocId);
        WmsMoveDocResponse response = wmsMoveDocService.passMoveOwnerApply(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsMoveDocController.passMoveOwnerApply] OUT");
        return retString;
    }

    @ApiOperation(value = "新建损溢申请")
    @RequestMapping(value = "/createProfitLossApply", method = RequestMethod.POST)
    @ResponseBody
    public String createProfitLossApply(HttpServletRequest request){
        logger.info("[WmsMoveDocController.createProfitLossApply] IN");
        String retString = null;
        WmsMoveDocRequest req = new WmsMoveDocRequest();
        CommonParamUtil.setWmsOperator(request,req);

        String oriCode = request.getParameter("oriCode");
        String oriType = request.getParameter("oriType");
        String productKeyId = request.getParameter("productKeyId");
        String productId = request.getParameter("productId");
        String srcLocationId = request.getParameter("srcLocationId");
        String overFlowType = request.getParameter("overFlowType");
        String moveQuantity = request.getParameter("moveQuantity");
        String description = request.getParameter("description");
        String skuName = request.getParameter("skuName");

        req.setOriCode(oriCode);
        req.setOriType(oriType);
        req.setProductKeyId(productKeyId);
        req.setSkuName(skuName);
        req.setProductId(productId);
        req.setSrcLocationId(srcLocationId);
        req.setOverFlowType(overFlowType);
        req.setMoveQuantity(new BigDecimal(moveQuantity));
        req.setDescription(description);

        WmsMoveDocResponse response = wmsMoveDocService.createProfitLossApply(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsMoveDocController.createProfitLossApply] OUT");
        return retString;
    }

    @ApiOperation(value = "损耗增溢 审批通过")
    @RequestMapping(value = "/passProfitLossApply/{moveDocId}", method = RequestMethod.GET)
    @ResponseBody
    public String passProfitLossApply(HttpServletRequest request, @PathVariable String moveDocId){
        logger.info("[WmsMoveDocController.passProfitLossApply] IN");
        String retString = null;
        WmsMoveDocRequest req = new WmsMoveDocRequest();
        CommonParamUtil.setWmsOperator(request,req);
        req.setId(moveDocId);
        WmsMoveDocResponse response = wmsMoveDocService.passProfitLossApply(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsMoveDocController.passProfitLossApply] OUT");
        return retString;
    }
}
