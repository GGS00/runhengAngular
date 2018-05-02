package com.cloudchain.admin.web.transport.vehicle;

import com.cloudchain.admin.web.transport.TmsBaseController;
import com.cloudchain.tms.api.TmsAccidentService;
import com.cloudchain.tms.api.TmsBaseService;
import com.cloudchain.tms.pojo.bo.vehicle.TmsAccidentRequest;
import com.cloudchain.tms.pojo.bo.vehicle.TmsAccidentResponse;
import com.cloudchain.tms.pojo.po.TmsVehicleAccident;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by LiuKai on 2017/4/5.
 */
@Api(value = "tms-vehicle-accident-api", description = "车辆事故接口")
@Controller
@RequestMapping("/transport/record/accident")
public class VehicleAccidentController extends TmsBaseController<TmsVehicleAccident, TmsAccidentRequest, TmsAccidentResponse> {

    @Autowired
    private TmsAccidentService tmsAccidentService;

    @Override
    protected TmsBaseService<TmsAccidentRequest, TmsAccidentResponse> getService() {
        return tmsAccidentService;
    }

    @Override
    protected TmsAccidentRequest getReq() {
        return new TmsAccidentRequest();
    }
}
