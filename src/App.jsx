import Copyright from "./components/Copyright";
import FilmSlider from "./components/FilmSlider";
import Footer from "./components/Footer";
import Genres from "./components/Genres";
import HomeSlider from "./components/HomeSlider";
import Trending from "./components/Trending";
import MovieDetail from "./components/MovieDetail";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div id="app" className="bg-base-dark-gray min-h-screen text-white">
        <Copyright />
        <div id="website">
          <nav>
            <h1 className="sr-only">Popcorn Prespective</h1>
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
                path="/:id"
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
