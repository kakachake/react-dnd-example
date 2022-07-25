import { Link, Outlet } from "react-router-dom";
import "./App.css";
import { routesList } from "./router/router";

function App() {
  return (
    <div className="App">
      {routesList[0].children.map((route, idx) => {
        return (
          <Link key={idx} to={route.path}>
            示例{idx + 1}
          </Link>
        );
      })}
      <Outlet />
    </div>
  );
}

export default App;
