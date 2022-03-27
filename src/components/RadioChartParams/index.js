import React, { useState, useEffect } from 'react'
import { Row, Col, Tag, Form } from 'antd'
import cls from './index.less'
import { createFromIconfontCN } from '@ant-design/icons'
import _ from 'lodash'

const { CheckableTag } = Tag;

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2123090_423ugu93kvw.js',
});

export const RadioChartParams = ({ handleTagsChange, radioTags,groupTags,precisionUnit }) => {
  // if(precisionUnit==="1"){
  //   radioTags = [radioTags[0]]
  // }
  if(precisionUnit==="2"){
    radioTags = radioTags
  }
  if(precisionUnit==="1"||precisionUnit==="3"){
    radioTags = [radioTags[0],radioTags[1]]
  }
    return (
        <div className={cls.container}>
            <Form.Item
                name={'radioTag'}
                wrapperCol={{span:24}}
            >
                <Row className={cls.chartBorder}>
                    {
                        radioTags.map((item,index) =>
                            <CheckableTag
                                key={'radio'+index}
                                className={`
                                    ${cls.tags}
                                    ${_.includes(groupTags,item.value) ? cls.tagsActivate : ''}
                                    ${!_.isEmpty(groupTags) && !_.includes(groupTags,item.value) ? cls.disable : ''}
                                `}
                                checked={_.includes(groupTags,item.value)}
                                onChange={checked => handleTagsChange(item.value, checked) }
                                value={item.value}
                            >
                                <span>{item.text}</span>
                                <IconFont type={'icon-check'} className={cls.outLined} />
                            </CheckableTag>
                        )
                    }
                </Row>
            </Form.Item>
        </div>
    )
}
