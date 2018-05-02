package com.cloudchain.admin.web.ums;

import com.cloudchain.ums.api.UmsCoverAreaService;
import com.cloudchain.ums.pojo.bo.coverarea.UmsCoverAreaRequest;
import com.cloudchain.ums.pojo.bo.coverarea.UmsCoverAreaResponse;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by wangqing on 2017/5/13.
 */
@Controller
@RequestMapping(path = "/user/supplier")
public class UmsSupplierController {
    private static final Logger log = LoggerFactory.getLogger(UmsRoleController.class);

    @Autowired
    UmsCoverAreaService umsCoverAreaService;

    /**
     * 查询供应商发货区域
     */
    @RequestMapping(value = "/qrySendAreas/{supplierId}")
    @ResponseBody
    public UmsCoverAreaResponse qrySupplierSendAreas(HttpServletRequest request, @PathVariable String supplierId){
        log.info("UmsSupplierController qrySupplierSendAreas in");
        UmsCoverAreaRequest req = new UmsCoverAreaRequest();
        req.setFkId(supplierId);
        UmsCoverAreaResponse response = umsCoverAreaService.qryUmsCoverAreaByFkId(req);
        log.info("UmsSupplierController qrySupplierSendAreas out");
        return response;
    }
}
