package com.cloudchain.admin.web.wms;

import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.ship.WmsPackageTaskService;
import com.cloudchain.wms.pojo.bo.ship.WmsPackageTaskRequest;
import com.cloudchain.wms.pojo.bo.ship.WmsPackageTaskResponse;
import io.swagger.annotations.Api;
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
 * Created by LiuKai on 2017/7/10.
 */
@Api(value = "wms-packageTask-api", description = "复合打包接口")
@Controller
@RequestMapping("/package")
public class WmsPackageTaskController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(WmsPackageTaskController.class);

    @Autowired
    private WmsPackageTaskService packageTaskService;

    /**
     * 获取面单打印数据
     * @param req
     * @return
     */
    @ApiOperation(value = "获取面单打印数据")
    @RequestMapping(value = "/getWayBillData", method = RequestMethod.POST)
    @ResponseBody
    public WmsPackageTaskResponse getWayBillData(@RequestBody WmsPackageTaskRequest req) {
        logger.info("[WmsPackageTaskController.getWayBillData] IN");

        WmsPackageTaskResponse resp = packageTaskService.getWaybillAndBoxPrintData(req);
        logger.info("[WmsPackageTaskController.getWayBillData] OUT");
        return resp;
    }


    /**
     * 获取出库单打印数据
     * @param req
     * @return
     */
    @ApiOperation(value = "获取出库单打印数据")
    @RequestMapping(value = "/getOutboundPrintData", method = RequestMethod.POST)
    @ResponseBody
    public WmsPackageTaskResponse getOutboundPrintData(@RequestBody WmsPackageTaskRequest req) {
        logger.info("[WmsPackageTaskController.getWayBillData] IN");

        WmsPackageTaskResponse resp = packageTaskService.getOutboundPrintData(req);
        logger.info("[WmsPackageTaskController.getWayBillData] OUT");
        return resp;
    }

    @ApiOperation(value = "复核")
    @RequestMapping(value = "/checkUCode", method = RequestMethod.POST)
    @ResponseBody
    public WmsPackageTaskResponse checkImei(HttpServletRequest request,@RequestBody WmsPackageTaskRequest req) {
        logger.info("[WmsPackageTaskController.checkImei] IN");
        CommonParamUtil.setWmsOperator(request,req);
        WmsPackageTaskResponse resp = packageTaskService.checkUniCode(req);
        logger.info("[WmsPackageTaskController.checkImei] OUT");
        return resp;
    }

    @ApiOperation(value = "包装箱确认")
    @RequestMapping(value = "/confirmPackage", method = RequestMethod.POST)
    @ResponseBody
    public WmsPackageTaskResponse confirmPackage(HttpServletRequest request,@RequestBody WmsPackageTaskRequest req) {
        logger.info("[WmsPackageTaskController.confirmPackage] IN");
        CommonParamUtil.setWmsOperator(request,req);
        WmsPackageTaskResponse resp = null;
        for (int i = 0; i < req.getBoxQty(); i++) {
            resp = packageTaskService.confirmPackage(req);
            if (!ResultCode.SUCCESS.equals(resp.getStatus())) {
                return resp;
            }
        }
        logger.info("[WmsPackageTaskController.confirmPackage] OUT");
        return resp;
    }

    @ApiOperation(value = "结束包装")
    @RequestMapping(value = "/overPackage", method = RequestMethod.POST)
    @ResponseBody
    public WmsPackageTaskResponse overPackage(HttpServletRequest request,@RequestBody WmsPackageTaskRequest req) {
        logger.info("[WmsPackageTaskController.overPackage] IN");
        CommonParamUtil.setWmsOperator(request,req);
        WmsPackageTaskResponse resp = packageTaskService.overPackage(req);
        logger.info("[WmsPackageTaskController.overPackage] OUT");
        return resp;
    }

    /**
     * @Title: refreshAfterOverPackage
     * @Description: 结束包装后更改页面包装任务状态
     * @return: String
     * @author: binhua
     * @date: 2014年10月8日 下午6:50:51
     */
    @RequestMapping(value = "/refreshAfterOverPackage", method = RequestMethod.POST)
    @ResponseBody
    public WmsPackageTaskResponse refreshPackage(HttpServletRequest request,@RequestBody WmsPackageTaskRequest req) {
        logger.info("[WmsPackageTaskController.overPackage] IN");
        CommonParamUtil.setWmsOperator(request,req);
        WmsPackageTaskResponse resp = packageTaskService.refreshAfterCheckImei(req);
        logger.info("[WmsPackageTaskController.overPackage] OUT");
        return resp;
    }

    /**
     * @Title: refreshByConditions
     * @Description: 根据串号、箱号、运单号或订单号 刷新复核打包页面
     * @return: String
     * @author: binhua
     * @date: 2014年9月23日 下午8:14:44
     */
    @RequestMapping(value = "/refreshByConditions", method = RequestMethod.POST)
    @ResponseBody
    public String refreshByConditions(@RequestBody WmsPackageTaskRequest req) {
        return packageTaskService.loadByCondition(req);
    }

    /**
     * @Title: removeCarton
     * @Description: 移出包装箱
     * @return: WmsPackageTaskResponse
     * @author: binhua
     * @date: 2014年9月23日 下午8:14:44
     */
    @RequestMapping(value = "/removeCarton", method = RequestMethod.POST)
    @ResponseBody
    public WmsPackageTaskResponse removeCarton(HttpServletRequest request,@RequestBody WmsPackageTaskRequest req) {
        logger.info("[WmsPackageTaskController.removeCarton] IN");
        CommonParamUtil.setWmsOperator(request,req);
        WmsPackageTaskResponse resp = packageTaskService.removeCarton(req);
        logger.info("[WmsPackageTaskController.removeCarton] OUT");
        return resp;
    }
}
