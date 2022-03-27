import React, { useState } from 'react'
import { Row, Col, Table, Spin, ConfigProvider, Tooltip } from 'antd'
import { useMount, useUpdateEffect } from 'ahooks';
import cls from './css/HotSite.less'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useI18n, addSymbol, useLoading } from "@/utils";
import analysis from '@/stores/analysis'
import { observer } from 'mobx-react';
import ico_up from '@/assets/svg/ico_up.svg'
import ico_down from '@/assets/svg/ico_down.svg'
import session from '@/stores/session'
import { renderEmptyStation } from '@/components/CustomEmpty'


const columns = [
    {
        title: '排名',
        dataIndex: 'key',
        align: 'center',
        render: (v) => <div className={cls.number}>{v}</div>
    },
    {
        title: '站点名称',
        dataIndex: 'name',
        align: 'center',
        width: '40%',
        render: v => (<div className={cls.siteName}>{v}</div>),
    },
    {
        title: '充电量',
        dataIndex: 'chargePower',
        align: 'center',
        render: (v) => <div className={cls.power}>{addSymbol(v*100)}</div>
    },
    {
        title: '日涨幅',
        dataIndex: 'riseRate',
        align: 'center',
        width: 110,
        render: (v) => (
            <div className={cls.increase}>
                {(v*100).toFixed(2) + '%'}
                { v < 0 ? <img src={ico_down} style={{marginLeft:5}} /> : v > 0 ? <img src={ico_up} style={{marginLeft:5}} /> : null }
            </div>
        )
    },
]

export const HotSite = observer((props) => {
    const _t = useI18n()
    const [powerToal, setPowerToal] = useState(0)
    const [powerRate, setPowerRate] = useState(0)
    const [siteRankData, setSiteRankData] = useState([])

    useMount(() => {
        getAnalysisHotSiteStatistics()
    })

    useUpdateEffect(() => {
        getAnalysisHotSiteStatistics()
      },[session.operatorIds, session.updateTime])

    const getAnalysisHotSiteStatistics = async() => {
        const res = await analysis.getAnalysisHotSiteStatistics()
        if(res.code) return message.error(res.message)
        setPowerToal(addSymbol(res.record?.firstFivePower*100) || 0)
        setPowerRate(res.record?.firstFiveRate || 0)

        setSiteRankData(handleData(res.record?.data || []))
    }

    const handleData = (arr) => {
        return arr.map((item,i) => {
            item.key = i+1
            // item.name = '爱看书的技法卢卡斯技法卢卡斯的尽量克服圣诞节分厘卡圣诞节了开发商大家lk'
            return item
        })
    }
    
    return (
        <div className={cls.container}>
            <Spin spinning={ useLoading('analysis/HotSiteStatistics') }>
                <div className={cls.title}>{ _t('热门站点') }</div>
                <div className={cls.margin}>
                    <div className={cls.text}>{ _t('热门站点总充电量') }</div>
                    <Row align={'bottom'}>
                        <Col>
                            <div className={cls.BoldText}>{ powerToal }</div>
                        </Col>
                        <Col>
                            <div className={cls.percentText}>{ _t('占总充电量的{0}%',[(powerRate*100).toFixed(2)]) }</div>
                        </Col>
                    </Row>

                    <div style={{marginTop: 30}}></div>
                    
                    <div className={cls.scroll}>
                        <ConfigProvider renderEmpty={renderEmptyStation}>
                            <Table columns={columns} dataSource={siteRankData} pagination={false} />
                        </ConfigProvider>
                        {
                            siteRankData.length < 3 && siteRankData.length > 0 ? 
                            renderEmptyStation() : null
                        }
                    </div>
                </div>
            </Spin>
        </div>
    )
})