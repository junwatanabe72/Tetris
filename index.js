const width = 12;
const w = width;
//端っこ判定
const height = 21;
const speed = 20;
//ブロックのある升目を記録
let fills = [];
let cells = document.getElementsByTagName("td");

//テトリスブロックのデータを保管するオブジェクト
const blocks = [
  {
    color: "cyan",
    angles: [
      [-1, 1, 2],
      [-w, w, 2 * w],
      [-2, -1, 1],
      [-2 * w, -w, w],
    ],
  },
  {
    color: "yellow",
    angles: [[-w - 1, -w, -1]],
  },
  {
    color: "green",
    angles: [
      [-w, 1 - w, -1],
      [-w, 1, 1 + w],
      [1, w - 1, w],
      [-w - 1, -1, w],
    ],
  },
  {
    color: "red",
    angles: [
      [-w - 1, -w, 1],
      [1 - w, 1, w],
      [-1, w, w + 1],
      [-w, -1, w - 1],
    ],
  },
  {
    color: "blue",
    angles: [
      [-w - 1, -1, 1],
      [-w, 1 - w, w],
      [-1, 1, w + 1],
      [-w, w - 1, w],
    ],
  },
  {
    color: "orange",
    angles: [
      [1 - w, -1, 1],
      [-w, w, 1 + w],
      [-1, 1, w - 1],
      [-1 - w, -w, w],
    ],
  },
  {
    color: "magenta",
    angles: [
      [-w, -1, 1],
      [-w, 1, w],
      [-1, 1, w],
      [-w, -1, w],
    ],
  },
];
const createField = () => {
  const html = ["<table>"];
  //テトリスのフィールドを描画する処理
  for (let y = 0; y < height; y++) {
    html.push("<tr>");
    for (let x = 0; x < width; x++) {
      if (x === 0 || x === width - 1 || y === height - 1) {
        html.push('<td id="side"style="background-color:black;"></td>');
        fills[x + y * width] = "black";
      } else {
        html.push("<td></td>");
      }
    }
    html.push("</tr>");
  }
  html.push("</table>");
  document.getElementById("view").innerHTML = html.join("");
};

const initalStatus = {
  top: 2,
  top0: 2,
  left: Math.floor(width / 2),
  left0: 0,
  isOver: false,
  block: [],
  angle: 0,
  angle0: 0,
  parts: [],
  parts0: [],
  score: 0,
  score0: 0,
  keys: {},
  tick: 0,
};
const initialBlock = blocks[Math.floor(Math.random() * blocks.length)];

let gameStatus = {
  ...initalStatus,
  block: initialBlock,
  parts: initialBlock.angles[0],
  parts0: [],
};

const adaptedToGameStatusWithKeyAction = (gameStatus) => {
  const { keys, left, top, angle, tick, block } = gameStatus;
  const newAngle = keys === "rotate" ? angle + 1 : angle;
  const common = {
    ...gameStatus,
    keys: {},
    parts: block.angles[newAngle % block.angles.length],
  };
  const result = {
    left: {
      ...common,
      left: left - 1,
    },
    right: {
      ...common,
      left: left + 1,
    },
    down: {
      ...common,
      top: top + 1,
    },
    rotate: {
      ...common,
      angle: angle + 1,
    },
  };

  if (tick % speed === 0) {
    return result["down"];
  }
  return result[keys] ?? common;
};

// ゲームーオーバーmove関数を終わらせる。
const gameOver = (cells, fills) => {
  const reset = () => {
    location.reload();
  };
  for (let i in fills) {
    if (fills[i]) {
      cells[i].style.backgroundColor = "black";
    }
  }
  document.getElementById("info").innerHTML = "Game Over";
  const title = document.getElementById("title");
  title.innerHTML = "もう一度遊ぶ";
  title.setAttribute("style", "cursor: pointer;");
  title.addEventListener("click", () => {
    reset();
  });
  return cells;
};

const clearRowBlocks = (cells, fills, score) => {
  //横列が揃っているか確認する。
  let cleans = 0;
  //ブロックの下段から横列が揃っているか判定 縦列のfor 縦列毎に段を消す判定をする。
  for (let y = height - 2; y >= 0; y--) {
    //trueのままであれば,列が揃っている状態。
    let filled = true;
    //横列に空があれば、filledをfalseにする。揃っていれば、スルー 横列のfor
    for (let x = 1; x < width - 1; x++) {
      if (!fills[y * width + x]) {
        filled = false;
        break;
      }
    }
    //横列が揃っていれば、揃っている列に上段の列を代入して、上書き。揃ってなければ、スルー
    if (filled) {
      for (let y2 = y; y2 >= 0; y2--) {
        for (let x = 1; x < width - 1; x++) {
          //fillsに横列が消された後の場のブロックの状況を記録する。
          fills[y2 * width + x] = fills[(y2 - 1) * width + x];
        }
      }
      //列が揃って段が下がった場合、下がってきた段が揃っているか確認。一番上のfor分のyを加算。
      y++;
      cleans++;
    }
  }
  //cleans
  if (cleans > 0) {
    //cleansの数だけボーナス加算。
    score += Math.pow(10, cleans) * 10;
    for (let y = height - 2; y >= 0; y--) {
      for (let x = 1; x < width - 1; x++) {
        let color = fills[y * width + x] || "";
        //場にブロックの配置を描画する（色を塗る。）
        cells[y * width + x].style.backgroundColor = color;
      }
    }
  }
  return [score, cells];
};
const describeBlock = (cells, isClear, gameStatus) => {
  const { parts0, top, top0, left, left0, block } = gameStatus;
  if (isClear) {
    for (let i = -1; i < parts0.length; i++) {
      let offset = parts0[i] || 0;
      cells[top0 * width + left0 + offset].style.backgroundColor = "";
    }
    return cells;
  }
  for (let i = -1; i < parts0.length; i++) {
    let offset = parts0[i] || 0;
    cells[top * width + left + offset].style.backgroundColor = block.color;
  }
  return cells;
};

const analyzeField = (cells, fills, gameStatus) => {
  for (let i = -1; i < gameStatus.parts.length; i++) {
    const { parts, tick } = gameStatus;
    const offsetA = parts[i] || 0;
    const isCollied =
      !!fills[gameStatus.top * width + gameStatus.left + offsetA];
    //ぶつかり判定。
    if (isCollied) {
      //自然落下ではない場合、枠にぶつかっている場合、ブロックを戻す。
      if (tick % speed !== 0) {
        gameStatus = {
          ...gameStatus,
          left: gameStatus.left0,
          top: gameStatus.top0,
          angle: gameStatus.angle0,
          parts: gameStatus.parts0,
        };
        break;
      }
      const { top0, block, left0, parts0, score, score0 } = gameStatus;
      // ブロックを積み上げる。
      for (let j = -1; j < parts0.length; j++) {
        let offsetB = parts0[j] || 0;
        fills[top0 * width + left0 + offsetB] = block.color;
      }
      // gameOverの処理
      if (score0 === score) {
        const blackCells = gameOver(cells, fills);
        cells = [...blackCells];
        gameStatus = { ...gameStatus, isOver: true };
        return;
      }
      // ブロックが揃っていたら消す処理
      const [newScore, newCells] = clearRowBlocks(cells, fills, score);
      cells = [...newCells];
      gameStatus = {
        ...gameStatus,
        score: newScore,
      };
      // 次ターンのブロックを生成し、ゲームの状態を初期化する処理
      const nextBlock = blocks[Math.floor(Math.random() * blocks.length)];
      gameStatus = {
        ...initalStatus,
        score: gameStatus.score,
        score0: gameStatus.score,
        block: nextBlock,
        parts: nextBlock.angles[0],
      };
      break;
    }
  }
  return [cells, fills, gameStatus];
};

const keyElements = ["down", "left", "right", "rotate"].map((element) => {
  return document.getElementById(element);
});
keyElements.forEach((element) => {
  element.addEventListener("click", () => {
    gameStatus = {
      ...gameStatus,
      keys: element.id,
    };
  });
});

const move = () => {
  const { isOver } = gameStatus;
  // ゲームオーバーならば関数終了
  if (isOver) {
    return;
  }
  // move関数実行前の初期値を登録
  gameStatus = {
    ...gameStatus,
    tick: gameStatus.tick + 1,
    left0: gameStatus.left,
    top0: gameStatus.top,
    angle0: gameStatus.angle,
  };
  // keyActionの操作を反映。
  gameStatus = adaptedToGameStatusWithKeyAction(gameStatus);

  // フィールドの状況を分析して最終的なゲームの状態とフィールドの状態を取得
  const [newCells, newFills, newGameStatus] = analyzeField(
    cells,
    fills,
    gameStatus
  );
  cells = [...newCells];
  fills = [...newFills];
  gameStatus = newGameStatus;

  // ブロックが正常に落下した場合、スコアを加算。
  if (gameStatus.top != gameStatus.top0) {
    gameStatus = {
      ...gameStatus,
      score: gameStatus.score + 1,
    };
  }
  // 前ターンのブロック表示消去;
  const clearBlock = describeBlock(cells, true, gameStatus);
  cells = [...clearBlock];
  gameStatus = { ...gameStatus, parts0: gameStatus.parts };
  // //今ターンのブロック表示を描画
  const showBlock = describeBlock(cells, false, gameStatus);
  cells = [...showBlock];
  const info = `score:${gameStatus.score}`;
  document.getElementById("info").innerHTML = info;
  //第二引数のタイミング毎にmove関数を再起的に実行。
  setTimeout(move, 1000 / speed);
};

window.addEventListener("load", () => {
  createField();
  move();
});
