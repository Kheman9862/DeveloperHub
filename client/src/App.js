import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser } from "./actions/authActions";
import store from "./store";

import "./App.css";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Landing from "./components/Layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { logoutUser } from "./actions/authActions";

// Check for token
console.log("Hi");
if (localStorage.jwtToken) {
  console.log("Hola");
  //Set auth token header auth
  setAuthToken(localStorage.jwtToken);

  //Decode token and get user info and expiration
  const decoded = jwt_decode(localStorage.jwtToken);

  //Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // // Check for expired time
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    //Logout user
    store.dispatch(logoutUser());
    //Clear current profile
    //Redirect the login
    window.location.href = "/login";
  }
}
function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Landing} />
          <div className="container">
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
