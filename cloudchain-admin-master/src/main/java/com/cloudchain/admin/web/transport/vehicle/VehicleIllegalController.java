package com.cloudchain.admin.web.transport.vehicle;

import com.cloudchain.admin.web.transport.TmsBaseController;
import com.cloudchain.tms.api.TmsBaseService;
import com.cloudchain.tms.api.TmsIllegalService;
import com.cloudchain.tms.pojo.bo.vehicle.TmsIllegalRequest;
import com.cloudchain.tms.pojo.bo.vehicle.TmsIllegalResponse;
import com.cloudchain.tms.pojo.po.TmsVehicleIllegal;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by LiuKai on 2017/4/5.
 */
@Api(value = "tms-vehicle-illegal-api", description = "车辆违章接口")
@Controller
@RequestMapping("/transport/record/illegal")
public class VehicleIllegalController extends TmsBaseController<TmsVehicleIllegal, TmsIllegalRequest, TmsIllegalResponse> {

    @Autowired
    private TmsIllegalService tmsIllegalService;

    @Override
    protected TmsBaseService<TmsIllegalRequest, TmsIllegalResponse> getService() {
        return tmsIllegalService;
    }

    @Override
    protected TmsIllegalRequest getReq() {
        return new TmsIllegalRequest();
    }
}
