import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

const ExerciseTable = props => {
  console.log(props);
  const exercise = props.exercises[0];
  return (
    <div>
      <h1>{exercise.title.rendered}</h1>
      <div>{exercise.content.rendered}</div>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/rT7DgCr-3pg"
        allowfullscreen
      />

      <h2>Primary Muscle: {exercise.acf.exercise_primary_muscle[0].name} </h2>
      <h2>Secondary Muscle: {exercise.acf.exercise_secondary_muscle[0]}</h2>
      <h2>Equipment: {exercise.acf.exercise_equipment[0].name} </h2>
      <h2>Diffifculty Rating: {exercise.acf.exercise_difficulty[0]}</h2>
      <h2>
        Alternative Exercises: {exercise.acf.exercise_alternative_exercise[0]}{" "}
      </h2>
    </div>
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
    //console.log(window.location.subst(window.location.lastIndexOf("/") + 1));
    const self = this;
    const request = axios(
      "http://wpworkoutlog.localhost/wp-json/wp/v2/exercise?slug=bench-press"
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
    <h1>React Exercise Detail</h1>
    <Exercises />
  </div>,
  document.getElementById("exerciseDetail")
);

module.hot.accept();
