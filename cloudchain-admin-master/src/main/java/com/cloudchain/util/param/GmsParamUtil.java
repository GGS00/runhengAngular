package com.cloudchain.util.param;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.cloudchain.gms.pojo.bo.GmsSupplierRequest;
import com.cloudchain.gms.pojo.po.GmsSupplierSkuRel;
import com.cloudchain.platform.util.Json2BeanUtil;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by zhuhao on 2017/4/24.
 */
public class GmsParamUtil {

    /**
     * GMS供应商商品设置请求封装
     * @param relList
     * @return
     */
    public static GmsSupplierRequest convertToGmsSupplierRequest(String relList) {

        GmsSupplierRequest request = new GmsSupplierRequest();
        JSONArray jan = JSON.parseArray(relList);
        List<GmsSupplierSkuRel> itemList = new ArrayList<GmsSupplierSkuRel>();
        if (null != jan && jan.size() > 0)
        {
            for (int i = 0; i < jan.size(); i++) {
                String str = jan.get(i).toString();
                GmsSupplierSkuRel item = Json2BeanUtil.mapJson2Bo(GmsSupplierSkuRel.class,str);
                itemList.add(item);
            }
        }

        request.setSupplierSkuRelList(itemList);

        return request;
    }
}
