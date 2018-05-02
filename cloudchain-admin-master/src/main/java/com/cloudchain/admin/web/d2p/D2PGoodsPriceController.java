package com.cloudchain.admin.web.d2p;

import com.cloudchain.admin.model.d2p.D2PPriceModel;
import com.cloudchain.d2p.api.GoodsPriceService;
import com.cloudchain.d2p.pojo.bo.D2PResponse;
import com.cloudchain.d2p.pojo.bo.price.PriceRequest;
import com.cloudchain.d2p.pojo.bo.price.PriceResponse;
import com.cloudchain.platform.common.ResultCode;
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
 * Created by LiuKai on 2017/5/9.
 */
@Api(value = "d2p-goods-price", description = "批发系统商品价格相关接口")
@Controller
@RequestMapping(value = "/d2p/price")
public class D2PGoodsPriceController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(D2PGoodsPriceController.class);


    @Autowired
    private GoodsPriceService goodsPriceService;

    /**
     * 按规格设置价格
     * @param request HttpServletRequest
     * @param shelveId 上架单ID
     * @return resp
     */
    @ResponseBody
    @ApiOperation(value = "按规格设置价格")
    @RequestMapping(value = "/setSpecPrice/{shelveId}", method = RequestMethod.POST)
    public D2PResponse setSpecPrice(HttpServletRequest request, @PathVariable String shelveId, D2PPriceModel model){
        logger.info("[D2PGoodsPriceController.setSpecPrice] IN");
        PriceRequest req = new PriceRequest();
        req.setShelveId(shelveId);
        req.setSpecPriceList(model.getSpecPriceList());
        CommonParamUtil.setD2POperator(request, req);
        PriceResponse resp = null;
        try {
            resp = goodsPriceService.setSpecPrice(req);
        } catch (Exception e) {
            logger.error("[D2PGoodsPriceController.setSpecPrice] error", e);
            resp = new PriceResponse();
            resp.setStatus(ResultCode.SYSTEM_EXCEPTION);
        }
        logger.info("[D2PGoodsPriceController.setSpecPrice] OUT");
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
    public D2PResponse setNumPrice(HttpServletRequest request, @PathVariable String shelveId, D2PPriceModel model){
        logger.info("[D2PGoodsPriceController.setNumPrice] IN");
        PriceRequest req = new PriceRequest();
        req.setShelveId(shelveId);
        req.setNumPriceList(model.getNumPriceList());
        CommonParamUtil.setD2POperator(request, req);
        PriceResponse resp = null;
        try {
            resp = goodsPriceService.setNumPrice(req);
        } catch (Exception e) {
            logger.error("[D2PGoodsPriceController.setNumPrice] error", e);
            resp = new PriceResponse();
            resp.setStatus(ResultCode.SYSTEM_EXCEPTION);
        }
        logger.info("[D2PGoodsPriceController.setNumPrice] OUT");
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
    public D2PResponse getNumPriceList(HttpServletRequest request, @PathVariable String goodsId){
        logger.info("[D2PGoodsPriceController.getNumPriceList] IN");
        PriceRequest req = new PriceRequest();
        req.setGoodsId(goodsId);
        CommonParamUtil.setD2POperator(request, req);
        PriceResponse resp = null;
        try {
            resp = goodsPriceService.getNumPriceList(req);
        } catch (Exception e) {
            logger.error("[D2PGoodsPriceController.getNumPriceList] error", e);
            resp = new PriceResponse();
            resp.setStatus(ResultCode.SYSTEM_EXCEPTION);
        }
        logger.info("[D2PGoodsPriceController.getNumPriceList] OUT");
        return resp;
    }
}
