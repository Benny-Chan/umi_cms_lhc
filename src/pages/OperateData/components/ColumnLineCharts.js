import React, { useState, useEffect,useRef } from 'react'
import { Row, Col,Button } from 'antd'
import cls from './css/ColumnLineCharts.less'
import { CircleDot } from '@/components/CircleDot'
import _ from 'lodash'
import { useI18n } from "@/utils";
import { DualAxes,Column } from '@ant-design/charts';
import {observer} from "mobx-react/dist/index";
import dataState from '@/stores/operator';
import {_t, formatPrice,getDiffUnitLabel} from "../../../utils";


export const ColumnLineCharts = React.forwardRef(({columnData,columnChartFields,},ref)=> {
    const _t = useI18n()
    console.log("columnData",JSON.stringify(columnData))
  console.log("columnChartFields",JSON.stringify(columnChartFields))
    const config = {
        data: columnData,
        xField: 'date',
        yField: columnChartFields,
        height: 400,
        padding: 'auto',
        legend: true,
        meta: {
          value1: {
            alias: _t('电量'),
            formatter: (v) => `${v?v.toFixed(3):0} kW·h`
          },
          value2: {
            alias: _t('使用率'),
            formatter: (v) => {return `${v?(v*100).toFixed(2):0} %`}
          },
          value3: {
            alias: _t('订单量'),
            formatter: (v) => {return `${v?v:0}${_t('单')}`}
          },
          value4: {
            alias: _t('金额'),
            formatter: (v) => ` ¥ ${formatPrice(v)}`
          },
        },
        geometryOptions: [
          {
            geometry: 'column',
            seriesField: 'type',
            columnWidthRatio: 0.4,
            color: ['#0070FF', '#FF9844', '#FFD050', '#59D8A6', '#6F5EF9'],
            isGroup: true,
          },
          {
            geometry: 'line',
            color: ['#FF8999', '#F6BC13', '#289998'],
            seriesField: 'type',
            lineStyle: {
              lineWidth: 3,
            },
          },
        ],
      };


 if(columnChartFields.length===1){
   const colorConfig =['#0070FF', '#FF9844', '#FFD050', '#59D8A6', '#6F5EF9'];
   const config2 = {
     data: columnData[0],
     isGroup: true,
     xField: 'date',
     yField: columnChartFields[0],
     seriesField: 'type',
     autoFit:true,
     height: 400,
     padding: 'auto',
     meta: {
       value1: {
         alias: _t('电量'),
         formatter: (v) => `${v?v.toFixed(3):0} kW·h`
       },
       value2: {
         alias: _t('使用率'),
         formatter: (v) => {return `${v?(v*100).toFixed(2):0} %`}
       },
       value3: {
         alias: _t('订单量'),
         formatter: (v) => {return `${v?v:0}${_t('单')}`}
       },
       value4: {
         alias: _t('金额'),
         formatter: (v) => ` ¥ ${formatPrice(v)}`
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
     color: colorConfig,
   };
   return(
     <div className={cls.container}>
       <Row style={{position:'relative'}}>
         <Col style={{padding:'0 40px',flex:1}}>
           <Column {...config2} chartRef={ref} />
         </Col>
       </Row>
     </div>
   )
 }

  return (
        <div className={cls.container}>
            <Row style={{position:'relative'}}>
                <Col style={{padding:'0 40px',flex:1}}>
                    {/* 混合图表 */}
                    <DualAxes {...config} chartRef={ref} />
                </Col>
            </Row>
        </div>
    )
})
