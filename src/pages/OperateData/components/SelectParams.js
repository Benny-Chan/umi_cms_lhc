import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Select, DatePicker } from 'antd'
import cls from './css/SelectParams.less'
import StationSelect from '../../../components/StationSelect'
import { StatisticsDateSelect } from './StatisticsDateSelect.js'
import {observer} from "mobx-react/dist/index";
import {_t} from "../../../utils";
import dataState from '@/stores/operator';
import {statisticsList} from "../../../utils/constant";

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

export const SelectParams = observer(({form,chartType,intervalType})=> {

  // console.log("intervalType",intervalType)
  // const chartType = form.getFieldValue("chartType")||'1';
    const {disabledDate,onOpenChange} = dataState;
    return (
        <div className={cls.container}>
            <Row style={{paddingLeft: 15}}>
                <Col xs={24} md={12} xl={6}>
                  <Form.Item
                    name="stationIds"
                    label={<span style={{fontWeight:'bold'}}>{_t('站点')}</span>}
                  >
                    <StationSelect
                      onChange={dataState.onStationChange}
                      showAll
                      // mode="multiple"
                      allowClear
                      style={{ width: '100%',height:'100%' }}
                      placeholder= {_t('站点选择')}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12} xl={6}>
                    <Form.Item
                      rules={[{ required: true, message: _t('请选择图表类型') }]}
                        name="chartType"
                        label={<span className={cls.label}>{_t('图表类型')}</span>}
                    >
                        <Select
                            placeholder={_t('请选择')}
                        >
                            <Option value="1">{_t('柱状图')}</Option>
                            <Option value="2">{_t('饼图')}</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={12} xl={6}>
                  <Form.Item
                    rules={[{ required: true, message: _t('请选择统计区间') }]}
                    name="intervalType"
                    label={<span style={{fontWeight:'bold'}}>{_t('统计区间')}</span>}
                  >
                    <Select
                      placeholder={_t('请选择')}
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
                    rules={[{ required: true, message: _t('请选择统计日期') }]}
                    name="interval"
                    wrapperCol={{xs:{span: 24}}}
                  >
                        <RangePicker
                          disabledDate={disabledDate}
                          onCalendarChange={val => dataState.setDates(val)}
                          onOpenChange={onOpenChange}
                        />
                  </Form.Item> :
                      <Form.Item
                        rules={[{ required: true, message: _t('请选择统计日期') }]}
                        name="interval2"
                        wrapperCol={{xs:{span: 24}}}
                      >
                        <DatePicker
                          picker={_.find(statisticsList,(item)=>item.value===intervalType).picker}
                        />
                      </Form.Item>
                  }
                </Col>
              {
                chartType === '1'&&
                <Col xs={24} md={12} xl={6}>
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
              }

            </Row>
        </div>
    )
})
