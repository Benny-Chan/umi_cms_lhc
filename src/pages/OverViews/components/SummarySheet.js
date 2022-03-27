import React, { useState } from 'react';
import { useMount, useUnmount, useUpdateEffect } from 'ahooks';
import { Row, Col, message, Spin, Select } from 'antd'
import cls from './css/SummarySheet.less'
import { useLoading, useI18n } from "@/utils";
import overview from '@/stores/overview';
import { observer } from 'mobx-react';
import { GradientsBorder } from '@/components/GradientsBorder'
import _ from 'underscore';
import { CountUp } from 'countup.js';
import session from '@/stores/session'

let backup = initBackup()

function initBackup(){
  return { emission:0, gunNum:0, station:0, power:0 }
}

export const SummarySheet = observer(()=>{
  const _t = useI18n()
  const [data, setData] = useState({})

  useMount(() => {
    getTotalStatistics()
  })

  useUnmount(() => {
    backup = initBackup()
  })

  useUpdateEffect(() => {
    getTotalStatistics()
  },[session.operatorIds, session.updateTime])

  const getTotalStatistics = async() => {
    const rt = await overview.totalStatistics()
    console.log(rt,'总充电量/站点数量/充电数量/减少碳排放')
    setData(rt.record)
  }

  const handleCountUp = (number, id, decimal) => {
    const options = {
        decimalPlaces: decimal || 0,
        duration: 3,
        startVal: backup[id]
    }

    let demo = new CountUp(id, number, options);
    if (!demo.error) {
      demo.start();
    }else{
      console.error(demo.error);
    }

    // 备份数据 用于开始变化的数值 startVal 
    backup[id] = number
  }

  const renderCountUp = (number, id, decimal) => {
    if(number != undefined && _.isNumber(parseFloat(number))){
      handleCountUp(number, id, decimal)
    }
    return (<div id={id}>0</div>)
  }

  return (
    <div className={cls.container}>
      {/* <Spin spinning={ useLoading(`overview/${type}`) }> */}
      <GradientsBorder>
        <Row justify="space-around" className={cls.content}>
            <Row style={{flexDirection: 'column'}}>
                <Row justify="center" className={cls.number1}>{ renderCountUp(data.totalPower, 'power', 2) }</Row>
                <Row justify="center">{ _t('总充电量KW·H') }</Row>
            </Row>
            <Row style={{flexDirection: 'column'}}>
                <Row justify="center" className={cls.number2}>{ renderCountUp(data.stationNum, 'station') }</Row>
                <Row justify="center">{ _t('站点数量') }</Row>
            </Row>
            <Row style={{flexDirection: 'column'}}>
                <Row justify="center" className={cls.number2}>{ renderCountUp(data.gunNum, 'gunNum') }</Row>
                <Row justify="center">{ _t('充电枪数量') }</Row>
            </Row>
            <Row style={{flexDirection: 'column'}}>
                <Row justify="center" className={cls.number1}>{ renderCountUp(data.carbonEmission, 'emission', 2) }</Row>
                <Row justify="center">{ _t('减少碳排放 吨') }</Row>
            </Row>
        </Row>
      </GradientsBorder>
      {/* </Spin> */}
    </div>
  )
})