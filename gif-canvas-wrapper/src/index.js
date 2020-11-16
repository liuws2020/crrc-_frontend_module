import ReactDOM from "react-dom";
import React from "react";
import Main from "./main";
import { Provider } from "react-redux";
import { createStore } from "redux";
import BoundledReducers from "./reducers";

ReactDOM.render(
	<Provider store={createStore(BoundledReducers)}>
		<Main />
	</Provider>,
	document.getElementById("root")
);
