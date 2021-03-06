
import * as React from 'react';
import { Redirect, Route, Switch } from "react-router-dom";
import { RouteComponentProps } from 'react-router-dom';
import Detail from './Detail'
import Form from './Form'
import List from './List'


class Student extends React.PureComponent<RouteComponentProps> {
    render () {
        return (<Switch>
        <Route path={`${this.props.match.path}/list`}  component={List} />
        <Route path={`${this.props.match.path}/add`}  component={Form} />
        <Route path={`${this.props.match.path}/detail/:id`}  component={Detail} />
        <Route path={`${this.props.match.path}/edit/:id`}  component={Form} />
        <Redirect to={`${this.props.match.path}/list`} />
      </Switch>)
    }
}

export default Student
