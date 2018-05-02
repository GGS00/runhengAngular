package com.cloudchain.admin.web.d2w;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.d2w.api.D2WGoodsService;
import com.cloudchain.d2w.pojo.bo.goods.D2WGoodsRequest;
import com.cloudchain.d2w.pojo.bo.goods.D2WGoodsResponse;
import com.cloudchain.d2w.pojo.po.D2WGoodsOffer;
import com.cloudchain.d2w.pojo.vo.D2WGoodsModel;
import com.cloudchain.util.param.CommonParamUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by zhuhao on 2017/7/12 0012.
 */
@Controller
@RequestMapping(value = "/d2w/goods")
public class D2WGoodsController {

    private static final Logger LOGGER = LoggerFactory.getLogger(D2WGoodsController.class);

    @Autowired
    D2WGoodsService d2WGoodsService;

    /**
     * 发布货源
     */
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ResponseBody
    public D2WGoodsResponse save(@RequestBody D2WGoodsModel d2WGoodsmodel, HttpServletRequest servletRequest)
    {
        LOGGER.info("D2WGoodsController save in");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(servletRequest);

        D2WGoodsRequest request = new D2WGoodsRequest();

        d2WGoodsmodel.setUserId(userModel.getUserId());

        request.setGoodsModel(d2WGoodsmodel);
        request.setUserId(userModel.getUserId());
        request.setOperatorId(userModel.getOperatorId());
        request.setOperatorName(userModel.getOperatorName());

        D2WGoodsResponse response = d2WGoodsService.save(request);

        LOGGER.info("D2WGoodsController save out");
        return response;
    }

    /**
     * 更新货源
     */
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public D2WGoodsResponse update(@RequestBody D2WGoodsModel d2WGoodsmodel, HttpServletRequest servletRequest)
    {
        LOGGER.info("D2WGoodsController update in");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(servletRequest);

        D2WGoodsRequest request = new D2WGoodsRequest();

        d2WGoodsmodel.setUserId(userModel.getUserId());

        request.setGoodsModel(d2WGoodsmodel);
        request.setUserId(userModel.getUserId());
        request.setOperatorId(userModel.getOperatorId());
        request.setOperatorName(userModel.getOperatorName());

        D2WGoodsResponse response = d2WGoodsService.update(request);

        LOGGER.info("D2WGoodsController update out");
        return response;
    }

    /**
     * 报价
     */
    @RequestMapping(value = "/offer", method = RequestMethod.POST)
    @ResponseBody
    public D2WGoodsResponse offer(String userId, String dwWarehouseId, String goodsId, Integer price, HttpServletRequest servletRequest)
    {
        LOGGER.info("D2WGoodsController offer in");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(servletRequest);

        D2WGoodsRequest request = new D2WGoodsRequest();

        D2WGoodsOffer d2WGoodsOffer = new D2WGoodsOffer();

        d2WGoodsOffer.setCustomerId(userModel.getUserId());
        d2WGoodsOffer.setUserId(userId);
        d2WGoodsOffer.setDwWarehouseId(dwWarehouseId);
        d2WGoodsOffer.setGoodsId(goodsId);
        d2WGoodsOffer.setPrice(price);

        request.setOffer(d2WGoodsOffer);
        request.setUserId(userModel.getUserId());
        request.setOperatorId(userModel.getOperatorId());
        request.setOperatorName(userModel.getOperatorName());

        D2WGoodsResponse response = d2WGoodsService.offer(request);

        LOGGER.info("D2WGoodsController offer out");
        return response;
    }

    /**
     * 取消报价
     */
    @RequestMapping(value = "/cancelOffer/{id}", method = RequestMethod.POST)
    @ResponseBody
    public D2WGoodsResponse cancelOffer(@PathVariable String id, HttpServletRequest servletRequest)
    {
        LOGGER.info("D2WGoodsController cancelOffer in");

        D2WGoodsRequest request = new D2WGoodsRequest();
        request.setId(id);

        D2WGoodsResponse response = d2WGoodsService.cancelOffer(request);

        LOGGER.info("D2WGoodsController cancelOffer out");
        return response;
    }

    /**
     * 查看详情
     */
    @RequestMapping(value = "/detail/{id}", method = RequestMethod.GET)
    @ResponseBody
    public D2WGoodsResponse detail(@PathVariable String id, HttpServletRequest servletRequest)
    {
        LOGGER.info("D2WGoodsController detail in");

        D2WGoodsRequest request = new D2WGoodsRequest();

        request.setId(id);

        D2WGoodsResponse response = d2WGoodsService.detail(request);

        LOGGER.info("D2WGoodsController detail out");
        return response;
    }
}
