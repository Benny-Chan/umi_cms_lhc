import React, {useState} from "react";
import {_t} from '@/utils'

function Layout(props) {
  return (
    <>
    {props.children}
    </>
  )
}

Layout.label = '站点运营数据对比'
Layout.icon = 'PieChartOutlined'
Layout.order = 5

export default Layout;


