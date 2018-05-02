package com.cloudchain.admin.web.wms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.outbound.WmsOutboundService;
import com.cloudchain.wms.pojo.bo.outbound.WmsOutboundRequest;
import com.cloudchain.wms.pojo.bo.outbound.WmsOutboundResponse;
import com.cloudchain.wms.pojo.vo.WmsOutboundModel;
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

/** outbound
 * Created by zhangmingjing on 2017/3/1.
 */
@Api(value = "wms-outbound-api", description = "出库单接口")
@Controller
@RequestMapping("/wmsOutbound")
public class WmsOutboundController {
	private static final Logger logger = LoggerFactory.getLogger(WmsOutboundController.class);

	@Autowired
	private WmsOutboundService outboundService;

	/**
	 * @Title: add
	 * @Description: 新建出库单
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "新建出库单")
	@RequestMapping(value = "/add", method = RequestMethod.POST)
	@ResponseBody
	public String add(HttpServletRequest request, WmsOutboundModel model) {
		WmsOutboundRequest req = new WmsOutboundRequest();
		CommonParamUtil.setWmsReq(request,req,model);
		//req.setReceiverId(model.getReceiverId());
		//收货人信息
		req.setReceiverName(model.getReceiverName());
		req.setReceiverContactor(model.getReceiverContactor());
		req.setReceiverMobile(model.getReceiverMobile());
		req.setReceiverProvince(model.getReceiverProvince());
		req.setReceiverCity(model.getReceiverCity());
		req.setReceiverDistrict(model.getReceiverDistrict());
		req.setReceiverAddress(model.getReceiverAddress());

		req.setRelatedBillNo1(model.getRelatedBillNo1());
		req.setRelatedBillNo2(model.getRelatedBillNo2());
		req.setRelatedBillNo3(model.getRelatedBillNo3());

		WmsOutboundResponse resp = outboundService.addOutbound(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString =  resp.getRetString();
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}


	/**
	 * @Title: update
	 * @Description: 更新出库单
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "更新出库单")
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	@ResponseBody
	public String update(HttpServletRequest request, WmsOutboundModel model) {
		WmsOutboundRequest req = new WmsOutboundRequest();
		CommonParamUtil.setWmsReq(request,req,model);
		WmsOutboundResponse resp = outboundService.updateOutbound(req);
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
	 * @Description: 删除出库单
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "删除出库单")
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	@ResponseBody
	public String delete(HttpServletRequest request, WmsOutboundModel model) {
		WmsOutboundRequest req = new WmsOutboundRequest();
		CommonParamUtil.setWmsReq(request,req,model);
		WmsOutboundResponse resp = outboundService.deleteOutbound(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = CommonControllerAspect.RETURN_VOID;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}

	/**
	 * @Title: active
	 * @Description: 生效出库单
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "获取单条出库单")
	@RequestMapping(value = "/load", method = RequestMethod.POST)
	@ResponseBody
	public WmsOutboundResponse load(HttpServletRequest request, WmsOutboundModel model) {
		WmsOutboundRequest req = new WmsOutboundRequest();
		CommonParamUtil.setWmsReq(request,req,model);
		WmsOutboundResponse resp = outboundService.load(req);
		/*String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = CommonControllerAspect.RETURN_VOID;
			return resp;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}*/
		return resp;
	}

	/**
	 * @Title: active
	 * @Description: 生效出库单
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "生效出库单")
	@RequestMapping(value = "/active", method = RequestMethod.POST)
	@ResponseBody
	public String active(HttpServletRequest request, WmsOutboundModel model) {
		WmsOutboundRequest req = new WmsOutboundRequest();
		CommonParamUtil.setWmsReq(request,req,model);
		WmsOutboundResponse resp = outboundService.active(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = CommonControllerAspect.RETURN_VOID;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}

	/**
	 * 生效出库单
	 * @param request
	 * @param model
	 * @return
	 */
	@ApiOperation(value = "生效出库单")
	@RequestMapping(value = "/invalid", method = RequestMethod.POST)
	@ResponseBody
	public String invalid(HttpServletRequest request, WmsOutboundModel model) {
		WmsOutboundRequest req = new WmsOutboundRequest();
		CommonParamUtil.setWmsReq(request,req,model);
		WmsOutboundResponse resp = outboundService.invalid(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = CommonControllerAspect.RETURN_VOID;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}


	/**
	 * 打印出库单
	 * @param request
	 * @param id
	 * @return
	 */
	@ApiOperation(value = "打印出库单")
	@RequestMapping(value = "/getOutboundPrint/{id}", method = RequestMethod.GET)
	@ResponseBody
	public WmsOutboundResponse getOutboundPrint(HttpServletRequest request, @PathVariable String id) {
		logger.debug("[WmsOutboundController.getOutboundPrint] IN");
		WmsOutboundRequest req = new WmsOutboundRequest();
		CommonParamUtil.setWmsOperator(request, req);
		req.setId(id);
		WmsOutboundResponse resp = outboundService.getOutbountPrint(req);
		logger.debug("[WmsOutboundController.getOutboundPrint] OUT");
		return resp;
	}

	/**
	 * 一键生成作业单
	 */
	@RequestMapping(value = "/quickPick/{outboundId}", method = RequestMethod.GET)
	@ResponseBody
	public String quickPick(HttpServletRequest request, @PathVariable String outboundId, String isAutoPick) {
		logger.debug("[WmsOutboundController.quickPick] IN");
		String retString = null;
		WmsOutboundRequest req = new WmsOutboundRequest();
		CommonParamUtil.setWmsOperator(request,req);
		req.setId(outboundId);
		req.setIsAutoPick(isAutoPick);
		WmsOutboundResponse response = outboundService.oneBtnGetPick(req);
		if (ResultCode.SUCCESS.equals(response.getStatus())) {
			retString = CommonControllerAspect.RETURN_VOID;
		}
		else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
		}
		logger.debug("[WmsOutboundController.quickPick] OUT");
		return retString;
	}
}
