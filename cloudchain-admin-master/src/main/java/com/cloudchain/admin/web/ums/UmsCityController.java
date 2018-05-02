package com.cloudchain.admin.web.ums;

import com.cloudchain.ums.api.UmsRegionService;
import com.cloudchain.ums.pojo.bo.region.UmsRegionRequest;
import com.cloudchain.ums.pojo.bo.region.UmsRegionResponse;
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
 * Created by zhuhao on 2017/3/10.
 */
@Api(value = "city-api", description = "城市相关接口")
@Controller
@RequestMapping(path = "/user/city")
public class UmsCityController {

    private static final Logger LOGGER = LoggerFactory.getLogger(UmsCityController.class);

    @Autowired
    UmsRegionService umsRegionService;

    /**
     * 查看城市列表
     * @param parentId
     * @param parentName
     * @param request
     * @return
     */
    @ApiOperation(value = "获取城市列表")
    @RequestMapping(value = "/getCityList/{parentId}", method = RequestMethod.GET)
    @ResponseBody
    public UmsRegionResponse getCityList(@PathVariable Integer parentId, String parentName, HttpServletRequest request)
    {
        LOGGER.info("getCityList in, request param parentId {}, parentName {}", parentId, parentName);

        if (null == parentId)
        {
            parentId = 0;
        }
        UmsRegionRequest umsRegionRequest = new UmsRegionRequest();

        umsRegionRequest.setParentId(parentId);

        umsRegionRequest.setParentName(parentName);

        UmsRegionResponse response = umsRegionService.getCityList(umsRegionRequest);

        LOGGER.info("getCityList out");
        return response;
    }
}
