package com.cloudchain.admin.web.d2p;

import com.cloudchain.d2p.api.GoodsShelveService;
import com.cloudchain.d2p.pojo.bo.D2PResponse;
import com.cloudchain.d2p.pojo.bo.goods.GoodsShelveRequest;
import com.cloudchain.d2p.pojo.bo.goods.GoodsShelveResponse;
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
@Api(value = "d2p-goods-api", description = "批发系统商品相关接口")
@Controller
@RequestMapping(value = "/d2p/goods")
public class D2PGoodsShelveController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(D2PGoodsShelveController.class);

    @Autowired
    private GoodsShelveService goodsShelveService;


    /**
     * 商品上架
     * @param request HttpServletRequest
     * @param ids 上架单ID
     * @return resp
     */
    @ResponseBody
    @ApiOperation(value = "上架")
    @RequestMapping(value = "/doShelve/{ids}", method = RequestMethod.POST)
    public D2PResponse doShelve(HttpServletRequest request, @PathVariable String ids){
        logger.info("[D2PGoodsShelveController.doShelve] IN");
        GoodsShelveRequest req = new GoodsShelveRequest();
        req.setId(ids);
        CommonParamUtil.setD2POperator(request, req);
        GoodsShelveResponse resp = null;
        try {
            resp = goodsShelveService.doShelve(req);
        } catch (Exception e) {
            logger.error("[D2PGoodsShelveController.doShelve] error", e);
            resp = new GoodsShelveResponse();
            resp.setStatus(ResultCode.SYSTEM_EXCEPTION);
        }
        logger.info("[D2PGoodsShelveController.doShelve] OUT");
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
    public D2PResponse cancelShelve(HttpServletRequest request, @PathVariable String ids){
        logger.info("[D2PGoodsShelveController.cancelShelve] IN");
        GoodsShelveRequest req = new GoodsShelveRequest();
        req.setId(ids);
        CommonParamUtil.setD2POperator(request, req);
        GoodsShelveResponse resp = null;
        try {
            resp = goodsShelveService.cancelShelve(req);
        } catch (Exception e) {
            logger.error("[D2PGoodsShelveController.cancelShelve] error", e);
            resp = new GoodsShelveResponse();
            resp.setStatus(ResultCode.SYSTEM_EXCEPTION);
        }
        logger.info("[D2PGoodsShelveController.cancelShelve] OUT");
        return resp;
    }


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
    public D2PResponse setShelveCategory(HttpServletRequest request, @PathVariable String id, @RequestParam("categoryIds") String categoryIds){
        logger.info("[D2PGoodsShelveController.setShelveCategory] IN");
        GoodsShelveRequest req = new GoodsShelveRequest();
        req.setGoodsId(id);
        req.setCategoryIds(categoryIds);
        CommonParamUtil.setD2POperator(request, req);
        GoodsShelveResponse resp = null;
        try {
            resp = goodsShelveService.setShelvesCategory(req);
        } catch (Exception e) {
            logger.error("[D2PGoodsShelveController.setShelveCategory] error", e);
            resp = new GoodsShelveResponse();
            resp.setStatus(ResultCode.SYSTEM_EXCEPTION);
        }
        logger.info("[D2PGoodsShelveController.setShelveCategory] OUT");
        return resp;
    }
}
