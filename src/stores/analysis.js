import {observable,action} from 'mobx';
import {loading} from 'mobx-loading';
import {callRPC} from "@/utils";

class Analysis {
  
  @loading("analysis/revenue")
  @action
  getAnalysisRevenue = async (data) => {
    const res = await callRPC('/admin/datamc/api/selAnalysisRevenue', data);
    console.log('/api/selAnalysisRevenue 获取分析页 今日营收 ===>',res)
    return res
  }

  @loading("analysis/ordersNums")
  @action
  getAnalysisOrders = async (data) => {
    const res = await callRPC('/admin/datamc/api/selOrdersNums', data);
    console.log('/api/selOrdersNums 获取分析页 今日订单量 ===>',res)
    return res
  }

  @loading("analysis/changingNums")
  @action
  getAnalysisCharge = async (data) => {
    const res = await callRPC('/admin/datamc/api/selChangingNums', data);
    console.log('/api/selChangingNums 获取分析页 今日充电量 ===>',res)
    return res
  }

  @loading("analysis/chargingStatus")
  @action
  getAnalysisGunStatus = async (data) => {
    const res = await callRPC('/admin/datamc/api/selChargingStatus', data);
    console.log('/api/selChargingStatus 获取分析页 今日枪状态 ===>',res)
    return res
  }

  @loading("analysis/revenueTrends")
  @action
  getAnalysisRevenueTrends = async (data) => {
    const res = await callRPC('/admin/datamc/api/selChartRevenue', data);
    console.log('/api/selChartRevenue 获取分析页 营收趋势 ===>',res)
    return res
  }

  @loading("analysis/siteRevenue")
  @action
  getAnalysisSiteRevenue = async (data) => {
    const res = await callRPC('/admin/datamc/api/selSiteRevenue', data);
    console.log('/api/selSiteRevenue 获取分析页 站点营收排名 ===>',res)
    return res
  }

  @loading("analysis/registerNumber")
  @action
  getAnalysisRegisterNumber = async (data) => {
    const res = await callRPC('/admin/datamc/api/registerStatistics', data);
    console.log('/api/registerStatistics 获取注册人数 ===>',res)
    return res
  }

  @loading("analysis/userLiveness")
  @action
  getAnalysisUserLiveness = async (data) => {
    const res = await callRPC('/admin/datamc/api/dauStatistics', data);
    console.log('/api/dauStatistics 获取用户活跃度 ===>',res)
    return res
  }

  @loading("analysis/HotSiteStatistics")
  @action
  getAnalysisHotSiteStatistics = async (data) => {
    const res = await callRPC('/admin/datamc/api/hotSiteStatistics', data);
    console.log('/api/hotSiteStatistics 获取热门站点总充电量and排名前5 ===>',res)
    return res
  }

  @loading("analysis/chargePhaseRatio")
  @action
  getAnalysisChargePhaseRatio = async (data) => {
    const res = await callRPC('/admin/datamc/api/phasePieStatistics', data);
    console.log('/api/phasePieStatistics 获取充电时段占比 ===>',res)
    return res
  }

}

export default new Analysis();
