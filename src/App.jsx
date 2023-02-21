import Navbar from "./components/Navbar";
import Copyright from "./components/Copyright";
import FilmSlider from "./components/FilmSlider";
import Footer from "./components/Footer";
import Genres from "./components/Genres";
import HomeSlider from "./components/HomeSlider";
import Trending from "./components/Trending";
import MovieDetail from "./components/MovieDetail";
import logo from "/popcorn.png";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useEffect } from "react";
import Search from "./components/Search";
import { IonIcon } from "@ionic/react";
import * as Icons from "ionicons/icons";

const App = () => {
  return (
    <Router>
      <div id="app" className="bg-base-dark-gray min-h-screen text-white">
        <Copyright />
        <div id="website">
          <Navbar logo={logo} />
          <main className="pb-8">
            <Switch>
              <Route exact path="/">
                <HomeSlider />
                <section id="genres">
                  <Genres />
                </section>
                <section id="popular">
                  <FilmSlider title="Popular Now" apiUrl="/movie/popular" />
                </section>
                <section id="trending">
                  <Trending />
                </section>
                <section id="topRated">
                  <FilmSlider title="Top Rated" apiUrl="/movie/top_rated" />
                </section>
              </Route>
              <Route
                path="/movies/:id"
                render={({ match }) => <MovieDetail id={match.params.id} />}
              />
              <Route path="/search">
                <Search />
              </Route>
            </Switch>
          </main>
          <footer>
            <Footer />
          </footer>
        </div>
      </div>
    </Router>
  );
};

export default App;
