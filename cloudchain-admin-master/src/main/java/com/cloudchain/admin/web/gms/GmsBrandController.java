package com.cloudchain.admin.web.gms;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.gms.api.BrandService;
import com.cloudchain.gms.pojo.bo.BrandRequest;
import com.cloudchain.gms.pojo.bo.BrandResponse;
import com.cloudchain.gms.pojo.vo.BrandModel;
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
 * Created by lihao on 2017/3/7.
 */
@Api(value = "brand-api", description = "品牌相关接口")
@Controller
@RequestMapping(value = "/brand")
public class GmsBrandController {
    public static final Logger LOGGER = LoggerFactory.getLogger(GmsBrandController.class);

    @Autowired
    BrandService brandService;

    /**
     * 新增品牌
     * @return
     */
    @ApiOperation(value = "新增品牌")
    @ResponseBody
    @RequestMapping(value = "/addBrand", method = RequestMethod.POST)
    public BrandResponse addBrand(HttpServletRequest request, @RequestBody BrandModel brandModel){
        LOGGER.info("BrandController.addBrand() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        if (null == user){
            LOGGER.error("user is not login.");
            return null;
        }
;
        BrandRequest req = new BrandRequest();
        CommonParamUtil.setGmsOperator(request, req);
        req.setBrandModel(brandModel);
        BrandResponse resp = brandService.addBrand(req);
        LOGGER.info("BrandController.addBrand() OUT");
        return resp;
    }


    /**
     * 新增品牌
     * @return
     */
    @ApiOperation(value = "修改品牌")
    @ResponseBody
    @RequestMapping(value = "/updateBrand", method = RequestMethod.POST)
    public BrandResponse updateBrand(HttpServletRequest request, @RequestBody BrandModel brandModel){
        LOGGER.info("BrandController.updateBrand() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        if (null == user){
            LOGGER.error("user is not login.");
            return null;
        }

        BrandRequest req = new BrandRequest();
        CommonParamUtil.setGmsOperator(request, req);
        req.setBrandModel(brandModel);
        BrandResponse resp = brandService.modifyBrand(req);
        LOGGER.info("BrandController.updateBrand() OUT");
        return resp;
    }


    /**
     * 删除
     * @param request
     * @return
     */
    @ApiOperation(value = "删除品牌")
    @ResponseBody
    @RequestMapping(value = "/deleteBrand/{bId}", method = RequestMethod.POST)
    public BrandResponse deleteBrand(HttpServletRequest request, @PathVariable String bId){
        LOGGER.info("BrandController.deleteBrand() IN");
        BrandRequest req = new BrandRequest();
        CommonParamUtil.setGmsOperator(request, req);
        req.setbId(bId);
        BrandResponse resp = brandService.delBrand(req);
        LOGGER.info("BrandController.deleteBrand() OUT");
        return resp;
    }


    /**
     * 查询
     * @param request
     * @return
     */
    @ApiOperation(value = "查询品牌列表")
    @ResponseBody
    @RequestMapping(value = "/queryBrand", method = RequestMethod.POST)
    public BrandResponse queryBrand(HttpServletRequest request){
        LOGGER.info("BrandController.queryBrand() IN");
        BrandRequest req = new BrandRequest();
        req.setUserId(CommonParamUtil.getUserFromSession(request).getUserId());
        BrandResponse resp = brandService.getBrandList(req);
        LOGGER.info("BrandController.queryBrand() OUT");
        return resp;
    }


    /**
     * 查询
     * @param request
     * @return
     */
    @ApiOperation(value = "查询品牌")
    @ResponseBody
    @RequestMapping(value = "/loadBrand/{bId}", method = RequestMethod.GET)
    public BrandResponse queryBrand(HttpServletRequest request, @PathVariable String bId){
        LOGGER.info("BrandController.queryBrand() IN");
        BrandRequest req = new BrandRequest();
        req.setbId(bId);
        CommonParamUtil.setGmsOperator(request, req);
        BrandResponse resp = brandService.getBrandDetail(req);
        LOGGER.info("BrandController.queryBrand() OUT");
        return resp;
    }
}
