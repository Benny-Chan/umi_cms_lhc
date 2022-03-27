import React, { useState } from 'react';
import { useMount, useUnmount, useUpdateEffect } from 'ahooks';
import { Row, Col, message } from 'antd'
import cls from './css/UseProportionChart.less'
import { useLoading, useI18n, chartHoverUI } from "@/utils";
import { observer } from 'mobx-react';
import _ from 'underscore';
import overview from '@/stores/overview'
import session from '@/stores/session'
import { Column } from '@ant-design/charts';


export const UseProportionChart = observer(({type})=>{
  const _t = useI18n()
  const [data, setData] = useState([]);

  useMount(() => {
    getOverViewUseRate()
  })

  useUpdateEffect(() => {
    getOverViewUseRate()
  },[session.operatorIds, session.updateTime])

  const getOverViewUseRate = async() => {
    const res = await overview.getOverViewUseRate()
    let arr = res.records.map((item,i) => {
      item.value = Number((item.percent*100).toFixed(2))
      if(item.name.length > 7){
        item.myName = item.name.slice(0,7) + '...' + item.name.slice(-1)
      }else{
        item.myName = item.name
      }
      return item
    })
    setData(arr)
  }

  const config = {
    data: data,
    xField: 'myName',
    yField: 'value',
    padding: [20,0,20,20],
    color: 'l(270) 0:#1C8DD3 1:#38CEBF',
    tooltip: {
      // showTitle: false,
      // formatter: (v) => {
      //   return { name: v.name, value: v.value + '%' };
      // },
      // fields: ['name', 'value'],
      customContent: (name,v) => {
        if(_.isEmpty(v)) return ''
        return chartHoverUI({ width: 200, data: { name: v[0].data.name, value: v[0].data.value+'%' }})
      },
    },
    label: {
      position: 'top',
      offsetY: 8,
      style: {
        fill: '#fff',
      },
      formatter: (v) => {
        return v.value + '%'
      }
    },
  }

  return (
    <div className={cls.container}>
      <Row className={cls.title}>{ _t('使用率占比') }</Row>
      <div style={{height: 300,paddingLeft: 40, paddingRight: 80}}>
        { !_.isEmpty(data) ? <Column {...config} /> : <div className={cls.empty}>{ _t('暂无数据') }</div> }
      </div>
    </div>
  )
})

