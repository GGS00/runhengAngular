package com.cloudchain.admin.web.transport.ship;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.admin.model.tms.TruckModel;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.platform.util.JacksonUtils;
import com.cloudchain.tms.api.TmsShipService;
import com.cloudchain.tms.pojo.bo.ship.TmsShipRequest;
import com.cloudchain.tms.pojo.bo.ship.TmsShipResponse;
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

/**
 * Created by LiuKai on 2017/3/16.
 */
@Api(value = "tms-ship-api", description = "装车发运接口")
@Controller
@RequestMapping("/transport/dispatch/loadup")
public class TmsShipController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(TmsShipController.class);

    @Autowired
    private TmsShipService tmsShipService;

    /**
     * 装车
     * @param request HttpServletRequest
     * @param model TruckModel
     * @return 结果
     */
    @ApiOperation(value = "装车")
    @RequestMapping(value = "/doTruck", method = RequestMethod.POST)
    @ResponseBody
    public String doTruck(HttpServletRequest request, TruckModel model) {
        logger.info("[TmsShipController.doTruck] IN");
        String retString = null;
        TmsShipRequest req = new TmsShipRequest();
        req.setDdId(model.getDdId());
        req.setGoods(model.getGoods());
        req.setSegmentId(model.getSegmentId());
        CommonParamUtil.setTmsOperator(request, req);
        TmsShipResponse resp = tmsShipService.doTruck(req);
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        } else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[TmsShipController.doTruck] OUT");
        return retString;
    }

    /**
     * 派车单详情
     * @param request HttpServletRequest
     * @param ddId 派车单ID
     * @return json
     */
    @ApiOperation(value = "派车单详情")
    @RequestMapping(value = "/detail/{ddId}", method = RequestMethod.GET)
    @ResponseBody
    public String load(HttpServletRequest request, @PathVariable String ddId) {
        logger.info("[TmsShipController.load] IN");
        String retString = null;
        TmsShipRequest req = new TmsShipRequest();
        req.setDdId(ddId);
        TmsShipResponse resp = tmsShipService.load(req);
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = JacksonUtils.object2json(resp.getResultMap());
        } else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }

        logger.info("[TmsShipController.load] OUT");
        return retString;
    }


    /**
     * 根据运单ID查询货品
     * @param request HttpServletRequest
     * @param orderId 运单ID
     * @return json
     */
    @ApiOperation(value = "根据运单ID查询货品")
    @RequestMapping(value = "/scanGoods/{orderId}", method = RequestMethod.GET)
    @ResponseBody
    public String scanGoods(HttpServletRequest request, @PathVariable String orderId) {
        logger.info("[TmsShipController.scanGoods] IN");
        String retString = null;
        TmsShipRequest req = new TmsShipRequest();
        req.setOrderId(orderId);
        TmsShipResponse resp = tmsShipService.loadOrderGoods(req);
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = resp.getRetString();
        } else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }

        logger.info("[TmsShipController.scanGoods] OUT");
        return retString;
    }

    /**
     * 发运
     * @param request HttpServletRequest
     * @param ddId 派车单ID
     * @return json
     */
    @ApiOperation(value = "发运")
    @RequestMapping(value = "/shipment/{ddId}", method = RequestMethod.POST)
    @ResponseBody
    public String ship(HttpServletRequest request,@PathVariable String ddId) {
        logger.info("[TmsShipController.ship] IN");
        String retString = null;
        TmsShipRequest req = new TmsShipRequest();
        req.setDdId(ddId);
        CommonParamUtil.setTmsOperator(request, req);
        TmsShipResponse resp = tmsShipService.ship(req);
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        } else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[TmsShipController.ship] OUT");
        return retString;
    }

}
