"use strict";
const Hapi = require("@hapi/hapi");
const { parseDataByTotal, parseDataByCountry } = require("./parser");
const axios = require("axios");
const url = "https://www.worldometers.info/coronavirus/#countries";

const init = async () => {
	const server = Hapi.server({
		port: 3000
	});

	server.route({
		method: "GET",
		path: "/",
		handler: (request, h) => {
			return "Hello world";
		}
	});

	server.route({
		method: "GET",
		path: "/covid-19",
		handler: (request, h) => {
			return axios.get(url).then(response => {
				const type = request.query.type;
				const country = request.query.country;

				if (country) {
					return parseDataByCountry(response, type, country);
				} else {
					return parseDataByTotal(response, type);
				}
			});
		}
	});

	await server.start();
	console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", err => {
	console.log(err);
	process.exit(1);
});

init();
