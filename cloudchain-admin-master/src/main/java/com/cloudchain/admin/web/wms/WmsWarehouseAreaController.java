package com.cloudchain.admin.web.wms;

/**
 * Created by 邵彬华 on 2017/4/5.
 */

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.warehouse.WmsWarehouseAreaService;
import com.cloudchain.wms.pojo.bo.warehouse.WmsHouseAreaInfo;
import com.cloudchain.wms.pojo.bo.warehouse.WmsWarehouseAreaRequest;
import com.cloudchain.wms.pojo.bo.warehouse.WmsWarehouseAreaResponse;
import com.cloudchain.wms.pojo.po.WmsWarehouseArea;
import com.cloudchain.wms.pojo.vo.WmsHouseAreaModel;
import com.cloudchain.wms.pojo.vo.WmsModel;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by 邵彬华 on 2017/3/20.
 */
@Api(value = "wms-warehousearea-api", description = "库区接口")
@Controller
@RequestMapping("/wmsWarehouseArea")
public class WmsWarehouseAreaController {
	@Autowired
	private WmsWarehouseAreaService warehouseAreaService;

	/**
	 * @Title: addWarehouse
	 * @Description: 增加仓库
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "增加库区")
	@RequestMapping(value = "/add", method = RequestMethod.POST)
	@ResponseBody
	public String addWarehouseArea(HttpServletRequest request, @RequestBody WmsHouseAreaModel wmsHouseAreaModel) {
		WmsWarehouseAreaRequest req = new WmsWarehouseAreaRequest();
		WmsModel model = new WmsModel();
		CommonParamUtil.setWmsReq(request,req,model);
		req.setWmsHouseAreaModel(wmsHouseAreaModel);
		WmsWarehouseAreaResponse resp = warehouseAreaService.addWarehouseArea(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = CommonControllerAspect.RETURN_VOID;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}

	/**
	 * @Title: deleteWarehouse
	 * @Description: 删除
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "失效库区")
	@RequestMapping(value = "/invalid", method = RequestMethod.POST)
	@ResponseBody
	public String invalidWarehouseArea(HttpServletRequest request, String id) {
		WmsWarehouseAreaRequest req = new WmsWarehouseAreaRequest();
		WmsModel model = new WmsModel();
		CommonParamUtil.setWmsReq(request,req,model);
		req.setId(id);  //库区id
		WmsWarehouseAreaResponse resp = warehouseAreaService.invalidWarehouseArea(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = CommonControllerAspect.RETURN_VOID;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}

	/**
	 * @Title: deleteWarehouse
	 * @Description: 删除
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "生效库区")
	@RequestMapping(value = "/active", method = RequestMethod.POST)
	@ResponseBody
	public String activeWarehouse(HttpServletRequest request, String id) {
		WmsWarehouseAreaRequest req = new WmsWarehouseAreaRequest();
		WmsModel model = new WmsModel();
		CommonParamUtil.setWmsReq(request,req,model);
		req.setId(id);  //库区id
		WmsWarehouseAreaResponse resp = warehouseAreaService.activeWarehouseArea(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = CommonControllerAspect.RETURN_VOID;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}

	/**
	 * @Title: updateWarehouse
	 * @Description: 修改
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "更新仓库")
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	@ResponseBody
	public String updateWarehouseArea(HttpServletRequest request, WmsHouseAreaInfo wmsHouseAreaInfo) {
		WmsWarehouseAreaRequest req = new WmsWarehouseAreaRequest();
		WmsModel model = new WmsModel();
		CommonParamUtil.setWmsReq(request,req,model);
		req.setWmsHouseAreaInfo(wmsHouseAreaInfo);
		WmsWarehouseAreaResponse resp = warehouseAreaService.updateWarehouseArea(req);
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
	@RequestMapping(value = "/qryHouseAreaDetailById/{areaId}", method = RequestMethod.GET)
	@ResponseBody
	public WmsWarehouseAreaResponse qryWarehouseDetailById(HttpServletRequest request, @PathVariable String areaId){
		WmsWarehouseAreaResponse response = warehouseAreaService.qryWareHouseAreaDetailById(areaId);
		return response;
	}

	/**
	 * 根据仓库id查询存在存货库位的库区列表
	 */
	@RequestMapping(value = "/qryAreaLstExistLoc/{wareHouseId}", method = RequestMethod.GET)
	@ResponseBody
	public WmsWarehouseAreaResponse qryAreaLstExistLoc(HttpServletRequest request, @PathVariable String wareHouseId){
		WmsWarehouseAreaResponse response = warehouseAreaService.qryAreasExistLocByHouseId(wareHouseId);
		return response;
	}
}
