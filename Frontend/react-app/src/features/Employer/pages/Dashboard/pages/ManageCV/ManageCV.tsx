import { Tabs } from 'antd'
import TableApplied from './components/TableApplied/TableApplied'
import './style.scss'

import { TabsProps } from 'antd/lib'
import ContentCVManage from './components/ContentCVManage'

const ManageCV = () => {
  const onChange = (key: string) => {
    console.log(key)
  }

  const items: TabsProps['items'] = [
    {
      key: 'tab-applied-cv',
      label: <div className='tab-item'>Hồ sơ đã ứng tuyển</div>,
      children: <ContentCVManage />
    },
    {
      key: 'tab-saved-cv',
      label: <div className='tab-item'>Hồ sơ đã lưu</div>,
      children: 'Content of Tab Pane 2'
    },
    {
      key: 'tab-back-list',
      label: <div className='tab-item'>Danh sách đen</div>,
      children: 'Content of Tab Pane 2'
    },
    {
      key: 'tab-deleted',
      label: <div className='tab-item'>Đã xóa</div>,
      children: 'Content of Tab Pane 3'
    }
  ]
  return (
    <div className='cv-applied-manage-container'>
      <div className='title'>Quản Lý Hồ Sơ Ứng Viên</div>

      <div className='tabs-post-manage-container'>
        <Tabs className='tabs-post-manage' defaultActiveKey='1' items={items} onChange={onChange} />
      </div>
    </div>
  )
}

export default ManageCV