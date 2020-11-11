import ReactDOM from "react-dom";
import React from "react";
import Main from "./main";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import BoundledReducers from "./reducers";

ReactDOM.render(
	<Provider store={createStore(BoundledReducers, applyMiddleware(thunk))}>
		<Main />
	</Provider>,
	document.getElementById("root")
);
