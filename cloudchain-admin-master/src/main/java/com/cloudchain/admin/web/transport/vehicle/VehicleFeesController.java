package com.cloudchain.admin.web.transport.vehicle;

import com.cloudchain.admin.web.transport.TmsBaseController;
import com.cloudchain.tms.api.TmsBaseService;
import com.cloudchain.tms.api.TmsVehicleFeesService;
import com.cloudchain.tms.pojo.bo.vehicle.TmsVehicleFeesRequest;
import com.cloudchain.tms.pojo.bo.vehicle.TmsVehicleFeesResponse;
import com.cloudchain.tms.pojo.po.TmsVehicleFees;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by LiuKai on 2017/4/5.
 */
@Api(value = "tms-vehicle-fees-api", description = "车辆规费接口")
@Controller
@RequestMapping("/transport/record/fees")
public class VehicleFeesController extends TmsBaseController<TmsVehicleFees, TmsVehicleFeesRequest, TmsVehicleFeesResponse> {

    @Autowired
    private TmsVehicleFeesService tmsVehicleFeesService;

    @Override
    protected TmsBaseService<TmsVehicleFeesRequest, TmsVehicleFeesResponse> getService() {
        return tmsVehicleFeesService;
    }

    @Override
    protected TmsVehicleFeesRequest getReq() {
        return new TmsVehicleFeesRequest();
    }
}
