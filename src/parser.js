const fs = require("fs");
const cheerio = require("cheerio");

function getValue(element, selector) {
	return cheerio
		.load("")(element)
		.find(selector)
		.text()
		.replace(/(\s|,)/g, "")
}

function parseData(response, country, type) {
	const $ = cheerio.load(response.data.toString());
	const datatime = new Date()
		.toJSON()
		.slice(0, 19)
		.replace(/[-T]/g, ":");
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
module.exports = parseData;
// fs.writeFileSync("./covid.log", log, { encoding: "utf8", flag: "w" });
