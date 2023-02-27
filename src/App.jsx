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
import MovieDetail from "./components/MovieDetail";
import Search from "./components/Search";

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
                <HomeSlider apiUrl="/discover/movie" />
                <section id="genres">
                  <Genres />
                </section>
                <section id="nowPlaying">
                  <FilmSlider title="Now Playing" apiUrl="/movie/now_playing" />
                </section>
                <section id="trending">
                  <Trending apiUrl={`/trending/movie/day`} />
                </section>
                <section id="topRated">
                  <FilmSlider title="Top Rated" apiUrl="/movie/top_rated" />
                </section>
              </Route>
              <Route exact path="/search">
                <Search apiUrl={`/movie/now_playing`} />
              </Route>
              <Route
                path="/movies/:id"
                render={({ match }) => <MovieDetail id={match.params.id} />}
              />

              {/* TV Series */}
              <Route exact path="/tv">
                <HomeSlider apiUrl="/discover/tv" />
                <section id="onTheAir">
                  <FilmSlider title="On The Air" apiUrl="/tv/on_the_air" />
                </section>
                <section id="trending">
                  <Trending apiUrl="/trending/tv/day" />
                </section>
                <section id="topRated">
                  <FilmSlider title="Top Rated" apiUrl="/tv/top_rated" />
                </section>
              </Route>
              <Route path="/tv/search">
                <Search apiUrl={`/tv/airing_today`} />
              </Route>
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
      </div>
    </Router>
  );
};

export default App;
