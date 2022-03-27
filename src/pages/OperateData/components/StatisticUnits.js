import React, { useState, useEffect } from 'react'
import { Row, Col, Select, Input, Button, message,TimePicker } from 'antd'
import cls from './css/StatisticUnits.less'
import { useI18n } from "@/utils";
import _ from 'lodash'
import { TagsContainer } from '@/components/TagsContainer'
import {_t} from "../../../utils";
import {observer} from "mobx-react/dist/index";
import dataState from '@/stores/operator';

// const statisticsList = [
//     { text: _t('自定义电量'), value: "1" },
//   // { text: _t('自定义小时区间'), value: "2" },
//     { text: _t('峰谷平'), value: "3" },
// ]

export const StatisticUnits = observer((props)=> {
    const _t = useI18n()
    const { chartsType,downloadImage,exportExcel } = props
    const {tagsData,minValue,maxValue,setTagsData,setMinValue,setMinTime,setMaxTime,setMaxValue,handleAddTag,handleCloseTag,precisionUnit,saveConfig,pieGroupTags,statisticsList} = dataState;
    const handleInputOnChange = (value, func) => {
        const reg = /^\d+$/;
        if(reg.test(value) || value==='') func(value)
    }

    return (
        <Row className={cls.container}>
            <Col xs={24} xl={14} xxl={14}>
                <Col hidden={chartsType === '1'}>
                    <Row style={{paddingLeft: 15}}>
                        <Col className={cls.lable}><span>{ _t('统计单位') }</span></Col>
                        <Col>
                            <Select
                                placeholder={ _t('请选择') }
                                className={cls.statisticsType}
                                value={precisionUnit}
                                onChange={(e)=>{
                                  dataState.onPrecisionUnitChange(e)
                                }}
                            >
                                {
                                    statisticsList.map((item,index) => (
                                        <Option key={'statistics'+index} value={item.value}>
                                            { item.text }
                                        </Option>
                                    ))
                                }
                            </Select>
                        </Col>
                        <Col xs={24} md={0} style={{marginBottom:20}} />
                        <Col>
                          {precisionUnit==="2"&&
                            <Row><TimePicker style={{width:150,height:40}} minuteStep={60} format={'HH:mm'} placeholder={ _t('最小值') } onChange={(time, timeString)=>{setMinTime(timeString)}} />  <div className={cls.disabledInput}>~</div><TimePicker style={{width:150,height:40}} minuteStep={60}  placeholder={ _t('最大值') } format={'HH:mm'} onChange={(time, timeString)=>{setMaxTime(timeString)}} /></Row>
                          }
                          {precisionUnit==="1"&&
                          <Row className={cls.rangeInput}>
                            <Input
                              className={cls.letfInput}
                              onChange={(e) => { handleInputOnChange(e.target.value, setMinValue) }}
                              placeholder={ _t('最小值') }
                              value={ minValue }
                              bordered={false}
                            />
                            <div className={cls.disabledInput}>~</div>
                            <Input
                              className={cls.rightInput}
                              onChange={(e) => { handleInputOnChange(e.target.value, setMaxValue) }}
                              placeholder={ _t('最大值') }
                              value={maxValue }
                              bordered={false}
                            />
                          </Row>
                          }
                        </Col>
                      {precisionUnit!=="3"&&
                      <Button type={'primary'} className={cls.btn} onClick={() => { handleAddTag() }}>
                        { _t('添加') }
                      </Button>
                      }

                    </Row>
                </Col>
            </Col>

            <Col xs={24} xl={0} style={{marginTop: 20}} />

            <Col xs={24} xl={10} xxl={10}>
                <Row justify={'end'}>
                    <Button type={'primary'} htmlType='submit' className={cls.btn}>{ _t('生成') }</Button>
                    <Button onClick={downloadImage} type={'primary'} className={cls.btn}>
                      { _t('导出图表') }
                      </Button>
                  <Button onClick={exportExcel} type={'primary'} className={cls.btn}>
                    { _t('导出列表') }
                  </Button>
                    <Button onClick={saveConfig} className={cls.btn}>{ _t('保存设置') }</Button>
                </Row>
            </Col>
          {precisionUnit!=="3"&&
          <Col style={{flex:1, marginTop: 25}} hidden={chartsType === '1'}>
            <TagsContainer pieGroupTags={pieGroupTags} precisionUnit={precisionUnit} tagsData={tagsData} handleCloseTag={handleCloseTag} />
          </Col>
          }
        </Row>
    )
})
