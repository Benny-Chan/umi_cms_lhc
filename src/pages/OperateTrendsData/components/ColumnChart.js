import React, { useState, useEffect } from 'react';
import {Column} from '@ant-design/charts';
import _ from 'lodash'
import {CircleDot} from '@/components/CircleDot';
import cls from './css/Chart.less'
import { Row, Col, Form, Button } from 'antd'
import {observer} from "mobx-react/dist/index";
import dataState from '@/stores/operatorTrend';
import {chartUnitMap} from "../../../utils/constant";
import {_t, getDiffUnitLabel} from "../../../utils";

/**
 *
 */
export const ColumnChart = React.forwardRef(({chartData,tagsValue},ref)=> {
  // const {chartData,tagsValue} = dataState;
  // console.log("chartData",JSON.stringify(chartData))
  console.log("tagsValue",JSON.stringify(tagsValue))
  const tagsVal = parseInt(tagsValue,10);
  const colorConfig = ['#0070FF', '#FFD050','#945FB9'];


  const config = {
    data: [...chartData],
    isGroup: true,
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
    label: {
      position: 'middle',
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
    },
    tooltip: {
      customContent: (title, data) => {
        console.log("data",title,data)
        return(
          <div style={{padding:4,borderRadius:4,minWidth:200}}>
            <div style={{marginBottom:16}}>{title}</div>
            {data.map((item,index)=>(
              <Row style={{marginBottom:8}}><Col className={cls.sumItem}> <CircleDot fontSize={12} color={item.color} /></Col><Col>{item.name}&nbsp;:</Col><Col>{getDiffUnitLabel(tagsVal,item.data.value)}</Col></Row>
            ))}
            <div>{data.length===2&&<Row style={{marginBottom:8}}><Col className={cls.sumItem}> <CircleDot fontSize={12} color={'#945FB9'} /></Col><Col>{_t('差值')}&nbsp;:</Col><Col>{getDiffUnitLabel(tagsVal,(data[1].data.value-data[0].data.value))}</Col></Row>}</div>
          </div>
        )
      }
    },
    legend:{
      position:"bottom-left",
    }
  };
  return(
    <Column {...config} chartRef={ref} />
  )

});

