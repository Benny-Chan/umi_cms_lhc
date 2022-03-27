import { Layout, Menu, Dropdown, Button, Modal, Input, Form, message } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined, EditOutlined, LogoutOutlined
} from '@ant-design/icons';
import * as icons from '@ant-design/icons';
import _ from 'underscore';
import cls from './index.less'
import React, { useState } from 'react';
import {history, Link} from 'umi'
import { useI18n } from '@/utils';
import session from '@/stores/session'
import { OperatorSelect } from './OperatorSelect'

const { Header, Sider, Content } = Layout;

export default function(props) {
  const _t = useI18n()
  const [collapsed, setCollapsed] = useState(false)
  const [form] = Form.useForm();
  const [editPwdVisible, setEditPwdVisible] = useState(false);
  const { route: {routes}, location: {pathname}, history } = props;
  const topMenu = _.filter(sortroutes(routes), r=>r.order);
  const curTopMenu = _.find(topMenu, m => pathname.startsWith(m.path));
  const curRouter = findCurRouter(topMenu, pathname);

  // 改变主题颜色
  let themeColor = ''
  let isBlackTheme = false
  if(curRouter?.theme == "black"){
    themeColor = cls.blackTheme
    isBlackTheme = true
  }

  if(!curTopMenu || !curRouter || !curRouter.exact){
    if(!curTopMenu && props.children && pathname != '/'){
      return (<div>{props.children}</div>);
    }
    const firstPage = findFirstPath(curRouter ? curRouter.routes : topMenu);
    history.push(firstPage ? firstPage.path : '/404');
    return (<div/>);
  }
  if(!session.user){
    return (<div>{props.children}</div>);
  }

  const toggle = () => {
    setCollapsed(!collapsed)
  };

  const showEditPassword = ()=>{
    form.resetFields();
    setEditPwdVisible(true)
  }
  const changePassword = async ()=>{
    form.submit();
  }
  const submitNewPassword = async (data)=>{
    const {oldPassword, password} = data;
    const rt = await session.changePassword({oldPassword, password});
    if(rt.code){
      message.error(rt.message);
    }else{
      message.success(_t('保存成功'));
      setEditPwdVisible(false)
    }
  }

    return (
      <Layout style={{fontFamily: 'HanSanRegular'}}>
        <Header className={`${isBlackTheme ? cls.header2 : cls.header} ${themeColor}`}>
          <div className={`${cls.logo} ${themeColor}`}>{ _t('令狐充数据中台') }</div>
          <a onClick={toggle} style={{color:'#0070FF',marginLeft:20, marginRight:20, float:'left', marginTop: 5}}>
                {
                    collapsed ?
                        <MenuUnfoldOutlined style={{fontSize:20, color: isBlackTheme ? '#fff':''}} />
                    :<MenuFoldOutlined style={{fontSize:20, color: isBlackTheme ? '#fff':''}} />
                }
            </a>
          {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[curTopMenu.path]} style={{float: 'left'}}>
            {
              topMenu.map(m => (<Menu.Item key={m.path}><Link to={m.path}>{_t(m.label)}</Link></Menu.Item>))
            }
          </Menu> */}
          <OperatorSelect />
          {renderHeaderRight(showEditPassword, themeColor)}
        </Header>
        <Layout>
        <Sider 
          breakpoint='lg' 
          trigger={null} 
          collapsible 
          collapsed={collapsed} 
          onBreakpoint={broken => {
            setCollapsed(broken)
          }}
          style={{background:'#fff'}}
          className={`${cls.sider} ${isBlackTheme ? cls.sider2 : ''}`}
        >
          <Menu mode="inline" defaultSelectedKeys={[curTopMenu.path]} className={`${themeColor}`} style={{ height: '100%' }}>
            {
              topMenu.map(m => (<Menu.Item key={m.path} icon={React.createElement(icons[m.icon], isBlackTheme ? {style: {color: '#fff'}} : null)} style={{height: 60, lineHeight: '60px'}}><Link to={m.path} style={isBlackTheme? {color: '#fff'}: {}}>{_t(m.label)}</Link></Menu.Item>))
            }
          </Menu>
        </Sider>
        <Layout className={cls.site_layout} style={{backgroundColor: isBlackTheme ? '#091531': '#F0F7FD'}}>
          <Content
            style={{
              // margin: '15px 12px',
              // padding: 5,
              minHeight: 280,
            }}
          >
            <div className={cls.content}>
              {props.children}
            </div>
          </Content>
        </Layout>
        </Layout>
        <Modal
          title={_t('修改密码')}
          visible={editPwdVisible}
          onOk={changePassword}
          onCancel={()=>setEditPwdVisible(false)}
        >
          <Form
            form={form}
            name="editpwd_form"
            labelCol={{ span: 5 }}
            onFinish={submitNewPassword}
          >
            <Form.Item
              name="oldPassword"
              label={_t('旧密码')}
              rules={[
                {
                  required: true,
                  message: _t('请输入旧密码'),
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="password"
              label={_t('新密码')}
              rules={[
                {
                  required: true,
                  message: _t('请输入新密码'),
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label={_t('确认密码')}
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message:  _t('请再次输入新密码'),
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(_t('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    );
}



function sortroutes(routes) {
  routes = _.filter(routes, r => r.routes||r.order);
  routes = _.sortBy(routes, r=>r.order).map(r=>({...r}));
  for(const r of routes){
    if(r.routes){
      r.routes = sortroutes(r.routes);
    }
  }
  return routes;
}

function findFirstPath(routes) {
  if(routes) {
    for (const r of routes) {
      if (r.exact) {
        return r;
      } else if (r.routes) {
        const r1 = findFirstPath(r.routes);
        if (r1) {
          return r1;
        }
      }
    }
  }
}

function findCurRouter(routes, pathname) {
  if(routes) {
    for (const r of routes) {
      if (r.path == pathname) {
        return r;
      } else if (r.routes) {
        const r1 = findCurRouter(r.routes, pathname);
        if (r1) {
          return r1;
        }
      }
    }
  }
}


function createSideMenu(curTopMenu, pathname){
  const {routes} = curTopMenu;
  const subMenus = _.filter(routes, r => r.routes||r.exact);
  const keys = subMenus.map(m => m.path);
  return (
    <Menu
      theme="light"
      mode="inline"
      selectedKeys={[pathname]}
      defaultOpenKeys={keys}
      style={{ height: '100%', borderRight: 0 }}
    >
      {
        subMenus.map(createSubMenu)
      }
    </Menu>
  )

}

function createSubMenu(r) {
  if(r.routes){
    return (
      <SubMenu
        key={r.path}
        title={
          <span>
            {getIcon(r.icon)}
              <span>{_t(r.title)}</span>
          </span>
        }
      >
        {r.routes.map(createSubMenu)}
      </SubMenu>
    )
  }else if(r.exact){
    return (<Menu.Item key={r.path}><Link to={r.path}>{_t(r.title)}</Link></Menu.Item>)
  }
}

function getIcon(name) {
  if(name){
    return (<IconFont type={name} />)
  }
}

function renderHeaderRight(showEditPassword, themeColor){
  const _t = useI18n()
  const menu = (
    <Menu className={`${themeColor}`}>
      <Menu.Item className={`${themeColor}`} onClick={showEditPassword}>
        <span className={cls.headerRightMenuItem}><EditOutlined /> {_t('修改密码')}</span>
      </Menu.Item>
      <Menu.Item className={`${themeColor}`} onClick={logout}>
        <span className={cls.headerRightMenuItem}><LogoutOutlined /> {_t('注销')}</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} placement="bottomRight">
      <Button type="link" className={`${cls.headerRight} ${themeColor}`}>      <UserOutlined />
        {session.user.nickname}</Button>
    </Dropdown>
  );
}


function logout(){
  localStorage.setItem('UserToken', null);
  history.push('/login')
}