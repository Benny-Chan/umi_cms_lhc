import React, { useState, useEffect } from 'react'
import { Row, Col, DatePicker, message, Spin, Empty, Dropdown, Menu } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import cls from './css/AnalysisTabs.less'
import { SiteProfitRankingList } from './SiteProfitRankingList'
import { RevenueTrendsChart } from './RevenueTrendsChart'
import { RegisterNumberChart } from './RegisterNumberChart'
import { UserLivenessChart } from './UserLivenessChart'
import analysis from '@/stores/analysis'
import _ from 'lodash'
import moment from 'moment'
import { useI18n, useLoading } from "@/utils";
import { observer } from 'mobx-react';
import session from '@/stores/session'
import { renderEmptyStation } from '@/components/CustomEmpty'

const { RangePicker } = DatePicker;

const tabsTextLeft = [
    { text: '营收', active: 0 },
    { text: '用户情况', active: 1 },
]
const tagsTextRight = [
    // { text: '今日', dateType: 'day', queryType: 1 },
    { text: '本周', dateType: 'week', queryType: 2 },
    { text: '本月', dateType: 'month', queryType: 3 },
    { text: '全年', dateType: 'year', queryType: 4 },
]

// isShow 用includes(queryType)判断 
const livenessList = [
    { text: '日活跃度', type: 1, isShow: '2,3' },
    { text: '周活跃度', type: 2, isShow: '3' },
    { text: '月活跃度', type: 3, isShow: '4' },
]

export const AnalysisTabs = observer(({type})=>{
    const _t = useI18n()
    const [showTabs, setShowTabs] = useState(0)
    const [selectTags, setSelectTags] = useState(2)
    const [date, setDate] = useState(['', ''])
    const [trends, setTrends] = useState([])
    const [sitesRank, setSitesRank] = useState([])
    const [registerNum, setRegisterNum] = useState([])
    const [userLiveness, setUserLiveness] = useState([])
    const [livenessType, setLivenessType] = useState(1)

    useEffect(()=>{
        // 清空自定义日期时  不执行
        if(_.isEmpty(date.filter(t => Boolean(t))) && selectTags == -1) return
        
        if(showTabs == 0){
            getAnalysisRevenueTrends()
            getAnalysisSiteRevenue()
        }else if(showTabs == 1){
            getAnalysisRegisterNumber()
            getAnalysisUserLiveness()
        }
    }, [ selectTags, date, showTabs, session.operatorIds, livenessType, session.updateTime ])

    const handleParams = (str) => {
        let isCustomDate = selectTags == -1
        let queryType = 1

        if(isCustomDate) queryType = 5                              // 如果自定义日期 queryType == 5
        else queryType = selectTags

        let params = { queryType }
        if(str == 'liveness') params.precisionType = isCustomDate ? 1 : livenessType             // getAnalysisUserLiveness() 增加type参数

        if(isCustomDate){
            params.startTime = date[0].format('YYYY-MM-DD')
            params.endTime = date[1].format('YYYY-MM-DD')
        }
        return params
    }

    const getAnalysisRevenueTrends = async() => {
        let params = handleParams()
        console.log('营收趋势参数: ',params)
        const res = await analysis.getAnalysisRevenueTrends(params)
        if(res.code) return message.error(res.message)
        setTrends(handleData(res.records))
    }

    const getAnalysisSiteRevenue = async() => {
        let params = handleParams()
        console.log('站点营收排名参数: ',params)
        const res = await analysis.getAnalysisSiteRevenue(params)
        if(res.code) return message.error(res.message)
        setSitesRank(res.records)
    }

    const getAnalysisRegisterNumber = async() => {
        let params = handleParams()
        console.log('注册人数参数: ',params)
        const res = await analysis.getAnalysisRegisterNumber(params)
        if(res.code) return message.error(res.message)
        setRegisterNum(res.records)
    }

    const getAnalysisUserLiveness = async() => {
        let params = handleParams('liveness')
        console.log('用户活跃度参数: ',params)
        const res = await analysis.getAnalysisUserLiveness(params)
        if(res.code) return message.error(res.message)
        let arr = res.records.map(item => {
            item.myRate = parseFloat((item.rate*100).toFixed(2))
            return item
        })
        setUserLiveness(arr)
    }

    const handleData = (arr) => {
        return arr.map(item => {
            item.amount = item.amount/100
            return item
        })
    }

    const handelClickTabs = (item) => {
        setShowTabs(item.active)
    }

    const handleDateTagsChange = (queryType) => {
        setSelectTags(queryType)
        setDate(['', ''])

        // 除了全年 默认更新参数为 1
        setLivenessType(queryType == 4 ? 3 : 1)
    }

    const handleTimeConfirm = (times) => {
        if(_.isEmpty(times)){
            setDate(['',''])
            // setSelectTags(1)
            return
        }
        console.log(times[0].format('YYYY-MM-DD'),times[1].format('YYYY-MM-DD'))
        // 自定义日期大于30 返回
        console.log('日期范围: '+ moment(times[1].format('YYYY-MM-DD')).diff(times[0].format('YYYY-MM-DD'),'days'))
        if(moment(times[1].format('YYYY-MM-DD')).diff(times[0].format('YYYY-MM-DD'),'days') > 30){
            return message.error(_t('请选择30天内的范围'))
        }

        setDate(times)
        setSelectTags(-1)
    }

    const handleClikcMenuItem = (t) => {
        setLivenessType(t.type)
    }

    const menu = () => {
        let arr = livenessList.filter(t => t.type != livenessType && t.isShow.includes(selectTags))
        if(_.isEmpty(arr)) return <div></div>
        return (
            <Menu>
                {
                    arr.map((item,i) => (
                        <Menu.Item className={i > 0 ? cls.livenessItem: cls.livenessItem2} key={'Menu'+i} onClick={() => { handleClikcMenuItem(item) }}>
                            <div className={cls.liveness}>{ _t(item.text) }</div>
                        </Menu.Item>
                    ))
                }
            </Menu>
        )
    }
    
    return (
        <div className={cls.container}>
            {/* tabs 今日/本周/本月/全年/自定义日期 */}
            <Row justify={'space-between'} style={{marginBottom: 20, paddingLeft: 10, flex: 1}}>
                <Row align="middle" style={{marginTop:10}}>
                    { 
                        tabsTextLeft.map(item => 
                            <div 
                                key={item.active}
                                className={`${cls.tabs} ${showTabs == item.active ? cls.activeTabs : ''}`} 
                                onClick={() => { handelClickTabs(item) }}
                            >
                                { _t(item.text) }
                            </div>   
                        )
                    }
                </Row>
                <Row align="middle">
                    <Row style={{marginTop:10}}>
                        {
                            tagsTextRight.map(item => (
                                <div 
                                    key={item.queryType}
                                    className={`${cls.tabs} ${selectTags == item.queryType ? cls.activeTabs : ''}`} 
                                    onClick={() => { handleDateTagsChange(item.queryType) }}
                                >
                                    { _t(item.text) }
                                </div>   
                            ))
                        }
                    </Row>
                    <RangePicker 
                        separator={'~'} 
                        // showTime={{format: 'YYYY-MM-DD'}} 
                        format='YYYY-MM-DD' 
                        value={date}
                        className={cls.rangePicker} onChange={(e)=>{ handleTimeConfirm(e) }} 
                    />
                </Row>
            </Row>

            {/* 图表 排名列表 */}
            <Row>
                {/* 营收 */}
                <Row hidden={!(showTabs == 0)} className={cls.tabsContent}>
                    <Col xs={24} xl={15}>
                        {/* <div className={cls.tabBottomTitle}>{ _t('营收额趋势') }</div> */}
                        <div className={cls.tabBottomTitle}> </div>
                        <Spin spinning={ useLoading('analysis/revenueTrends') }>
                            <Row wrap={false}>
                                <Col flex={1} className={cls.unit}>{ _t('(元)') }</Col>
                                <Col flex={1} style={{height:360}}>
                                    { !_.isEmpty(trends) ? <RevenueTrendsChart data={trends} /> : <Empty /> }
                                </Col>
                            </Row>
                        </Spin>
                    </Col>
                    <Col xs={0} xl={2} style={{display: 'flex', justifyContent: 'center'}}>
                        <div className={cls.line}></div>
                    </Col>
                    <Col xs={24} xl={7} style={{position:'relative'}}>
                        <Col xs={1} xl={0} style={{marginBottom:30}}></Col> {/* 占位的 */}
                        <div className={cls.tabBottomTitle} style={{marginBottom: 20}}>{ _t('站点营收额排名') }</div>
                        <Spin spinning={ useLoading('analysis/siteRevenue') }>
                            { !_.isEmpty(sitesRank) ? <SiteProfitRankingList data={sitesRank} /> : null }
                            { sitesRank.length < 4 ? renderEmptyStation() : null }
                        </Spin>
                    </Col>
                </Row>
                
                {/* 用户情况 */}
                <Row hidden={!(showTabs == 1)} className={cls.tabsContent}>
                    <Col xs={24} xl={12}>
                        <div className={cls.tabBottomTitle}>{ _t('新注册人数') }</div>
                        <Spin spinning={ useLoading('analysis/registerNumber') }>
                            {
                                !_.isEmpty(registerNum) ?
                                <Row>
                                    <Col flex={1} className={cls.unit}>{ _t('(人)') }</Col>
                                    <Col flex={1} style={{height:330}}>
                                        <RegisterNumberChart data={registerNum} />
                                    </Col>
                                </Row>
                                : <Empty />
                            }
                        </Spin>
                    </Col>
                    <Col xs={0} xl={1} style={{display: 'flex', justifyContent: 'center'}}>
                        <div className={cls.line}></div>
                    </Col>
                    <Col xs={24} xl={11}>
                        <Col xs={1} xl={0} style={{marginBottom:30}}></Col> {/* 占位的 */}
                        <Row>
                            <Dropdown overlay={menu} trigger={['click']} overlayClassName={cls.dropdown}>
                                <div className={`${cls.tabBottomTitle} ${cls.pointer}`}>
                                    <span style={{marginRight: 5}}>{ _t('用户{0}',[livenessList.find(t => t.type == livenessType).text]) }</span>
                                    { selectTags == 2 || selectTags == 4 || selectTags == -1 ? null : <CaretDownOutlined/> } 
                                </div>
                            </Dropdown>
                        </Row>
                        <Spin spinning={ useLoading('analysis/userLiveness') }>
                            {
                                !_.isEmpty(userLiveness) ?
                                <Row>
                                    <Col flex={1} className={cls.unit}>{ _t('(%)') }</Col>
                                    <Col flex={1} style={{height:330}}>
                                        <UserLivenessChart data={userLiveness} /> 
                                    </Col>
                                </Row>
                                : <Empty />
                            }
                        </Spin>
                    </Col>
                </Row>
            </Row>
        </div>
    )
})

