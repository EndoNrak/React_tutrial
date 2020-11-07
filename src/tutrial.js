import './tutrial.css'
import React from 'react';
// import ReactDOM from 'react-dom';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.SquareNum = 0;
    }

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderSquareRow(){
        var SquareRow = [];
        for(let i=0; i<3; i++){
            SquareRow = SquareRow.concat(this.renderSquare(this.SquareNum));
            this.SquareNum ++;
        }
        return(
            <div className="board-row">
                {SquareRow}
            </div>
        );
    }

    render() {
        var Board = [];
        this.SquareNum=0;
        for(let i=0; i<3; i++){
            Board = Board.concat(this.renderSquareRow());
        }
        return (
            <div>
                {Board}
            </div>
        );
    }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null), 
          column_number: null
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      IsListAsc: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          column_number: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  getOrderedMoves(){
    var history = this.state.history;
    if(!this.state.IsListAsc){
        history = history.slice().reverse();
        const moves = history.map((step, move) => {
            move = history.length - move -1;
            console.log(move);
            const desc = move ?
            'Go to move #' + move + '(' + (step.column_number%3 + 1) + ', '+ (Math.floor(step.column_number/3)+1) +')' :
            'Go to game start';
            if(this.state.stepNumber===move){
                return (
                    <li key={move}>
                        <button className="active" onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                );
            }
            else{
                return(
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                );
            }});
        return (moves);
    }
    else{
        const moves = history.map((step, move) => {
            console.log(move);
            const desc = move ?
            'Go to move #' + move + '(' + (step.column_number%3 + 1) + ', '+ (Math.floor(step.column_number/3)+1) +')' :
            'Go to game start';
            if(this.state.stepNumber===move){
                return (
                    <li key={move}>
                        <button className="active" onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                );
            }
            else{
                return(
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                );
            }});
        return (moves);
    }
  }


  handleIsAscClick(){
    this.setState(
        {IsListAsc: !this.state.IsListAsc}
    );
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = this.getOrderedMoves();

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    let order = this.state.IsListAsc ?"ASC" : "DESC";

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.handleIsAscClick()}>{order}</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

export default Game;

// ========================================

// ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
