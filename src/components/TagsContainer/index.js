import React, { useState, useEffect } from 'react'
import { Row, Col, Tag } from 'antd'
import cls from './index.less'
import _ from 'lodash'
import { createFromIconfontCN } from '@ant-design/icons'
import {chartUnitMap, precisionUnitMap} from "../../utils/constant";

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2123090_d92m7hcc7ft.js',
});

export const TagsContainer = (props) => {
    const { tagsData, handleCloseTag,precisionUnit } = props
  const unitLabel  = precisionUnitMap[parseInt(precisionUnit,10)];
    return (
        <div className={cls.container}>
            {
                tagsData.map((item, index) =>
                    <span key={'tagCont'+index} className={cls.item}>
                        <Tag className={cls.tags}>{item.max?`${item.min}-${item.max}${unitLabel}`:`${item.min}${unitLabel}以上`}</Tag>
                        <IconFont
                            type={'icon-jiaochacross78'}
                            className={cls.close}
                            onClick={()=>{ handleCloseTag(item.key) }}
                        />
                    </span>
                )
            }
        </div>
    )
}
