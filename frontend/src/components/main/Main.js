import React from "react";
import { Route, Redirect, withRouter, Switch } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  AreaChartOutlined,
  AuditOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import store from "../../store";
import "./Main.css";
import Utils from "../../common/Utils";

const Expense = React.lazy(() => import("../expense/List"));
const UserList = React.lazy(() => import("../user/List"));
const Summary = React.lazy(() => import("../summary/Summary"));

const { Sider } = Layout;

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentItem: [],
    };

    this.onMenuItemClick = this.onMenuItemClick.bind(this);
    this.setCurrentItem = this.setCurrentItem.bind(this);
    this.sideBar = this.sideBar.bind(this);
  }

  onMenuItemClick(event) {
    this.setCurrentItem(event.key);
    if (event.key === "logout") {
      Utils.rmToken();
      this.props.history.push("/");
      return;
    }

    this.props.history.push(event.key);
  }

  setCurrentItem(item) {
    let action = {
      type: "setMenuItem",
      value: [item],
    };

    store.dispatch(action);
  }

  componentDidMount() {
    let self = this;
    self.setState({
      currentItem: store.getState().currentItem,
    });

    this.unsubscribe = store.subscribe(() => {
      if (
        self.state.currentItem.length !== store.getState().currentItem.length ||
        self.state.currentItem[0] !== store.getState().currentItem[0]
      ) {
        self.setState({
          currentItem: store.getState().currentItem,
        });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  sideBar() {
    return (
      <Sider width={200} className="site-layout-background">
        <div className="logo">Money Guardian</div>
        <Menu
          mode="inline"
          defaultSelectedKeys={this.state.currentItem}
          selectedKeys={this.state.currentItem}
          style={{ height: "100%", borderRight: 0 }}
          onClick={this.onMenuItemClick}
          theme="dark"
        >
          <Menu.Item key="/main/summary" icon={<AreaChartOutlined />}>
            Summary
          </Menu.Item>
          <Menu.Item key="/main/expense" icon={<AuditOutlined />}>
            Expense
          </Menu.Item>
          <Menu.Item key="logout" icon={<TransactionOutlined />}>
            Log Out
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }

  render() {
    return (
      <Layout className="container">
        <Layout>
          <this.sideBar />
          <Layout style={{ padding: "24px 24px 24px" }}>
            <Switch>
              <Redirect from="/main/" to="/main/summary" exact />
              <Route path="/main/summary" component={Summary} exact />
              <Route path="/main/expense" component={Expense} exact />
              <Route path="/main/user" component={UserList} exact />
            </Switch>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(Main);
