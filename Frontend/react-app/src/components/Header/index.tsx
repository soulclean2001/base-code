import { Component } from 'react'
import LeftMenu from './LeftMenu/LeftMenu'
import RightMenu from './RightMenu/RightMenu'
import { NavLink } from 'react-router-dom'
// import { Drawer, Button } from 'antd'

import './header.scss'
import "@fontsource/rubik"; // Defaults to weight 400
import "@fontsource/rubik/400.css"; // Specify weight
import "@fontsource/rubik/400-italic.css"; // 
// import { RightOutlined } from '@ant-design/icons'

class Header extends Component {
  state = {
    visible: false
  }

  showDrawer = () => {
    this.setState({
      visible: true
    })
  }

  onClose = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    return (
      <nav className='menu'>
        <div className='menu__logo'>
          <NavLink to={"/"} className={"header_logo"}>HFWork</NavLink>
        </div>
        <div className='menu__container'>
          <div className='menu_left'>
            <div className='left_menu_container'>
            <LeftMenu />
            </div>
            
            
          </div>
          <div className='menu_rigth'>
            <div className='menu_rigth_container'>
            <RightMenu />
            </div>
            
          </div>
          {/* <Button className='menu__mobile-button' type='primary' onClick={this.showDrawer}>
            <RightOutlined />
          </Button>
          <Drawer
            title='Basic Drawer'
            placement='right'
            className='menu_drawer'
            closable={false}
            onClose={this.onClose}
            open={this.state.visible}
          >
            <LeftMenu />
            <RightMenu />
          </Drawer> */}
        </div>
      </nav>
    )
  }
}

export default Header
