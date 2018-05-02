package com.cloudchain.admin.web.ums;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.platform.util.StringUtils;
import com.cloudchain.ums.api.UmsConsigneeService;
import com.cloudchain.ums.pojo.bo.user.UmsConsigneeRequest;
import com.cloudchain.ums.pojo.bo.user.UmsConsigneeResponse;
import com.cloudchain.ums.pojo.po.UmsUserConsigneeAddress;
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
 * Created by zhuhao on 2017/3/10.
 */
@Api(value = "city-consignee-api", description = "收货人相关接口")
@Controller
@RequestMapping(path = "/user/consignee")
public class UmsConsigneeController {

    private static final Logger LOGGER = LoggerFactory.getLogger(UmsUserController.class);

    @Autowired
    UmsConsigneeService us;

    /**
     * 添加收货人信息
     * @param userConsigneeAddress
     * @param request
     * @return
     */
    @ApiOperation(value = "添加收货人")
    @RequestMapping(value = "add", method = RequestMethod.POST)
    @ResponseBody
    public UmsConsigneeResponse addUserConsignee(UmsUserConsigneeAddress userConsigneeAddress, HttpServletRequest request)
    {
        LOGGER.info("consignee addUserConsignee in");

        UmsConsigneeRequest umsConsigneeRequest = new UmsConsigneeRequest();

        String userId = userConsigneeAddress.getUserId();

        if (StringUtils.isEmpty(userId))
        {
            CommUserModel userModel = CommonParamUtil.getUserFromSession(request);
            userConsigneeAddress.setUserId(userModel.getUserId());
        }
        umsConsigneeRequest.setConsigneeAddress(userConsigneeAddress);

        UmsConsigneeResponse resp = us.addUserConsignee(umsConsigneeRequest);

        LOGGER.info("addUser addUserConsignee out");

        return resp;
    }

    /**
     * 更新收货人信息
     * @param userConsigneeAddress
     * @param request
     * @return
     */
    @ApiOperation(value = "更新收货人")
    @RequestMapping(value = "update", method = RequestMethod.POST)
    @ResponseBody
    public UmsConsigneeResponse updateUserConsignee(UmsUserConsigneeAddress userConsigneeAddress, HttpServletRequest request)
    {
        LOGGER.info("consignee updateUserConsignee in");

        UmsConsigneeRequest umsConsigneeRequest = new UmsConsigneeRequest();
        umsConsigneeRequest.setConsigneeAddress(userConsigneeAddress);

        UmsConsigneeResponse resp = us.updateUserConsignee(umsConsigneeRequest);

        LOGGER.info("addUser updateUserConsignee out");

        return resp;
    }

    /**
     * 查看收货人信息
     * @param isDefault
     * @param request
     * @return
     */
    @ApiOperation(value = "查看收货人")
    @RequestMapping(value = "/getUserConsignees", method = RequestMethod.GET)
    @ResponseBody
    public UmsConsigneeResponse getUserConsignees(Integer isDefault, HttpServletRequest request)
    {
        LOGGER.info("consignee getUserConsignees in, request param userId {}, isDefault {}", isDefault);

        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);


        if (null == isDefault)
        {
            isDefault = -1;
        }
        UmsUserConsigneeAddress userConsigneeAddress = new UmsUserConsigneeAddress();
        userConsigneeAddress.setUserId(userModel.getUserId());
        userConsigneeAddress.setIsDefault(isDefault);

        UmsConsigneeRequest umsConsigneeRequest = new UmsConsigneeRequest();
        umsConsigneeRequest.setConsigneeAddress(userConsigneeAddress);

        UmsConsigneeResponse resp = us.getUserConsignee(umsConsigneeRequest);

        LOGGER.info("addUser getUserConsignees out");
        return resp;
    }

    /**
     * 查看常用联系人的收货信息
     * @param userId
     * @param request
     * @return
     */
    @RequestMapping(value = "/address/{userId}", method = RequestMethod.GET)
    @ResponseBody
    public UmsConsigneeResponse address(@PathVariable String userId, HttpServletRequest request)
    {
        LOGGER.info("consignee getUserConsignees in");


        UmsUserConsigneeAddress userConsigneeAddress = new UmsUserConsigneeAddress();
        userConsigneeAddress.setUserId(userId);

        UmsConsigneeRequest umsConsigneeRequest = new UmsConsigneeRequest();
        umsConsigneeRequest.setConsigneeAddress(userConsigneeAddress);

        UmsConsigneeResponse resp = us.getUserConsignee(umsConsigneeRequest);

        LOGGER.info("addUser getUserConsignees out");
        return resp;
    }

    /**
     * 删除收货人
     * @param cId
     * @param request
     * @return
     */
    @ApiOperation(value = "删除收货人")
    @RequestMapping(value = "/del/{cId}", method = RequestMethod.POST)
    @ResponseBody
    public UmsConsigneeResponse deleteUserConsignee(@PathVariable String cId, HttpServletRequest request)
    {
        LOGGER.info("consignee deleteUserConsignee in");

        UmsConsigneeRequest consigneeRequest = new UmsConsigneeRequest();

        consigneeRequest.setcId(cId);

        UmsConsigneeResponse response = us.deleteUserConsignee(consigneeRequest);

        LOGGER.info("consignee deleteUserConsignee out");
        return response;
    }

    /**
     * 记录收货使用信息
     * @param cId
     * @param request
     * @return
     */
    @ApiOperation(value = "记录收货使用信息")
    @RequestMapping(value = "/recordUsingConsignee", method = RequestMethod.POST)
    @ResponseBody
    public UmsConsigneeResponse recordUsingConsignee(String cId, HttpServletRequest request)
    {
        LOGGER.info("consignee recordUsingConsignee in");

        UmsConsigneeRequest consigneeRequest = new UmsConsigneeRequest();

        consigneeRequest.setcId(cId);

        UmsConsigneeResponse response = us.recordUsingConsignee(consigneeRequest);

        LOGGER.info("consignee recordUsingConsignee out");
        return response;
    }

}
