package com.cloudchain.admin.web.ums;

import com.cloudchain.ums.api.UmsDictCacheService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by zhuhao on 2017/4/11.
 */
@Controller
@RequestMapping(path = "/sys/dict")
public class DictController {
    private static final Logger LOGGER = LoggerFactory.getLogger(DictController.class);

    @Autowired
    UmsDictCacheService umsDictCacheService;

    /**
     * 获取list
     * @param dictTypeName
     * @param request
     * @return
     */
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    @ResponseBody
    public String listDict(String dictTypeName, HttpServletRequest request) {
        return umsDictCacheService.listDictData(dictTypeName);
    }
}
