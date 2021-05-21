'use strict'
require('dotenv').config()
const fetch = require('node-fetch')
const dateTimeFormat = require('dayjs')

const controller = {}

const secretToken = process.env.GITLAB_TOKEN
const url = 'https://gitlab.lnu.se/api/v4/projects/13872/issues?state=opened&private_token=' + secretToken

/**
 * Function to get issues
 *
 * @param {object} req The request object
 * @param {object} res The response object
 */
controller.getIssues = async (req, res) => {
  const issues = []
  try {
    const issue = await fetch(url)
    const jData = await issue.json()
    if (issue.ok) {
      console.log('Successfully fetched issues!')
    } else {
      console.log('Could not fetch the url')
    }
    for (const issue of jData) {
      const issuesData = {
        author: issue.author.username,
        id: issue.id,
        title: issue.title,
        description: issue.description,
        created_at: dateTimeFormat(issue.created_at).format('YYYY-MM-DD HH:mm'),
        updated_at: dateTimeFormat(issue.updated).format('YYYY-MM-DD HH:mm'),
        comments: issue.user_notes_count,
        link: issue.web_url,
        state: issues.state
      }
      if (issuesData) {
        issues.push(issuesData)
      }
    }
    res.render('main/start', { issues: issues })
  } catch (error) {
    console.error(error)
    res.render('main/start')
  }
}

/**
 * Function to post webhooks
 *
 * @param {object} req The request object
 * @param {object} res The response object
 * @param {object} next The next object
 * @returns {*} returns an object
 */
controller.handleWebHook = async (req, res, next) => {
  const secret = req.headers['x-gitlab-token']
  if (secret === secretToken) {
    if (req.body.event_type === 'issue') {
      if (!req.body.changes.description) {
        req.body.changes.description = {}
        req.body.changes.description.previous = null
        req.body.changes.description.current = null
      }
      const events = {
        id: req.body.object_attributes.id,
        title: req.body.object_attributes.title,
        description: req.body.object_attributes.description,
        created_at: dateTimeFormat(req.body.object_attributes.created_at).format('YYYY-MM-DD HH:mm'),
        updated_at: dateTimeFormat(req.body.object_attributes.updated_at).format('YYYY-MM-DD HH:mm'),
        comments: 0,
        link: req.body.object_attributes.url,
        currentDesc: req.body.changes.description.previous,
        newDesc: req.body.changes.description.current,
        type: req.body.event_type,
        state: req.body.object_attributes.state,
        author: req.body.user.username
      }
      res.locals.event = events
      return next()
    } else if (req.body.event_type === 'note') {
      const notes = {
        author: req.body.user.username,
        id: req.body.issue.id,
        description: req.body.object_attributes.description,
        created_at: dateTimeFormat(req.body.object_attributes.created_at).format('YYYY-MM-DD HH:mm'),
        updated_at: dateTimeFormat(req.body.object_attributes.updated_at).format('YYYY-MM-DD HH:mm'),
        link: req.body.object_attributes.url,
        type: req.body.event_type,
        title: req.body.issue.title
      }
      res.locals.event = notes
      return next()
    }
    return res.sendStatus(500)
  }
}

module.exports = controller
