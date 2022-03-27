import {observable,action} from 'mobx';
import {loading} from 'mobx-loading';
import {callRPC} from "@/utils";
import BaseStores from "./baseStores";
import _ from 'underscore';
import moment from 'moment'
import {_t} from "../utils";
import session from '@/stores/session';
import {notification} from "antd/lib/index";

class OperatorTrend extends BaseStores {

  @observable listData = []
  @observable chartData = []
  // @observable curSearchFormParam = {precisionType:"1",intervalType:"2",chartType: "2",stationIds:[],interval2:moment().week(moment().week() - 1),intervalPrev2:moment().week(moment().week() - 2)}; //当前查询form参数
  @observable curSearchFormParam =  [
    {
      "name": [
        "stationIds"
      ],
      "value": [""]
    },
    {
      "name": [
        "chartType"
      ],
      "value": "2"
    },
    {
      "name": [
        "precisionType"
      ],
      "value": "1"
    },
    {
      "name": [
        "intervalType"
      ],
      "value": "2"
    },
    {
      "name": [
        "interval2"
      ],
      "value": moment().week(moment().week() - 1)
    },
    {
      "name": [
        "intervalPrev2"
      ],
      "value": moment().week(moment().week() - 2)
    },
  ]
  @observable groupTags = ["1"]
  @observable chartVisible = true

  @observable dates = []
  @observable hackValue = undefined


  @action
  onOpenChange = open => {
    if (open) {
      this.hackValue = []
      this.dates = []
    } else {
      this.hackValue = undefined
    }
  };

  @action
  setDates = date => {
    this.dates = date
  }



  @action
  disabledDate = current => {
    if (!this.dates || this.dates.length === 0) {
      return false;
    }
    const tooLate = this.dates[0] && current.diff(this.dates[0], 'days') > 30;
    const tooEarly = this.dates[1] && this.dates[1].diff(current, 'days') > 30;
    return tooEarly || tooLate;
  };

  @action
  handleTagsChange= async (value, checked) => {
    await this.resetChartData();
    this.groupTags = checked ? [...this.groupTags, value] : this.groupTags.filter(t => t !== value);
  }

  @action
  handleChartVisible = () => {
    this.chartVisible = !this.chartVisible
  }

  @action
  onIntervalTypeChange = async (e) => {
    // this.resetPrecisionType(e);
    // this.resetData()
    this.groupTags = ["1"]
  }

  @action
  resetPrecisionType = async (intervalType) => {
    let precisionType = "1" ;
    switch (intervalType) {
      case '5':
        precisionType = "1";
        break;
      case '1':
        precisionType = "6";
        break;
      case '2':
        precisionType = "1";
        break;
      case '3':
        precisionType = "1";
        break;
      case '4':
        precisionType = "3";
        break;
    }
    this.setSearchFormParams("precisionType",precisionType)
    console.log("resetPrecisionType",JSON.stringify(this.curSearchFormParam))
  }

  @action
  resetData = async () => {
    this.chartData = []
    this.listData = []
  }

  @action
  resetChartData = async () => {
    this.chartData = []
  }

  @action
  onSearchFormValuesChanged= async(changedValues, allValues)=>{
    await this.resetData();
    console.log("onSearchFormValuesChanged",JSON.stringify(changedValues),JSON.stringify(allValues))
    let params = _.clone(allValues);
    if(changedValues&&changedValues.intervalType){
      Object.assign(params,{precisionType:undefined})
    }
    if(_.isEmpty(params)){
      this.curSearchFormParam = []
    }else{
      this.curSearchFormParam = Object.keys(params).map(key=>({
        "name": [
          key
        ],
        "value": params[key]
      }))
    }
    this.handlePageChange(1,10);
  }


  //获取查询对象参数
  @action
  getListSearchFormParams=async()=>{
    let fieldsValue = await this.getSearchParams();
    const {intervalPrev,intervalPrev2,interval,interval2,intervalType,stationIds} = fieldsValue;
    if(intervalType==="5"){
      if(_.isEmpty(interval)||_.isEmpty(intervalPrev)){
        return {}
      }
    }else{
      if(_.isEmpty(interval2)||_.isEmpty(intervalPrev2)){
        return {}
      }
    }
    console.log("intervalPrev2",JSON.stringify(intervalPrev2))
    console.log("interval2",JSON.stringify(interval2))
    let val;
    let val2;
    let valLabel,val2Label;
    switch (intervalType) {
      case '5':
        val = interval[0].format('YYYY-MM-DD')+'~'+interval[1].format('YYYY-MM-DD');
        valLabel = interval[0].format('YYYY年MM月DD日')+'~'+interval[1].format('YYYY年MM月DD日');
        val2 = intervalPrev[0].format('YYYY-MM-DD')+'~'+intervalPrev[1].format('YYYY-MM-DD');
        val2Label = intervalPrev[0].format('YYYY年MM月DD日')+'~'+intervalPrev[1].format('YYYY年MM月DD日');
        break;
      case '1':
        val = interval2.format('YYYY-MM-DD');
        valLabel = interval2.format('YYYY年MM月DD日');
        val2 = intervalPrev2.format('YYYY-MM-DD');
        val2Label = intervalPrev2.format('YYYY年MM月DD日');
        break;
      case '2':
        val = interval2.format('YYYY-w');
        val2 = intervalPrev2.format('YYYY-w');
        valLabel = interval2.format('YYYY年w周');
        val2Label = intervalPrev2.format('YYYY年w周');
        break;
      case '3':
        val = interval2.format('YYYY-MM');
        val2 = intervalPrev2.format('YYYY-MM');
        valLabel = interval2.format('YYYY年MM月');
        val2Label = intervalPrev2.format('YYYY年MM月');
        break;
      case '4':
        val = interval2.format('YYYY');
        val2 = intervalPrev2.format('YYYY');
        valLabel = interval2.format('YYYY年');
        val2Label = intervalPrev2.format('YYYY年');
        break;
    }
    return {...fieldsValue,stationIds:stationIds?stationIds.join(","):"",interval:val,intervalLabel:valLabel,intervalPrev:val2,intervalPrevLabel:val2Label,};
  }

  @action
  getChartSearchFormParams=async()=>{
    const params = await this.getListSearchFormParams();
    if(_.isEmpty(params)){
      return;
    }
    delete params.pageIndex;
    delete params.pageSize;
    Object.assign(params,{firstgroups:!_.isEmpty(this.groupTags)?this.groupTags[0]:"1"})
    return params;
  }



  @loading("operatorTrend/getListData")
  @action
  getListData = async () => {
    this.listData = []
    const params = await this.getListSearchFormParams();
    const {interval,intervalPrev,intervalLabel,intervalPrevLabel,intervalType} = params;
    if(intervalType === "5"){
      const intervals = interval.split("~");
      const intervalPrevs = intervalPrev.split("~");
      if(intervalPrevs[0]<intervals[0]){
        Object.assign(params,{interval:intervalPrev,intervalPrev:interval,intervalLabel:intervalPrevLabel,intervalPrevLabel:intervalLabel})
      }
    }else{
      if(intervalPrev<interval){
        Object.assign(params,{interval:intervalPrev,intervalPrev:interval,intervalLabel:intervalPrevLabel,intervalPrevLabel:intervalLabel})
      }
    }
    if(_.isEmpty(params)){
      return;
    }
    console.log("getListData",JSON.stringify(params))
    const res = await callRPC('/admin/datamc/api/findSiteOperationDataTrendList', params);
    console.log('/api/findSiteOperationDataTrendList ===>',res)
    if(res.code===0){
      this.listData = res;
    }
    return res
  }
  @action
  onStationChange = (e)=>{
    console.log("onStationChange",JSON.stringify(e))
    let stationIds = null;
    if(_.isEmpty(e)){
      stationIds = [];
    }else{
      const last = e[e.length-1]
      if(!last){
        stationIds = [""];
      }else{
        stationIds = _.without(e,"");
      }
    }

    this.setSearchFormParams("stationIds",stationIds)
  }


  @loading("operatorTrend/getChartData")

  getChartData = async () => {
    this.chartData = []
    const params = await this.getChartSearchFormParams();
    const {interval,intervalPrev,intervalLabel,intervalPrevLabel,intervalType} = params;
    if(intervalType === "5"){
      const intervals = interval.split("~");
      const intervalPrevs = intervalPrev.split("~");
      if(intervalPrevs[0]<intervals[0]){
        Object.assign(params,{interval:intervalPrev,intervalPrev:interval,intervalLabel:intervalPrevLabel,intervalPrevLabel:intervalLabel})
      }
    }else{
      if(intervalPrev<interval){
        Object.assign(params,{interval:intervalPrev,intervalPrev:interval,intervalLabel:intervalPrevLabel,intervalPrevLabel:intervalLabel})
      }
    }

    console.log("getChartData",JSON.stringify(params))
    const res = await callRPC('/admin/datamc/api/findSiteOperationDataTrend', params);
    console.log('/api/findSiteOperationDataTrend ===>',res)
    if(res.code===0){
      this.chartData = res.records;
    }
    return res
  }

  // 分页index改变
  @action
  onPageIndexChange= async(page, pageSize)=> {
    this.handlePageChange(page,pageSize);
    this.getListData()
  }
  // 分页size改变
  @action
  onPageSizeChange= async(current, size)=>{
    this.handlePageChange(current,size);
    this.getListData()
  }


  @action
  saveConfig = async ()=>{
    const params = await this.getChartSearchFormParams();
    // Object.assign(params,{operatorIds:session.operatorIds})
    const data = {prop:"operatorTrend",config:JSON.stringify(params),id:this.configData.id}
    const rt = await callRPC('/admin/datamcconfig/saveConfig', data,true);
    if(rt.code===0){
      notification.success({
        message:_t('保存成功'),
      });
    }
    return rt;
  }


  @action
  getConfig = async ()=>{
    const rt = await callRPC('/admin/datamcconfig/selectByProp', {prop:"operatorTrend"});
    if(rt.code===0){
      this.configData = rt.record||{};
      const {record} = rt;
      if(record){
        const {config} = record;
        if(config){
          const data = JSON.parse(config);
          const {operatorIds,stationIds,intervalType,firstgroups,interval,intervalLabel,chartType,precisionType,intervalPrev,intervalPrevLabel} = data;
          // session.setOperatorIds(parseInt(operatorIds||0,10))
         const params = {chartType,precisionType,stationIds:stationIds.split(",").map(id=>parseInt(id,10))||[].map(id=>parseInt(id,10)),intervalType,}
          if(intervalType==="5"){
           const intervals = interval.split("~");
            const intervalPrevs = intervalPrev.split("~");
           if(!_.isEmpty(intervals)){
             Object.assign(params,{interval:[moment(intervals[0]),moment(intervals[1])],intervalPrev:[moment(intervalPrevs[0]),moment(intervalPrevs[1])]})
           }

          }else if(intervalType==="2"){
            Object.assign(params,{interval2:moment(interval,"YYYY-w"),intervalPrev2:moment(intervalPrev,"YYYY-w")})
          }else{
            Object.assign(params,{interval2:moment(interval),intervalPrev2:moment(intervalPrev)})
          }
          await this.onSearchFormValuesChanged(null,params);
          this.groupTags = [firstgroups];

          this.getChartData();
          this.getListData();
        }
      }
    }
    return rt;
  }

}

export default new OperatorTrend();
