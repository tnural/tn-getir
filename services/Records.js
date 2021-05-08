const Records = require("../models/Records");
/**
 * 
 * @param { starting date value for query } startDate 
 * @param { end date value for mongoose query } endDate 
 * @param { minimum count for sum of counts field array } minCount 
 * @param { maximum count for sum of counts field array } maxCount 
 * @returns 
 */
function findRecord(startDate, endDate, minCount, maxCount) {
  let result = {};
  let records = [];
  return Records.find({
    createdAt: { $gte: startDate, $lte: endDate },
  })
    .exec()
    .then((record) => {
      record.forEach((element) => {
        let sum = element.counts.reduce(function (a, b) {
          return a + b;
        }, 0);
        if (sum <= maxCount && sum >= minCount)
          records.push({
            key: element.key,
            createdAt: element.createdAt,
            totalCount: sum,
          });
      });
      if (records.length > 0) {
        result.code = 0;
        result.msg = "Success";
        result.records = records;
      } else {
        result.code = -1;
        result.msg = "Not Found";
        result.records = [];
      }

      return new Promise(function (resolve, reject) {
        resolve(result);
      });
    })
    .catch((error) => {
      console.log(error.message);
      result.code = -2;
      result.msg = "Internal server error";
      result.records = [];
      return new Promise(function (resolve, reject) {
        reject(result);
      });
    });
}

module.exports = findRecord;
