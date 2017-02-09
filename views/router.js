import React,{Component} from 'react';
import {Router,Route,IndexRoute,hashHistory } from 'react-router';

// import useRouterHistory from 'react-router/lib/useRouterHistory';
// import createHashHistory  from 'history/lib/createHashHistory'
// import {Provider,connect} from "react-redux";

// import Main from './Main';
// import Login from './Login';
// import HouseList from './HouseList';
// import ContractList from './ContractList';

// const appHistory = useRouterHistory(createHashHistory)({queryKey:false});



export default
class RootRouter extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <Router history={hashHistory}>
             {/*main*/}
                <Route path="/" getComponent={(nextState, cb)=>{
                    require.ensure([], (require) => {
                        cb(null, require("./Main"))
                    },"main");
                }} >
                    <Route path="house-list"  getComponent={(nextState, cb)=>{
                        require.ensure([], (require) => {
                            console.log(require("./HouseList"));
                            cb(null, require("./HouseList"))
                        },"house-list");
                    }}/>
                    <Route path="contract-list"  getComponent={(nextState, cb)=>{
                        require.ensure([], (require) => {
                            cb(null, require("./ContractList"))
                        },"contract-list");
                    }}/>
                </Route>
            </Router>
        )
    }
}