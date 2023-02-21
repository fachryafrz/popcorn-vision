import logo from "/popcorn.png";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// Movies
import Navbar from "./components/movies/Navbar";
import Copyright from "./components/movies/Copyright";
import FilmSlider from "./components/movies/FilmSlider";
import Footer from "./components/movies/Footer";
import Genres from "./components/movies/Genres";
import HomeSlider from "./components/movies/HomeSlider";
import Trending from "./components/movies/Trending";
import MovieDetail from "./components/movies/MovieDetail";
import Search from "./components/movies/Search";

// TV
import TVNavbar from "./components/tv/Navbar";
import TVCopyright from "./components/tv/Copyright";
import TVFilmSlider from "./components/tv/FilmSlider";
import TVFooter from "./components/tv/Footer";
import TVGenres from "./components/tv/Genres";
import TVHomeSlider from "./components/tv/HomeSlider";
import TVTrending from "./components/tv/Trending";
import TVMovieDetail from "./components/tv/MovieDetail";
import TVSearch from "./components/tv/Search";

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
                <HomeSlider apiUrl="/movie/popular" />
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
              <Route exact path="/search">
                <Search />
              </Route>
              <Route
                path="/movies/:id"
                render={({ match }) => <MovieDetail id={match.params.id} />}
              />

              {/* TV Series */}
              <Route exact path="/tv">
                <TVHomeSlider apiUrl="/tv/popular" />
                <section id="popular">
                  <TVFilmSlider title="Top Rated" apiUrl="/tv/popular" />
                </section>
                <section id="trending">
                  <TVTrending apiUrl="/discover/tv" />
                </section>
                <section id="popular">
                  <TVFilmSlider
                    title="New Releases"
                    apiUrl="/discover/tv"
                    releasedYear={new Date().getFullYear() - 1}
                  />
                </section>
              </Route>
              <Route path="/tv/search">
                <TVSearch />
              </Route>
              <Route
                path="/tv/:id"
                render={({ match }) => <TVMovieDetail id={match.params.id} />}
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
