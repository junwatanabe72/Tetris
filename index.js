window.onload = function () {
  const width = 10;
  const height = 20;
  const speed = 20;
  const html = ["<table>"];

  //テトリスのフィールドを描画する処理
  for (let y = 0; y < height; y++) {
    html.push("<tr>");
    for (let x = 0; x < width; x++) {
      html.push("<td></td>");
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
  //ブロック回転時の位置情報を予め定義
  const angles = [
    [-1,1,2],
    [-w,w,2*w],
    [-2,-1,1],
    [-2*w,-w,w]
  ]
  //回転を指示した回数をカウントとする関数
  let angle = 0
  //前ターンの回転情報
  let parts0 =[]
  //横マス移動の状態を保存するオブジェクト
  let keys = {}
  //横マス移動が発生しているか判断する関数
  this.document.onkeydown = function (e){
    switch((e || event).keyCode){
      case 37: keys.left = true; break
      case 39: keys.right = true; break
      case 32: keys.rotate = true; break
    }
  }
  let tick =0
  //ブロックを移動させる関数
  const move = function () {
    tick+=1
    //keys.leftがtrueでleftが0超なら左に１マス移動
    left0 = left
    if(keys.left && left > 1){
      left -=1;
    }
     //keys.rightがtrueでleftの幅に余裕がるならば、右に１マス移動
    if (keys.right && left + 3 < width) {
      left += 1;
    }
    //回転を指示したかどうか。
    if(keys.rotate){ angle +=1}
    //次ターンに再度、入力するため、初期化
    keys={}
    //前ターンのブロック表示消去
    for(let i=-1;i<parts0.length;i++){
      let offset = parts0[i] || 0
      cells[top0 * width + left0 + offset].style.backgroundColor = "";
    }
    
    // //parts0に回転指示カウントを反映させたanglesを代入
    // //%は除算の余りを出力するもの。1(1),2(2),3(3),4(0),5(1)....
    parts0 = angles[angle % angles.length]

    // //ブロック回転指示後の表示
    for (let i = -1; i < parts0.length; i++) {
      let offset = parts0[i] || 0;
      cells[top * width + left + offset].style.backgroundColor = "red";
    }

    // for (let a = 0; a < 4; a++) {
    //   cells[top0 * width + left0 + a].style.backgroundColor = "";
    // }
    // for (let a = 0; a < 4; a++) {
    //   cells[top * width + left + a].style.backgroundColor = "red";
    // }
    top0 = top;
    

    if (tick % speed === 0 ){
      top++;
    }
    
    const info = `${tick}(${left},${top})`
    document.getElementById("info").innerHTML = info

    if (top < height) {
      setTimeout(move, 1000 / speed);
    }
  };

  move();
};
