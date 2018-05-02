package com.cloudchain.admin.web.d2d;

import com.cloudchain.d2p.pojo.bo.goods.GoodsShelveRequest;
import com.cloudchain.d2p.pojo.bo.goods.GoodsShelveResponse;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.ums.pojo.vo.UserModel;
import io.swagger.annotations.Api;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by zhuhao on 2017/6/8.
 */
@Api(value = "d2p-goods", description = "采购联盟商品查询")
@Controller
@RequestMapping(value = "/d2d/goods")
public class D2DGoodsController {

    private static final Logger LOGGER = LoggerFactory.getLogger(D2DGoodsController.class);

}
