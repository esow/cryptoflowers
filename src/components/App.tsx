import * as React from "react";
import { Grid } from "semantic-ui-react";
import "./App.css";
import CryptoCurrency from "../models/CryptoCurrency";

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
			}));
	}

	render() {
		return (
			<div className="App">
				<header className="page-header">
					cryptoflowers
				</header>

				<div className="sub-header">top crypto currencies reimagined as flowers</div>

				<Grid textAlign="center">
					{
						this.state.cryptocurrencies.map((coin: CryptoCurrency) => (
							<Grid.Row columns={3}>
								<Grid.Column>
									{coin.name}
								</Grid.Column>
								<Grid.Column>
									{coin.price_usd}
								</Grid.Column>
								<Grid.Column>
									{coin.rank}
								</Grid.Column>
							</Grid.Row>
						))
					}
				</Grid>
			</div>
		);
	}
}
