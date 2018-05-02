package com.cloudchain.admin.web.oms;

import com.alibaba.csb.sdk.HttpCaller;
import com.alibaba.csb.sdk.HttpCallerException;
import com.alibaba.csb.sdk.HttpParameters;
import com.alibaba.fastjson.JSON;
import com.cloudchain.oms.pojo.bo.sale.OmsSaleOrderRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by lihao on 2017/6/21.
 */
@Controller
@RequestMapping("/csb")
public class HelloCsbController {

    /**
     *
     */
    @ResponseBody
    @RequestMapping("/helloCsb")
    public void helloCsb(){
        HttpParameters.Builder builder = new HttpParameters.Builder();
        builder.requestURL("http://120.55.114.223:8086/CSB").api("helloCsbHsf")
                .version("1.0.0")
                .method("get")
                .accessKey("ef7d998f15394e6b9095e69ad7d9a815")
                .secretKey("EwWTAfIwZv7YCKXYZt21EWfgDwI=");

        OmsSaleOrderRequest req = new OmsSaleOrderRequest();
        req.setOperatorName("lihao");
        builder.putParamsMap("req", JSON.toJSONString(req));
        try {
            String json = HttpCaller.invoke(builder.build());
            System.out.println();
        } catch (HttpCallerException e) {
            e.printStackTrace();
        }
    }
}
