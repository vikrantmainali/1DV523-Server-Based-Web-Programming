'use strict'

const startController = {}

startController.index = (req, res) => {
  res.render('main/start')
}

module.exports = startController