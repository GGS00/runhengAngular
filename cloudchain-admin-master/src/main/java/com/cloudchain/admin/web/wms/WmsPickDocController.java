package com.cloudchain.admin.web.wms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.pick.WmsPickDocService;
import com.cloudchain.wms.pojo.bo.pick.WmsPickRequest;
import com.cloudchain.wms.pojo.bo.pick.WmsPickResponse;
import com.cloudchain.wms.pojo.vo.WmsPickDocModel;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by 邵彬华 on 2017/3/16.
 */
@Api(value = "wms-pickDoc-api", description = "拣货单接口")
@Controller
@RequestMapping("/wmsPickDoc")
public class WmsPickDocController {
	@Autowired
	private WmsPickDocService pickDocService;

	/**
	 * @Title: autoAllocate
	 * @Description: 自动分配
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "自动分配拣货单")
	@RequestMapping(value = "/autoAllocate", method = RequestMethod.POST)
	@ResponseBody
	public String autoAllocate(HttpServletRequest request, WmsPickDocModel model) {
		WmsPickRequest req = new WmsPickRequest();
		CommonParamUtil.setWmsReq(request,req,model);
		WmsPickResponse resp = pickDocService.autoAllocate(req);
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
	 * @Description: 生效
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "生效拣货单")
	@RequestMapping(value = "/active", method = RequestMethod.POST)
	@ResponseBody
	public String active(HttpServletRequest request, WmsPickDocModel model) {
		WmsPickRequest req = new WmsPickRequest();
		CommonParamUtil.setWmsReq(request,req,model);
		WmsPickResponse resp = pickDocService.activePickDoc(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = CommonControllerAspect.RETURN_VOID;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}

	/**
	 *  失效拣货单
	 * @param request
	 * @param model
	 * @return
	 */
	@ApiOperation(value = "失效拣货单")
	@RequestMapping(value = "/invalid", method = RequestMethod.POST)
	@ResponseBody
	public String invalid(HttpServletRequest request, WmsPickDocModel model) {
		WmsPickRequest req = new WmsPickRequest();
		CommonParamUtil.setWmsReq(request,req,model);
		WmsPickResponse resp = pickDocService.invalidPickDoc(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = CommonControllerAspect.RETURN_VOID;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}
}
