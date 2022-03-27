import React, { useState, useEffect } from 'react'
import { Row, Col } from 'antd'
import { useMount, useUnmount, useUpdateEffect } from 'ahooks';
import cls from './index.less'
import { TotalRevenueServiceElect } from './components/TotalRevenueServiceElect'
import { RevenueRank } from './components/RevenueRank'
import { ProvinceMap } from './components/ProvinceMap'
import { SummarySheet } from './components/SummarySheet'
import { RevenueProportionChart } from './components/RevenueProportionChart'
import { RegisterNumberChart } from './components/RegisterNumberChart'
import { ActiveNumberChart } from './components/ActiveNumberChart'
import { UseProportionChart } from './components/UseProportionChart'
import { _t } from "@/utils";
import moment from 'moment'
import overview from '@/stores/overview'
import session from '@/stores/session'
import ico_time from '@/assets/image/ico_time@1x.svg'
import { observer } from 'mobx-react';
let interval = null


const Page = observer((props) => {
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
                    <img src={ico_time} style={{marginTop: 2, marginRight: 4,width: 18}} />
                    <span style={{paddingTop:2}}>{ time }</span>
                </div>
            </div>

            <div className={cls.content}>
                <Row gutter={[30, 30]}>
                    {/* 总营收 服务费 电费 */}
                    <Col xs={24} xxl={7} >
                        <TotalRevenueServiceElect />
                    </Col>
                    {/* 地图 */}
                    <Col xs={24} xxl={10}>
                        <div style={{marginBottom: 10}}>
                            <SummarySheet/>
                        </div>
                        <div>
                            <ProvinceMap />
                        </div>
                    </Col>
                    {/* 营收排名 上升排名 下降排名 */}
                    <Col xs={24} xxl={7}>
                        <Row gutter={[25, 25]}>
                            <Col xs={24}>
                                <RevenueRank type="rank" />
                            </Col>
                            <Col xs={24}>
                                <RevenueRank type="rise" />
                            </Col>
                            <Col xs={24}>
                                <RevenueRank type="decline" />
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row gutter={[30, 30]} className={cls.charts}>
                    {/* 营收占比 */}
                    <Col xs={24} xxl={12}>
                        <RevenueProportionChart />
                    </Col>
                    {/* 使用率占比 */}
                    <Col xs={24} xxl={12}>
                        <UseProportionChart />
                    </Col>
                    {/* 日注册人数 */}
                    <Col xs={24} xxl={12}>
                        <RegisterNumberChart />
                    </Col>
                    {/* 日活跃人数 */}
                    <Col xs={24} xxl={12}>
                        <ActiveNumberChart />
                    </Col>
                </Row>
            </div>
        </div>
    )
})

Page.label = '概览图'
Page.module = 'dmcOverViews'
Page.order = 2
Page.theme = 'black'

export default Page;
