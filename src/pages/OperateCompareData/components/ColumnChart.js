import React, { useState, useEffect } from 'react';
import {Column} from '@ant-design/charts';
import _ from 'lodash'
import {observer} from 'mobx-react';
import {CircleDot} from '@/components/CircleDot';
import cls from './css/Chart.less'
import { Row, Col, Form, Button } from 'antd'
import operatorCompare from '@/stores/operatorCompare';
import {_t, getDiffUnitLabel} from "../../../utils";
import {chartUnitMap} from "../../../utils/constant";

/**
 *
 */
export const ColumnChart = React.forwardRef(({intervalType},ref)=> {
  const {compareData,groupTags} = operatorCompare;
  const tagsVal = parseInt(!_.isEmpty(groupTags)?groupTags[0]:"",10);
  const colorConfig =['#5B8FF9', '#FF9844', '#FFD050','#59D8A6','#6F5EF9', '#5C7092', '#6DC8EC','#945FB9','#FF7F62'];
  const config = {
    data: [...compareData],
    isGroup: true,
    xField: 'stationName',
    yField: 'value',
    seriesField: 'time',
    autoFit:true,
    height: 400,
    padding: 'auto',
    meta: {
      value: {
        formatter: (v) => (getDiffUnitLabel(tagsVal,v))
      },
      stationName: {
        // alias: _t('站点'),
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
    tooltip: {
      customContent: (title, data) => {
        console.log("data",title,data)
        return(
          <div style={{padding:4,borderRadius:4,minWidth:180}}>
            <div style={{marginBottom:16}}>{title}</div>
            {data.map((item,index)=>(
              <Row style={{marginBottom:8}}><Col className={cls.sumItem}> <CircleDot fontSize={12} color={colorConfig[index]} /></Col><Col>{item.name}&nbsp;:</Col><Col>{item.value}</Col></Row>
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
    <div className={cls.container}>
      <Row className={cls.charts}>
        <Col span={24} style={{padding:'16px 32px'}}>
          <Column {...config} chartRef={ref} />
        </Col>
      </Row>
    </div>
  )
})

