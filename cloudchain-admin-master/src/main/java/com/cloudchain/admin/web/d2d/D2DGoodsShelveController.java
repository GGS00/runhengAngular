package com.cloudchain.admin.web.d2d;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.d2d.api.D2DGoodsShelveService;
import com.cloudchain.d2d.pojo.bo.D2DResponse;
import com.cloudchain.d2d.pojo.bo.goods.D2DGoodsShelveRequest;
import com.cloudchain.d2d.pojo.bo.goods.D2DGoodsShelveResponse;
import com.cloudchain.util.param.CommonParamUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by zhuhao on 2017/6/6.
 */
@Api(value = "d2d-goods-api", description = "采购联盟商品相关接口")
@Controller
@RequestMapping(value = "/d2d/goods")
public class D2DGoodsShelveController {

    private static final Logger LOGGER = LoggerFactory.getLogger(D2DGoodsShelveController.class);

    @Autowired
    private D2DGoodsShelveService goodsShelveService;

    /**
     * 设置展示分类
     * @param request HttpServletRequest
     * @param id 上架单ID
     * @param categoryIds  分类ID，逗号间隔
     * @return resp
     */
    @ResponseBody
    @ApiOperation(value = "设置展示分类")
    @RequestMapping(value = "/setShelveCategory/{id}", method = RequestMethod.POST)
    public D2DGoodsShelveResponse setShelveCategory(HttpServletRequest request, @PathVariable String id, @RequestParam("categoryIds") String categoryIds){
        LOGGER.info("[D2PGoodsShelveController.setShelveCategory] IN");
        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);
        D2DGoodsShelveRequest req = new D2DGoodsShelveRequest();
        req.setGoodsId(id);
        req.setCategoryIds(categoryIds);
        req.setUserId(userModel.getUserId());
        D2DGoodsShelveResponse resp = goodsShelveService.setShelvesCategory(req);
        LOGGER.info("[D2PGoodsShelveController.setShelveCategory] OUT");
        return resp;
    }

    /**
     * 商品上架
     * @param request HttpServletRequest
     * @param ids 上架单ID
     * @return resp
     */
    @ResponseBody
    @ApiOperation(value = "上架")
    @RequestMapping(value = "/doShelve/{ids}", method = RequestMethod.POST)
    public D2DResponse doShelve(HttpServletRequest request, @PathVariable String ids){
        LOGGER.info("[D2PGoodsShelveController.doShelve] IN");
        D2DGoodsShelveRequest req = new D2DGoodsShelveRequest();
        req.setId(ids);
        D2DGoodsShelveResponse resp = goodsShelveService.doShelve(req);
        LOGGER.info("[D2PGoodsShelveController.doShelve] OUT");
        return resp;
    }

    /**
     * 商品下架
     * @param request HttpServletRequest
     * @param ids 上架单ID
     * @return resp
     */
    @ResponseBody
    @ApiOperation(value = "下架")
    @RequestMapping(value = "/cancelShelve/{ids}", method = RequestMethod.POST)
    public D2DResponse cancelShelve(HttpServletRequest request, @PathVariable String ids){
        LOGGER.info("[D2PGoodsShelveController.cancelShelve] IN");
        D2DGoodsShelveRequest req = new D2DGoodsShelveRequest();
        req.setId(ids);
        D2DGoodsShelveResponse resp = goodsShelveService.cancelShelve(req);
        LOGGER.info("[D2PGoodsShelveController.cancelShelve] OUT");
        return resp;
    }
}
