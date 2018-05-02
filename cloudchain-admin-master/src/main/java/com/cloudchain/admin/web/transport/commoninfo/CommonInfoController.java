package com.cloudchain.admin.web.transport.commoninfo;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.tms.api.CommonInfoService;
import com.cloudchain.tms.pojo.bo.commoninfo.CommonInfoRequest;
import com.cloudchain.tms.pojo.bo.commoninfo.CommonInfoResponse;
import com.cloudchain.tms.pojo.po.TmsCommonAddress;
import com.cloudchain.tms.pojo.po.TmsCommonContactor;
import com.cloudchain.tms.pojo.po.TmsGoods;
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
 * Created by LiuKai on 2017/3/3.
 */
@Api(value = "tms-common-api", description = "通用信息接口")
@Controller
@RequestMapping("/transport/setting/commonInfo")
public class CommonInfoController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(CommonInfoController.class);

    @Autowired
    private CommonInfoService commonInfoService;

    /**
     * 保存常用地址
     * @param request HttpServletRequest
     * @param address
     * @return 结果
     */
    @ApiOperation(value = "保存常用地址")
    @RequestMapping(value = "/addAddress", method = RequestMethod.POST)
    @ResponseBody
    public String addAddress(HttpServletRequest request, TmsCommonAddress address) {
        logger.info("[CommonInfoController.addAddress] IN");
        long begin = System.currentTimeMillis();

        String retString = null;
        CommonInfoRequest req = new CommonInfoRequest();
        req.setTmsCommonAddress(address);
        CommonParamUtil.setTmsOperator(request, req);
        CommonInfoResponse resp = commonInfoService.saveAddress(req);
        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[CommonInfoController.addAddress] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

    /**
     * 保存常用联系人
     * @param request HttpServletRequest
     * @param contactor 联系人
     * @return 结果
     */
    @ApiOperation(value = "保存常用联系人")
    @RequestMapping(value = "/addContactor", method = RequestMethod.POST)
    @ResponseBody
    public String addContactor(HttpServletRequest request, TmsCommonContactor contactor) {
        logger.info("[CommonInfoController.addContactor] IN");
        long begin = System.currentTimeMillis();

        String retString = null;
        CommonInfoRequest req = new CommonInfoRequest();
        req.setTmsCommonContactor(contactor);
        CommonParamUtil.setTmsOperator(request, req);
        CommonInfoResponse resp = commonInfoService.saveContractor(req);
        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[CommonInfoController.addContactor] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

    /**
     * 保存常用货品
     * @param request HttpServletRequest
     * @param goods 要添加的货品
     * @return 结果
     */
    @ApiOperation(value = "保存常用货品")
    @RequestMapping(value = "/addGoods", method = RequestMethod.POST)
    @ResponseBody
    public String addGoods(HttpServletRequest request, TmsGoods goods) {
        logger.info("[CommonInfoController.addGoods] IN");
        long begin = System.currentTimeMillis();

        String retString = null;
        CommonInfoRequest req = new CommonInfoRequest();
        CommonParamUtil.setTmsOperator(request, req);
        req.setTmsGoods(goods);
        CommonInfoResponse resp = commonInfoService.saveGoods(req);
        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[CommonInfoController.addGoods] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }


    /**
     * 更新地址
     * @param request HttpServletRequest
     * @param address 地址
     * @return 结果
     */
    @ApiOperation(value = "更新地址")
    @RequestMapping(value = "/updateAddress", method = RequestMethod.POST)
    @ResponseBody
    public String updateAddress(HttpServletRequest request, TmsCommonAddress address) {
        logger.info("[CommonInfoController.updateAddress] IN");
        long begin = System.currentTimeMillis();

        String retString = null;
        CommonInfoRequest req = new CommonInfoRequest();
        req.setTmsCommonAddress(address);
        CommonInfoResponse resp = commonInfoService.updateAddress(req);
        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[CommonInfoController.updateAddress] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

    /**
     * 更新联系人
     * @param request HttpServletRequest
     * @param contactor TmsCommonContactor
     * @return String
     */
    @ApiOperation(value = "更新联系人")
    @RequestMapping(value = "/updateContactor", method = RequestMethod.POST)
    @ResponseBody
    public String updateContactor(HttpServletRequest request, TmsCommonContactor contactor) {
        logger.info("[CommonInfoController.updateContactor] IN");
        long begin = System.currentTimeMillis();

        String retString = null;
        CommonInfoRequest req = new CommonInfoRequest();
        req.setTmsCommonContactor(contactor);
        CommonInfoResponse resp = commonInfoService.updateContractor(req);
        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[CommonInfoController.updateContactor] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

    /**
     * 更新常用货品
     * @param request HttpServletRequest
     * @param goods TmsGoods
     * @return String
     */
    @ApiOperation(value = "更新常用货品")
    @RequestMapping(value = "/updateGoods", method = RequestMethod.POST)
    @ResponseBody
    public String updateGoods(HttpServletRequest request, TmsGoods goods) {
        logger.info("[CommonInfoController.updateGoods] IN");
        long begin = System.currentTimeMillis();

        String retString = null;
        CommonInfoRequest req = new CommonInfoRequest();
        req.setTmsGoods(goods);
        CommonInfoResponse resp = commonInfoService.updateGoods(req);
        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[CommonInfoController.updateGoods] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }


    /**
     * 删除地址
     * @param request HttpServletRequest
     * @param addressId id
     * @return String
     */
    @ApiOperation(value = "删除地址")
    @RequestMapping(value = "/deleteAddress/{addressId}", method = RequestMethod.POST)
    @ResponseBody
    public String deleteAddress(HttpServletRequest request, @PathVariable  String addressId) {
        logger.info("[CommonInfoController.deleteAddress] IN");
        long begin = System.currentTimeMillis();

        String retString = null;
        CommonInfoRequest req = new CommonInfoRequest();
        req.setAddressId(addressId);
        CommonInfoResponse resp = commonInfoService.deleteAddress(req);
        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[CommonInfoController.deleteAddress] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

    /**
     * 删除联系人
     * @param request HttpServletRequest
     * @param conId 联系人ID
     * @return String
     */
    @ApiOperation(value = "删除联系人")
    @RequestMapping(value = "/deleteContactor/{conId}", method = RequestMethod.POST)
    @ResponseBody
    public String deleteContactor(HttpServletRequest request, @PathVariable  String conId) {
        logger.info("[CommonInfoController.deleteContactor] IN");
        long begin = System.currentTimeMillis();

        String retString = null;
        CommonInfoRequest req = new CommonInfoRequest();
        req.setContactorId(conId);
        CommonInfoResponse resp = commonInfoService.deleteContractor(req);
        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[CommonInfoController.deleteContactor] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

    /**
     * 删除常用货品
     * @param request HttpServletRequest
     * @param goodsId 货品ID
     * @return String
     */
    @ApiOperation(value = "删除常用货品")
    @RequestMapping(value = "/deleteGoods/{goodsId}", method = RequestMethod.POST)
    @ResponseBody
    public String deleteGoods(HttpServletRequest request,@PathVariable String goodsId) {
        logger.info("[CommonInfoController.deleteGoods] IN");
        long begin = System.currentTimeMillis();

        String retString = null;
        CommonInfoRequest req = new CommonInfoRequest();
        req.setGoodsId(goodsId);
        CommonInfoResponse resp = commonInfoService.deleteGoods(req);
        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[CommonInfoController.deleteGoods] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

}
