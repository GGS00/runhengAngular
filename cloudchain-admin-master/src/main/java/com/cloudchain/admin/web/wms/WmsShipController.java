package com.cloudchain.admin.web.wms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.ship.WmsShipService;
import com.cloudchain.wms.pojo.bo.ship.WmsShipRequest;
import com.cloudchain.wms.pojo.bo.ship.WmsShipResponse;
import com.cloudchain.wms.pojo.vo.WmsShipModel;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by 邵彬华 on 2017/3/20.
 */
@Api(value = "wms-pickDocItem-api", description = "拣货单明细接口")
@Controller
@RequestMapping("/wmsShip")
public class WmsShipController {
	@Autowired
	private WmsShipService shipService;

	/**
	 * @Title: shipped
	 * @Description: 生效出库单
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "发运发货单")
	@RequestMapping(value = "/shipped", method = RequestMethod.POST)
	@ResponseBody
	public String shipped(HttpServletRequest request, WmsShipModel model) {
		WmsShipRequest req = new WmsShipRequest();
		CommonParamUtil.setWmsReq(request,req,model);
		req.setTransType(model.getTransType());
		req.setCarrierId(model.getCarrierId());
		req.setCarrierName(model.getCarrierName());
		WmsShipResponse resp = shipService.ship(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = CommonControllerAspect.RETURN_VOID;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}

}
