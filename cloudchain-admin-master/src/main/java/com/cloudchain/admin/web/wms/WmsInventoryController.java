package com.cloudchain.admin.web.wms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.ims.api.InventoryFreezeService;
import com.cloudchain.ims.pojo.bo.freeze.InventoryFreezeRequest;
import com.cloudchain.ims.pojo.bo.freeze.InventoryFreezeResponse;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.util.string.StringUtils;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by wangqing on 2017/6/27.
 */
@Controller
@RequestMapping("/wmsInventroy")
public class WmsInventoryController {
    private static final Logger logger = LoggerFactory.getLogger(WmsInventoryController.class);

    @Autowired
    InventoryFreezeService inventoryFreezeService;

    @ApiOperation(value = "冻结")
    @RequestMapping(value = "/freezePdtKeyInv", method = RequestMethod.POST)
    @ResponseBody
    public String freezePdtKeyInv(HttpServletRequest request){
        logger.debug("[WmsInventoryController.freezePdtKeyInv] IN");
        String retString = null;
        InventoryFreezeRequest req = new InventoryFreezeRequest();
        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);
        // 设置操作人
        req.setOperatorId(userModel.getOperatorId());
        req.setOperatorName(userModel.getOperatorName());
        //设置A用户
        req.setUserId(userModel.getUserId());

        String productKeyId = request.getParameter("productKeyId");
        String productId = request.getParameter("productId");
        String locationId = request.getParameter("locationId");
        String freezeQuantity = request.getParameter("freezeQuantity");
        String unFreezeDt = request.getParameter("unFreezeDt");
        String description = request.getParameter("description");

        req.setProductKeyId(productKeyId);
        req.setLocationId(locationId);
        req.setProductId(productId);
        req.setFreezeQuantity(Integer.valueOf(freezeQuantity));
        if(!StringUtils.isEmpty(unFreezeDt)){
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date date = null;
            try{
                date = sdf.parse(unFreezeDt);
            }catch (Exception e){
                logger.error("日期格式化异常:",e);
            }
            req.setUnFreezeDt(date);
        }
        req.setDescription(description);

        InventoryFreezeResponse response = inventoryFreezeService.freezePdtKeyInv(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.debug("[WmsInventoryController.freezePdtKeyInv] OUT");
        return retString;
    }

    @ApiOperation(value = "解冻")
    @RequestMapping(value = "/unFreezePdtKeyInv", method = RequestMethod.POST)
    @ResponseBody
    public String unFreezePdtKeyInv(HttpServletRequest request){
        logger.debug("[WmsInventoryController.unFreezePdtKeyInv] IN");
        String retString = null;
        InventoryFreezeRequest req = new InventoryFreezeRequest();
        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);
        // 设置操作人
        req.setOperatorId(userModel.getOperatorId());
        req.setOperatorName(userModel.getOperatorName());
        //设置A用户
        req.setUserId(userModel.getUserId());

        String productKeyId = request.getParameter("productKeyId");
        String productId = request.getParameter("productId");
        String locationId = request.getParameter("locationId");
        String freezeQuantity = request.getParameter("freezeQuantity");
        String description = request.getParameter("description");

        req.setProductKeyId(productKeyId);
        req.setLocationId(locationId);
        req.setProductId(productId);
        req.setFreezeQuantity(Integer.valueOf(freezeQuantity));
        req.setDescription(description);

        InventoryFreezeResponse response = inventoryFreezeService.unFreezePdtKeyInv(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.debug("[WmsInventoryController.unFreezePdtKeyInv] OUT");
        return retString;
    }

}
