import * as React from "react";
import "./App.css";
import CryptoCurrency from "../models/CryptoCurrency";
import { petalPaths } from "../models/PentalPath";
import * as d3 from "d3";
import * as _ from "lodash";

export interface AppProps {
}
export interface AppState {
	cryptocurrencies: CryptoCurrency[];
}

export default class App extends React.Component<AppProps, AppState> {

	constructor(props: AppProps) {
		super(props);
		this.state = { cryptocurrencies: [] };
	}

	componentWillMount() {
		fetch("https://api.coinmarketcap.com/v1/ticker/")
			.then(res => res.json())
			.then(json => this.setState({
				cryptocurrencies: json
				// tslint:disable-next-line:align
			}, () => this.renderFlowers()));
	}

	renderFlowers = () => {
		const coins = this.state.cryptocurrencies;

		// instantiate scales and petal path lookup
		const sizeScale = d3.scaleLinear()
			.range([0.1, 1]);
		const numPetalsScale = d3.scaleQuantize()
			.range(_.range(3, 10));

		// grab svg
		const svg = d3.select(" svg");

		const sizeExtent = d3.extent(coins, d => Math.abs(+d.market_cap_usd));

		// amount of petals
		var minMarketCap = d3.min(coins, d => d.market_cap_usd);
		var maxMarketCap = d3.max(coins, d => d.market_cap_usd);
		numPetalsScale.domain([minMarketCap, maxMarketCap] as any);
		// http://bl.ocks.org/sxywu/raw/d612c6c653fb8b4d7ff3d422be164a5d/ <-- Use this to calculate proper amout of petals based on total marketcap
		// set domain on scales
		sizeScale.domain(sizeExtent as any);

		// 2. create a <g> for each flower
		// and translate+scale the whole flower
		// instead of individual petals
		const flowers = svg.selectAll("g")
			.data(coins).enter().append("g")
			.attr("transform", (d, i) => {
				const x = (i % 3 + 0.5) * 200;
				const y = (Math.floor(i / 3) + 0.5) * 200;
				const scale = sizeScale(Math.abs(+d.market_cap_usd));
				return `translate(${x},${y})scale(${scale})`;
			});

		const petals = flowers.selectAll("path")
			.data(d => {
				const numPetals = numPetalsScale(Math.abs(+d.percent_change_24h));
				return _.times(numPetals, i => {
					return {
						rotate: (i / numPetals) * 360,
						path: petalPaths,
						color: d3.interpolateRainbow(i / numPetals),
					};
				});
			}).enter().append("path")
			.attr("transform", d => `rotate(${d.rotate})`)
			.attr("d", d => d.path as any)
			.attr("fill", d => d.color)
			.attr("stroke-width", 12)
			.style("mix-blend-mode", "multiply");

		console.log(petals);
	}

	render() {
		const coins = this.state.cryptocurrencies;
		const coins10 = coins.slice(0, 6);

		return (
			<div className="App">
				<header className="page-header">
					cryptoflowers
				</header>

				<div className="sub-header">top 100 crypto currencies reimagined as flowers</div>
				<svg />
				<div className="titles">
					{
						coins10.map((coin: CryptoCurrency) => (
							<div className="title">{coin.name}</div>
						))
					}
				</div>
			</div>
		);
	}
}
