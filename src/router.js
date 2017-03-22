import React,{Component} from 'react'
import { Provider } from 'react-redux'
import {
    HashRouter as Router,
    IndexRoute,
    Route
} from 'react-router-dom'
import store from 'store'

import Main from './views/Main'
import HouseList from './views/HouseList'
import ContractList from './views/ContractList'

export default
class RootRouter extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <Provider store={store}>
                { /* ConnectedRouter will use the store from Provider automatically */ }
                <Router>
                    <div>
                        <Route path="/" component={Main} ></Route>
                        <Route path="/house-list"  component={HouseList}/>
                        <Route path="/contract-list"  component={ContractList}/>
                    </div>
                </Router>
            </Provider>
        )
    }
}
