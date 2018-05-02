package com.cloudchain.admin.model.tms;

import com.cloudchain.tms.pojo.po.TmsDispatchBill;
import com.cloudchain.tms.pojo.po.TmsDispatchDriver;
import com.cloudchain.tms.pojo.po.TmsDispatchFee;
import com.cloudchain.tms.pojo.vo.SegmentDriver;

import java.util.List;

/**
 * Created by LiuKai on 2017/3/14.
 */
public class DispatchBillModel {

    private TmsDispatchBill dispatchBill;

    private TmsDispatchFee dispatchFee;

    private List<TmsDispatchDriver> dispatchDriverList;

    private List<SegmentDriver> segmentDrivers;

    private String segmentIds;

    public String getSegmentIds() {
        return segmentIds;
    }

    public void setSegmentIds(String segmentIds) {
        this.segmentIds = segmentIds;
    }

    public TmsDispatchBill getDispatchBill() {
        return dispatchBill;
    }

    public void setDispatchBill(TmsDispatchBill dispatchBill) {
        this.dispatchBill = dispatchBill;
    }

    public TmsDispatchFee getDispatchFee() {
        return dispatchFee;
    }

    public void setDispatchFee(TmsDispatchFee dispatchFee) {
        this.dispatchFee = dispatchFee;
    }

    public List<TmsDispatchDriver> getDispatchDriverList() {
        return dispatchDriverList;
    }

    public void setDispatchDriverList(List<TmsDispatchDriver> dispatchDriverList) {
        this.dispatchDriverList = dispatchDriverList;
    }

    public List<SegmentDriver> getSegmentDrivers() {
        return segmentDrivers;
    }

    public void setSegmentDrivers(List<SegmentDriver> segmentDrivers) {
        this.segmentDrivers = segmentDrivers;
    }
}
