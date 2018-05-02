package com.cloudchain.admin.web.transport.vehicle;

import com.cloudchain.admin.web.transport.TmsBaseController;
import com.cloudchain.tms.api.TmsBaseService;
import com.cloudchain.tms.api.TmsMaintainService;
import com.cloudchain.tms.pojo.bo.vehicle.TmsMaintainRequest;
import com.cloudchain.tms.pojo.bo.vehicle.TmsMaintainResponse;
import com.cloudchain.tms.pojo.po.TmsVehicleMaintenance;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by LiuKai on 2017/4/5.
 */
@Api(value = "tms-vehicle-maintain-api", description = "车辆保养接口")
@Controller
@RequestMapping("/transport/record/maintain")
public class VehicleMaintainController extends TmsBaseController<TmsVehicleMaintenance, TmsMaintainRequest, TmsMaintainResponse> {

    @Autowired
    private TmsMaintainService tmsMaintainService;

    @Override
    protected TmsBaseService<TmsMaintainRequest, TmsMaintainResponse> getService() {
        return tmsMaintainService;
    }

    @Override
    protected TmsMaintainRequest getReq() {
        return new TmsMaintainRequest();
    }
}
