import React, { useState, useEffect } from 'react';
import { Row, Col, Table } from 'antd'
import moment from 'moment'
import cls from './css/ElectricProfitTable.less'
import dataState from '@/stores/operator';
import {_t, formatPrice, useLoading} from "../../../utils";
import {observer} from "mobx-react/dist/index";


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
    sorter: (a, b) => a.chargePower - b.chargePower,
    render: (text) => (getPowerFormat(text))
  },
  {
    title: renderTitle(_t('峰期电量')),
    dataIndex: 'phasePower1',
    align: 'center',
    xlWidth: 20,
    sorter: (a, b) => a.phasePower1 - b.phasePower1,
    render: (text) => (getPowerFormat(text))
  },
  {
    title: renderTitle(_t('平期电量')),
    dataIndex: 'phasePower2',
    align: 'center',
    xlWidth: 20,
    sorter: (a, b) => a.phasePower2 - b.phasePower2,
    render: (text) => (getPowerFormat(text))
  },
  {
    title: renderTitle(_t('谷期电量')),
    dataIndex: 'phasePower3',
    align: 'center',
    xlWidth: 20,
    sorter: (a, b) => a.phasePower3 - b.phasePower3,
    render: (text) => (getPowerFormat(text))
  },
  {
    title: renderTitle(_t('日均使用率')),
    dataIndex: 'oneRate',
    align: 'center',
    xlWidth: 20,
    sorter: (a, b) => a.oneRate - b.oneRate,
    render: (text) => (getRateFormat(text))
  },
  {
    title: renderTitle(_t('营收')),
    dataIndex: 'amount',
    align: 'center',
    xlWidth: 20,
    sorter: (a, b) => a.amount - b.amount,
    render: (text) => (formatPrice(text))
  },
  {
    title: renderTitle(_t('服务费')),
    dataIndex: 'servFee',
    align: 'center',
    xlWidth: 20,
    sorter: (a, b) => a.servFee - b.servFee,
    render: (text) => (formatPrice(text))
  },
  {
    title: renderTitle(_t('日单枪电量')),
    dataIndex: 'onePower',
    align: 'center',
    xlWidth: 20,
    sorter: (a, b) => a.onePower - b.onePower,
    render: (text) => (getPowerFormat(text))
  },
  {
    title: renderTitle(_t('日单枪服务费')),
    dataIndex: 'oneServ',
    align: 'center',
    xlWidth: 20,
    sorter: (a, b) => a.oneServ - b.oneServ,
    render: (text) => (formatPrice(text))
  },
];

export const ElectricProfitTable =observer(({})=> {
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
          loading={useLoading('operator/getListData')}
          dataSource={records}
          rowKey="id"
          columns={columns}
          pagination={false}
          pageSizeOptions={[5, 10, 20, 50]}
          // scroll={{ x: 2200 }}
        />
      </div>
    </div>
  )
})
