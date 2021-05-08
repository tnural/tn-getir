const express = require("express");
const router = express.Router();
const findRecord = require("../services/Records");
const { check, validationResult } = require("express-validator");
/**
 * "/records" POST endpoint
 */
router.post(
  "/records",
  [
    check("startDate").isDate(),
    check("endDate").isDate(),
    check("minCount").isNumeric(),
    check("maxCount").isNumeric(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    findRecord(
      req.body.startDate,
      req.body.endDate,
      req.body.minCount,
      req.body.maxCount
    )
      .then((resp) => {
        console.log("result : \n" + JSON.stringify(resp));
        switch (resp.code) {
          case 0:
            res.status(200).json(resp);
            break;
          case -1:
            res.status(404).json(resp);
            break;
          case -2:
            res.status(500).json(resp);
            break;
        }
      })
      .catch((error) => {
        console.log(error.message);
        res.status(500).send({
          code: -2,
          msg: "Internal server error",
          records: [],
        });
      });
  }
);

module.exports = router;
