import React,{ useState } from 'react';
import { Row } from 'antd'
import img_noData from '@/assets/image/img_noData.png'
import { useI18n, _t } from "@/utils";
import cls from './index.less'


export const renderEmptyStation = (props) => {
  // const _t = useI18n()

  return (
    <Row className={cls.empty}>
        <img src={img_noData} />
        <div className={cls.emptyText}>{ _t('暂无更多站点信息') }</div>
    </Row>
  )
}
