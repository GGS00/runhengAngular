package com.cloudchain.admin.web.wms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.pick.WmsPickDocItemService;
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
 * Created by 邵彬华 on 2017/3/18.
 */
@Api(value = "wms-pickDocItem-api", description = "拣货单明细接口")
@Controller
@RequestMapping("/wmsPickDocItem")
public class WmsPickDocItemController {
	@Autowired
	private WmsPickDocItemService pickDocItemService;

	/**
	 * @Title: active
	 * @Description: 自动分配拣货单
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
		WmsPickResponse resp = pickDocItemService.detailManualAllocate(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = CommonControllerAspect.RETURN_VOID;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}
}
