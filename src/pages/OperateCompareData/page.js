import React, { useState, useEffect,useRef } from 'react'
import { Row, Col, Form, Button,Select,DatePicker,Spin,Tag,Modal } from 'antd'
import { createFromIconfontCN } from '@ant-design/icons'
import cls from './index.less'
import moment from 'moment';
import { useMount, useUnmount } from 'ahooks';
import dataState from '@/stores/operatorCompare';
import {ColumnChart} from './components/ColumnChart'
import { RadioChartParams } from '@/components/RadioChartParams'
import { UpOutlined, DownOutlined,CloseCircleOutlined  } from '@ant-design/icons'
import {observer} from "mobx-react/dist/index";
import StationSelect from "../../components/StationSelect";
import {_t, useLoading} from "../../utils";
import {RadioTags, statisticsList} from "../../utils/constant";
import _ from "underscore";
const {Option} = Select
const  {RangePicker} = DatePicker

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      md: { span: 7 },
      lg: { span: 7 },
      xl: { span: 7 },
      xxl: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
      md: { span: 16 },
      xl: { span: 16 }
    },
};

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2123090_d92m7hcc7ft.js',
});


const SearchForm = observer(({downloadImage})=> {
  const {saveConfig,groupTags,dateBoxValue,onStationChange,stationBox,boxDisabled} = dataState;
  const [form] = Form.useForm();
  const intervalType = form.getFieldValue("intervalType")||'1';
  const onFinish = async(values) => {
    if(_.isEmpty(dateBoxValue)){
      Modal.error({
        content:_t('请先选择对比时间')
      })
      return false;
    }
    if(_.isEmpty(groupTags)){
      Modal.error({
        content:_t('请先选择图表参数')
      })
      return false;
    }
    dataState.getCompareStationOperationData();
  };
  return (
    <Form
      form={form}
      {...formItemLayout}
      onValuesChange={dataState.onSearchFormValuesChanged}
      // initialValues={dataState.curSearchFormParam}
      fields={dataState.curSearchFormParam}
      name="search-form"
      onFinish={onFinish}
      labelAlign={'left'}
      colon={false}
    >
      <div className={cls.searchFormContainer}>
        <Row>
          <Col xs={6} md={4} xl={2}  style={{fontWeight:'bold'}}>
            {_t('站点')}
          </Col>
          <Col xs={16} md={18} xl={16}>
            <Form.Item
              name='stationIds'
            >
              <StationSelect
                disabled={boxDisabled}
                onChange={onStationChange}
                labelInValue
                allowClear
                style={{ width: '100%'}}
                placeholder= {_t('站点选择')}
              />
            </Form.Item>
          </Col>

        </Row>
        {
          !_.isEmpty(dataState.stationBox)&&
        <Row style={{marginBottom:20}}>
          <Col xs={24} md={24} xl={24}>
              <div className={cls.itemContainer}>
                {
                  dataState.stationBox.map((item, index) =>
                    <span key={'tagCont'+index} className={cls.item}>
                        <Tag className={cls.tags}> {item}</Tag>
                        <IconFont
                          type={'icon-jiaochacross78'}
                          className={cls.close}
                          onClick={()=>{ dataState.deleteStationBoxItem(index) }}
                        />
                    </span>
                  )
                }
              </div>
          </Col>
        </Row>
        }
        <Row>
          <Col>
            <Form.Item
              name='intervalType'
              rules={[{ required: true, message: _t('请选择对比时间类型') }]}
              label={<span style={{fontWeight:'bold'}}>{_t('对比时间')}</span>}
            >
              <Select
                placeholder={_t('请选择')}
                onChange={dataState.onIntervalTypeChange}
                style={{width:272,marginLeft:20}}
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
          <Col>
            <Form.Item
              wrapperCol={{xs:{span: 24}}}
            >
              {
                intervalType==='5'?
                  <RangePicker
                    disabled={boxDisabled}
                    style={{marginLeft:20}}
                    onChange={(e)=>{  dataState.onDateBoxChange(e,intervalType);}}
                  />
                  :<DatePicker
                    disabled={boxDisabled}
                    style={{marginLeft:20}}
                    picker={_.find(statisticsList,(item)=>item.value===intervalType).picker}
                    // picker={"date"}
                    defaultValue={moment()}
                    value={''}
                    onChange={(e)=>{
                      dataState.onDateBoxChange(e,intervalType)
                    }}
                  />
              }
            </Form.Item>

          </Col>
        </Row>
        <Row>
          <Col xs={24} md={24} xl={24}>
            {
              !_.isEmpty(dataState.dateBox)&&
              <div className={cls.itemContainer}>
                {
                  dataState.dateBox.map((item, index) =>
                    <span key={'tagCont'+index} className={cls.item}>
                        <Tag className={cls.tags}> {item}</Tag>
                        <IconFont
                          type={'icon-jiaochacross78'}
                          className={cls.close}
                          onClick={()=>{ dataState.deleteDateBoxItem(index) }}
                        />
                    </span>
                  )
                }
              </div>
            }
          </Col>

        </Row>
      </div>
      <div style={{marginTop:16}}>
        <span className={cls.chartParam}>{_t('图表参数')}</span>
        <span className={cls.chartParamTip}>{_t('仅支持统计一个参数。')}</span>
      </div>
      <RadioChartParams groupTags={dataState.groupTags}  handleTagsChange={dataState.handleTagsChange} radioTags={RadioTags} />
      <Row justify={'end'} style={{marginTop: 20}}>
        <Button className={cls.btn} type={'primary'} htmlType='submit'>{_t('生成')}</Button>
        <Button onClick={downloadImage} type={'primary'} className={cls.btn}>{_t('导出图表')}</Button>
        <Button onClick={saveConfig} className={cls.btn}>{_t('保存设置')}</Button>
      </Row>
    </Form>
  )
})


const Page = observer(({})=> {
  useMount(()=>{
    dataState.getConfig();
  });
  const ref = useRef();
  const downloadImage = () => {
    ref.current?.downloadImage(`${_t('站点间运营数据对比')}.png`,["image/png",1]);
  }
    return (
        <div className={cls.container}>
            <SearchForm downloadImage={downloadImage} />
            <Spin spinning={useLoading('operatorCompare/getCompareStationOperationData')||false}>
              <ColumnChart ref={ref} />
            </Spin>
        </div>
    )
})

Page.label = '站点间运营数据对比'
Page.module = 'dmcOperateCompareData'
Page.order = 4

export default Page;
