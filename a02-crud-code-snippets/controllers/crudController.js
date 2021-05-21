'use strict'

const snippets = require('../models/snippets')
var mongoose = require('mongoose');
const crudController = {}

module.exports = crudController
  
crudController.readSnippet = (req, res) => {
  snippets.find().then(snippetDB => {
    let snippetDataArray = []
    snippetDB.forEach(item => {
      snippetDataArray.push({
        title: item.title,
        username: item.username, 
        snippet: item.snippet,
        posted: item.createdAt,
        id: item._id
      })
    })
    res.render('crud/read', { snippets: snippetDataArray })
  })
}

  crudController.create =  (req, res) => {
    if (req.session.username) {
    res.render('crud/create')
    }
    else{
      res.status(403).render('../views/errors/403'), {flash : {type:'error', message: 'You must be logged in to create snippets'}}
    }
  }
  
  crudController.createPost = async (req, res) => {
   
    if(!req.session.username) {
      res.status(403).render('../views/errors/403'), {flash : {type:'error', message: 'You must be logged in to create snippets'}}
    }

    snippets.init()


    const snippetData = await snippets.create ({
      username: req.session.username,
      title: req.body.title,
      snippet: req.body.snippet,
  })
  .catch(err => {
    req.session.flash = {type: 'error', message: 'Could not create this snippet, please try again!'}
    res.redirect('/create')
    console.log(err)
  })
  if (snippetData) {
    req.session.flash = {type: 'success', message: 'The snippet has been created successfully!'}
    console.log('Created snippet: ' + snippetData)
    res.redirect('./')   
  }
}
  
crudController.update = async (req, res) => {
  try {
    const snippet = await snippets.findOne({_id: req.params.id})
    .catch(err => {
      console.error(err)
    })
    
    const snippetDB = {
      id: snippet._id,
      title: snippet.title,
      username: snippet.username,
      snippet: snippet.snippet
    }
    if (req.session.username && req.session.username === snippet.username) {
      res.render('crud/update', {snippets : snippetDB})
    }
    else {
      req.session.flash = {type: 'error', message: 'You must be logged in as ' + snippetDB.username + ' to edit this snippet'}
      res.status(403).render('../views/errors/403')
    }
  } catch (err) {
    console.log(err)
  }
}
  
crudController.updatePost = async (req, res) => {
try {
const snipId = req.params.id
if(req.session.username) {
 const result = await snippets.updateOne({_id: snipId}, 
  { 
    title: req.body.title,
    snippet: req.body.snippet
  }, {runValidators: true})
  .catch(err => {
    if(err && err.name === "ValidationError")
    {
      if (err) {
        console.log('Error Inserting New Data');
        if (err.name == 'ValidationError') {
          req.session.flash = {type: 'error', message: 'Could not create this snippet, please try again!'}
          res.render('/update'+snipId)
        }
    }
    }
  })
 if(result.nModified === 1) {
  req.session.flash = {type: 'success', message: 'Successfully updated snippet'}
  res.redirect('../read')
 }
 else {
  req.session.flash = {type: 'error', message: 'Snippet could not be updated'}
  res.redirect('../read')
 }
} 
else {
  req.session.flash = {type: 'error', message: 'You must be logged in to edit snippets' }
  res.status(403).render('../views/errors/403')
}
}catch(error) {
  console.log(error)
}
}

crudController.delete = async (req, res) => {
  try {
    let snippet = await snippets.findOne({_id: req.params.id})
    .catch(err => {
      console.error(err)
    })
  if(req.session.loggedIn && req.session.username === snippet.username) {
    snippet = await snippets.deleteOne({ _id: req.params.id })
    req.session.flash = {type: 'success', message: 'You have successfully deleted the snippet'}
    res.redirect('../read')
  }
  if(!req.session.loggedIn && req.session.username !== snippet.username) {
    req.session.flash = {type: 'success', message: 'You must be logged in as ' + snippet.username + ' to delete this snippet'}
    res.status(403).render('../views/errors/403')
  }
} catch (err) {
  console.log(err)
}
}