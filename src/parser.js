const fs = require("fs");
const cheerio = require("cheerio");

function getValue(element, selector = "span:nth-child(1)") {
	return cheerio
		.load("")(element)
		.find(selector)
		.text()
		.replace(/(\s|,)/g, "");
}

function parseDataByTotal(response, type) {
	const $ = cheerio.load(response.data.toString());
	let state = {};

	state.total = getValue(
		$(".content-inner > div:nth-child(7) > div:nth-child(2)")
	);
	state.deaths = getValue(
		$(".content-inner > div:nth-child(9) > div:nth-child(2)")
	);
	state.recovered = getValue(
		$(".content-inner > div:nth-child(10) > div:nth-child(2)")
	);
	state.active = getValue(
		$(
			"div.col-md-6:nth-child(14) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)"
		),
		".number-table-main"
	);

	if (type === "json") {
		return state;
	} else {
		return `${state.total}|${state.recovered}`;
	}
}

function parseDataByCountry(response, type, country) {
	const $ = cheerio.load(response.data.toString());
	let state = {};

	$("#main_table_countries_today > tbody")
		.children()
		.each((i, tr) => {
			if (
				$(tr)
					.find("td:nth-child(1)")
					.text()
					.replace(" ", "") === country
			) {
				state = {
					country: getValue(tr, "td:nth-child(1)"),
					cases: {
						total: getValue(tr, "td:nth-child(2)"),
						new:
							getValue(tr, "td:nth-child(3)") !== ""
								? getValue(tr, "td:nth-child(3)")
								: "0",
						active: getValue(tr, "td:nth-child(7)")
					},
					deaths: {
						total: getValue(tr, "td:nth-child(4)"),
						today:
							getValue(tr, "td:nth-child(5)") !== ""
								? getValue(tr, "td:nth-child(5)")
								: "0"
					},
					recovered: getValue(tr, "td:nth-child(6)")
				};
			}
		});

	if (type === "json") {
		return state;
	} else {
		return `${state.cases.total} ${state.cases.new} ${state.deaths.total} ${state.recovered}`;
	}
}
module.exports = { parseDataByTotal, parseDataByCountry };
