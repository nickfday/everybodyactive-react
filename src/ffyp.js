import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Loader from "react-loader";
import "normalize.css";
import "./style/ffyp.scss";

function createMarkup(markup) {
  return { __html: markup };
}

const FindOutMore = props => {
  const backgroundStyle = {
    backgroundImage:
      "url(" + props.media.media_details.sizes.medium_large.source_url + ")"
  };
  return (
    <div style={backgroundStyle} className="find-out-more">
      <a href="/contact">
        <h2
          className="title"
          dangerouslySetInnerHTML={createMarkup(props.media.caption.rendered)}
        />
      </a>
    </div>
  );
};

const ActivityBody = props => {
  const status = String(props.activity.selected);

  return (
    <div
      class={`activity-body-wrapper index-${props.index} ${
        props.isSelected ? "shown" : "hidden"
      }`}
    >
      <div className="activeIcon" />
      <div className="activity-body">
        <div dangerouslySetInnerHTML={createMarkup(props.body)} />
      </div>
    </div>
  );
};

const Activity = props => {
  const backgroundStyle = {
    backgroundImage: "url(" + props.activity.ffyp_image.sizes.medium_large + ")"
  };

  let isSelected = props.selectedItem == props.index;

  return (
    <div>
      <div
        className={`activity ${isSelected ? "shown" : "hidden"}`}
        key={props.index}
        onClick={() => props.toggleBody(props.index)}
      >
        <div class="activity-content" style={backgroundStyle}>
          <h2 class="title">{props.activity.ffyp_title}</h2>
        </div>
        {/* <div>Title: {props.activity.ffyp_body}</div> */}
        {/* <img src={props.activity.ffyp_image.sizes.medium_large} /> */}
      </div>
      <ActivityBody
        activity={props.activity}
        body={props.activity.ffyp_body}
        index={props.index}
        selectedItem={props.selectedItem}
        isSelected={isSelected}
      />
    </div>
  );
};

const Classes = props => {
  const activities = props.classes[0];
  const activity = Object.values(activities.acf).map((activity, index) => {
    return (
      <Activity
        activity={activity}
        index={index}
        bodyOpen={props.bodyOpen}
        toggleBody={props.toggleBody}
        selectedItem={props.selectedItem}
      />
    );
  });
  return (
    <div>
      <h1>{activities.title.rendered}</h1>
      <div
        dangerouslySetInnerHTML={createMarkup(activities.content.rendered)}
      />
      <div className="activity-wrapper">{activity}</div>
    </div>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: [],
      loaded: false,
      bodyOpen: false,
      selectedItem: null
    };
    this.toggleBody = this.toggleBody.bind(this);
  }

  toggleBody(id) {
    this.setState(state => ({
      selectedItem: id
    }));
  }

  fetchData() {
    const self = this;
    const baseUrl = site.base_url;

    const requestExercises = axios(
      baseUrl + "/wp-json/wp/v2/pages?_embed&slug=fitness-for-young-people"
    ).then(function(response) {
      self.setState({
        classes: response.data,
        loaded: true
      });
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    if (this.state.loaded) {
      return (
        <div class="app-wrapper">
          <Classes
            classes={this.state.classes}
            bodyOpen={this.state.bodyOpen}
            toggleBody={this.toggleBody}
            selectedItem={this.state.selectedItem}
          />
          <FindOutMore
            media={this.state.classes[0]._embedded["wp:featuredmedia"][0]}
          />
        </div>
      );
    } else {
      return <Loader />;
    }
  }
}

ReactDOM.render(
  <div>
    <App />
  </div>,
  document.getElementById("ffyp-entry")
);

module.hot.accept();
