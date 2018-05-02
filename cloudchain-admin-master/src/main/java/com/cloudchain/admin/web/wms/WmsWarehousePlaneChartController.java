package com.cloudchain.admin.web.wms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.util.string.StringUtils;
import com.cloudchain.wms.api.warehouse.WmsWarehouseService;
import com.cloudchain.wms.pojo.bo.WmsRequest;
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

@Api(value = "wms-warehouse-plane-chart-api", description = "仓库平面图接口")
@Controller
@RequestMapping("/wmsWarehousePlaneChart")
public class WmsWarehousePlaneChartController {
	private static final Logger log = LoggerFactory.getLogger(WmsWarehousePlaneChartController.class);

	@Autowired
	private WmsWarehouseService warehouseService;

	/**
	 * 根据userID查询仓库
	 */
	@RequestMapping(value = "/qryWarehouseByUser", method = RequestMethod.GET)
	@ResponseBody
	public WmsWarehouseResponse qryWarehouseByUser(HttpServletRequest request){
		log.debug("[WmsWarehouseController.qryWarehouseByUser] IN");
		WmsRequest req = new WmsRequest();
		CommonParamUtil.setWmsOperator(request,req);
		WmsWarehouseResponse response = warehouseService.getWarehouseByUser(req.getUserId());
		log.debug("[WmsWarehouseController.qryWarehouseByUser] OUT");
		return response;
	}

	/**
	 * 根据仓库id获取仓库平面图信息
	 */
	@RequestMapping(value = "/qryWarehousePlaneChart/{wareHouseId}", method = RequestMethod.GET)
	@ResponseBody
	public WmsWarehouseResponse qryWarehousePlaneChart(HttpServletRequest request, @PathVariable String wareHouseId){
		log.debug("[WmsWarehouseController.qryWarehousePlaneChart] IN");
		WmsWarehouseResponse response = warehouseService.getWarehousePlaneChart(wareHouseId);
		log.debug("[WmsWarehouseController.qryWarehousePlaneChart] OUT");
		return response;
	}
}
