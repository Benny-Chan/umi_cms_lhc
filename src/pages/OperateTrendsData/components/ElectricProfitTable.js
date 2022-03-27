import React, { useState, useEffect } from 'react';
import { Row, Col, Table } from 'antd'
import moment from 'moment'
import cls from './css/ElectricProfitTable.less'
import {observer} from "mobx-react/dist/index";
import dataState from '@/stores/operatorTrend';
import {_t, formatPrice, useLoading} from "../../../utils";
const { Column, ColumnGroup } = Table;

const renderTitle = (name) => <span className={cls.name}>{name}</span>

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
  },
  {
    title: renderTitle(_t('站场名称')),
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: renderTitle(_t('电量升降量')),
    dataIndex: 'chargePowerNum',
    align: 'center',
    sorter: (a, b) => a.chargePowerNum - b.chargePowerNum,
    render: (text) => (getPowerFormat(text))
  },
  {
    title: renderTitle(_t('电量升降率')),
    dataIndex: 'chargePowerRate',
    align: 'center',
    sorter: (a, b) => a.chargePowerRate - b.chargePowerRate,
    render: (text) => (getRateFormat(text))
  },
  {
    title: renderTitle(_t('峰期电量升降量')),
    dataIndex: 'phasePower1Num',
    align: 'center',
    sorter: (a, b) => a.phasePower1Num - b.phasePower1Num,
    render: (text) => (getPowerFormat(text))
  },
  {
    title: renderTitle(_t('峰期电量升降率')),
    dataIndex: 'phasePower1Rate',
    align: 'center',
    sorter: (a, b) => a.phasePower1Rate - b.phasePower1Rate,
    render: (text) => (getRateFormat(text))
  },
  {
    title: renderTitle(_t('平期电量升降量')),
    dataIndex: 'phasePower2Num',
    align: 'center',
    sorter: (a, b) => a.phasePower2Num - b.phasePower2Num,
    render: (text) => (getPowerFormat(text))
  },
  {
    title: renderTitle(_t('平期电量升降率')),
    dataIndex: 'phasePower2Rate',
    align: 'center',
    sorter: (a, b) => a.phasePower2Rate - b.phasePower2Rate,
    render: (text) => (getRateFormat(text))
  },
  {
    title: renderTitle(('谷期电量升降量')),
    dataIndex: 'phasePower3Num',
    align: 'center',
    sorter: (a, b) => a.phasePower3Num - b.phasePower3Num,
    render: (text) => (getPowerFormat(text))
  },
  {
    title: renderTitle(_t('谷期电量升降率')),
    dataIndex: 'phasePower3Rate',
    align: 'center',
    sorter: (a, b) => a.phasePower3Rate - b.phasePower3Rate,
    render: (text) => (getRateFormat(text))
  },
  {
    title: renderTitle(_t('营收升降量')),
    dataIndex: 'amountNum',
    align: 'center',
    sorter: (a, b) => a.amountNum - b.amountNum,
    render: (text) => (formatPrice(text))
  },
  {
    title: renderTitle(_t('营收升降率')),
    dataIndex: 'amountRate',
    align: 'center',
    sorter: (a, b) => a.amountRate - b.amountRate,
    render: (text) => (getRateFormat(text))
  },
  {
    title: renderTitle(_t('日单枪电量升降量')),
    dataIndex: 'onePowerNum',
    align: 'center',
    sorter: (a, b) => a.onePowerNum - b.onePowerNum,
    render: (text) => (getPowerFormat(text))
  },
  {
    title: renderTitle(_t('日单枪电量升降率')),
    dataIndex: 'onePowerRate',
    align: 'center',
    sorter: (a, b) => a.onePowerRate - b.onePowerRate,
    render: (text) => (getRateFormat(text))
  },
  {
    title: renderTitle(_t('服务费升降量')),
    dataIndex: 'servFeeNum',
    align: 'center',
    sorter: (a, b) => a.servFeeNum - b.servFeeNum,
    render: (text) => (formatPrice(text))
  },
  {
    title: renderTitle(_t('服务费升降率')),
    dataIndex: 'servFeeRate',
    align: 'center',
    sorter: (a, b) => a.servFeeRate - b.servFeeRate,
    render: (text) => (getRateFormat(text))
  },
];


export const ElectricProfitTable = observer(({})=> {

const {listData,onPageIndexChange,onPageSizeChange,curSearchFormParam} = dataState;
  const {totalRecords,records,pageIndex,pageSize,sumData} = listData;
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper:true,
    current: pageIndex||1,
    pageSize:pageSize||5,
    onChange:(page, pageSize)=>onPageIndexChange(page,pageSize),
    onShowSizeChange:(page, pageSize)=>onPageSizeChange(page,pageSize),
    total: totalRecords,
    showTotal:(total)=> `总数：${total}`,
    position:'top',
  };

  return (
    <div className={cls.container}>
      <div className={cls.card}>
        <Table
          bordered
          loading={useLoading('operatorTrend/getListData')}
          dataSource={records}
          rowKey="id"
          columns={columns}
          pagination={false}
          pageSizeOptions={[5, 10, 20, 50]}
          scroll={{ x: 2200 }}
        />
      </div>
    </div>
  )
})
