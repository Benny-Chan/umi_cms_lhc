import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Select, DatePicker } from 'antd'
import cls from './css/SelectParams.less'
import StationSelect from '../../../components/StationSelect'
import { StatisticsDateSelect } from './StatisticsDateSelect.js'
import moment from 'moment';
import {observer} from "mobx-react/dist/index";
import {_t} from "../../../utils";
import {statisticsList} from "../../../utils/constant";
import dataState from '@/stores/operatorTrend';
import _ from "underscore";
const { Option } = Select;
const {RangePicker} = DatePicker




const statisticsAccurList = [
    [
        // { text: '时', value: '5' },
      { text: '峰谷平', value: '6' },
        { text: '峰谷平细分时段', value: '7' }

    ],
    [ { text: '日', value: '1' }],
    [
        { text: '日', value: '1' },
        { text: '周', value: '2' }
    ],
    [{ text: '月', value: '3' }],
  [{ text: '日', value: '1' }],
]

const ChartTypes = [
    {value: '1', label:'区域图'},
    {value: '2', label:'柱状图'}
]

export const SelectParams = observer(({form})=> {
    const {chartType,curSearchFormParam,onIntervalTypeChange} = dataState;
  const targetParam =  _.find(curSearchFormParam, (item)=>item.name[0]==="intervalType");
  const intervalType = targetParam?targetParam.value:"1"
    return (
        <div className={cls.container}>
            <Row>
                <Col xs={24} md={12} xl={6}>
                    <Form.Item
                        name="stationIds"
                        label={<span style={{fontWeight:'bold'}}>{_t('站点')}</span>}
                    >
                        <StationSelect
                          onChange={dataState.onStationChange}
                          showAll
                          mode="multiple"
                          allowClear
                          style={{ width: '100%'}}
                          placeholder= {_t('站点选择')}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12} xl={6}>
                    <Form.Item
                      rules={[{ required: true, message: _t('请选择图表类型') }]}
                      name="chartType"
                        label={<span style={{fontWeight:'bold'}}>{_t('图表类型')}</span>}
                    >
                        <Select
                            placeholder={_t('请选择')}
                            value = {chartType}
                            onChange={()=>{dataState.resetData()}}
                        >
                            {ChartTypes.map((item,index)=>(
                                <Option key={index} value={item.value}>{item.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

            </Row>
            <Row>
                 <Col xs={24} md={12} xl={6}>
                    <Form.Item
                      rules={[{ required: true, message: _t('请选择统计区间') }]}
                        name="intervalType"
                        label={<span style={{fontWeight:'bold'}}>{_t('统计区间')}</span>}
                    >
                        <Select
                          placeholder={_t('请选择')}
                          onChange={onIntervalTypeChange}
                        >
                            {
                                statisticsList.map((item,index) => (
                                    <Option key={item.value} value={item.value}>
                                        { item.text }
                                    </Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} xl={6}>
                  {
                    intervalType==="5"?
                    <Form.Item
                        name={'interval'}
                        wrapperCol={{xs:{span: 24}}}
                        rules={[{ required: true, message: _t('请设置统计时间') }]}
                    >
                        <RangePicker
                          disabledDate={dataState.disabledDate}
                          onCalendarChange={val => dataState.setDates(val)}
                          onOpenChange={dataState.onOpenChange}
                        />
                    </Form.Item>
                      :
                      <Form.Item
                        name={'interval2'}
                        wrapperCol={{xs:{span: 24}}}
                        rules={[{ required: true, message: _t('请设置统计时间') }]}
                      >
                        <DatePicker
                          picker={_.find(statisticsList,(item)=>item.value===intervalType).picker}
                        />
                      </Form.Item>
                  }
                </Col>
              <Col span={1} style={{marginLeft:28,marginTop:9}}>{_t('对比')}</Col>
                <Col xs={24} md={12} xl={5}  >
                  {
                    intervalType==="5"?
                      <Form.Item
                        name={'intervalPrev'}
                        wrapperCol={{xs:{span: 24}}}
                        rules={[{ required: true, message: _t('请设置统计对比时间') }]}
                      >
                        <RangePicker
                          disabledDate={dataState.disabledDate}
                          onCalendarChange={val => dataState.setDates(val)}
                          onOpenChange={dataState.onOpenChange}
                        />
                      </Form.Item>
                      :
                      <Form.Item
                        name={'intervalPrev2'}
                        wrapperCol={{xs:{span: 24}}}
                        rules={[{ required: true, message: _t('请设置统计对比时间') }]}
                      >
                        <DatePicker
                          picker={_.find(statisticsList,(item)=>item.value===intervalType).picker}
                        />
                      </Form.Item>
                  }
                </Col>
                <Col xs={24} md={12} xl={5} hidden={chartType === '2'} style={{marginLeft:8}}>

                  <Form.Item
                    rules={[{ required: true, message: _t('请选择统计精度') }]}
                    name="precisionType"
                    label={<span style={{fontWeight:'bold'}}>{_t('统计精度')}</span>}
                  >
                    <Select
                      placeholder={_t('请选择')}
                    >
                      {
                        statisticsAccurList[parseInt(intervalType,10)-1].map((item,index) => (
                          <Option key={'accur'+index} value={item.value}>
                            { item.text }
                          </Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>
            </Row>
        </div>
    )
})
