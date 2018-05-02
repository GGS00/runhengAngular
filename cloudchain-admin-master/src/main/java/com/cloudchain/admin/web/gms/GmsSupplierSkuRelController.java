package com.cloudchain.admin.web.gms;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.gms.api.GmsSupplierService;
import com.cloudchain.gms.pojo.bo.GmsSupplierRequest;
import com.cloudchain.gms.pojo.bo.GmsSupplierResponse;
import com.cloudchain.ims.api.VirtualityInvService;
import com.cloudchain.ims.pojo.bo.InventoryRequest;
import com.cloudchain.ims.pojo.bo.InventoryResponse;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.util.param.GmsParamUtil;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhuhao on 2017/4/21.
 */
@Api(value = "supplier-api", description = "供应商相关接口")
@Controller
@RequestMapping(value = "/goods/supplier")
public class GmsSupplierSkuRelController {
    private static final Logger LOGGER = LoggerFactory.getLogger(GmsSupplierSkuRelController.class);

    @Autowired
    GmsSupplierService supplierService;

    @Autowired
    VirtualityInvService virtualityInvService;

    /**
     * 设置供应商
     * @param spuId
     * @param supplierIds
     * @param servletRequest
     * @return
     */
    @ApiOperation(value = "设置供应商")
    @RequestMapping(value = "/setSupplierSpuRel/{spuId}", method = RequestMethod.POST)
    @ResponseBody
    public GmsSupplierResponse setSupplierSpuRel(@PathVariable String spuId, String[] supplierIds, HttpServletRequest servletRequest)
    {
        LOGGER.info("GmsSupplierSkuRelController setSupplierSpuRel in");

        List<String> spList = new ArrayList<>();

        for (int i = 0; i < supplierIds.length; i++) {
            spList.add(supplierIds[i]);
        }
        CommUserModel model = CommonParamUtil.getUserFromSession(servletRequest);

        GmsSupplierRequest request =  new GmsSupplierRequest();
        request.setSpuId(spuId);
        request.setSupplierIds(spList);
        request.setUserId(model.getUserId());

        GmsSupplierResponse resp = supplierService.setSupplierSpuRel(request);

        LOGGER.info("GmsSupplierSkuRelController setSupplierSpuRel out");
        return resp;
    }


    /**
     * 设置供应商：商品绑定关系(1:n)
     * @param servletRequest
     * @param supplierId
     * @param skuIds
     * @return
     */
    @RequestMapping(value = "/supplierAddSkusRel/{supplierId}", method = RequestMethod.POST)
    @ResponseBody
    public GmsSupplierResponse supplierAddSkusRel(HttpServletRequest servletRequest,@PathVariable String supplierId,String[] skuIds){
        LOGGER.info("GmsSupplierSkuRelController supplierAddSkuRel in");
        GmsSupplierRequest request = new GmsSupplierRequest();
        request.setSupplierId(supplierId);
        CommUserModel model = CommonParamUtil.getUserFromSession(servletRequest);
        request.setUserId(model.getUserId());
        List<String> list = new ArrayList<String>();
        for (int i = 0; i < skuIds.length; i++) {
            list.add(skuIds[i]);
        }
        request.setSkuIds(list);
        GmsSupplierResponse response = supplierService.supplierAddSkuRel(request);
        LOGGER.info("GmsSupplierSkuRelController supplierAddSkuRel out");
        return response;
    }

    /**
     * 查看商品设置的供应商
     * @param spuId
     * @param servletRequest
     * @return
     */
    @ApiOperation(value = "查看商品设置的供应商")
    @RequestMapping(value = "/{spuId}", method = RequestMethod.GET)
    @ResponseBody
    public String listSpuSupplier(@PathVariable String spuId, HttpServletRequest servletRequest)
    {
        LOGGER.info("GmsSupplierSkuRelController listSpuSupplier in");

        Map<String, Object> params = new HashMap<String, Object>();

        params.put("spuId", spuId);

        String retString = supplierService.getSupplierSkuRelList(params);

        LOGGER.info("GmsSupplierSkuRelController listSpuSupplier in");
        return retString;
    }

    /**
     *
     * @param spuId
     * @param servletRequest
     * @return
     */
    @ApiOperation(value = "查看商品设置的全部供应商")
    @RequestMapping(value = "/querySkuSupplierRel/{spuId}", method = RequestMethod.GET)
    @ResponseBody
    public GmsSupplierResponse querySkuSupplierRel(@PathVariable String spuId, HttpServletRequest servletRequest)
    {
        LOGGER.info("GmsSupplierSkuRelController querySkuSupplierRel IN");

        Map<String, Object> params = new HashMap<String, Object>();

        params.put("spuId", spuId);

        GmsSupplierResponse resp = supplierService.querySkuSupplierRel(params);

        LOGGER.info("GmsSupplierSkuRelController querySkuSupplierRel OUT");
        return resp;
    }

    /**
     * 按skuId查询商品下设置的供应商信息
     * @param skuId
     * @param servletRequest
     * @return
     */
    @RequestMapping(value = "/getSupplierRelBySkuId/{skuId}", method = RequestMethod.GET)
    @ResponseBody
    public String getSupplierRelBySkuId(@PathVariable String skuId, HttpServletRequest servletRequest)
    {
        LOGGER.info("GmsSupplierSkuRelController getSupplierRelBySkuId in");

        Map<String, Object> params = new HashMap<String, Object>();

        params.put("skuId", skuId);

        String retString = supplierService.getSupplierSkuRelList(params);

        LOGGER.info("GmsSupplierSkuRelController getSupplierRelBySkuId out");
        return retString;
    }

    /**
     * 删除商品设置的供应商
     * @param relId
     * @param servletRequest
     * @return
     */
    @ApiOperation(value = "删除商品设置的供应商")
    @RequestMapping(value = "/delete/{relId}", method = RequestMethod.POST)
    @ResponseBody
    public GmsSupplierResponse delete(@PathVariable String relId, HttpServletRequest servletRequest)
    {
        LOGGER.info("GmsSupplierSkuRelController delete in");

        GmsSupplierRequest request = new GmsSupplierRequest();

        request.setRelId(relId);

        GmsSupplierResponse resp = supplierService.delSupplierSkuRel(request);

        LOGGER.info("GmsSupplierSkuRelController  delete in");
        return resp;
    }

    /**
     * 批量设置供应商商品
     * @param relList
     * @param servletRequest
     * @return
     */
    @ApiOperation(value = "批量设置供应商商品")
    @RequestMapping(value = "/batchSetSupplierSkuRel", method = RequestMethod.POST)
    @ResponseBody
    public GmsSupplierResponse batchSetSupplierSkuRel(String relList, HttpServletRequest servletRequest)
    {
        LOGGER.info("GmsSupplierSkuRelController batchSetSupplierSkuRel in");

        GmsSupplierRequest request = GmsParamUtil.convertToGmsSupplierRequest(relList);

        CommUserModel model = CommonParamUtil.getUserFromSession(servletRequest);
        request.setUserId(model.getUserId());

        String spuId = servletRequest.getParameter("spuId");
        request.setSpuId(spuId);

        GmsSupplierResponse resp = supplierService.batchSetSupplierSkuRel(request);

        LOGGER.info("GmsSupplierSkuRelController batchSetSupplierSkuRel in");
        return resp;
    }

    @ApiOperation(value = "关联库存")
    @RequestMapping(value = "/relateRealInv", method = RequestMethod.POST)
    @ResponseBody
    public InventoryResponse relateRealInv(InventoryRequest req, HttpServletRequest servletRequest){
        LOGGER.info("GmsSupplierSkuRelController relateRealInv in");
        CommUserModel userModel = CommonParamUtil.getUserFromSession(servletRequest);
        req.setUserId(userModel.getUserId());
        InventoryResponse resp = virtualityInvService.relateRealInv(req);

        LOGGER.info("GmsSupplierSkuRelController relateRealInv out");
        return resp;
    }
}
