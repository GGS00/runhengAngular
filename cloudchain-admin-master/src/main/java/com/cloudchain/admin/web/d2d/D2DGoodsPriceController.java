package com.cloudchain.admin.web.d2d;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.admin.model.d2d.D2DPriceModel;
import com.cloudchain.d2d.api.D2DGoodsPriceService;
import com.cloudchain.d2d.pojo.bo.D2DResponse;
import com.cloudchain.d2d.pojo.bo.goods.D2DGoodsPriceRequest;
import com.cloudchain.d2d.pojo.bo.goods.D2DGoodsPriceResponse;
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
 * Created by zhuhao on 2017/6/8.
 */
@Api(value = "d2p-goods-price", description = "采购联盟商品价格相关接口")
@Controller
@RequestMapping(value = "/d2d/price")
public class D2DGoodsPriceController {

    private static final Logger LOGGER = LoggerFactory.getLogger(D2DGoodsPriceController.class);

    @Autowired
    private D2DGoodsPriceService goodsPriceService;

    /**
     * 按规格设置价格
     * @param request HttpServletRequest
     * @param shelveId 上架单ID
     * @return resp
     */
    @ResponseBody
    @ApiOperation(value = "按规格设置价格")
    @RequestMapping(value = "/setSpecPrice/{shelveId}", method = RequestMethod.POST)
    public D2DResponse setSpecPrice(HttpServletRequest request, @PathVariable String shelveId, D2DPriceModel model){
        LOGGER.info("[D2PGoodsPriceController.setSpecPrice] IN");
        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);

        D2DGoodsPriceRequest req = new D2DGoodsPriceRequest();
        req.setShelveId(shelveId);
        req.setSpecPriceList(model.getSpecPriceList());
        req.setUserId(userModel.getUserId());
        D2DGoodsPriceResponse resp = goodsPriceService.setSpecPrice(req);
        LOGGER.info("[D2PGoodsPriceController.setSpecPrice] OUT");
        return resp;
    }

    /**
     * 按数量设置价格
     * @param request HttpServletRequest
     * @param shelveId 上架单ID
     * @return resp
     */
    @ResponseBody
    @ApiOperation(value = "按数量设置价格")
    @RequestMapping(value = "/setNumPrice/{shelveId}", method = RequestMethod.POST)
    public D2DResponse setNumPrice(HttpServletRequest request, @PathVariable String shelveId, D2DPriceModel model){
        LOGGER.info("[D2PGoodsPriceController.setNumPrice] IN");
        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);

        D2DGoodsPriceRequest req = new D2DGoodsPriceRequest();
        req.setShelveId(shelveId);
        req.setNumPriceList(model.getNumPriceList());
        req.setUserId(userModel.getUserId());
        D2DGoodsPriceResponse resp = goodsPriceService.setNumPrice(req);
        LOGGER.info("[D2PGoodsPriceController.setNumPrice] OUT");
        return resp;
    }

    /**
     * 价格数量列表
     * @param request HttpServletRequest
     * @param goodsId 商品ID
     * @return resp
     */
    @ResponseBody
    @ApiOperation(value = "价格数量列表")
    @RequestMapping(value = "/getNumPriceList/{goodsId}", method = RequestMethod.GET)
    public D2DResponse getNumPriceList(HttpServletRequest request, @PathVariable String goodsId){
        LOGGER.info("[D2PGoodsPriceController.getNumPriceList] IN");
        D2DGoodsPriceRequest req = new D2DGoodsPriceRequest();
        req.setGoodsId(goodsId);
        D2DGoodsPriceResponse resp = goodsPriceService.getNumPriceList(req);
        LOGGER.info("[D2PGoodsPriceController.getNumPriceList] OUT");
        return resp;
    }
}
