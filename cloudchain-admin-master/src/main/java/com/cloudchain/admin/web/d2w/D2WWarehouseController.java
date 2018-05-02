package com.cloudchain.admin.web.d2w;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.d2w.api.D2WWareHouseService;
import com.cloudchain.d2w.pojo.bo.warehouseinfo.D2WWarehouseInfoRequest;
import com.cloudchain.d2w.pojo.bo.warehouseinfo.D2WWarehouseInfoResponse;
import com.cloudchain.d2w.pojo.vo.D2WWarehouseEditModel;
import com.cloudchain.d2w.pojo.vo.D2WWarehouseSaveModel;
import com.cloudchain.util.param.CommonParamUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by zhuhao on 2017/6/21.
 */
@Controller
@RequestMapping(value = "/d2w/warehouse")
public class D2WWarehouseController {

    private static final Logger LOGGER = LoggerFactory.getLogger(D2WWarehouseController.class);

    @Autowired
    D2WWareHouseService wareHouseService;

    /**
     * 编辑库源信息
     * @param servletRequest
     * @return
     */
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public D2WWarehouseInfoResponse clearCart(HttpServletRequest servletRequest, @RequestBody D2WWarehouseEditModel editModel)
    {
        LOGGER.info("D2WWarehouseInfoResponse update in");

        D2WWarehouseInfoRequest request = new D2WWarehouseInfoRequest();
        request.setEditModel(editModel);

        D2WWarehouseInfoResponse resp = wareHouseService.update(request);

        LOGGER.info("D2WWarehouseInfoResponse update out");
        return resp;
    }

    /**
     * 发布仓源信息
     * @param servletRequest
     * @return
     */
    @RequestMapping(value = "/publish", method = RequestMethod.POST)
    @ResponseBody
    public D2WWarehouseInfoResponse publish(HttpServletRequest servletRequest, @RequestBody D2WWarehouseSaveModel saveModel)
    {
        LOGGER.info("D2WWarehouseInfoResponse publish in");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(servletRequest);

        saveModel.setUserId(userModel.getUserId());

        D2WWarehouseInfoRequest request = new D2WWarehouseInfoRequest();
        request.setSaveModel(saveModel);

        D2WWarehouseInfoResponse resp = wareHouseService.publish(request);

        LOGGER.info("D2WWarehouseInfoResponse publish out");
        return resp;
    }

    /**
     * 库源上架
     * @param request HttpServletRequest
     * @param id 库源id
     * @return resp
     */
    @ResponseBody
    @RequestMapping(value = "/doShelve/{id}", method = RequestMethod.POST)
    public D2WWarehouseInfoResponse doShelve(HttpServletRequest request, @PathVariable String id){
        LOGGER.info("[D2WWarehouseController.doShelve] IN");
        D2WWarehouseInfoRequest req = new D2WWarehouseInfoRequest();
        req.setId(id);
        D2WWarehouseInfoResponse resp = wareHouseService.doShelves(req);
        LOGGER.info("[D2WWarehouseController.doShelve] OUT");
        return resp;
    }

    /**
     * 库源下架
     * @param request HttpServletRequest
     * @param id 库源id
     * @return resp
     */
    @ResponseBody
    @RequestMapping(value = "/cancelShelve/{id}", method = RequestMethod.POST)
    public D2WWarehouseInfoResponse cancelShelve(HttpServletRequest request, @PathVariable String id){
        LOGGER.info("[D2WWarehouseController.cancelShelve] IN");
        D2WWarehouseInfoRequest req = new D2WWarehouseInfoRequest();
        req.setId(id);
        D2WWarehouseInfoResponse resp = wareHouseService.cancelShelves(req);
        LOGGER.info("[D2WWarehouseController.cancelShelve] OUT");
        return resp;
    }

    /**
     * 详情
     * @param request HttpServletRequest
     * @param id 库源id
     * @return resp
     */
    @ResponseBody
    @RequestMapping(value = "/detail/{id}", method = RequestMethod.GET)
    public String detail(HttpServletRequest request, @PathVariable String id){
        LOGGER.info("[D2WWarehouseController.detail] IN");
        String resp = wareHouseService.detail(id);
        LOGGER.info("[D2WWarehouseController.detail] OUT");
        return resp;
    }

    /**
     * 列表
     * @param request HttpServletRequest
     * @return resp
     */
    @ResponseBody
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public D2WWarehouseInfoResponse list(HttpServletRequest request, String provinceId, String cityId, String districtId){
        LOGGER.info("[D2WWarehouseController.list] IN");
        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);

        D2WWarehouseInfoRequest infoRequest = new D2WWarehouseInfoRequest();
        infoRequest.setUserId(userModel.getUserId());
        infoRequest.setProvinceId(provinceId);
        infoRequest.setCityId(cityId);
        infoRequest.setDistrictId(districtId);
        D2WWarehouseInfoResponse resp = wareHouseService.getHouses(infoRequest);
        LOGGER.info("[D2WWarehouseController.list] OUT");
        return resp;
    }

    /**
     * 列表
     * @param request HttpServletRequest
     * @return resp
     */
    @ResponseBody
    @RequestMapping(value = "/recommend", method = RequestMethod.GET)
    public String recommend(HttpServletRequest request){
        LOGGER.info("[D2WWarehouseController.list] IN");

        String retString = wareHouseService.getRecommendHouses();

        LOGGER.info("[D2WWarehouseController.list] OUT");
        return retString;
    }
}
