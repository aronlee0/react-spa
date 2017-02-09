import React,{ Component } from 'react';
import Layout from 'antd/lib/layout';
const { Header, Footer, Sider, Content } = Layout;

import SiderMenu from './SiderMenu';

export default class PageHome extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <Layout>
                <Header>Header</Header>
                <Layout style={{height: "600px"}}>
                    <Sider>
                        <SiderMenu />
                    </Sider>
                    <Content>{this.props.children}</Content>
                </Layout>
                <Footer>Footer</Footer>
            </Layout>
            
        );
    }
}
