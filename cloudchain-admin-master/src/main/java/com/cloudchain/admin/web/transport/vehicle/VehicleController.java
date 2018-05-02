package com.cloudchain.admin.web.transport.vehicle;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.tms.api.TmsVehicleService;
import com.cloudchain.tms.pojo.bo.vehicle.TmsVehicleRequest;
import com.cloudchain.tms.pojo.bo.vehicle.TmsVehicleResponse;
import com.cloudchain.tms.pojo.po.TmsVehicle;
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
 * Created by LiuKai on 2017/3/14.
 */
@Api(value = "tms-vehicle-api", description = "车辆接口")
@Controller
@RequestMapping("/transport/setting/vehicle")
public class VehicleController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(VehicleController.class);

    @Autowired
    private TmsVehicleService tmsVehicleService;

    /**
     * 新增车辆
     * @param request HttpServletRequest
     * @param vehicle TmsVehicle
     * @return json
     */
    @ApiOperation(value = "新增车辆")
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public String save(HttpServletRequest request, TmsVehicle vehicle) {
        logger.info("[VehicleController.save] IN");
        long begin = System.currentTimeMillis();

        String retString = null;
        TmsVehicleRequest req = new TmsVehicleRequest();
        req.setTmsVehicle(vehicle);

        CommonParamUtil.setTmsOperator(request, req);

        TmsVehicleResponse resp = tmsVehicleService.save(req);

        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[VehicleController.save] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }


    /**
     * 修改车辆
     * @param request HttpServletRequest
     * @param vehicle TmsVehicle
     * @return json
     */
    @ApiOperation(value = "修改车辆")
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public String update(HttpServletRequest request,TmsVehicle vehicle) {
        logger.info("[VehicleController.update] IN");
        long begin = System.currentTimeMillis();

        String retString = null;
        TmsVehicleRequest req = new TmsVehicleRequest();
        req.setTmsVehicle(vehicle);

        CommonParamUtil.setTmsOperator(request, req);

        TmsVehicleResponse resp = tmsVehicleService.update(req);

        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[VehicleController.update] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

    /**
     *  车辆详情
     * @param id 车辆ID
     * @return json
     */
    @ApiOperation(value = "车辆详情")
    @RequestMapping(value = "/detail/{id}", method = RequestMethod.GET)
    @ResponseBody
    public String scanVehicle(@PathVariable String id){
        logger.info("[VehicleController.scanVehicle] IN");
        TmsVehicleRequest req = new TmsVehicleRequest();
        req.setVehicleId(id);
        TmsVehicleResponse resp = tmsVehicleService.load(req);
        String retString = resp.getRetString();
        logger.info("[VehicleController.scanVehicle] OUT");
        return retString;
    }

    /**
     * 删除车辆
     * @param id 车辆ID
     * @return json
     */
    @ApiOperation(value = "删除车辆")
    @RequestMapping(value = "/del/{id}", method = RequestMethod.POST)
    @ResponseBody
    public String deleteVehicle(@PathVariable String id){
        logger.info("[VehicleController.deleteVehicle] IN");
        TmsVehicleRequest req = new TmsVehicleRequest();
        req.setVehicleId(id);
        String retString = null;
        TmsVehicleResponse resp = tmsVehicleService.delete(req);
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[VehicleController.deleteVehicle] OUT");
        return retString;
    }
}
