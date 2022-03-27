import React, { useState, useEffect } from 'react';
import { Row, Col, Select, DatePicker } from 'antd'
import moment from 'moment'
import cls from './css/StatisticsDateSelect.less'
import { MyDateSelect } from '../../../components/MyDateSelect'

const { Option } = Select;
const { RangePicker } = DatePicker;

export const StatisticsDateSelect = (props) => {
  const { onChange, statisticsValue } = props

  const handleSelectStation = (e) => {
    if(onChange){
      onChange(e)
    }
  }

  switch(statisticsValue){
    case '0':
        return <RangePicker 
                separator={'~'} 
                className={cls.rangePicker} 
                onChange={(e)=>{handleSelectStation(e)}} 
                />
    case '1':
        return <DatePicker defaultValue={moment()} onChange={(e)=>{ handleSelectStation(e) }} />
    case '2':
        return <MyDateSelect column={3} onChange={onChange} />
    case '3':
        return <MyDateSelect column={2} onChange={onChange} />
    default:
      return <div></div>
  }

}
