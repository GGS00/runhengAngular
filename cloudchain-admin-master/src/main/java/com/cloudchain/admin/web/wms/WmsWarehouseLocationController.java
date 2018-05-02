package com.cloudchain.admin.web.wms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.warehouse.WmsWarehouseLocationService;
import com.cloudchain.wms.pojo.bo.warehouse.WmsHouseLocationInfo;
import com.cloudchain.wms.pojo.bo.warehouse.WmsWarehouseLocationRequest;
import com.cloudchain.wms.pojo.bo.warehouse.WmsWarehouseLocationResponse;
import com.cloudchain.wms.pojo.vo.WmsHouseLocationModel;
import com.cloudchain.wms.pojo.vo.WmsModel;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by 邵彬华 on 2017/4/6.
 */
@Api(value = "wms-warehouseLocation-api", description = "库位接口")
@Controller
@RequestMapping("/wmsWarehouseLoc")
public class WmsWarehouseLocationController {
	@Autowired
	private WmsWarehouseLocationService locationService;

	/**
	 * @Title: addWarehouseLoc
	 * @Description: 增加库位
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "增加库位")
	@RequestMapping(value = "/add", method = RequestMethod.POST)
	@ResponseBody
	public String addWarehouseLoc(HttpServletRequest request, @RequestBody WmsHouseLocationModel wmsHouseLocationModel) {
		WmsWarehouseLocationRequest req = new WmsWarehouseLocationRequest();
		WmsModel model = new WmsModel();
		CommonParamUtil.setWmsReq(request,req,model);
		req.setWmsHouseLocationModel(wmsHouseLocationModel);
		WmsWarehouseLocationResponse resp = locationService.addWarehouseLoc(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = CommonControllerAspect.RETURN_VOID;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}

	/**
	 * @Title: invalidWarehouseLoc
	 * @Description: 失效库位
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "失效库位")
	@RequestMapping(value = "/invalid", method = RequestMethod.POST)
	@ResponseBody
	public String invalidWarehouseLoc(HttpServletRequest request, String id) {
		WmsWarehouseLocationRequest req = new WmsWarehouseLocationRequest();
		WmsModel model = new WmsModel();
		CommonParamUtil.setWmsReq(request,req,model);
		WmsHouseLocationInfo wmsHouseLocationInfo = new WmsHouseLocationInfo();
		wmsHouseLocationInfo.setLocationId(id);
		req.setWmsHouseLocationInfo(wmsHouseLocationInfo);
		WmsWarehouseLocationResponse resp = locationService.invalidWarehouseLoc(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = CommonControllerAspect.RETURN_VOID;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}

	/**
	 * @Title: activeWarehouseLoc
	 * @Description: 生效库位
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "生效库位")
	@RequestMapping(value = "/active", method = RequestMethod.POST)
	@ResponseBody
	public String activeWarehouseLoc(HttpServletRequest request, String id) {
		WmsWarehouseLocationRequest req = new WmsWarehouseLocationRequest();
		WmsModel model = new WmsModel();
		CommonParamUtil.setWmsReq(request,req,model);
		WmsHouseLocationInfo wmsHouseLocationInfo = new WmsHouseLocationInfo();
		wmsHouseLocationInfo.setLocationId(id);
		req.setWmsHouseLocationInfo(wmsHouseLocationInfo);
		WmsWarehouseLocationResponse resp = locationService.activeWarehouseLoc(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = CommonControllerAspect.RETURN_VOID;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}

	/**
	 * @Title: updateWarehouseLoc
	 * @Description: 修改库位
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "更新库位")
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	@ResponseBody
	public String updateWarehouseLoc(HttpServletRequest request, WmsHouseLocationInfo wmsHouseLocationInfo) {
		WmsWarehouseLocationRequest req = new WmsWarehouseLocationRequest();
		WmsModel model = new WmsModel();
		CommonParamUtil.setWmsReq(request,req,model);
		req.setWmsHouseLocationInfo(wmsHouseLocationInfo);
		WmsWarehouseLocationResponse resp = locationService.updateWarehouseLoc(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = CommonControllerAspect.RETURN_VOID;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}

	/**
	 * 根据库区ID查询库区详细信息
	 */
	@RequestMapping(value = "/qryHouseLocationDetailById/{locationId}", method = RequestMethod.GET)
	@ResponseBody
	public WmsWarehouseLocationResponse qryWarehouseDetailById(HttpServletRequest request, @PathVariable String locationId){
		WmsWarehouseLocationResponse response = locationService.qryHouseLocationDetailById(locationId);
		return response;
	}
}
