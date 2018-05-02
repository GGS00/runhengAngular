package com.cloudchain.admin.web.wms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.outbound.WmsOutboundItemService;
import com.cloudchain.wms.pojo.bo.outbound.WmsOutboundRequest;
import com.cloudchain.wms.pojo.bo.outbound.WmsOutboundResponse;
import com.cloudchain.wms.pojo.vo.WmsOutboundModel;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/** outitem
 * Created by 邵彬华 on 2017/3/16.
 */
@Api(value = "wms-outboundItem-api", description = "出库单明细接口")
@Controller
@RequestMapping("/wmsOutboundItem")
public class WmsOutboundItemController {
	@Autowired
	private WmsOutboundItemService outboundItemService;

	/**
	 * @Title: add
	 * @Description: 新建出库单明细
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "新建出库单明细")
	@RequestMapping(value = "/add", method = RequestMethod.POST)
	@ResponseBody
	public String add(HttpServletRequest request, WmsOutboundModel model) {
		WmsOutboundRequest req = new WmsOutboundRequest();
		CommonParamUtil.setWmsReq(request,req,model);
		req.setWeight(model.getWeight());
		req.setGoodsName(model.getGoodsName());
		WmsOutboundResponse resp = outboundItemService.addOutboundItem(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			Map<String, Object> result = new HashMap<String, Object>();
			result.put("wmsOutboundItemId", resp.getId());
			retString = CommonControllerAspect.RETURN_VOID;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}

	/**
	 * @Title: update
	 * @Description: 更新出库单明细
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "更新出库单明细")
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	@ResponseBody
	public String update(HttpServletRequest request, WmsOutboundModel model) {
		WmsOutboundRequest req = new WmsOutboundRequest();
		CommonParamUtil.setWmsReq(request,req,model);
		WmsOutboundResponse resp = outboundItemService.updateOutboundItem(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = CommonControllerAspect.RETURN_VOID;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}

	/**
	 * @Title: delete
	 * @Description: 删除出库单明细
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "删除出库单明细")
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	@ResponseBody
	public String delete(HttpServletRequest request, WmsOutboundModel model) {
		WmsOutboundRequest req = new WmsOutboundRequest();
		CommonParamUtil.setWmsReq(request,req,model);
		WmsOutboundResponse resp = outboundItemService.deleteOutboundItem(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = CommonControllerAspect.RETURN_VOID;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}
	/**
	 * @Title: delete
	 * @Description: 获取明细中货品的可用数量
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "获取可用数量")
	@RequestMapping(value = "/getInv", method = RequestMethod.POST)
	@ResponseBody
	public String getInvNum(HttpServletRequest request, WmsOutboundModel model) {
		WmsOutboundRequest req = new WmsOutboundRequest();
		CommonParamUtil.setWmsReq(request,req,model);
		WmsOutboundResponse resp = outboundItemService.getInvNum(req);
		String retString ;
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = String.valueOf(resp.getTotal());
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}
}
