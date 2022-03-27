import React, { useState, useEffect,useRef } from 'react'
import { Row, Col, Form, Button,Spin,Modal } from 'antd'
import {userMount} from 'ahooks'
import cls from './index.less'
import { SelectParams } from './components/SelectParams'
import { CheckBoxChartParams } from './components/CheckBoxChartParams'
import { ElectricProfitTable } from './components/ElectricProfitTable'
import {AreaChart} from './components/AreaChart'
import {ColumnChart} from './components/ColumnChart'
import { RadioChartParams } from '@/components/RadioChartParams'
import { ColumnLineAxes } from '../../components/ColumnLineAxes'
import { CircleDot } from '../../components/CircleDot'
import { CustomizeTags} from './components/CustomizeTags'
import { UpOutlined, DownOutlined } from '@ant-design/icons'
import {_t, exportTableExcel, formatPrice, useLoading} from "../../utils";
import {observer} from "mobx-react/dist/index";
import {RadioTags, TrendRadioTags, TrendRadioTags1, TrendRadioTags2} from "../../utils/constant";
import dataState from '@/stores/operatorTrend';
import {useMount} from "ahooks/lib/index";
import _ from "underscore";

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

const renderTitle = (name) => name

const getRateFormat = (text)=>{
  if(!text){
    return `${0}%`
  }
  return`${(text*100).toFixed(2)}%`
}

const getPowerFormat = (text)=>{
  if(!text){
    return 0
  }
  return`${text.toFixed(3)}`
}

const columns = [
  {
    title: renderTitle(_t('站场ID')),
    dataIndex: 'id',
    align: 'center',
    xlWidth: 20,
  },
  {
    title: renderTitle(_t('站场名称')),
    dataIndex: 'name',
    align: 'center',
    xlWidth: 20,
  },
  {
    title: renderTitle(_t('电量升降量')),
    dataIndex: 'chargePowerNum',
    align: 'center',
    xlWidth: 20,
    sorter: (a, b) => a.chargePowerNum - b.chargePowerNum,
    render: (text) => (getPowerFormat(text)),
    numberFormat: '0.000'
  },
  {
    title: renderTitle(_t('电量升降率')),
    dataIndex: 'chargePowerRate',
    align: 'center',
    xlWidth: 20,
    numberFormat: '0.00%',
    needPercent: true,
    sorter: (a, b) => a.chargePowerRate - b.chargePowerRate,
    render: (text) => (getRateFormat(text))
  },
  {
    title: renderTitle(_t('峰期电量升降量')),
    dataIndex: 'phasePower1Num',
    align: 'center',
    xlWidth: 20,
    numberFormat: '0.000',
    sorter: (a, b) => a.phasePower1Num - b.phasePower1Num,
    render: (text) => (getPowerFormat(text))
  },
  {
    title: renderTitle(_t('峰期电量升降率')),
    dataIndex: 'phasePower1Rate',
    align: 'center',
    xlWidth: 20,
    numberFormat: '0.00%',
    needPercent: true,
    sorter: (a, b) => a.phasePower1Rate - b.phasePower1Rate,
    render: (text) => (getRateFormat(text))
  },
  {
    title: renderTitle(_t('平期电量升降量')),
    dataIndex: 'phasePower2Num',
    align: 'center',
    xlWidth: 20,
    numberFormat: '0.000',
    sorter: (a, b) => a.phasePower2Num - b.phasePower2Num,
    render: (text) => (getPowerFormat(text))
  },
  {
    title: renderTitle(_t('平期电量升降率')),
    dataIndex: 'phasePower2Rate',
    align: 'center',
    xlWidth: 20,
    numberFormat: '0.00%',
    needPercent: true,
    sorter: (a, b) => a.phasePower2Rate - b.phasePower2Rate,
    render: (text) => (getRateFormat(text))
  },
  {
    title: renderTitle(('谷期电量升降量')),
    dataIndex: 'phasePower3Num',
    align: 'center',
    xlWidth: 20,
    numberFormat: '0.000',
    sorter: (a, b) => a.phasePower3Num - b.phasePower3Num,
    render: (text) => (getPowerFormat(text))
  },
  {
    title: renderTitle(_t('谷期电量升降率')),
    dataIndex: 'phasePower3Rate',
    align: 'center',
    xlWidth: 20,
    numberFormat: '0.00%',
    needPercent: true,
    sorter: (a, b) => a.phasePower3Rate - b.phasePower3Rate,
    render: (text) => (getRateFormat(text))
  },
  {
    title: renderTitle(_t('营收升降量')),
    dataIndex: 'amountNum',
    align: 'center',
    xlWidth: 20,
    formatPrice:true,
    sorter: (a, b) => a.amountNum - b.amountNum,
    render: (text) => (formatPrice(text))
  },
  {
    title: renderTitle(_t('营收升降率')),
    dataIndex: 'amountRate',
    align: 'center',
    xlWidth: 20,
    numberFormat: '0.00%',
    needPercent: true,
    sorter: (a, b) => a.amountRate - b.amountRate,
    render: (text) => (getRateFormat(text))
  },
  {
    title: renderTitle(_t('日单枪电量升降量')),
    dataIndex: 'onePowerNum',
    align: 'center',
    xlWidth: 20,
    numberFormat: '0.000',
    sorter: (a, b) => a.onePowerNum - b.onePowerNum,
    render: (text) => (getPowerFormat(text))
  },
  {
    title: renderTitle(_t('日单枪电量升降率')),
    dataIndex: 'onePowerRate',
    align: 'center',
    xlWidth: 20,
    numberFormat: '0.00%',
    needPercent: true,
    sorter: (a, b) => a.onePowerRate - b.onePowerRate,
    render: (text) => (getRateFormat(text))
  },
  {
    title: renderTitle(_t('服务费升降量')),
    dataIndex: 'servFeeNum',
    align: 'center',
    xlWidth: 20,
    formatPrice:true,
    sorter: (a, b) => a.servFeeNum - b.servFeeNum,
    render: (text) => (formatPrice(text))
  },
  {
    title: renderTitle(_t('服务费升降率')),
    dataIndex: 'servFeeRate',
    align: 'center',
    xlWidth: 20,
    numberFormat: '0.00%',
    needPercent: true,
    sorter: (a, b) => a.servFeeRate - b.servFeeRate,
    render: (text) => (getRateFormat(text))
  },
];



const Page = observer(({})=> {

  useMount(()=>{
    dataState.getConfig();
  });

    const [form] = Form.useForm();
    const {curSearchFormParam,chartVisible,chartData,groupTags,saveConfig} = dataState;
  const chartTypeParam =  _.find(curSearchFormParam, (item)=>item.name[0]==="chartType");
  const chartType = chartTypeParam?chartTypeParam.value:"2"
  const intervalType = form.getFieldValue("intervalType")||'2';
  const ref = useRef();

  const downloadImage = () => {
    ref.current?.downloadImage(`${_t('站点运营数据变化趋势')}.png`,["image/png",1]);
  }
  const onFinish = async(values) => {
    let isEmptyTags = true;
    const tempArr = groupTags.filter(tag=>!_.isEmpty(tag))
    if(!_.isEmpty(tempArr)){
      isEmptyTags = false;
    }
    if(isEmptyTags){
      Modal.error({
        content:_t('请先选择图表参数')
      })
      return false;
    }
    dataState.getListData();
    dataState.getChartData();
  };

  const exportExcel = ()=>{
    const {listData} = dataState;
    const {records} = listData;
    const title = _t('站点运营对比趋势列表');
    exportTableExcel(records,columns,{title, filename:title,isGroup:false})
  }
    return (
        <div className={cls.container}>
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

                {/* 站点 / 图表类型 / 统计区间 / 统计精度 下拉框 */}
                <SelectParams form={form} />
                <div>
                    <span className={cls.chartParam}>{_t( '图表参数')}</span>
                    <span className={cls.chartParamTip}>{_t( '环比数据只支持同一参数的两个时间段进行对比')}</span>
                    <a onClick={()=>{ dataState.handleChartVisible() }} className={cls.fold}>
                        { chartVisible ? _t( '收起图表'):_t( '展开图表') } &nbsp;
                        { chartVisible ?  <UpOutlined /> :<DownOutlined /> }
                    </a>
                </div>
                <RadioChartParams groupTags={dataState.groupTags} intervalType={intervalType} handleTagsChange={dataState.handleTagsChange} radioTags={intervalType==="1"?TrendRadioTags1:TrendRadioTags2} />

                <Row justify={'end'} style={{marginTop: 20}}>
                    <Button type={'primary'} htmlType='submit' className={cls.btn}>{_t('生成')}</Button>
                    <Button onClick={downloadImage} type={'primary'} className={cls.btn}>{_t('导出图表')}</Button>
                    <Button onClick={exportExcel} type={'primary'} className={cls.btn}>{_t('导出列表')}</Button>
                    <Button onClick={saveConfig} className={cls.btn}>{_t('保存设置')}</Button>
                </Row>
            </Form>
          <Spin spinning={useLoading('operatorTrend/getChartData')||false}>
            {
              dataState.chartVisible&&<div className={cls.charts} style={{padding:'32px'}}>
                {
                  chartType === '1' ?
                    <AreaChart ref={ref} chartData={chartData} tagsValue={!_.isEmpty(groupTags)?groupTags[0]:""} />
                    :<ColumnChart ref={ref} chartData={chartData} tagsValue={!_.isEmpty(groupTags)?groupTags[0]:""} />
                }
              </div>
            }
          </Spin>


             {/*表格 */}
             <div className={cls.tableTitle} style={{marginTop:16}}>{_t('电量单位 kW·h, 费用(营收)单位 ¥')} </div>
            <ElectricProfitTable />
        </div>
    )
})

Page.label = '站点运营数据变化趋势'
Page.module = 'dmcOperateTrendsData'
Page.order = 3

export default Page;
