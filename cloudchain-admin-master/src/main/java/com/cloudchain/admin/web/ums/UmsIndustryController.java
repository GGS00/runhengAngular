package com.cloudchain.admin.web.ums;

import com.cloudchain.ums.api.UmsIndustryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Created by LiuKai on 2017/7/4.
 */
@Component
@RequestMapping(path = "/sys/industry")
public class UmsIndustryController {

    private static final Logger LOGGER = LoggerFactory.getLogger(UmsIndustryController.class);

    @Autowired
    private UmsIndustryService industryService;

    /**
     * 获取行业列表
     * @param request
     * @return
     */
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    @ResponseBody
    public String list(HttpServletRequest request) {
        LOGGER.info("[UmsIndustryController.list] in");

        Map<String, String[]> paramsMap = request.getParameterMap();

        Map<String, Object> params = new HashMap<String, Object>();
        Set<Map.Entry<String, String[]>> entrySet = paramsMap.entrySet();
        for (Map.Entry<String, String[]> entry : entrySet) {
            params.put(entry.getKey(), entry.getValue()[0]);
        }

        String retString = industryService.getIndustrys(params);

        LOGGER.info("[UmsIndustryController.list] out");
        return retString;
    }
}
