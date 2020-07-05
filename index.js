window.onload = function () {
  const width = 10;
  const height = 20;

  const html = ["<table>"];

  for (let y = 0; y < height; y++) {
    html.push("<tr>");
    for (let x = 0; x < width; x++) {
      html.push("<td></td>");
    }
    html.push("</tr>");
  }
  html.push("</table>");
  document.getElementById("view").innerHTML = html.join("");
  const cells = document.getElementsByTagName("td");

  let top = 0;
  let top0 = top;

  const move = function () {
    for (let a = 0; a < 4; a++) {
      cells[top0 * width + a].style.backgroundColor = "";
    }
    for (let a = 0; a < 4; a++) {
      cells[top * width + a].style.backgroundColor = "red";
    }
    top0 = top;
    top++;
    if (top < height) {
      setTimeout(move, 1000);
    }
  };

  move();
};
