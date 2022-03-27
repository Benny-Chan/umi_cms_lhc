import {observable,action} from 'mobx';
import React, { useRef } from 'react'
import {loading} from 'mobx-loading';
import {callRPC} from "@/utils";
import BaseStores from "./baseStores";
import _ from 'underscore';
import {message } from 'antd'
import session from '@/stores/session';
import moment from 'moment';
import {chartUnitMap} from "../utils/constant";
import {_t} from "../utils";
import {notification} from "antd/lib/index";

class Operator extends BaseStores {

  @observable hasInitParams = false

  @observable listData = []
  @observable columnData = [[],[]]
  @observable pieData = []
  // @observable curSearchFormParam = {chartType: "1",stationIds:[],precisionType:"1",intervalType:"5",interval:[moment().subtract(15, 'days'), moment().subtract(1, 'days')],interval2:moment()}; //当前查询form参数
  // @observable curSearchFormParam = {chartType: "1",stationIds:[664],precisionType:"1",intervalType:"5"}; //当前查询form参数
  @observable curSearchFormParam =[
    {
      "name": [
        "stationIds"
      ],
      "value": ""
    },
    {
      "name": [
        "chartType"
      ],
      "value": "1"
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
      "value": "5"
    },
    {
      "name": [
        "interval"
      ],
      "value": [moment().subtract(15, 'days'), moment().subtract(1, 'days')]
    },
    {
      "name": [
        "interval2"
      ],
      "value": moment()
    },
  ]
  // @observable tagsValue = "1"
  @observable groupTags = [["1"],[],[],["1"]]
  @observable pieGroupTags = ["1"]
  @observable columnChartFields = ['value1',"value4"]
  @observable chartVisible = true
  @observable disableGroup = [false,true,true,false]

  @observable tagsData = [
    { min: 0, max: 20, key: '0-20'},
    { min: 20, max: 40, key: '20-40'},
    { min: 40, max: 60, key: '40-60'},
    { min: 60, max: 80, key: '60-80'},
    { min: 80, max: 100, key: '80-100'},
    { min: 100, max: 150, key: '100-150'},
    { min: 150, max: '', key: '150-'},
  ]
  @observable minValue = ""
  @observable maxValue = ""
  @observable minTime = ""
  @observable maxTime = ""
  @observable precisionUnit = "1"

  @observable dates = []
  @observable hackValue = undefined

  @observable statisticsList = [
    { text: _t('自定义电量'), value: "1" },
    // { text: _t('自定义小时区间'), value: "2" },
    { text: _t('峰谷平'), value: "3" },
  ]


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
  resetParams = async() => {
    this.hasInitParams = false;
  }

  @action
  initParamsFromAnalysis = async(key) => {
    this.hasInitParams = true;
    this.curSearchFormParam =[
      {
        "name": [
          "stationIds"
        ],
        "value": ""
      },
      {
        "name": [
          "chartType"
        ],
        "value": "1"
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
        "value": "3"
      },
      {
        "name": [
          "interval"
        ],
        "value": [moment().subtract(15, 'days'), moment().subtract(1, 'days')]
      },
      {
        "name": [
          "interval2"
        ],
        "value": moment()
      },
    ]
    if(key===1){
      this.groupTags = [[],[],[],["1"]]
      this.columnChartFields = ["value4"]
      this.disableGroup = [false,false,false,false]
    }else if(key===2){
      this.groupTags = [[],[],["1"],[]]
      this.columnChartFields = ["value3"]
      this.disableGroup = [false,false,false,false]
    }else if(key===3){
      this.groupTags = [["1"],[],[],[]]
      this.columnChartFields = ["value1"]
      this.disableGroup = [false,false,false,false]
    }
    this.getListData();
    this.getChartData();
  }

  @action
  onPrecisionUnitChange = (precisionUnit) => {
    this.precisionUnit = precisionUnit
    this.tagsData = []
    this.pieData = []
    this.pieGroupTags = ["1"]
  }

  @action
  setDisableGroup = (disableGroup) => {
  this.disableGroup = disableGroup
  }

  @action
  setGroupTags = (data) => {
    this.groupTags = data
  }

  @action
  setTagsData = (data) => {
    this.tagsData = data
  }

  @action
  handleCloseTag = async(key) => {
    await this.resetChartData();
    const tags = this.tagsData.filter(item => item.key !== key)
    this.setTagsData(tags)
  }

  @action
  handleAddTag = async() => {
    await this.resetChartData();
    if(this.precisionUnit==="1"){
      const obj = {min: this.minValue, max: this.maxValue, key: `${this.minValue}-${this.maxValue}`}
      const bool = this.tagsData.some(item => item.key === obj.key)

      if(bool) return message.error(_t('存在相同标签'))
      this.setMinValue('')
      this.setMaxValue('')
      this.setTagsData([...this.tagsData, obj])
    }
    if(this.precisionUnit==="2"){
      const obj = {min: this.minTime, max: this.maxTime, key: `${this.minTime}-${this.maxTime}`}
      const bool = this.tagsData.some(item => item.key === obj.key)

      if(bool) return message.error(_t('存在相同标签'))
      this.setMinTime('')
      this.setMaxTime('')
      this.setTagsData([...this.tagsData, obj])
    }


  }

  @action
  setMinValue = (val) => {
    this.minValue = val
  }

  @action
  setMaxValue = (val) => {
    this.maxValue = val
  }

  @action
  setMinTime = (val) => {
    this.minTime = val
  }

  @action
  setMaxTime = (val) => {
    this.maxTime = val
  }


  @action
  handleChartVisible = () => {
    this.chartVisible = !this.chartVisible
  }

  @action
  handleTagsChange= async (value, checked) => {
    await this.resetChartData();

    this.pieGroupTags = checked ? [...this.pieGroupTags, value] : this.pieGroupTags.filter(t => t !== value);
    if(value==="6"&&checked){
      this.precisionUnit = "3"
      this.statisticsList = [
        { text: _t('峰谷平'), value: "3" },
      ]
    }else{
      this.precisionUnit = "1"
      this.statisticsList = [
        { text: _t('自定义电量'), value: "1" },
        // { text: _t('自定义小时区间'), value: "2" },
        { text: _t('峰谷平'), value: "3" },
      ]
    }
  }

  @action
  onColumnCheckBoxChange = async (value) => {
    await this.resetChartData();
    if(!_.isEmpty(value)){

      this.groupTags = value;
      const [firstgroups,secondgroups,thirdgroups,forthgroups] = value;
      const columnChartFields = []
      if(!_.isEmpty(firstgroups)){
        columnChartFields.push("value1")
      }
      if(!_.isEmpty(secondgroups)){
        columnChartFields.push("value2")
      }
      if(!_.isEmpty(thirdgroups)){
        columnChartFields.push("value3")
      }
      if(!_.isEmpty(forthgroups)){
        columnChartFields.push("value4")
      }
      this.columnChartFields = [...columnChartFields]
    }
  }

  @action
  onIntervalTypeChange = async (e) => {
    this.resetPrecisionType();
    // this.resetData()
  }

  @action
  resetPrecisionType = async () => {
    this.setSearchFormParams("precisionType",undefined)
  }

  @action
  resetData = async () => {
    // this.tagsData = []
    this.columnData = [[],[]]
    this.pieData = []
    this.listData = []
  }

  @action
  onSearchFormValuesChanged= async(changedValues, allValues)=>{
    await this.resetData();
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

  @action
  resetChartData = async () => {
    this.columnData = [[],[]]
    this.pieData = []
  }


  //获取查询对象参数
  @action
  getListSearchFormParams=async()=>{
    let fieldsValue = await this.getSearchParams();
    const {interval,interval2,intervalType,stationIds} = fieldsValue;
    let val;
    switch (intervalType) {
      case '5':
        val = interval[0].format('YYYY-MM-DD')+'~'+interval[1].format('YYYY-MM-DD');
        break;
      case '1':
        val = interval2.format('YYYY-MM-DD');
        break;
      case '2':
        val = interval2.format('YYYY-w');
        break;
      case '3':
        val = interval2.format('YYYY-MM');
        break;
      case '4':
        val = interval2.format('YYYY');
        break;
    }
    return {...fieldsValue,stationIds:stationIds,interval:val,};
  }

  @action
  getChartSearchFormParams=async()=>{
    const params = await this.getListSearchFormParams();
    delete params.pageIndex;
    delete params.pageSize;
    const {chartType} = params;
    if(chartType === "1"){
      Object.assign(params,{firstgroups:this.groupTags[0].join(','),secondgroups:this.groupTags[1].join(','),thirdgroups:this.groupTags[2].join(','),forthgroups:this.groupTags[3].join(',')})
    }else{
      Object.assign(params,{firstgroups:!_.isEmpty(this.pieGroupTags)?this.pieGroupTags[0]:"1",precisionType:this.precisionUnit,precision:_.pluck(this.tagsData,'key').join(',')})
    }

    return params;
  }



  @loading("operator/getListData")
  @action
  getListData = async () => {
    const params = await this.getListSearchFormParams();
    const res = await callRPC('/admin/datamc/api/findSiteOperationList', params);
    if(res.code===0){
      this.listData = res;
    }
    return res
  }
  @action
  onStationChange = (e)=>{
    this.setSearchFormParams("stationIds",e)
  }


  @loading("operator/getChartData")
  getChartData = async () => {
    const params = await this.getChartSearchFormParams();
    const res = await callRPC('/admin/datamc/api/onSiteOperationDataStatistics', params);
    if(res.code===0){
      const {chartType} = params;
      if(chartType==='1'){
       const {firstGroupData,secondGroupData,thirdGroupData,forthGroupData} =  res.record.chartData;
        const [firstgroups,secondgroups,thirdgroups,forthgroups] = this.groupTags;
        let columnData = []
        if(!_.isEmpty(firstgroups)){
          columnData.push(firstGroupData)
        }
        if(!_.isEmpty(secondgroups)){
          columnData.push(secondGroupData)
        }
        if(!_.isEmpty(thirdgroups)){
          columnData.push(thirdGroupData)
        }
        if(!_.isEmpty(forthgroups)){
          columnData.push(forthGroupData)
        }
        this.columnData = columnData
      }else{
      const {chartData} = res.record;
      if(chartData){
        if(this.precisionUnit === "1"){
          const tempArr = []
          chartData.map(item=>{
            const tag =   _.find(this.tagsData,(i)=>i.key===item.type)
            const unitLabel  = chartUnitMap[parseInt(this.precisionUnit,10)];
            if(tag){
              tempArr.push({...item,label:tag.max?`${tag.min}-${tag.max}${unitLabel}`:`${tag.min}${unitLabel}以上`})
            }
          })
          this.pieData = tempArr;
        }
        if(this.precisionUnit === "3"){
          this.pieData = chartData.map(item=>({...item,label:item.type}))
        }
      }
      }

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
    const data = {prop:"operator",config:JSON.stringify(params),id:this.configData.id}
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
    const rt = await callRPC('/admin/datamcconfig/selectByProp', {prop:"operator"});
    if(rt.code===0){
      this.configData = rt.record||{};
      const {record} = rt;
      if(record){
        const {config} = record;
        if(config){
          const data = JSON.parse(config);
          const {stationIds,intervalType,firstgroups,interval,chartType,precisionType} = data;
          // session.setOperatorIds(parseInt(operatorIds||0,10))
          const params = {chartType,precisionType,stationIds:stationIds,intervalType,}
          if(intervalType==="5"){
            const intervals = interval.split("~");
            if(!_.isEmpty(intervals)){
              Object.assign(params,{interval:[moment(intervals[0]),moment(intervals[1])]})
            }

          }else if(intervalType==="2"){
            Object.assign(params,{interval2:moment(interval, "YYYY-w")})
          }else{
            Object.assign(params,{interval2:moment(interval)})
          }
          if(chartType === "1"){
            const {firstgroups,secondgroups,thirdgroups,forthgroups} = data;
            this.groupTags = [firstgroups?firstgroups.split(","):[],secondgroups?secondgroups.split(","):[],thirdgroups?thirdgroups.split(","):[],forthgroups?forthgroups.split(","):[]]
            const disableGroup = []
            this.groupTags.map(item=>{
              if(_.isEmpty(item)){
                disableGroup.push(true)
              }else{
                disableGroup.push(false)
              }
            })
            this.disableGroup = disableGroup
          }else{
            const {firstgroups,precisionType,precision} = data;
            this.pieGroupTags = [firstgroups];
            this.precisionUnit = precisionType;
            const precisionKeys = precision.split(',');
            const precisionArr = []
            precisionKeys.map(key=>{
             const values =  key.split('-');
             if(values.length===2){
               precisionArr.push({min: values[0], max: values[1], key: `${values[0]}-${values[1]}`})
             }
              if(values.length===1){
                precisionArr.push({min: values[0], max: '', key: `${values[0]}-`})
              }
            })
            this.tagsData = precisionArr
          }
          await this.onSearchFormValuesChanged(null,params);
          // this.groupTags = [firstgroups];
          this.getChartData();
          this.getListData();
        }
      }
    }
    return rt;
  }

}

export default new Operator();
