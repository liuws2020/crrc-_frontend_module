import React from "react";
import { separateArrayOutofObject } from "./algorithms/DataConverterHandler";

export const DataConverterDriver = function () {
	const raw = [
		{
			GHChannel4: 4,
			GHChannel6: 6,
			GHChannel7: 7,
			GHChannel8: 8,
			date: 1607060250000,
		},
		{
			GHChannel4: 4,
			GHChannel6: 6,
			GHChannel7: 7,
			GHChannel8: 8,
			date: 1607060251000,
		},
		{
			GHChannel4: 4,
			GHChannel6: 6,
			GHChannel7: 7,
			GHChannel8: 8,
			date: 1607060252000,
		},
		{
			GHChannel4: 4,
			GHChannel6: 6,
			GHChannel7: 7,
			GHChannel8: 8,
			date: 1607060253000,
		},
		{
			GHChannel4: 4,
			GHChannel6: 6,
			GHChannel7: 7,
			GHChannel8: 8,
			date: 1607060254000,
		},
		{
			GHChannel4: 4,
			GHChannel6: 6,
			GHChannel7: 7,
			GHChannel8: 8,
			date: 1607060255000,
		},
	];

	const converted = separateArrayOutofObject(raw);
	console.log(converted);

	return <div>请打开控制台</div>;
};
