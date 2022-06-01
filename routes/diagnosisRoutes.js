const express = require("express");
const router = express.Router();

const {
    getDiagnosis,   
} = require("../controllers/diagnosisController")

router.post("/diagnosis", getDiagnosis)

module.exports = router;