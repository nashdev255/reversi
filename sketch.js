// https://magazine.techacademy.jp/magazine/22767
const sideLength = 8;
const board = document.getElementById("board");
const squareTemplate = document.getElementById("square-template");

const stoneStateList = [];

const onClickSquare = (index) => {
    if(stoneStateList[index]!==0) {
        alert("you can't put here!!!");
        return;
    }
};

const initBoard = () => {
    for(let i=0;i<sideLength*sideLength;i++) {
        const square = squareTemplate.cloneNode(true);
        square.removeAttribute("id");
        board.appendChild(square);
    
        const stone = square.querySelector('.stone');

        let defaultState;
        if (i == 27 || i == 36) {
            defaultState = 1;
        } else if (i == 28 || i == 35) {
            defaultState = 2;
        } else {
            defaultState = 0;
        }

        stone.setAttribute("data-state", defaultState);

        stone.setAttribute("data-index", i);
        stoneStateList.push(defaultState);

        square.addEventListener('click', () => {
            onClickSquare(i);
        })
    }
};

//onClickSquare関数のすぐ上に記述しましょう
let currentColor = 1;
const getReversibleStones = (idx) => {
  //クリックしたマスから見て、各方向にマスがいくつあるかをあらかじめ計算する
  //squareNumsの定義はやや複雑なので、理解せずコピーアンドペーストでも構いません
  const squareNums = [
    7 - (idx % 8),
    Math.min(7 - (idx % 8), (56 + (idx % 8) - idx) / 8),
    (56 + (idx % 8) - idx) / 8,
    Math.min(idx % 8, (56 + (idx % 8) - idx) / 8),
    idx % 8,
    Math.min(idx % 8, (idx - (idx % 8)) / 8),
    (idx - (idx % 8)) / 8,
    Math.min(7 - (idx % 8), (idx - (idx % 8)) / 8),
  ];
  //for文ループの規則を定めるためのパラメータ定義
  const parameters = [1, 9, 8, 7, -1, -9, -8, -7];

  //ここから下のロジックはやや入念に読み込みましょう
  //ひっくり返せることが確定した石の情報を入れる配列
  let results = [];

  //8方向への走査のためのfor文
  for (let i = 0; i < 8; i++) {
    //ひっくり返せる可能性のある石の情報を入れる配列
    const box = [];
    //現在調べている方向にいくつマスがあるか
    const squareNum = squareNums[i];
    const param = parameters[i];
    //ひとつ隣の石の状態
    const nextStoneState = stoneStateList[idx + param];

    //フロー図の[2][3]：隣に石があるか 及び 隣の石が相手の色か -> どちらでもない場合は次のループへ
    if (nextStoneState === 0 || nextStoneState === currentColor) continue;
    //隣の石の番号を仮ボックスに格納
    box.push(idx + param);

    //フロー図[4][5]のループを実装
    for (let j = 0; j < squareNum - 1; j++) {
      const targetIdx = idx + param * 2 + param * j;
      const targetColor = stoneStateList[targetIdx];
      //フロー図の[4]：さらに隣に石があるか -> なければ次のループへ
      if (targetColor === 0) continue;
      //フロー図の[5]：さらに隣にある石が相手の色か
      if (targetColor === currentColor) {
        //自分の色なら仮ボックスの石がひっくり返せることが確定
        results = results.concat(box);
        break;
      } else {
        //相手の色なら仮ボックスにその石の番号を格納
        box.push(targetIdx);
      }
    }
  }
  //ひっくり返せると確定した石の番号を戻り値にする
  return results;
};

// const initBoard = () => {
//     for(let i=0;i<sideLength;i++) {
//         for(let j=0;j<sideLength;j++) {
//             const square = squareTemplate.cloneNode(true);
//             square.removeAttribute("id");
//             board.appendChild(square);
        
//             const stone = square.querySelector('.stone');
    
//             let defaultState = 0;
//             if(i==3&&j==4||i==4&&j==3) defaultState = 1;
//             if(i==3&&j==3||i==4&&j==4) defaultState = 2;
    
//             stone.setAttribute("data-state", defaultState);

//             dataIndex = sideLength*i+(j+1)-1;
    
//             stone.setAttribute("data-index", dataIndex);
//             stoneStateList.push(defaultState);
    
//             square.addEventListener('click', () => {
//                 onClickSquare(dataIndex);
//             })
//         }
//     }
// };

window.onload = () => {
    initBoard();
};
