package com.cloudchain.admin.model.d2d;

import com.cloudchain.d2d.pojo.vo.D2DNumPriceModel;
import com.cloudchain.d2d.pojo.vo.D2DSpecPriceModel;

import java.util.List;

/**
 * Created by zhuhao on 2017/6/8.
 */
public class D2DPriceModel {

    private List<D2DSpecPriceModel> specPriceList;

    private List<D2DNumPriceModel> numPriceList;

    public List<D2DSpecPriceModel> getSpecPriceList() {
        return specPriceList;
    }

    public void setSpecPriceList(List<D2DSpecPriceModel> specPriceList) {
        this.specPriceList = specPriceList;
    }

    public List<D2DNumPriceModel> getNumPriceList() {
        return numPriceList;
    }

    public void setNumPriceList(List<D2DNumPriceModel> numPriceList) {
        this.numPriceList = numPriceList;
    }
}
