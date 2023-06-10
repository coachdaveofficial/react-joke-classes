import React from "react";
import axios from "axios";
import JokeClass from "./JokeRefactor";
import "./JokeList.css";

class JokeListClass extends React.Component {
    static defaultProps = {
        numJokesToGet: 10
    };

    constructor(props) {
        super(props);
        this.state = { jokes: [] };
        this.getJokes = this.getJokes.bind(this);
        this.generateNewJokes = this.generateNewJokes.bind(this);
        this.vote = this.vote.bind(this);
    }

    componentDidMount() {
        if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
    }

    componentDidUpdate() {
        if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
      }

    async getJokes() {
        const { numJokesToGet } = this.props;
        let { jokes } = this.state;
        let j = [...jokes];
        let seenJokes = new Set();
        try {
            while (j.length < numJokesToGet) {
                let res = await axios.get("https://icanhazdadjoke.com", {
                    headers: { Accept: "application/json" }
                });
                let { status, ...jokeObj } = res.data;

                if (!seenJokes.has(jokeObj.id)) {
                    seenJokes.add(jokeObj.id);
                    j.push({ ...jokeObj, votes: 0 });
                } else {
                    console.error("duplicate found!");
                }
            }
            this.setState({ jokes: j });
        } catch (e) {
            console.log(e);
        }
    }

    generateNewJokes() {
        this.setState({ jokes: [] });
    }

    vote(id, delta) {
        this.setState(prevState => ({
            jokes: prevState.jokes.map(j =>
                j.id === id ? { ...j, votes: j.votes + delta } : j)
        }));
    }
    render() {
        const { jokes } = this.state;
        if (jokes.length) {
            let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
            return (
                <div className="JokeList">
                    <button className="JokeList-getmore" onClick={this.generateNewJokes}>
                        Get New Jokes
                    </button>

                    {sortedJokes.map(j => (
                        <JokeClass text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
                    ))}
                </div>
            );
        }
        return null

    }
}

export default JokeListClass;
