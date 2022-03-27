import React, { useState } from 'react';
import { useMount, useUnmount, useUpdateEffect } from 'ahooks';
import { Row, Col, message } from 'antd'
import cls from './css/ActiveNumberChart.less'
import { useLoading, useI18n, chartHoverUI } from "@/utils";
import { observer } from 'mobx-react';
import _ from 'underscore';
import { Area } from '@ant-design/charts';
import overview from '@/stores/overview'
import session from '@/stores/session'


export const ActiveNumberChart = observer(({type})=>{
  const _t = useI18n()
  const [data, setData] = useState([])

  useMount(() => {
    getOverViewLivenessNumber()
  },[])

  useUpdateEffect(() => {
    getOverViewLivenessNumber()
  },[session.operatorIds, session.updateTime])

  const getOverViewLivenessNumber = async() => {
    let res = await overview.getOverViewLivenessNumber()
    if(res.code) return message.error(res.message)
    setData(res.records)
  }

  const config = {
    title: {
      visible: false,
    },
    data: data || [],
    smooth: true,
    tooltip: {
      // visible: true,
      // fields: ['num', 'date'],
      // formatter: (item) => {
      //     return { name: item.date, value: item.num}
      // },
      // domStyles: {
      //     'g2-tooltip-title': {display: 'none'}
      // },
      customContent: (name,v) => {
        if(_.isEmpty(v)) return ''
        return chartHoverUI({ data: { name: v[0].data.date, value: _t('{0}人',[v[0].data.num]) }})
      },
    },
    areaStyle: {
      fill: 'l(270) 0:#22073C 1:#95007F'
    },
    line: {
      style:{
        lineWidth: 1,
      },
    },
    color: '#C200FF',
    xField: 'date',
    yField: 'num',
  }

  return (
    <div className={cls.container}>
      <Row className={cls.title}>{ _t('日活跃人数') }</Row>
      <div style={{height: 300,paddingLeft: 40, paddingRight: 80}}>
        { !_.isEmpty(data) ? <Area {...config} /> : <div className={cls.empty}>{ _t('暂无数据') }</div> }
      </div>
    </div>
  )
})
