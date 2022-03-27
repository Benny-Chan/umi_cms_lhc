import React, { useState } from 'react'
import { Select } from 'antd'
import { useMount } from 'ahooks';
import cls from './OperatorSelect.less'
import { useI18n } from "@/utils";
import { observer } from 'mobx-react';
import ico_jt01 from '@/assets/image/ico_jt01.png'
import session from '@/stores/session'

const { Option } = Select;

export const OperatorSelect = observer((props) => {
    const _t = useI18n()
    // const [list, setList] = useState([])

    useMount(() => {
        getNameList()
    })

    const getNameList = async() => {
        const res = await session.getNameList()
        // if(res.code) return message.error(res.message)
        // setList(res.records)
    }

    const handleOperatorChange = (id) => {
        console.log('设置运营商ID: ',id)
        session.setOperatorIds(id)
    }

    return (
        <div className={cls.container}>
            <div className={cls.operator}>
                <Select defaultValue={session.operatorIds} value={session.operatorIds} className={cls.operatorSelect} onChange={handleOperatorChange} suffixIcon={<img src={ico_jt01} />}>
                    <Option value={0}>{ _t('全部运营商') }</Option>
                    { session.operatorList.map((item,i) => <Option key={'opid'+i} value={item.id}>{ _t(item.shortName) }</Option>)}
                </Select>
            </div>
        </div>
    )
})
