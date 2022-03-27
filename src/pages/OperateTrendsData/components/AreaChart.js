import React, { useState, useEffect } from 'react';
import { Area } from '@ant-design/charts';
import cls from './css/Chart.less'
import { Row, Col, Form, Button } from 'antd'
import { CircleDot } from '@/components/CircleDot'
import {observer} from "mobx-react/dist/index";
import dataState from '@/stores/operatorTrend';
import {chartUnitMap} from "../../../utils/constant";
import {_t, getDiffUnitLabel} from "../../../utils";

export const AreaChart  = React.forwardRef(({chartData,tagsValue},ref)=> {
  // const {chartData,tagsValue} = dataState;
  // console.log("chartData",JSON.stringify(chartData))
  const tagsVal = parseInt(tagsValue,10);
  const colorConfig = ['#0070FF', '#FFD050','#945FB9'];
  const isDiffRecord = (record)=>{
    return record.name==="差值";
  }
  let diffRecord = {};
  const config = {
    data: chartData,
    xField: 'group',
    yField: 'value',
    seriesField: 'type',
    height: 400,
    padding: 'auto',
    color: colorConfig,
    meta: {
      value: {
        formatter: (v) => (getDiffUnitLabel(tagsVal,v))
      },
    },
    legend:{
      position:"bottom-left",
    }
  };
  return (
    <Area {...config}  chartRef={ref} />
  )
});
