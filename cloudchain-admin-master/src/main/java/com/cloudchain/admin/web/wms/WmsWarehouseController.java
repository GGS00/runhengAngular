package com.cloudchain.admin.web.wms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.util.string.StringUtils;
import com.cloudchain.wms.api.warehouse.WmsWarehouseService;
import com.cloudchain.wms.pojo.bo.warehouse.WmsWarehouseRequest;
import com.cloudchain.wms.pojo.bo.warehouse.WmsWarehouseResponse;
import com.cloudchain.wms.pojo.po.WmsWarehouse;
import com.cloudchain.wms.pojo.vo.WmsModel;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by 邵彬华 on 2017/3/20.
 */
@Api(value = "wms-warehouse-api", description = "仓库接口")
@Controller
@RequestMapping("/wmsWarehouse")
public class WmsWarehouseController {
	private static final Logger log = LoggerFactory.getLogger(WmsWarehouseController.class);

	@Autowired
	private WmsWarehouseService warehouseService;

	/**
	 * @Title: addWarehouse
	 * @Description: 增加仓库
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "增加仓库")
	@RequestMapping(value = "/add", method = RequestMethod.POST)
	@ResponseBody
	public String addWarehouse(HttpServletRequest request, WmsWarehouse wmsWarehouse, String shipAreas,String cateIds,String empIds) {
		WmsWarehouseRequest req = new WmsWarehouseRequest();
		WmsModel model = new WmsModel();
		CommonParamUtil.setWmsReq(request,req,model);
		req.setWmsWarehouse(wmsWarehouse);
		req.setShipAreas(shipAreas);
		req.setCateIds(cateIds);
		req.setEmpIds(empIds);
		WmsWarehouseResponse resp = warehouseService.addWarehouse(req);
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
	@ApiOperation(value = "失效仓库")
	@RequestMapping(value = "/invalid", method = RequestMethod.POST)
	@ResponseBody
	public String invalidWarehouse(HttpServletRequest request, WmsWarehouse wmsWarehouse) {
		WmsWarehouseRequest req = new WmsWarehouseRequest();
		WmsModel model = new WmsModel();
		CommonParamUtil.setWmsReq(request,req,model);
		req.setWmsWarehouse(wmsWarehouse);
		WmsWarehouseResponse resp = warehouseService.invalidWarehouse(req);
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
	@ApiOperation(value = "生效仓库")
	@RequestMapping(value = "/active", method = RequestMethod.POST)
	@ResponseBody
	public String activeWarehouse(HttpServletRequest request, WmsWarehouse wmsWarehouse) {
		WmsWarehouseRequest req = new WmsWarehouseRequest();
		WmsModel model = new WmsModel();
		CommonParamUtil.setWmsReq(request,req,model);
		req.setWmsWarehouse(wmsWarehouse);
		WmsWarehouseResponse resp = warehouseService.activeWarehouse(req);
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
	public String updateWarehouse(HttpServletRequest request,String cateIds,String shipAreas, WmsWarehouse wmsWarehouse) {
		WmsWarehouseRequest req = new WmsWarehouseRequest();
		WmsModel model = new WmsModel();
		CommonParamUtil.setWmsReq(request,req,model);
		req.setWmsWarehouse(wmsWarehouse);
		req.setId(wmsWarehouse.getId());
		req.setCateIds(cateIds);
		req.setShipAreas(shipAreas);
		WmsWarehouseResponse resp = warehouseService.updateWarehouse(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = CommonControllerAspect.RETURN_VOID;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}

	/**
	 * 查询指定用户id的仓库信息
	 */
	@RequestMapping(value = "/qryWareHouseByUserId", method = RequestMethod.POST)
	@ResponseBody
	public WmsWarehouseResponse qryWareHouseByUserId(HttpServletRequest request,String userId,String qryScope){
		WmsWarehouseResponse response = new WmsWarehouseResponse();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("userId",userId);
		if(!StringUtils.isEmpty(qryScope)){
			map.put("qryScope",qryScope);
		}

		WmsWarehouseRequest req = new WmsWarehouseRequest();
		req.setParams(map);
		response = warehouseService.getWarehouseByUserId(req);
		return response;
	}
	/**
	 * 根据仓库ID查询仓库详细信息
	 */
	@RequestMapping(value = "/qryWarehouseDetailById/{wareHouseId}", method = RequestMethod.GET)
	@ResponseBody
	public WmsWarehouseResponse qryWarehouseDetailById(HttpServletRequest request, @PathVariable String wareHouseId){
		log.debug("[WmsWarehouseController.qryWarehouseDetailById] IN");
		WmsWarehouseResponse response = warehouseService.getWarehouseDetailById(wareHouseId);
		log.debug("[WmsWarehouseController.qryWarehouseDetailById] OUT");
		return response;
	}
	/**
	 * 根据仓库ID查询仓库基本信息
	 */
	@RequestMapping(value = "/qryWarehouseBasicById/{wareHouseId}", method = RequestMethod.GET)
	@ResponseBody
	public WmsWarehouseResponse qryWarehouseBasicById(HttpServletRequest request, @PathVariable String wareHouseId){
		log.debug("[WmsWarehouseController.qryWarehouseBasicById] IN");
		WmsWarehouseRequest req = new WmsWarehouseRequest();
		req.setId(wareHouseId);
		WmsWarehouseResponse response = warehouseService.getWarehouseById(req);
		log.debug("[WmsWarehouseController.qryWarehouseBasicById] OUT");
		return response;
	}

	/**
	 * 用户/员工权限内仓库列表查询
	 */
	@RequestMapping(value = "/qryAuthorityHouseLst", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String,Object>> qryAuthorityHouseLst(HttpServletRequest request){
		log.debug("[WmsWarehouseController.qryAuthorityHouseLst] IN");
		CommUserModel userModel =CommonParamUtil.getUserFromSession(request);
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("userId",userModel.getUserId());
		//当用户ID和OperatorId不同时设置，否则不设置
		if (!userModel.getUserId().equals(userModel.getOperatorId())) {
			map.put("operatorId", userModel.getOperatorId());
		}
		List<Map<String,Object>> list = warehouseService.qryAuthorityHouseLst(map);
		log.debug("[WmsWarehouseController.qryAuthorityHouseLst] OUT");
		return list;
	}

	/**
	 * 根据仓库id查询有效库区列表
	 */
	@RequestMapping(value = "/qryAreaLstByHouseId/{wareHouseId}", method = RequestMethod.GET)
	@ResponseBody
	public WmsWarehouseResponse qryAreaLstByHouseId(HttpServletRequest request, @PathVariable String wareHouseId){
		log.debug("[WmsWarehouseController.qryAreaLstByHouseId] IN");
		WmsWarehouseResponse response = new WmsWarehouseResponse();
		List<Map<String,Object>> list = warehouseService.qryAreaLstByHouseId(wareHouseId);
		response.setData(list);
		log.debug("[WmsWarehouseController.qryAreaLstByHouseId] OUT");
		return response;
	}
}
