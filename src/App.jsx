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
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Router>
      <div id="app" className="bg-base-dark-gray min-h-screen text-white">
        <div id="website">
          <Navbar logo={logo} />
          <main className="pb-8">
            <Switch>
              <Route exact path="/">
                <HomeSlider apiUrl="/discover/movie" />
                {/* <section id="genres">
                  <Genres />
                </section> */}
                <section id="nowPlaying" className="pt-[2rem]">
                  <FilmSlider title="Now Playing" apiUrl="/movie/now_playing" />
                </section>
                <section id="upcoming">
                  <FilmSlider
                    title="Upcoming"
                    apiUrl="/movie/upcoming"
                    apiUpcoming={today}
                  />
                </section>
                <section id="trending">
                  <Trending apiUrl={`/trending/movie/day`} />
                </section>
                <section className="pt-[2rem]">
                  <FilmSlider
                    title="Marvel Studios"
                    apiUrl="/discover/movie"
                    companies="420"
                  />
                </section>
                <section>
                  <FilmSlider
                    title="DC Comics"
                    apiUrl="/discover/movie"
                    companies="429"
                  />
                </section>
                <section>
                  <FilmSlider
                    title="Walt Disney Pictures"
                    apiUrl="/discover/movie"
                    companies="2"
                  />
                </section>
                <section>
                  <FilmSlider
                    title="Universal Pictures"
                    apiUrl="/discover/movie"
                    companies="33"
                  />
                </section>
                <section>
                  <FilmSlider
                    title="Paramount Pictures"
                    apiUrl="/discover/movie"
                    companies="4"
                  />
                </section>
                <section>
                  <FilmSlider
                    title="20th Century Studios"
                    apiUrl="/discover/movie"
                    companies="25"
                  />
                </section>
                <section>
                  <FilmSlider
                    title="Pixar Animation Studios"
                    apiUrl="/discover/movie"
                    companies="3"
                  />
                </section>
                <section>
                  <FilmSlider
                    title="Action"
                    apiUrl="/discover/movie"
                    apiGenres={`28`}
                  />
                </section>
                <section>
                  <FilmSlider
                    title="Drama"
                    apiUrl="/discover/movie"
                    apiGenres={`18`}
                  />
                </section>
                <section>
                  <FilmSlider
                    title="Comedy"
                    apiUrl="/discover/movie"
                    apiGenres={`35`}
                  />
                </section>
                <section>
                  <FilmSlider
                    title="Mystery"
                    apiUrl="/discover/movie"
                    apiGenres={`9648`}
                  />
                </section>
                <section>
                  <FilmSlider
                    title="Romance"
                    apiUrl="/discover/movie"
                    apiGenres={`10749`}
                  />
                </section>
                <section>
                  <FilmSlider
                    title="Horror"
                    apiUrl="/discover/movie"
                    apiGenres={`27`}
                  />
                </section>
                <section>
                  <FilmSlider
                    title="Science Fiction"
                    apiUrl="/discover/movie"
                    apiGenres={`878`}
                  />
                </section>
                <section id="topRated">
                  <FilmSlider title="Top Rated" apiUrl="/movie/top_rated" />
                </section>
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
