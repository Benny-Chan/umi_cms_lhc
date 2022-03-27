import React, {useState} from "react";
import {_t} from '@/utils'

function Layout(props) {
  return (
    <>
    {props.children}
    </>
  )
}

Layout.label = '站点间运营数据对比'
Layout.icon = 'ProjectOutlined'
Layout.order = 6

export default Layout;


