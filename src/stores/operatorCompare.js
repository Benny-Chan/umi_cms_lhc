import {observable,action,computed} from 'mobx';
import {loading} from 'mobx-loading';
import {callRPC} from "@/utils";
import BaseStores from "./baseStores";
import session from '@/stores/session';
import _ from 'underscore';
import {notification} from "antd/lib/index";
import {_t} from "../utils";

class OperatorCompare extends BaseStores {

  @observable compareData = []
  // @observable curSearchFormParam = {stationIds:[664]}; //当前查询form参数
  @observable curSearchFormParam =  [
    {
      "name": [
        "stationIds"
      ],
      "value": []
    },
    {
      "name": [
        "intervalType"
      ],
      "value": "1"
    },
    ]
  @observable dateBox = []
  @observable dateBoxValue = []
  @observable stationBox = []
  @observable stationBoxValue = []
  @observable groupTags = ["1"]

  @action
  handleTagsChange= async (value, checked) => {
    await this.resetData();
    this.groupTags = checked ? [...this.groupTags, value] : this.groupTags.filter(t => t !== value);
  }

  @action
  onIntervalTypeChange = async () => {
    this.resetDateBox();
    this.resetData()
  }

  @action
  resetDateBox = async () => {
    await this.resetData();
    this.dateBox = []
    this.dateBoxValue = []
  }

  @action
  resetStationBox = async () => {
    await this.resetData();
    this.stationBox = []
    this.stationBoxValue = []
  }

  @action
  resetData = async () => {
    this.compareData = []
  }

  @computed get boxDisabled() {
    return this.dateBoxValue.length * this.stationBoxValue.length >= 18;
  }

  @action
  onStationChange = async (station) => {

    console.log("onStationChange",JSON.stringify(station))
    await this.resetData();
    if(!this.stationBox.includes(station.label)){
      this.stationBox = [...this.stationBox,station.label]
    }

    if(!this.stationBoxValue.includes(station.value)){
      this.stationBoxValue = [...this.stationBoxValue,station.value]
    }
    this.setSearchFormParams("stationIds",[])
  }


  @action
  onDateBoxChange = async (value,intervalType) => {
    console.log("onDateBoxChange",value,intervalType)
    if(!value){
      return;
    }
    await this.resetData();
    let text ;
    let val ;
    switch (intervalType) {
      case '5':
        text = value[0].format('YYYY年MM月DD日~')+value[1].format('YYYY年MM月DD日');
        val = value[0].format('YYYY-MM-DD')+'~'+value[1].format('YYYY-MM-DD');
        break;
      case '1':
        text = value.format('YYYY年MM月DD日')
        val = value.format('YYYY-MM-DD');
        break;
      case '2':
        text = value.format('YYYY年w周')
        val = value.format('YYYY-w');
        break;
      case '3':
        text = value.format('YYYY年MM月')
        val = value.format('YYYY-MM');
        break;
      case '4':
        text = value.format('YYYY年')
        val = value.format('YYYY');
        break;
    }
    if(!this.dateBox.includes(text)){
      this.dateBox = [...this.dateBox,text]
    }

    if(!this.dateBoxValue.includes(val)){
      this.dateBoxValue = [...this.dateBoxValue,val]
    }
  }

  @action
  deleteStationBoxItem = async (index) => {
    await this.resetData();
    const box = _.clone(this.stationBox);
    box.splice(index,1);
    this.stationBox = [...box]
    const boxVal = _.clone(this.stationBoxValue);
    boxVal.splice(index,1);
    this.stationBoxValue = [...boxVal]
  }

  @action
  deleteDateBoxItem = async (index) => {
    await this.resetData();
    const box = _.clone(this.dateBox);
    box.splice(index,1);
    this.dateBox = [...box]
    const boxVal = _.clone(this.dateBoxValue);
    boxVal.splice(index,1);
    this.dateBoxValue = [...boxVal]
  }

  @loading("operatorCompare/getCompareStationOperationData")
  @action
  getCompareStationOperationData = async () => {
    // const {stationIds,intervalType,} = this.curSearchFormParam;
    const intervalType =await this.getSearchFormParamsByName("intervalType")
    const params = {stationIds:this.stationBoxValue?this.stationBoxValue.join(","):"",intervalType,firstgroups:!_.isEmpty(this.groupTags)?this.groupTags[0]:"",interval:this.dateBoxValue.join(','),intervalLabel:this.dateBox.join(',')};
    const res = await callRPC('/admin/datamc/api/compareStationOperationData', params);
    console.log('/api/compareStationOperationData 获取站点间运营数据对比 ===>',res)
    if(res.code===0){
      this.compareData = res.records;

    }
    return res
  }

  @action
  saveConfig = async ()=>{
    const intervalType =await this.getSearchFormParamsByName("intervalType")
    const params = {stationIdLabels:!_.isEmpty(this.stationBox)?this.stationBox.join(","):"",stationIds:!_.isEmpty(this.stationBoxValue)?this.stationBoxValue.join(","):"",intervalType,firstgroups:this.groupTags,interval:this.dateBoxValue.join(','),intervalLabel:this.dateBox.join(',')}
    // Object.assign(params,{operatorIds:session.operatorIds})
    const data = {prop:"operatorCompare",config:JSON.stringify(params),id:this.configData.id}
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
    const rt = await callRPC('/admin/datamcconfig/selectByProp', {prop:"operatorCompare"});
    if(rt.code===0){
      this.configData = rt.record||{};;
      const {record} = rt;
      if(record){
        const {config} = record;
        if(config){
         const data = JSON.parse(config);
         const {operatorIds,stationIdLabels,stationIds,intervalType,firstgroups,interval,intervalLabel} = data;
          // this.curSearchFormParam = {stationIds:stationIds.split(",").map(id=>parseInt(id,10)),intervalType,}
          // session.setOperatorIds(parseInt(operatorIds||0,10))
          this.curSearchFormParam =  [
            {
              "name": [
                "intervalType"
              ],
              "value": intervalType
            },
          ]
            console.log("this.curSearchFormParam",JSON.stringify(this.curSearchFormParam))
          this.groupTags = firstgroups;
          this.stationBoxValue = stationIds?stationIds.split(",").map(id=>parseInt(id,10)):[];
          this.stationBox = stationIdLabels?stationIdLabels.split(","):[];
          this.dateBoxValue = interval.split(",");
          this.dateBox = intervalLabel.split(",");

          this.getCompareStationOperationData();
        }
      }
    }
    return rt;
  }

}

export default new OperatorCompare();
