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
      if(x === 0 || x === width-1 || y === height -1){
        html.push('<td style="background-color:silver;"></td>');
        fills[x+y*width]= "silver";
      }else{
      html.push("<td></td>");
      }
    }
    html.push("</tr>");
  }
  html.push("</table>");
  document.getElementById("view").innerHTML = html.join("");
  //


  //テトリスのコマを動かす処理
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
  const blocks = [
    {
      color: "cyan",
      angles: [
        [-1, 1, 2],
        [-w, w, 2*w],
        [-2, -1, 1],
        [-2*w, -w, w],
      ],
    },
    {
      color: "yellow",
      angles: [[-w-1, -w, -1]],
    },
    {
      color: "green",
      angles: [
        [-w, 1-w, -1],
        [-w, 1, 1+w],
        [1, w-1, w],
        [-w-1, -1, w],
      ],
    },
    {
      color: "red",
      angles: [
        [-w-1, -w, 1],
        [1-w, 1, w],
        [-1, w, w+1],
        [-w, -1, w-1],
      ],
    },
    {
      color: "blue",
      angles: [
        [-w-1, -1, 1],
        [-w, 1-w, w],
        [-1, 1, w+1],
        [-w, w-1, w],
      ],
    },
    {
      color: "orange",
      angles: [
        [1-w, -1, 1],
        [-w, w, 1+w],
        [-1, 1, w-1],
        [-1-w, -w, w],
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
  let block = blocks[Math.floor(Math.random()*blocks.length)]



  //回転を指示した回数をカウントとする関数
  let angle = 0
  let angle0= angle;
  //前ターンの回転情報
  let parts0 =[]
  //横マス移動の状態を保存するオブジェクト
  let keys = {}
  //横マス移動が発生しているか判断する関数
  document.onkeydown = function (e){
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
  let tick =0
  //ブロックを移動させる関数
  
  const move = function () {
    tick+=1
    //keys.leftがtrueでleftが0超なら左に１マス移動
    left0 = left
    top0 = top
    angle0 = angle
    
    if (tick % speed === 0) {
      top+=1;
    }else{
      if (keys.left) {
        left --;
      }
      //keys.rightがtrueでleftの幅に余裕がるならば、右に１マス移動
      if (keys.right) {
        left += 1;
      }
      if(keys.down){
        top+=1
      }
      //回転を指示したかどうか。
      if (keys.rotate) {
        angle += 1;
      }
    }
    
    //次ターンに再度、入力するため、初期化
    keys={}
    let parts = block.angles[angle % block.angles.length];

    for(let i=-1;i<parts.length;i++){
      let offsetA = parts[i] ||0;
      if(fills[top * width + left + offsetA]){
        if(tick % speed ===0){
          for(let j =-1; j<parts0.length; j++){
             let offsetB = parts0[j] || 0 
            fills[top0*width + left0 + offsetB] = block.color 
          }
          block = blocks[Math.floor(Math.random() * blocks.length)]
          left0 = left = Math.floor(width/2)
          top0=top =2
          angle0 =angle =0
          parts0 = parts = block.angles[angle % block.angles.length];
        }else{
          left = left0
          top = top0
          angle = angle0
          parts = parts0
        }
        break;
      }
    }



    //前ターンのブロック表示消去
    for(let i=-1;i<parts0.length;i++){
      let offset = parts0[i] || 0
      cells[top0 * width + left0 + offset].style.backgroundColor = "";
    }
    
    // //parts0に回転指示カウントを反映させたanglesを代入
    // //%は除算の余りを出力するもの。1(1),2(2),3(3),4(0),5(1)....
    parts0 = parts

    // //ブロック回転指示後の表示
    for (let i = -1; i < parts0.length; i++) {
      let offset = parts0[i] || 0;
      cells[top * width + left + offset].style.backgroundColor = block.color;
    }
    
    const info = `${tick}(${left},${top})`
    document.getElementById("info").innerHTML = info
    setTimeout(move, 1000/speed);
  };

  move();
};
