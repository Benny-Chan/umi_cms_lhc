import React, { useState, useEffect } from 'react';
import {observer} from "mobx-react/dist/index";
import stations from "@/stores/station";
import {_t, handleResult, useLoading} from "@/utils";
import { useMount, useUnmount, useUpdateEffect } from 'ahooks';
import cls from '../../global.less'
import {
  Select,
} from 'antd';
import _ from 'underscore';
import session from '@/stores/session'

const { Option } = Select;

const StationSelect = observer(({value,onChange,style,placeholder,mode,showAll,labelInValue,disabled})=>{
  useMount(()=>{
    if(_.isEmpty(stations.list)){
      stations.loadList();
    }
  });
  useUpdateEffect(() => {
    stations.loadList();
  },[session.operatorIds])

  if(showAll&&mode==="multiple"){
    let stationIds = null;
    if(_.isEmpty(value)){
      stationIds = [];
    }else{
      const last = value[value.length-1]
      // console.log("last",last)
      if(last===""){
        stationIds = [""];
      }else{
        stationIds = _.without(value,"");
      }
    }
    return (
      <div className={cls.stationSelectContainer}>
        <Select
          optionFilterProp="title"
          filterOption={(inputValue, option)=>(option.title&&option.title.indexOf(inputValue)!==-1)||(option.key&&option.key.indexOf(inputValue)!==-1)}
          showArrow={false}
          value={value}
          loading={useLoading('station/loadList')}
          dropdownMatchSelectWidth={true}
          onChange={onChange}
          placeholder={placeholder||_t('请选择')}
          style={style}
          mode={mode}
          allowClear
        >
          {showAll&&
          <Option title={_t('全部站点')} value="" key="">
            {_t('全部站点')}
          </Option>
          }
          {stations.list.map(item => (
            <Option title={item.name} value={item.id} key={item.id} disabled={value?value.includes(""):false}>
              {item.name}
            </Option>
          ))}
        </Select>
      </div>
    );
  }
    // console.log("StationSelect",value)
  return (
    <div className={cls.stationSelectContainer}>
      <Select
        showSearch
        optionFilterProp="title"
        filterOption={(inputValue, option)=>(option.title&&option.title.indexOf(inputValue)!==-1)||(option.key&&option.key.indexOf(inputValue)!==-1)}
        value={value}
        loading={useLoading('station/loadList')}
        dropdownMatchSelectWidth={true}
        onChange={onChange}
        placeholder={placeholder||_t('请选择')}
        style={style}
        mode={mode}
        allowClear
        labelInValue={labelInValue}
        disabled={disabled}
      >
        {showAll&&
        <Option title={_t('全部站点')} value="" key="">
          {_t('全部站点')}
        </Option>
        }
        {stations.list.map(item => (
          <Option title={item.name} value={item.id} key={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
    </div>
  );
})

export default StationSelect;
