package com.cloudchain.admin.web.transport.vehicle;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.platform.util.JacksonUtils;
import com.cloudchain.tms.api.TmsVehicleTypeService;
import com.cloudchain.tms.pojo.bo.vehicle.TmsVehicleTypeRequest;
import com.cloudchain.tms.pojo.bo.vehicle.TmsVehicleTypeResponse;
import com.cloudchain.tms.pojo.po.TmsVehicleType;
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
@Api(value = "tms-vehicletype-api", description = "车辆类型接口")
@Controller
@RequestMapping("/transport/setting/vehicletype")
public class VehicleTypeController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(VehicleTypeController.class);

    @Autowired
    private TmsVehicleTypeService tmsVehicleTypeService;

    /**
     * 车辆类型增加
     * @param request HttpServletRequest
     * @param vehicle TmsVehicleType
     * @return json
     */
    @ApiOperation(value = "车辆类型增加")
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public String save(HttpServletRequest request, TmsVehicleType vehicle) {
        logger.info("[VehicleTypeController.save] IN");
        long begin = System.currentTimeMillis();

        String retString = null;
        TmsVehicleTypeRequest req = new TmsVehicleTypeRequest();
        req.setTmsVehicleType(vehicle);

        CommonParamUtil.setTmsOperator(request, req);

        TmsVehicleTypeResponse resp = tmsVehicleTypeService.save(req);

        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[VehicleTypeController.save] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

    /**
     * 车辆类型修改
     * @param request HttpServletRequest
     * @param vehicle TmsVehicleType
     * @return json
     */
    @ApiOperation(value = "车辆类型修改")
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public String update(HttpServletRequest request,TmsVehicleType vehicle) {
        logger.info("[VehicleTypeController.update] IN");
        long begin = System.currentTimeMillis();

        String retString = null;
        TmsVehicleTypeRequest req = new TmsVehicleTypeRequest();
        req.setTmsVehicleType(vehicle);

        CommonParamUtil.setTmsOperator(request, req);

        TmsVehicleTypeResponse resp = tmsVehicleTypeService.update(req);

        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[VehicleTypeController.update] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

    /**
     * 车辆类型详情
     * @param id 车辆类型ID
     * @return json
     */
    @ApiOperation(value = "车辆类型详情")
    @RequestMapping(value = "/detail/{id}", method = RequestMethod.GET)
    @ResponseBody
    public String scanVehicle(@PathVariable String id){
        logger.info("[VehicleTypeController.scanVehicle] IN");
        TmsVehicleTypeRequest req = new TmsVehicleTypeRequest();
        req.setVehicleTypeId(id);
        TmsVehicleTypeResponse resp = tmsVehicleTypeService.load(req);
        String retString = JacksonUtils.object2json(resp.getResultMap());
        logger.info("[VehicleTypeController.scanVehicle] OUT");
        return retString;
    }

    /**
     * 车辆类型删除
     * @param id 车辆类型ID
     * @return json
     */
    @ApiOperation(value = "车辆类型删除")
    @RequestMapping(value = "/del/{id}", method = RequestMethod.POST)
    @ResponseBody
    public String deleteVehicle(@PathVariable String id){
        logger.info("[VehicleTypeController.deleteVehicle] IN");
        TmsVehicleTypeRequest req = new TmsVehicleTypeRequest();
        req.setVehicleTypeId(id);
        String retString = null;
        TmsVehicleTypeResponse resp = tmsVehicleTypeService.delete(req);
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[VehicleTypeController.deleteVehicle] OUT");
        return retString;
    }
}
