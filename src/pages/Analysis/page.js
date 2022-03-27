import React, { useState, useEffect } from 'react'
import { useMount, useUnmount, useUpdateEffect } from 'ahooks';
import { Row, Col } from 'antd'
import cls from './index.less'
import { TodayData } from './components/TodayData.js'
import { AnalysisTabs } from './components/AnalysisTabs.js'
import { HotSite } from './components/HotSite.js'
import { ChargeTimePercent } from './components/ChargeTimePercent.js'
import { useI18n } from "@/utils";
import moment from 'moment'
import ico_time from '@/assets/svg/ico_time02.svg'
import session from '@/stores/session'
let interval = null


const Page = (props) => {
    const _t = useI18n()
    const [time, setTime] = useState('')

    useMount(() => {
        clearInterval(interval)
        setTime(moment().format('H:mm'))
        interval = setInterval(() => {
            setTime(moment().format('H:mm'))
            session.setUpdateTime(new Date().getTime())
        }, 60000);
    })

    useUnmount(() => {
        clearInterval(interval)
    })

    useUpdateEffect(() => {
        setTime(moment().format('H:mm'))
    },[session.operatorIds])

    return (
        <div className={cls.container}>
            <div className={cls.updateTime}>
                { _t('数据更新时间') }
                <div className={cls.time}>
                    <img src={ico_time} style={{marginTop: 2, marginRight: 4}} />
                    <span style={{paddingTop:2}}>{ time }</span>
                </div>
            </div>

            <div>
                {/* 营收/订单量/充电量/充电枪状态组件 */}
                <Row justify={'space-between'} gutter={[30,30]}>
                    <Col xs={24} md={12} xxl={6}>
                        <TodayData content={'todayProfit'} />
                    </Col>
                    <Col xs={24} md={12} xxl={6}>
                        <TodayData content={'todayOrder'} />
                    </Col>
                    <Col xs={24} md={12} xxl={6}>
                        <TodayData content={'todayCharge'} />
                    </Col>
                    <Col xs={24} md={12} xxl={6}>
                        <TodayData content={'chargeGunStatus'} />
                    </Col>
                </Row>
            </div>

            <div style={{marginTop: 20}}>
                {/* 营收 用户情况 Tabs */}
                <AnalysisTabs />
            </div>

            <div style={{marginTop: 30}}>
                {/* 热门站点 充电时段占比 */}
                <Row gutter={[30,30]}>
                    <Col xs={24} xxl={12}>
                        <HotSite />
                    </Col>
                    <Col xs={24} xxl={12}>
                        <ChargeTimePercent />
                    </Col>
                </Row>
            </div>
        </div>
    )
}

Page.label = '分析台'
Page.module = 'dmcAnalysis'
Page.order = 1

export default Page;