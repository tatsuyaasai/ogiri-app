const mysql = require('mysql2')
var express = require('express');
var router = express.Router();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '414381a',
    database: 'ogiri'
});
router.get('/odai/new', (req, res) => {
    connection.query(
        'SELECT * FROM ogiri.odai',
        function(err, results, fields){
            if(err){
                console.log('接続エラー');
                throw err;
            }
            const odai_api = []
            const num_elm = results.length
            for (let i = 0; i < 10; i++){
                if(i < num_elm){
                    odai_api.push([results[i].odai_content, results[i].odai_id]);
                }else{
                    break;
                }
            }
            res.json({message: odai_api});
        }
    )
});

router.get('/odai/popular', (req, res) => {
    connection.query(
        'SELECT * FROM odai',
        function(err, results, fields){
            if(err){
                console.log('接続エラー');
                throw err;
            }
            const odai_api = [];
            const num_elm = results.length;
            for (let i = 0; i < 3; i++){
                if(i < num_elm){
                    odai_api.push([results[i].odai_content, results[i].odai_id]);
                }else{
                    break;
                }
            }
            res.json({message: odai_api});
        }
    )
});

router.post('/odai/create', function(req, res, next) {
  const odai_in = req.body.odai[1];
  // console.log(odai_in);
  if (odai_in){
      connection.query(
            'insert into odai (odai_content) values (?);',
            [odai_in],
        function(err, results, fields){
                    if(err){
                        console.log('接続エラー');
                        throw err;
                    }
                    res.json({message: odai_in});
                }
      )

  }else{
      // console.log("空ですよ～")
      res.json({message: "空ですよ～"});
  }
});

router.post('/answer/set', function(req, res, next) {
  const answer_in = req.body.answer.content;
  const odai_id_in = req.body.answer.odai_id;
  // console.log(odai_id_in);
  if (answer_in){
    connection.query(
        "insert into answer (answer_content,odai_id) values (?, ?);",
        [answer_in, odai_id_in],
    function(err, results, fields){
                if(err){
                    console.log('接続エラー');
                    throw err;
                }
            }
    )
  res.json({message: req.body});
  }else{
      res.json({message: "空ですよ～"});
  }
  //空のオブジェクトをレスポンスしようとするとエラーになる。
  // res.json({message: answer_in});
});

router.post('/answer/get', function(req, res, next){
    const odai_id_in = req.body.search_key.key;
    if(odai_id_in){
        connection.query(
            'select answer_id, answer_content, odai_id from ogiri.answer where odai_id = ?',
            [odai_id_in],
            function(err, results, fields) {
                if (err) {
                    console.log('接続エラー');
                    throw err;
                }
                const answer_list = [];
                const num_elm = results.length;
                for(let i = 0; i < 5; i++){
                    if (i < num_elm){
                        answer_list.push([results[i].answer_id, results[i].answer_content])
                    }else{
                        break;
                    }

                }
                res.json({message: answer_list})
            }
        )
    }else{
        console.log("空でした～")
        res.json({message: "空でした～"});
    }
    //お題idが送られてくるので入れ物
    //お題IDでデータベースを検索して一覧を作る
});

module.exports = router;
