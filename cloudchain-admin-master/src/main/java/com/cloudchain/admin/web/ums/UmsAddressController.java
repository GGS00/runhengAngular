package com.cloudchain.admin.web.ums;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.ums.api.UmsAddressService;
import com.cloudchain.ums.pojo.bo.address.UmsAddressRequest;
import com.cloudchain.ums.pojo.bo.address.UmsAddressResponse;
import com.cloudchain.ums.pojo.bo.address.UmsUserAddressInfo;
import com.cloudchain.ums.pojo.po.UmsAddressLibrary;
import com.cloudchain.util.param.CommonParamUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by wangqing on 2017/5/24.
 * 用户地址库controller类
 */
@Controller
@RequestMapping(path = "/user/address")
public class UmsAddressController {
    private static final Logger log = LoggerFactory.getLogger(UmsAddressController.class);

    @Autowired
    UmsAddressService umsAddressService;

    //添加用户地址信息
    @RequestMapping(value = "/addUserAddress/{userId}", method = RequestMethod.POST)
    @ResponseBody
    public UmsAddressResponse addUserAddress(HttpServletRequest request, @PathVariable String userId, UmsUserAddressInfo addressInfo){
        log.debug("UmsAddressController.addUserAddress request in");
        UmsAddressRequest addReq = new UmsAddressRequest();
        if("A".equals(userId)){
            CommUserModel userModel = CommonParamUtil.getUserFromSession(request);
            userId = userModel.getUserId();
        }
        if(addressInfo != null){
            addressInfo.setForUserid(userId);
        }
        addReq.setUmsUserAddressInfo(addressInfo);
        UmsAddressResponse response = umsAddressService.addUserAddress(addReq);
        log.debug("UmsAddressController.addUserAddress request out");
        return response;
    }

    //修改用户地址信息
    @RequestMapping(value = "/updUserAddress/{userId}", method = RequestMethod.POST)
    @ResponseBody
    public UmsAddressResponse updUserAddress(HttpServletRequest request, @PathVariable String userId, UmsUserAddressInfo addressInfo){
        log.debug("UmsAddressController.updUserAddress request in");
        UmsAddressRequest updReq = new UmsAddressRequest();
        if("A".equals(userId)){
            CommUserModel userModel = CommonParamUtil.getUserFromSession(request);
            userId = userModel.getUserId();
        }
        if(addressInfo != null){
            addressInfo.setForUserid(userId);
        }
        updReq.setUmsUserAddressInfo(addressInfo);
        UmsAddressResponse response = umsAddressService.updUserAddress(updReq);
        log.debug("UmsAddressController.updUserAddress request out");
        return response;
    }

    //删除用户地址信息
    @RequestMapping(value = "/delUserAddress/{addressId}", method = RequestMethod.GET)
    @ResponseBody
    public UmsAddressResponse delUserAddress(HttpServletRequest request, @PathVariable String addressId){
        log.debug("UmsAddressController.delUserAddress request in");
        UmsAddressRequest delReq = new UmsAddressRequest();;
        delReq.setAddressId(addressId);
        UmsAddressResponse response = umsAddressService.delUserAddress(delReq);
        log.debug("UmsAddressController.delUserAddress request out");
        return response;
    }

    /**
     * 查看收货人信息
     * @param request
     * @return
     */
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    @ResponseBody
    public UmsAddressResponse getUserConsignees(HttpServletRequest request)
    {
        log.info("consignee getUserConsignees in");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);

        List<UmsAddressLibrary> uuu = umsAddressService.qryAddressByUserId(userModel.getUserId(), "111");

        UmsAddressResponse resp = new UmsAddressResponse();

        resp.setData(uuu);

        log.info("consignee getUserConsignees out");
        return resp;
    }
}
