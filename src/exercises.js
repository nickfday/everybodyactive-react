import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

const ExerciseRow = props => {
  return (
    <tr>
      <td>
        <a href={props.exercise.slug}>{props.exercise.slug}</a>
      </td>
      <td>{props.exercise.acf.exercise_primary_muscle[0].name}</td>
      <td />
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
          <ExerciseRow exercise={exercise} />
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
      loaded: false
    };
  }

  fetchExercises() {
    const self = this;
    const request = axios(
      "http://wpworkoutlog.localhost/wp-json/wp/v2/exercise"
    ).then(function(response) {
      self.setState({
        exercises: response.data,
        loaded: true
      });
      console.log(response.data);
    });
  }

  componentDidMount() {
    this.fetchExercises();
  }

  render() {
    if (this.state.loaded) {
      return <ExerciseTable exercises={this.state.exercises} />;
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
