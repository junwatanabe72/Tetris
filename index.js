window.onload = function () {
  //端っこ判定
  const width = 12;
  //端っこ判定
  const height = 21;
  const speed = 20;
  //ブロックのある升目を記録
  let fills = {};
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
  //


  //テトリスのコマをarrayで取得する。
  const cells = document.getElementsByTagName("td");
  //縦マスの初期位置及び２ターン目以降の前ターンの状態
  let top = 2;
  //縦マスの次ターン位置（１ターン目は0）
  let top0 = top;
  //横マスの初期位置及び２ターン目以降の前ターンの状態
  let left = Math.floor(width / 2);
  //横マスの次ターン位置（１ターン目は0）
  let left0 = left
  //幅サイズのショートハンド
  const w = width
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
  //テトリスブロックの中から、ブロックをランダムに選びblock変数に代入。
  let block = blocks[Math.floor(Math.random() * blocks.length)]



  //回転を指示した回数をカウントとする関数
  let angle = 0;
  let angle0 = angle;
  //前ターンの回転情報
  let parts0 = [];
  let score = 0;
  let score0 = score;
  //横マス移動の状態を保存するオブジェクト
  let keys = {}
  //横マス移動が発生しているか判断する関数
  document.onkeydown = function (e) {
    switch ((e || event).keyCode) {
      case 37:
        keys.left = true;
        break;
      case 39:
        keys.right = true;
        break;
      case 40:
        keys.down = true;
        break;
      case 32:
        keys.rotate = true;
        break;
    }
  }
  //move関数の呼ばれる回数を記録する変数(自然落下の速度を調整する.)
  let tick = 0


  //ブロックを移動させる関数
  const move = function () {
    tick += 1
    //keys.leftがtrueでleftが0超なら左に１マス移動
    left0 = left
    top0 = top
    angle0 = angle

    if (tick % speed === 0) {
      //自然落下する
      top += 1;
    } else {
      //keys.leftボタンが押されたら、左に１マス移動
      if (keys.left) {
        left--;
      }
      //keys.rightボタンが押されたら、右に１マス移動
      if (keys.right) {
        left += 1;
      }
      //keys.downボタンが押されたら、下に１マス移動
      if (keys.down) {
        top += 1
      }
      //keys.rotateボタンが押されたら、90度回転。（４回押されたら、元に戻る。）
      if (keys.rotate) {
        angle += 1;
      }
    }

    //次ターンに再度、入力するため、初期化
    keys = {}

    //ブロックが回転した場合の、ブロックの一マスごとの位置情報をpartsに代入。
    let parts = block.angles[angle % block.angles.length];


//ここからブロックを格納して、揃っているか判定し、次のブロックを生成する処理。揃っていなければ、スルー
//ブロックにぶつかっていない。①へ行く。処理なし。
//ブロックにぶつかっているが、自然落下でない。②へ行く。ぶつかっているので、移動できない。一つ前の状況に戻す。
//ブロックにぶつかっており、自然落下のタイミング。③へ行く。横列が揃っているか判定する。
//揃っているかにかかわらず、最後は、④へ行く。次のブロックと初期値を設定する。
    for (let i = -1; i < parts.length; i++) {
      let offsetA = parts[i] || 0;
      //ぶつかり判定。fills[x]が既に登録されている場合、true。
      if (!fills[top * width + left + offsetA]) {
        //①①①①①
      } else {
        //ぶつかり判定trueで、tickが２０の倍数（つまり、自然落下）の場合、true。
        if (tick % speed !== 0) {
          //②②②②②②
          left = left0
          top = top0
          angle = angle0
          parts = parts0
        } else {
          //③③③③③③
          //fillsに現在のブロックを追加して、次のmoveのためのブロック等を生成する。
          for (let j = -1; j < parts0.length; j++) {
            let offsetB = parts0[j] || 0
            fills[top0 * width + left0 + offsetB] = block.color
          }
    
    // ゲーム〜オーバーmove関数を終わらせる。
          if (score0 === score) {
            for (let i in fills) {
              if (fills[i]) { cells[i].style.backgroundColor = "black" }
            }
            document.getElementById("info").innerHTML = "Game Over"
            const title = document.getElementById("title")
            title.innerHTML = "もう一度遊ぶ";
            title.setAttribute("style","cursor: pointer;")
            title.addEventListener("click",initalize);
            return
          }
          
    //横列が揃っているか確認する。
          let cleans = 0
          //ブロックの下段から横列が揃っているか判定 縦列のfor 縦列毎に段を消す判定をする。
          for (let y = height - 2; y >= 0; y--) {
            //trueのままであれば,列が揃っている状態。
            let filled = true
            //横列に空があれば、filledをfalseにする。揃っていれば、スルー 横列のfor
            for (let x = 1; x < width - 1; x++) {
              if (!fills[y * width + x]) {
                filled = false
                break;
              }
            }
            //横列が揃っていれば、揃っている列に上段の列を代入して、上書き。揃ってなければ、スルー
            if (filled) {
              for (let y2 = y; y2 >= 0; y2--) {
                for (let x = 1; x < width - 1; x++) {
                  //fillsに横列が消された後の場のブロックの状況を記録する。
                  fills[y2 * width + x] = fills[(y2 - 1) * width + x]
                }
              }
              //列が揃って段が下がった場合、下がってきた段が揃っているか確認。一番上のfor分のyを加算。
              y++
              cleans++
            }
          }
          //cleans
          if (cleans > 0) {
            //cleansの数だけボーナス加算。
            score += Math.pow(10, cleans) * 10

            for (let y = height - 2; y >= 0; y--) {
              for (let x = 1; x < width - 1; x++) {
                let color = fills[y * width + x] || ""
                //場にブロックの配置を描画する（色を塗る。）
                cells[y * width + x].style.backgroundColor = color
              }
            }
          }
    //横列が揃っているか判定する。ここまで
          //④④④④④④      
          block = blocks[Math.floor(Math.random() * blocks.length)]
          left0 = left = Math.floor(width / 2)
          top0 = top = 2
          angle0 = angle = 0
          parts0 = parts = block.angles[angle % block.angles.length];
          score0 = score
        }
        break;
      }
    }
//ここからブロックが揃っているかを判定する。ここまで.


    if (top != top0) { score++ }

    //前ターンのブロック表示消去
    for (let i = -1; i < parts0.length; i++) {
      let offset = parts0[i] || 0
      cells[top0 * width + left0 + offset].style.backgroundColor = "";
    }

    parts0 = parts

    // //今ターンのブロック表示を描画
    for (let i = -1; i < parts0.length; i++) {
      let offset = parts0[i] || 0;
      cells[top * width + left + offset].style.backgroundColor = block.color;
    }

    // const info = `${tick}(${left},${top}) score:${score}`
    const info = `score:${score}`
    document.getElementById("info").innerHTML = info
    //第二引数のタイミング毎にmove関数を再起的に実行。
    setTimeout(move, 1000 / speed);
  };
  move();
};


function initalize() {
  location.reload()
}