package com.cloudchain.admin.model.d2p;

import com.cloudchain.d2p.pojo.vo.NumPriceModel;
import com.cloudchain.d2p.pojo.vo.SpecPriceModel;

import java.util.List;

/**
 * Created by LiuKai on 2017/5/9.
 */
public class D2PPriceModel {

    private List<SpecPriceModel> specPriceList;

    private List<NumPriceModel> numPriceList;

    public List<SpecPriceModel> getSpecPriceList() {
        return specPriceList;
    }

    public void setSpecPriceList(List<SpecPriceModel> specPriceList) {
        this.specPriceList = specPriceList;
    }

    public List<NumPriceModel> getNumPriceList() {
        return numPriceList;
    }

    public void setNumPriceList(List<NumPriceModel> numPriceList) {
        this.numPriceList = numPriceList;
    }
}
