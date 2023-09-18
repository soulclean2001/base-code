import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { FaClipboardUser } from 'react-icons/fa6'
import { IoNotificationsSharp } from 'react-icons/io5'
import { Layout, Menu, Button, MenuProps, Checkbox } from 'antd'

const { Sider } = Layout
import { Avatar } from 'antd'
import { useEffect, useState } from 'react'
import './style.scss'
import { AiFillDashboard, AiFillSetting } from 'react-icons/ai'

import { BiSolidFactory } from 'react-icons/bi'
import { MdWork } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { CheckboxChangeEvent } from 'antd/es/checkbox'

const SideBar = () => {
  const navigation = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [hiddenHeader, setHiddenHeader] = useState(false)
  const [defaultSelected, setDefaultSelected] = useState(['1'])
  const currentURL = window.location.href
  console.log('URL của trang web hiện tại:', currentURL)
  // useEffect(() => {
  //   handleChangeSelected()
  //   console.log('cc', defaultSelected)
  // }, [])
  // const handleChangeSelected = () => {
  //   if (currentURL === `http://127.0.0.1:3001/settings`) setDefaultSelected(['1'])
  //   else if (currentURL === `http://127.0.0.1:3001/settings/my-companies`) setDefaultSelected(['4'])
  //   else if (currentURL === `http://127.0.0.1:3001/settings/my-jobs`) setDefaultSelected(['5'])
  // }
  const onClickMenu: MenuProps['onClick'] = (e) => {
    console.log('click ', e)
    if (e.key === '1') navigation('/settings')
    if (e.key === '2') navigation('/CV')
    if (e.key === '4') navigation('/settings/my-companies')
    if (e.key === '5') navigation('/settings/my-jobs')
  }
  const onChangeCheckbox = (e: CheckboxChangeEvent) => {
    console.log(`checked = ${e.target.checked}`)
  }
  return (
    <Layout className='side-bar-settings-container'>
      <Sider className='sider-settings-page-container' trigger={null} collapsible collapsed={collapsed} width={300}>
        <div className='header-side-bar-container'>
          <div className='header-side-bar' style={{ height: `${hiddenHeader ? 'auto' : '100px'}` }}>
            <div className='user-header-side-bar' hidden={hiddenHeader}>
              <Avatar src={'P'} size={'large'} className='avatar-header-side-bar' />
              <div className='name-header-side-bar'>Thanh Phong</div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: `${hiddenHeader ? '100%' : 'auto'}`
              }}
            >
              <Button
                type='text'
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => {
                  setCollapsed(!collapsed), setHiddenHeader(!hiddenHeader)
                }}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                  color: 'white'
                }}
              />
            </div>
          </div>
          <div hidden={hiddenHeader} className='settings-auto-finding-cv'>
            <Checkbox disabled onChange={onChangeCheckbox}>
              Cho phép tìm kiếm hồ sơ
            </Checkbox>
            <span className='show-warning-cv'>Hồ sơ chưa đủ điều kiện cho phép tìm kiếm</span>
          </div>
        </div>
        <Menu
          style={{ backgroundColor: 'rgb(247, 248, 250)', borderInlineEnd: 'none' }}
          //   theme='light'
          onClick={onClickMenu}
          mode='inline'
          defaultSelectedKeys={
            currentURL === 'http://127.0.0.1:3001/settings'
              ? ['1']
              : currentURL === 'http://127.0.0.1:3001/settings/my-companies'
              ? ['4']
              : currentURL === 'http://127.0.0.1:3001/settings/my-jobs'
              ? ['5']
              : ['1']
          }
          items={[
            {
              key: '1',
              icon: (
                <span style={{ fontSize: '22px', color: 'gray' }}>
                  <AiFillDashboard />
                </span>
              ),
              label: 'Tổng Quan',
              style: { display: 'flex', alignItems: 'center', marginTop: '10px' }
            },
            {
              key: '2',
              icon: (
                <span style={{ fontSize: '22px', color: 'gray' }}>
                  <FaClipboardUser />
                </span>
              ),
              label: 'Hồ Sơ Của Tôi',
              style: { display: 'flex', alignItems: 'center' }
            },
            // {
            //   key: '3',
            //   icon: (
            //     <span style={{ fontSize: '22px', color: 'gray' }}>
            //       <FaUserCog />
            //     </span>
            //   ),
            //   label: 'Thiết Lập Hồ Sơ',
            //   style: { display: 'flex', alignItems: 'center' }
            // },
            {
              key: '4',
              icon: (
                <span style={{ fontSize: '22px', color: 'gray' }}>
                  <BiSolidFactory />
                </span>
              ),
              label: 'Công Ty Của Tôi',
              style: { display: 'flex', alignItems: 'center' }
            },
            {
              key: '5',
              icon: (
                <span style={{ fontSize: '22px', color: 'gray' }}>
                  <MdWork />
                </span>
              ),
              label: 'Việc Làm Của Tôi',
              style: { display: 'flex', alignItems: 'center' }
            },
            {
              key: '6',
              icon: (
                <span style={{ fontSize: '22px', color: 'gray' }}>
                  <IoNotificationsSharp />
                </span>
              ),
              label: 'Thông Báo Việc Làm',
              style: { display: 'flex', alignItems: 'center' }
            },
            {
              key: '7',
              icon: (
                <span style={{ fontSize: '22px', color: 'gray' }}>
                  <AiFillSetting />
                </span>
              ),
              label: 'Quản Lý Tài Khoản',
              style: { display: 'flex', alignItems: 'center' }
            }
          ]}
        />
      </Sider>
    </Layout>
  )
}

export default SideBar
