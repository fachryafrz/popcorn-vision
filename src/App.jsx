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
          <nav className="sticky top-0 z-50 bg-base-dark-gray">
            <h1 className="sr-only">Popcorn Prespective</h1>
            <div className="max-w-7xl mx-auto py-2 px-6 flex flex-wrap justify-between">
              <Link
                to="/"
                className="flex gap-2 items-center font-semibold tracking-wide leading-none max-w-fit"
              >
                <figure className="aspect-square w-[50px] border-r pr-2">
                  <img src={logo} alt="Popcorn Prespective" />
                </figure>
                <span>
                  Popcorn <br />
                  Prespective
                </span>
              </Link>
              <Link
                to="/search"
                className="flex gap-2 items-center bg-base-gray bg-opacity-20 self-center p-2 sm:px-4 rounded-lg hover:bg-opacity-40 transition-all hover:scale-105 active:scale-100 ml-auto"
              >
                <IonIcon icon={Icons.search} className="text-[1.25rem]" />
                <span className="hidden sm:block">Search</span>
              </Link>
            </div>
          </nav>
          <main className="pb-8">
            <Switch>
              <Route exact path="/">
                <HomeSlider />
                <section id="genres">
                  <Genres />
                </section>
                <section id="popular">
                  <FilmSlider title="Popular Now" />
                </section>
                <section id="trending">
                  <Trending />
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
