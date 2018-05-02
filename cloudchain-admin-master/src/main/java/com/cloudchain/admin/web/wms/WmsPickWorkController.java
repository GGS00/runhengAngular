package com.cloudchain.admin.web.wms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.picktask.WmsPickTaskService;
import com.cloudchain.wms.api.pickwork.WmsPickWorkService;
import com.cloudchain.wms.pojo.bo.pick.WmsPickRequest;
import com.cloudchain.wms.pojo.bo.pick.WmsPickResponse;
import com.cloudchain.wms.pojo.bo.pickwork.WmsPickWorkRequest;
import com.cloudchain.wms.pojo.bo.pickwork.WmsPickWorkResponse;
import com.cloudchain.wms.pojo.vo.WmsPickWorkModel;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by 邵彬华 on 2017/3/29.
 */
@Api(value = "wms-pickWork-api", description = "作业确认接口")
@Controller
@RequestMapping("/wmsPickWork")
public class WmsPickWorkController {
	@Autowired
	private WmsPickWorkService pickWorkService;

	@Autowired
	private WmsPickTaskService pickTaskService;

	/**
	 * @Title: active
	 * @Description: 拣货单作业确认
	 * @return: String
	 * @author: binhua
	 * @date: 2017年3月3日 上午10:51:17
	 */
	@ApiOperation(value = "作业单确认")
	@RequestMapping(value = "/confirm", method = RequestMethod.POST)
	@ResponseBody
	public String workConfirm(HttpServletRequest request, WmsPickWorkModel model) {
		WmsPickWorkRequest req = new WmsPickWorkRequest();
		CommonParamUtil.setWmsReq(request,req,model);
		req.setUniqueCodes(model.getUniqueCodes());
		WmsPickWorkResponse resp = pickWorkService.confirmDetailPick(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = CommonControllerAspect.RETURN_VOID;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}

	/**
	 * 拣货作业分配
	 * @param request HttpServletRequest
	 * @param docId 作业单Id
	 * @param taskExecutor 责任人id
	 * @param workerName 责任人
	 * @return json
	 */
	@ApiOperation(value = "拣货作业分配")
	@RequestMapping(value = "/workAllocate/{docId}", method = RequestMethod.POST)
	@ResponseBody
	public String workAllocate(HttpServletRequest request, @PathVariable String docId, String taskExecutor, String workerName) {
		WmsPickWorkRequest req = new WmsPickWorkRequest();
		CommonParamUtil.setWmsOperator(request,req);
		req.setId(docId);
		req.setWorkerId(taskExecutor);
		req.setWorkerName(workerName);
		WmsPickWorkResponse resp = pickWorkService.workAssignment(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = CommonControllerAspect.RETURN_VOID;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}

	/**
	 *  拣货任务分配
	 * @param request HttpServletRequest
	 * @param taskId 任务ID
	 * @param taskExecutor 任务执行人ID
	 * @return json
	 */
	@ApiOperation(value = "拣货任务分配")
	@RequestMapping(value = "/taskAllocate/{taskId}", method = RequestMethod.POST)
	@ResponseBody
	public String taskAllocate(HttpServletRequest request, @PathVariable String taskId, String taskExecutor, String workerName) {
		WmsPickRequest req = new WmsPickRequest();
		CommonParamUtil.setWmsOperator(request,req);
		req.setId(taskId);
		req.setTaskExector(taskExecutor);
		req.setWorkerName(workerName);
		WmsPickResponse resp = pickTaskService.taskAssignment(req);
		String retString = "";
		if(ResultCode.SUCCESS.equals(resp.getStatus())){
			retString = CommonControllerAspect.RETURN_VOID;
		}else {
			retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
		}
		return retString;
	}
}
