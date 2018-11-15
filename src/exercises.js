import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class ExerciseDetail extends React.Component {
  constructor(props) {
    super();
    this.state = {
      exercise: [],
      loaded: false
    };
  }

  componentDidUpdate() {
    const self = this;
    const slug = this.props.match.params.id;
    const requestExerciseDetail = axios(
      `http://wpworkoutlog.localhost/wp-json/wp/v2/exercise?slug=${slug}`
    ).then(function(response) {
      self.setState({
        exercise: response.data,
        loaded: true
      });
      console.log(response.data);
    });
  }

  render() {
    if (this.state.loaded) {
      return <div>{this.state.exercise[0].title.rendered}</div>;
    } else {
      return (
        <div>
          <div>Loading</div>
        </div>
      );
    }
  }
}

const ExerciseSingle = props => {
  console.log(props);
  const exercise = props.exerciseDetail[0];
  if (exercise) {
    return (
      <div>
        <h1>Exercise Single</h1>
        <h2>{exercise.title.rendered}</h2>
        <div>{exercise.content.rendered}</div>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/rT7DgCr-3pg"
          allowfullscreen
        />

        <h2>Primary Muscle: {exercise.acf.exercise_primary_muscle[0].name} </h2>
        <h2>Equipment: {exercise.acf.exercise_equipment[0].name} </h2>

        <h2>
          Secondary Muscle: {exercise.acf.exercise_secondary_muscle[0].name}
        </h2>

        <h2>Diffifculty Rating: {exercise.acf.exercise_difficulty[0]}</h2>
        <h2>
          Alternative Exercises:{" "}
          {exercise.acf.exercise_alternative_exercise[0].post_title}
        </h2>
      </div>
    );
  } else {
    return <div />;
  }
};

const ExerciseRow = props => {
  console.log(props);
  return (
    <tr>
      <td>
        {/* <Link to={`?exercise=${props.exercise.slug}`}>About</Link> */}
        <Link
          to={{
            pathname: props.exercise.slug,
            search: "?exercise=bench-press",
            state: { exerciseDetail: props.exerciseDetail }
          }}
          onClick={e => props.fetchExerciseDetail(props.exercise.slug)}
        >
          {props.exercise.slug}
        </Link>

        {/* <a href={`?exercise=${props.exercise.slug}`}>{props.exercise.slug}</a> */}
      </td>
      <td>{props.exercise.acf.exercise_primary_muscle[0].name}</td>
      <td>
        {props.exercise.acf.exercise_equipment.map(function(equipment, i) {
          if (props.exercise.acf.exercise_equipment.length === i + 1) {
            return equipment.name;
          } else {
            return equipment.name + ", ";
          }
        })}
      </td>
    </tr>
  );
};

const ExerciseTable = props => {
  return (
    <table>
      <thead>
        <th>Title</th>
        <th>Primary Muscle</th>
        <th>Equipment</th>
      </thead>
      <tbody>
        {props.exercises.map(exercise => (
          <ExerciseRow
            exercise={exercise}
            fetchExerciseDetail={props.fetchExerciseDetail}
            exerciseDetail={props.exerciseDetail}
          />
        ))}
      </tbody>
    </table>
  );
};

class Exercises extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      exerciseDetail: [],
      loaded: false
    };
    this.fetchExerciseDetail = this.fetchExerciseDetail.bind(this);
  }

  fetchExerciseDetail(slug) {
    console.log("hit it");
    const self = this;
    console.log(slug);
    const requestExerciseDetail = axios(
      `http://wpworkoutlog.localhost/wp-json/wp/v2/exercise?slug=${slug}`
    ).then(function(response) {
      self.setState({
        exerciseDetail: response.data
      });
      console.log(response.data);
    });
  }

  fetchExercises() {
    const self = this;
    // get url params
    const urlParams = new URLSearchParams(window.location.search);
    const exerciseDetailParam = urlParams.get("exercise");

    const requestExercises = axios(
      "http://wpworkoutlog.localhost/wp-json/wp/v2/exercise"
    ).then(function(response) {
      self.setState({
        exercises: response.data,
        loaded: true
      });
      console.log(response.data);
    });

    // if (exerciseDetailParam) {
    //   const requestExerciseDetail = axios(
    //     `http://wpworkoutlog.localhost/wp-json/wp/v2/exercise?slug=${exerciseDetailParam}`
    //   ).then(function(response) {
    //     self.setState({
    //       exerciseDetail: response.data
    //     });
    //     console.log(response.data);
    //   });
    // }
  }

  componentDidMount() {
    this.fetchExercises();
  }

  render() {
    let params = new URLSearchParams(location.search);

    if (this.state.loaded) {
      return (
        <Router>
          <div>
            <ExerciseTable
              exercises={this.state.exercises}
              fetchExerciseDetail={this.fetchExerciseDetail}
              exerciseDetail={this.state.exerciseDetail}
            />

            <Route
              path="/:id"
              component={ExerciseDetail}
              exercise={this.state.exerciseDetail}
            />
          </div>
        </Router>
      );
    } else {
      return <div>Loading...</div>;
    }
  }
}

ReactDOM.render(
  <div>
    <h1>React Exercises</h1>
    <Exercises />
  </div>,
  document.getElementById("exercises")
);

module.hot.accept();
