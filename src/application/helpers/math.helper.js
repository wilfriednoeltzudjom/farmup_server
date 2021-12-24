function roundNumberToTwoDecimal(number) {
  return Math.round((Number(number) + Number.EPSILON) * 100) / 100;
}

module.exports = { roundNumberToTwoDecimal };
