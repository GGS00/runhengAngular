package com.cloudchain.admin.web.d2d;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.d2d.api.D2DCartService;
import com.cloudchain.d2d.pojo.bo.cart.D2DCartRequest;
import com.cloudchain.d2d.pojo.bo.cart.D2DCartResponse;
import com.cloudchain.platform.util.JacksonUtils;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.util.param.D2DParamUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by zhuhao on 2017/6/12.
 */
@Controller
@RequestMapping(path = "/d2d/cart")
public class D2DCartController {
    private static final Logger LOGGER = LoggerFactory.getLogger(D2DCartController.class);

    @Autowired
    D2DCartService cartService;

    /**
     * 添加购物车
     * @param dataList
     * @param request
     * @return
     */
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public D2DCartResponse add(String dataList, HttpServletRequest request) {
        LOGGER.info("D2D add cart in");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);

        if (null == userModel)
        {
            D2DCartResponse resp = new D2DCartResponse();

            resp.setIsLogin(1);
            return resp;
        }

        D2DCartRequest cartRequest = D2DParamUtil.convertToCartRequest(userModel.getUserId(), dataList);

        D2DCartResponse resp = cartService.addCart(cartRequest);
        LOGGER.info("D2D add cart out");

        return resp;
    }

    /**
     * 清除购物车
     * @param servletRequest
     * @return
     */
    @RequestMapping(value = "/clear", method = RequestMethod.POST)
    @ResponseBody
    public D2DCartResponse clearCart(HttpServletRequest servletRequest)
    {
        LOGGER.info("D2D clear cart in");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(servletRequest);

        D2DCartRequest cartRequest = new D2DCartRequest();
        cartRequest.setUserId(userModel.getUserId());

        D2DCartResponse resp = cartService.clearCart(cartRequest);

        LOGGER.info("D2D clear cart out");
        return resp;
    }

    /**
     * 展示购物车列表
     * @param servletRequest
     * @return
     */
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    @ResponseBody
    public String listCart(HttpServletRequest servletRequest)
    {
        LOGGER.info("D2D list cart in");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(servletRequest);

        if (null == userModel)
        {
            Map<String, Object> map = new HashMap<>();
            map.put("isLogin", 1);
            String ret = JacksonUtils.object2json(map);
            return  ret;
        }

        String ret = cartService.listCart(userModel.getUserId());

        LOGGER.info("D2D list cart out");
        return ret;
    }

    /**
     * 更新购物车
     * @param dataList
     * @param servletRequest
     * @return
     */
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public D2DCartResponse updateCart(String dataList, HttpServletRequest servletRequest)
    {
        LOGGER.info("D2D updateCart in");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(servletRequest);

        D2DCartRequest cartRequest = D2DParamUtil.convertToCartRequest(userModel.getUserId(), dataList);

        D2DCartResponse resp = cartService.updateCart(cartRequest);

        LOGGER.info("D2D updateCart out");
        return resp;
    }

    /**
     * 删除购物车
     * @param dataList
     * @param servletRequest
     * @return
     */
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public D2DCartResponse deleteCart(String dataList, HttpServletRequest servletRequest)
    {
        LOGGER.info("D2D deleteCart in");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(servletRequest);

        D2DCartRequest cartRequest = D2DParamUtil.convertToCartRequest(userModel.getUserId(), dataList);

        D2DCartResponse resp = cartService.deleteCart(cartRequest);

        LOGGER.info("D2D deleteCart out");
        return resp;
    }
}
