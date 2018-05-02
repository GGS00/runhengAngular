package com.cloudchain.admin.web.transport.vehicle;

import com.cloudchain.admin.web.transport.TmsBaseController;
import com.cloudchain.tms.api.TmsBaseService;
import com.cloudchain.tms.api.TmsRepairService;
import com.cloudchain.tms.pojo.bo.vehicle.TmsRepairRequest;
import com.cloudchain.tms.pojo.bo.vehicle.TmsRepairResponse;
import com.cloudchain.tms.pojo.po.TmsVehicleRepair;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by LiuKai on 2017/4/5.
 */
@Api(value = "tms-vehicle-repair-api", description = "车辆维修接口")
@Controller
@RequestMapping("/transport/record/repair")
public class VehicleRepairController extends TmsBaseController<TmsVehicleRepair, TmsRepairRequest, TmsRepairResponse> {

    @Autowired
    private TmsRepairService tmsRepairService;

    @Override
    protected TmsBaseService<TmsRepairRequest, TmsRepairResponse> getService() {
        return tmsRepairService;
    }

    @Override
    protected TmsRepairRequest getReq() {
        return new TmsRepairRequest();
    }
}
