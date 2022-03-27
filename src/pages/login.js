import {_t, useLoading} from "@/utils";
import React, { useState, useEffect } from 'react';
import { useMount, useUnmount } from 'ahooks';
import { Form, Input, Button, Checkbox,Row,Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './login.less';
import session from '@/stores/session';
// import logo from '../assets/PoweredBy2.png';
import logo from '../assets/image/login_logo.png';
import icoUser from '../assets/image/ico_user.png';
import icoPassword from '../assets/image/ico_password.png';

import {
  CopyrightOutlined
} from '@ant-design/icons';


export default function({history}) {
  const [loginError, setLoginError] = useState();

  const onFinish = async data=>{
    const rt = await session.login(data);
    if(rt.code){
      setLoginError(rt.message)
    }else{
      history.push('/');
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top} style={{ marginTop: '80px' }}>
          <div className={styles.header}>
            <img alt="logo" className={styles.logo} src={logo} />
            <span className={styles.title}>{_t('数据中台')}</span>
          </div>
          <div className={styles.desc}> </div>
        </div>
        <div className={styles.bg}>
          <div className={styles.loginContent}>
            <div style={{color:'#000000',fontSize:16,marginTop:22,marginLeft:21}}>{_t('登录')}</div>
            <Form
              name="normal_login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              style={{textAlign:"center"}}
            >
              <Form.Item
                style={{marginTop:0,marginBottom:0}}
                name="loginname"
                rules={[{ required: true, message: _t('请输入账号') }]}
              >
                <Input
                  style={{marginTop:64,marginBottom:8}}
                  allowClear
                  className={styles["login-button"]}
                  prefix={<img src={icoUser} />}
                  placeholder={_t('账号')}
                />
              </Form.Item>
              <Form.Item
                style={{marginTop:0,marginBottom:0}}
                name="password"
                help={loginError}
              >
                <Input
                  style={{marginTop:8,marginBottom:8}}
                  allowClear
                  className={styles["login-button"]}
                  // prefix={<LockOutlined />}
                  prefix={<img src={icoPassword} />}
                  type="password"
                  placeholder={_t('密码')}
                />
              </Form.Item>

              <Form.Item  style={{marginTop:0,marginBottom:0}}>
                <Button type="primary" htmlType="submit" className={styles["login-form-button"]}>
                  {_t('登录')}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        {/*<div className={styles.main}>*/}
         {/**/}
        {/*</div>*/}
      </div>
      <div className={styles.copyright}>{`Copyright `}<CopyrightOutlined />{` ${new Date().getFullYear()} `}{_t('令狐充数据中台')}</div>
    </div>
  );
}
