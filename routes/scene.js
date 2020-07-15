const express = require('express');
const router = express.Router();
const XLSX = require("xlsx");

const sheet2arr = function(sheet){
  let result = [];
  let row;
  let rowNum;
  let colNum;
  let range = XLSX.utils.decode_range(sheet['!ref']);
  for(rowNum = range.s.r; rowNum <= range.e.r; rowNum++){
     row = [];
      for(colNum=range.s.c; colNum<=range.e.c; colNum++){
         let nextCell = sheet[
            XLSX.utils.encode_cell({r: rowNum, c: colNum})
         ];
         if( typeof nextCell === 'undefined' ){
            row.push(void 0);
         } else row.push(nextCell.w);
      }
      result.push(row);
  }
  return result;
};

/* GET users listing. */
router.get('/:sceneName', (req, res, next) => {
  let workbook = XLSX.readFile(`${__dirname}/../public/scenes/${req.params.sceneName}.xlsx`);
  let worksheet = workbook.Sheets["Sheet1"];
  res.json(sheet2arr(worksheet));
  return;
});

module.exports = router;
