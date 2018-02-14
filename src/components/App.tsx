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
				// tslint:disable-next-line:radix
				cryptocurrencies: json.map((x: any) => ({ id: x.id, name: x.name, market_cap_usd: parseInt(x.market_cap_usd), volume: parseInt(x["24h_volume_usd"]), rank: x.rank }))
				// tslint:disable-next-line:align
			}, () => this.renderFlowers()));
	}

	renderFlowers = () => {
		const coins = this.state.cryptocurrencies;

		// Amount of petals
		const numPetalsScale = d3.scaleQuantize().range(_.range(3, 15));
		const numPetalsExtent = d3.extent(coins, d => d.volume);
		numPetalsScale.domain(numPetalsExtent as any);

		// Size of flowers
		const sizeScale = d3.scaleLinear().range([0.1, 1.2]);
		const sizeExtend = d3.extent(coins, d => d.market_cap_usd);
		sizeScale.domain(sizeExtend as any);

		console.log(d3.extent(coins, d => d.market_cap_usd));

		coins.forEach((x, index) => {
			const svg = d3.select(`#coin-${x.id}`);

			const numPetals = numPetalsScale(coins[index].volume);
			const petalData = _.times(numPetals, (i) => {
				const rotate = (i / numPetals) * 360;
				return {
					rotate,
					path: petalPaths,
					size: sizeScale(coins[index].market_cap_usd),
					color: d3.interpolateRainbow(i / numPetals),
					name: coins[index].id
				};
			});

			svg.selectAll("path")
				.data(petalData).enter().append("path")
				.attr("transform", d => {
					return `translate(125,125)rotate(${d.rotate})scale(${d.size})`;
				})
				.attr("d", d => d.path as any)
				.attr("fill", d => d.color)
				.attr("stroke", "#333")
				.attr("stroke-width", d => 1 / d.size)
				.style("mix-blend-mode", "multiply")
				.on("click", d => window.open(`https://coinmarketcap.com/currencies/${d.name}/`));
		});

	}

	render() {
		const coins = this.state.cryptocurrencies;

		return (
			<div className="App">
				<header className="page-header">
					cryptoflowers
				</header>

				<div className="sub-header">Top 100 crypto currencies reimagined as flowers</div>
				<div>Size symbolizes market cap</div>
				<div>Number of petals symbolizes 24 hour volume</div>

				<div className="coins">
					{
						coins.map((coin: CryptoCurrency) => (
							<div className={`coin ${coin.name}`}><svg id={`coin-${coin.id}`} /></div>
						))
					}
				</div>
				<div className="titles">
					{
						coins.map((coin: CryptoCurrency) => (
							<div className="title">{coin.name}</div>
						))
					}
				</div>
			</div>
		);
	}
}
