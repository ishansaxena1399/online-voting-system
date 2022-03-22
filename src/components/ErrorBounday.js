import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false
    };
  };

  static getDerivedStateFromError(error) {
    console.log('ui error -> ', error);
    return { hasError: true };
  }

  render() {
    if(this.state.hasError) {
      return (
        <div>
          <p>
            Oops! Something broke..
          </p>
        </div>
      )
    }

    return this.props.children;
  }
};

export default ErrorBoundary