import React, { useState, useEffect,useRef } from 'react'
import { Row, Col, Form, Button,Spin,notification,Modal } from 'antd'
import cls from './index.less'
import { SelectParams } from './components/SelectParams'
import { CheckBoxChartParams } from './components/CheckBoxChartParams'
import { StatisticUnits } from './components/StatisticUnits'
import { RadioChartParams } from '../../components/RadioChartParams'
import { ElectricProfitTable } from './components/ElectricProfitTable'
import { ColumnLineCharts } from './components/ColumnLineCharts'
import { SpiderPieChart } from '../../components/SpiderPieChart'
import { UpOutlined, DownOutlined } from '@ant-design/icons'
import { useI18n } from "@/utils";
import {observer} from "mobx-react/dist/index";
import dataState from '@/stores/operator';
import {SiteRadioTags} from "../../utils/constant";
import {_t, exportTableExcel, formatPrice, useLoading} from "../../utils";
import {useMount, useUnmount} from "ahooks/lib/index";
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

const radioTags = [
    { text: '电量', value: '1'},
    { text: '峰电量', value: '2'},
    { text: '平电量', value: '3'},
    { text: '谷电量', value: '4'},
    { text: '日单枪电量', value: '5'},
    { text: '订单量', value: '1'},
    { text: '营收', value: '2'},
    { text: '服务费', value: '1'},
    { text: '使用率', value: '2'},
    { text: '日单枪服务费', value: '3'},
]

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
    title: renderTitle(_t('总电量')),
    dataIndex: 'chargePower',
    align: 'center',
    xlWidth: 20,
    numberFormat: '0.000',
    sorter: (a, b) => a.chargePower - b.chargePower,
    render: (text) => (getPowerFormat(text))
  },
  {
    title: renderTitle(_t('峰期电量')),
    dataIndex: 'phasePower1',
    align: 'center',
    xlWidth: 20,
    numberFormat: '0.000',
    sorter: (a, b) => a.phasePower1 - b.phasePower1,
    render: (text) => (getPowerFormat(text))
  },
  {
    title: renderTitle(_t('平期电量')),
    dataIndex: 'phasePower2',
    align: 'center',
    xlWidth: 20,
    numberFormat: '0.000',
    sorter: (a, b) => a.phasePower2 - b.phasePower2,
    render: (text) => (getPowerFormat(text))
  },
  {
    title: renderTitle(_t('谷期电量')),
    dataIndex: 'phasePower3',
    align: 'center',
    xlWidth: 20,
    numberFormat: '0.000',
    sorter: (a, b) => a.phasePower3 - b.phasePower3,
    render: (text) => (getPowerFormat(text))
  },
  {
    title: renderTitle(_t('日均使用率')),
    dataIndex: 'oneRate',
    align: 'center',
    xlWidth: 20,
    numberFormat: '0.00%',
    sorter: (a, b) => a.oneRate - b.oneRate,
    render: (text) => (getRateFormat(text))
  },
  {
    title: renderTitle(_t('营收')),
    dataIndex: 'amount',
    align: 'center',
    xlWidth: 20,
    formatPrice:true,
    sorter: (a, b) => a.amount - b.amount,
    render: (text) => (formatPrice(text))
  },
  {
    title: renderTitle(_t('服务费')),
    dataIndex: 'servFee',
    align: 'center',
    xlWidth: 20,
    formatPrice:true,
    sorter: (a, b) => a.servFee - b.servFee,
    render: (text) => (formatPrice(text))
  },
  {
    title: renderTitle(_t('日单枪电量')),
    dataIndex: 'onePower',
    align: 'center',
    xlWidth: 20,
    numberFormat: '0.000',
    sorter: (a, b) => a.onePower - b.onePower,
    render: (text) => (getPowerFormat(text))
  },
  {
    title: renderTitle(_t('日单枪服务费')),
    dataIndex: 'oneServ',
    align: 'center',
    xlWidth: 20,
    formatPrice:true,
    sorter: (a, b) => a.oneServ - b.oneServ,
    render: (text) => (formatPrice(text))
  },
];

const Page = observer(({location})=> {
  if(!dataState.hasInitParams){
    useMount(()=>{
      dataState.getConfig();
    });
  }
  useUnmount(() => {
    dataState.resetParams()
  })
    const _t = useI18n()
    const [form] = Form.useForm();
    const {curSearchFormParam,chartVisible,onSearchFormValuesChanged,columnData,columnChartFields,pieData,groupTags,pieGroupTags,precisionUnit,tagsData} = dataState;
  // const chartType = form.getFieldValue("chartType")||curSearchFormParam.chartType;
  // const intervalType = form.getFieldValue("intervalType")||curSearchFormParam.intervalType;
  const intervalTypeParam =  _.find(curSearchFormParam, (item)=>item.name[0]==="intervalType");
  const intervalType = intervalTypeParam?intervalTypeParam.value:"5"
  const chartTypeParam =  _.find(curSearchFormParam, (item)=>item.name[0]==="chartType");
  const chartType = chartTypeParam?chartTypeParam.value:"1"
  const ref = useRef();
  const downloadImage = () => {
    ref.current?.downloadImage(`${_t('站点运营')}.png`,["image/png",1]);
  }
  const onFinish = async(values) => {
    const chartType = await dataState.getSearchFormParamsByName("chartType");
    if(chartType === "1"){
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
    }else{
      let isEmptyTags = true;
      const tempArr = pieGroupTags.filter(tag=>!_.isEmpty(tag))
      if(!_.isEmpty(tempArr)){
        isEmptyTags = false;
      }
      if(isEmptyTags){
        Modal.error({
          content:_t('请先选择图表参数')
        })
        return false;
      }
      if(precisionUnit==="1"&&_.isEmpty(tagsData)){
        Modal.error({
          content:_t('请先添加自定义电量范围')
        })
        return false;
      }
    }

    dataState.getListData();
    dataState.getChartData();
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const exportExcel = ()=>{
    const {listData} = dataState;
    const {records} = listData;
    const title = _t('站点运营列表');
    exportTableExcel(records,columns,{title, filename:title,isGroup:false})
  }
    return (
        <div className={cls.container}>
            <Form
              form={form}
              {...formItemLayout}
              onValuesChange={onSearchFormValuesChanged}
              // initialValues={curSearchFormParam}
              fields={dataState.curSearchFormParam}
              name="search-form"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              labelAlign={'left'}
              colon={false}
            >
                {/* 站点 / 图表类型 / 统计区间 / 统计精度 下拉框 */}
                <SelectParams form={form} chartType={chartType} intervalType={intervalType} />

                <div style={{marginTop: 10}} />
                {/* 图表参数 */}
              {
                chartType === '1' ?
                  <div>
                    <div>
                      <span className={cls.chartParam}>{ _t('图表参数') }</span>
                      <span className={cls.chartParamTip}>{ _t('支持组内多选, 最多可选择两组数据进行组合展示。') }</span>
                      <a onClick={()=>{ dataState.handleChartVisible() }} className={cls.fold}>
                        { chartVisible ?  _t('收起图表'):_t('展开图表') } &nbsp;
                        { chartVisible ?  <UpOutlined />:<DownOutlined />  }
                      </a>
                    </div>
                    <div style={{marginTop: 5}} />

                    {/* 分组多选图表参数 */}
                    <CheckBoxChartParams intervalType={intervalType} />
                  </div>
                  :
                  <div>
                    <span className={cls.chartParam}>{ _t('图表参数') }</span>
                    {/*<span className={cls.chartParamTip}>{ _t('自定义统计单位之间不可重复, 时间单位下最长区间为24小时。') }</span>*/}
                    <span className={cls.chartParamTip}>{ _t('自定义统计单位之间不可重复。') }</span>
                    <div style={{marginTop: 5}} />

                    {/* 单选图表参数 */}
                    <RadioChartParams  precisionUnit={precisionUnit} handleTagsChange={dataState.handleTagsChange} radioTags={SiteRadioTags} groupTags={pieGroupTags} />

                  </div>
              }
                <Row style={{marginTop: 20}}>
                    {/* 统计单位 */}
                    <StatisticUnits chartsType={chartType} downloadImage={downloadImage} exportExcel={exportExcel}  />
                </Row>
            </Form>

            {/* 混合图表 饼图 */}
          <Spin spinning={useLoading('operator/getChartData')||false}>
            {
              dataState.chartVisible&&
              <div className={cls.charts}>
                {
                  chartType === '1' ?
                    <ColumnLineCharts ref={ref} columnData={columnData} columnChartFields={columnChartFields} />
                    :
                    <Row>
                      <Col xs={24} xl={20}>
                        {/* 蜘蛛饼图 */}
                        <SpiderPieChart ref={ref} pieData={pieData} />
                      </Col>
                    </Row>
                }
              </div>

            }
          </Spin>


            {/* 表格 */}
            <div className={cls.tableTitle}>{ _t('电量单位 kW·h, 费用(营收)单位 ¥') } </div>
            <ElectricProfitTable columns={columns} />
        </div>
    )
})

Page.label = '站点运营数据'
Page.module = 'dmcOperateData'
Page.order = 1

export default Page;
