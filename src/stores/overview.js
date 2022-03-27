import {observable,action} from 'mobx';
import {loading} from 'mobx-loading';
import {callRPC} from "@/utils";

class OverView {

  @action
  getOverViewRevenue = async (data) => {
    const res = await callRPC('/admin/datamc/api/findRevenues', data);
    console.log('/api/findRevenues 获取概览图营收 ===>',res)
    return res
  }

  @action
  getOverViewTodayData = async (data) => {
    const res = await callRPC('/admin/datamc/api/findStatistDay', data);
    console.log('/api/findStatistDay 获取概览图今日数据 ===>',res)
    return res
  }
  
  @loading("overview/rank")
  @action
  getOverViewRevenueRank = async (data) => {
    const res = await callRPC('/admin/datamc/api/findRevenueRanking', data);
    console.log('/api/findRevenueRanking 获取营收排名 ===>',res)
    return res
  }
  
  @loading("overview/rise")
  @action
  getOverViewRevenueRise = async (data) => {
    const res = await callRPC('/admin/datamc/api/findRevenueRise', data);
    console.log('/api/findRevenueRise 获取营收上升排名 ===>',res)
    return res
  }
  
  @loading("overview/decline")
  @action
  getOverViewRevenueDecline = async (data) => {
    const res = await callRPC('/admin/datamc/api/findRenueDecline', data);
    console.log('/api/findRenueDecline 获取营收下降排名 ===>',res)
    return res
  }

  @action
  getOverViewRevenueProportion = async (data) => {
    const res = await callRPC('/admin/datamc/api/unionAmountStatistics', data);
    console.log('/api/unionAmountStatistics 获取营收占比 ===>',res)
    return res
  }

  @action
  getOverViewRegisterNumber = async (data) => {
    const res = await callRPC('/admin/datamc/api/registerRecentStatistics', data);
    console.log('/api/registerRecentStatistics 获取近7天注册人数 ===>',res)
    return res
  }

  @action
  getOverViewLivenessNumber = async (data) => {
    const res = await callRPC('/admin/datamc/api/dauRecentStatistics', data);
    console.log('/api/dauRecentStatistics 获取近7天活跃人数 ===>',res)
    return res
  }

  @action
  getOverViewUseRate = async (data) => {
    const res = await callRPC('/admin/datamc/api/useRateStatistics', data);
    console.log('/api/useRateStatistics 使用率占比 ===>',res)
    return res
  }

  @action
  findProvinceList = async()=>{
    const res = await callRPC('/admin/station/findProvinceList');
    return res
  }

  @action
  getStationHeatMap = async(regionCode)=>{
    const res = await callRPC('admin/datamc/api/stationHeatMap', {regionCode});
    return res
  }

  @action
  totalStatistics = async()=>{
    const res = await callRPC('admin/datamc/api/totalStatistics');
    return res
  }
}

export default new OverView();
