import logo from "/popcorn.png";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// Movies
import Navbar from "./components/Navbar";
import Copyright from "./components/Copyright";
import FilmSlider from "./components/FilmSlider";
import Footer from "./components/Footer";
import Genres from "./components/Genres";
import HomeSlider from "./components/HomeSlider";
import Trending from "./components/Trending";
import MovieDetail from "./pages/MovieDetail";
import Search from "./pages/Search";
import HomeMovies from "./pages/HomeMovies";
import HomeTVShows from "./pages/HomeTVShows";
import ReactGA from "react-ga";

GA_TRACKING_ID = "UA-275172584-1";
ReactGA.initialize(GA_TRACKING_ID);

const App = () => {
  const today = new Date().toISOString().slice(0, 10);
  const thisYear = new Date().getFullYear();

  return (
    <Router>
      <div id="app" className="bg-base-dark-gray min-h-screen text-white">
        <div id="website">
          <Navbar logo={logo} />
          <main className="pb-8">
            <Switch>
              <Route exact path="/">
                <HomeMovies today={today} thisYear={thisYear} />{" "}
              </Route>
              <Route exact path="/search">
                <Search apiUrl={`/movie/now_playing`} />
              </Route>
              <Route
                exact
                path="/search/:query"
                render={({ match }) => (
                  <Search
                    apiUrl={`/movie/now_playing`}
                    query={match.params.query}
                  />
                )}
              />
              <Route
                path="/movies/:id"
                render={({ match }) => <MovieDetail id={match.params.id} />}
              />

              {/* TV Series */}
              <Route exact path="/tv">
                <HomeTVShows today={today} thisYear={thisYear} />{" "}
              </Route>
              <Route exact path="/tv/search">
                <Search apiUrl={`/tv/airing_today`} />
              </Route>
              <Route
                exact
                path="/tv/search/:query"
                render={({ match }) => (
                  <Search
                    apiUrl={`/movie/now_playing`}
                    query={match.params.query}
                  />
                )}
              />
              <Route
                path="/tv/:id"
                render={({ match }) => <MovieDetail id={match.params.id} />}
              />
            </Switch>
          </main>
          <footer>
            <Footer />
          </footer>
        </div>
        <Copyright />
      </div>
    </Router>
  );
};

export default App;
