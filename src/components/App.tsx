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
				cryptocurrencies: json.map((x: any) => ({ id: x.id, name: x.name, market_cap_usd: parseInt(x.market_cap_usd), volume: x["24h_volume_usd"], rank: x.rank }))
				// tslint:disable-next-line:align
			}, () => this.renderFlowers()));
	}

	renderFlowers = () => {
		// const flowerSize = 250;
		const coins = this.state.cryptocurrencies;

		// Amount of petals
		const numPetalsScale = d3.scaleQuantize().range(_.range(3, 7));
		const numPetalsExtent = d3.extent(coins, d => d.volume);
		numPetalsScale.domain(numPetalsExtent as any);

		// Size of flowers
		const sizeScale = d3.scaleLinear().range([0.1, 1.2]);
		const sizeExtend = d3.extent(coins, d => d.market_cap_usd);
		sizeScale.domain(sizeExtend as any);

		console.log(d3.extent(coins, d => d.market_cap_usd));

		coins.forEach((x, index) => {
			// grab svg = 
			const svg = d3.select(`#coin-${x.id}`);

			// 2. create petal data for just the first movie
			const numPetals = numPetalsScale(coins[index].volume);
			const petalData = _.times(numPetals, (i) => {
				// 1. rotation of the petal
				const rotate = (i / numPetals) * 360;
				// 2. path of petal (pg)
				// 3. size of petals (IMDB ratings)
				console.log(sizeScale(coins[index].market_cap_usd), coins[index].name);
				return {
					rotate,
					path: petalPaths,
					size: sizeScale(coins[index].market_cap_usd),
				};
			});

			svg.selectAll("path")
				.data(petalData).enter().append("path")
				.attr("transform", d => {
					return `translate(125,125)rotate(${d.rotate})scale(${d.size})`;
				})
				.attr("d", d => d.path as any)
				.attr("fill", "none")
				.attr("stroke", "#000")
				.attr("stroke-width", d => 1 / d.size);
		});

	}

	render() {
		const coins = this.state.cryptocurrencies;

		return (
			<div className="App">
				<header className="page-header">
					cryptoflowers
				</header>

				<div className="sub-header">top 100 crypto currencies reimagined as flowers</div>
				{/* <svg /> */}
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
