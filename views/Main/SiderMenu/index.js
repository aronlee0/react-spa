import React,{ Component } from 'react';
import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon';
const { SubMenu } = Menu;

export default class SiderMenu extends Component{
    constructor(props){
        super(props);
    }
    state = {
        theme: 'dark',
        current: '1'
    }
    
    handleClick(e) {
        // console.log('click ', e);
        let {key} = e;
        this.setState({
            current: e.key,
        });
        switch (key) {
            case "1":
                location.href = "#/contract-list"
                break;
            case "2":
                location.href = "#/house-list"
                break;
            default:
                location.href = "#/"
                break;
        }
    }
    render(){
        return (
            <Menu
            // theme={this.state.theme}
            onClick={this.handleClick.bind(this)}
            style={{ width: 240 }}
            defaultOpenKeys={['sub1']}
            selectedKeys={[this.state.current]}
            mode="inline"
            >
                <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
                    <Menu.Item key="1">contract-list</Menu.Item>
                    <Menu.Item key="2">house-list</Menu.Item>
                    <Menu.Item key="3">Option 3</Menu.Item>
                    <Menu.Item key="4">Option 4</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigtion Two</span></span>}>
                    <Menu.Item key="5">Option 5</Menu.Item>
                    <Menu.Item key="6">Option 6</Menu.Item>
                    <SubMenu key="sub3" title="Submenu">
                    <Menu.Item key="7">Option 7</Menu.Item>
                    <Menu.Item key="8">Option 8</Menu.Item>
                    </SubMenu>
                </SubMenu>
                <SubMenu key="sub4" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
                    <Menu.Item key="9">Option 9</Menu.Item>
                    <Menu.Item key="10">Option 10</Menu.Item>
                    <Menu.Item key="11">Option 11</Menu.Item>
                    <Menu.Item key="12">Option 12</Menu.Item>
                </SubMenu>
            </Menu>
        )
    }
}
