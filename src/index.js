"use strict";
const Hapi = require("@hapi/hapi");
const parseData = require("./parser");
const axios = require("axios");
const url = "https://www.worldometers.info/coronavirus/#countries";

const init = async () => {
	const server = Hapi.server({
		port: 3000,
		host: "localhost"
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
		path: "/covid-19.log",
		handler: (request, h) => {
			const country = request.query.country;
			return axios.get(url).then(response => {
				return parseData(response, country, "log");
			});
		}
	});

	server.route({
		method: "GET",
		path: "/covid-19.json",
		handler: (request, h) => {
			return axios.get(url).then(response => {
				const country = request.query.country;
				return parseData(response, country, "json");
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
