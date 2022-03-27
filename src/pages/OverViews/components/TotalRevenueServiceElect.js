import React, { useState } from 'react';
import { useMount, useUnmount, useUpdateEffect } from 'ahooks';
import { Row, Col, message } from 'antd'
import cls from './css/TotalRevenueServiceElect.less'
import { addSymbol, useI18n } from "@/utils";
import overview from '@/stores/overview';
import { observer } from 'mobx-react';
import { GradientsBorder } from '@/components/GradientsBorder'
import df from '@/assets/svg/ico_df.svg'
import fwf from '@/assets/svg/ico_fwf.svg'
import zys from '@/assets/svg/ico_zys.svg'
import { CountUp } from 'countup.js';
import _ from 'underscore';
import session from '@/stores/session'

const card = {
  1: {
    name: '总营收',
    color: '#FFA20D',
    icon: zys,
    id: 'revenue',
    css: cls.revenue
  },
  2: {
    name: '服务费',
    color: '#0070FF',
    icon: fwf,
    id: 'service',
    css: cls.service
  },
  3: {
    name: '电费',
    color: '#00E4E1',
    icon: df,
    id: 'electric',
    css: cls.electric
  },
}

export const TotalRevenueServiceElect = observer(()=>{
  const _t = useI18n()
  const [data, setData] = useState({revenueAll: {}, service: {}, electric: {}})
  const [todayData, setTodayData] = useState({})

  useMount(() => {
    getRevenue()
    getTodayData()
  },[])

  useUpdateEffect(() => {
    getRevenue()
    getTodayData()
  },[session.operatorIds, session.updateTime])

  const getRevenue = async () =>{
    let res = await overview.getOverViewRevenue()
    if(res.code) return message.error(_t(res.message))
    let { record } = res
    if(!record) return
    setData({
      revenueAll: { yesterday: record.ystAmount, month: record.monthAmount, total: record.totalAmount},
      service: { yesterday: record.ystServFee, month: record.monthServFee, total: record.totalServFee},
      electric: { yesterday: record.ystEleFee, month: record.monthEleFee, total: record.totalEleFee},
    })
  }

  const getTodayData = async() => {
    let res = await overview.getOverViewTodayData()
    if(res.code) return message.error(_t(res.message))
    setTodayData(res.record)
  }

  const handleCountUp = (amount, id) => {
    const options = {
        decimalPlaces: 2,
        duration: 3,
      }
      let demo = new CountUp(id, amount/100 || 0, options);
      if (!demo.error) {
        demo.start();
      } else {
        console.error(demo.error);
      }
  }

  const rightContent = (text, amount) => {
    return (
      <div>
        <div className={cls.RightText}>{ text }</div>
        <div>
          <span>{ addSymbol(amount, '¥') || 0 }</span>
        </div>
      </div>
    )
  }
  
  const cardItem = (card, data, amount) => {
    if(_.isNumber(amount)){
      handleCountUp(amount, card.id)
    }
    return (
      <GradientsBorder>
        <div className={cls.cardItem}>
            <Row align={'middle'} style={{flexGrow:1}}>
                <Col span={12} className={cls.left}>
                  <Row align={'middle'} className={cls.title}>
                    <img src={card.icon} className={cls.icon} />
                    { _t(card.name) }
                  </Row>
                  <Row align="bottom" className={card.css}>
                    <div className={cls.symbol}>¥</div>
                    <div className={cls.todayAmount}>
                      <div id={card.id} style={{marginTop:10}}>0</div>
                    </div>
                  </Row>
                  <div className={cls.todayText}>{ _t('今日') }</div>
                </Col>
                <Row style={{flex: 1,height:'100%'}}>
                  <Col className={cls.right} offset={4}>
                    { rightContent(_t('昨日'), data.yesterday) }
                    { rightContent(_t('本月'), data.month) }
                    { rightContent(_t('累计'), data.total) }
                  </Col>
                </Row>
            </Row>
        </div>
      </GradientsBorder>

    )
  }

  return (
    <div className={cls.container}>
      { cardItem(card['1'], data.revenueAll, todayData?.todayAmount||0) }

      <div className={cls.cardMt}></div>
      { cardItem(card['2'], data.service, todayData?.todayServFee||0) }

      <div className={cls.cardMt}></div>
      { cardItem(card['3'], data.electric, todayData?.todayEleFee||0) }
    </div>
  )
})