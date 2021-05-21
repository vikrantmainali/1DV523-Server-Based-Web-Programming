const socket = io()

socket.on('connect', function () {
  console.log('Connected')
})

socket.on('disconnect', function () {
  console.log('Disconnected')
})

socket.on('webhook-event', function (e) {
  if (e.type === 'note') {
    console.log('Type of webhook event: ' + e.type)
    createNotification(e, 'New comment added to an issue')
    updateAmountOfComments(e)
  } else if (e.type === 'issue') {
    if (e.state === 'closed') {
      console.log('Type of webhook event: ' + e.type)
      createNotification(e, 'Issue has been closed')
      removeClosedIssue(e)
    } else {
      console.log('Type of webhook event: ' + e.type)
      createNotification(e, 'New issue has been added')
      newIssueEvent(e)
    }
  }
})

/** Function to create notifications
 *
 * @param {*} event Event that triggered the update
 * @param {*} type Type of notification
 */
const createNotification = (event, type) => {
  const notification = document.getElementById('notificationList')

  const notificationBox = document.createElement('div')
  notificationBox.setAttribute('class', 'notificationBox')
  // Header creation
  const header = document.createElement('header')
  header.setAttribute('class', 'notificationHeader')
  header.innerHTML = `<h4>${type}</h4>`
  notificationBox.append(header)

  const content = document.createElement('div')
  content.setAttribute('class', 'notificationContent')

  const createdDate = document.createElement('p')
  createdDate.innerText = 'Created date: ' + event.created_at
  const link = document.createElement('a')
  link.setAttribute('href', event.link)
  link.innerText = 'Link to the issue'

  const title = document.createElement('p')
  title.innerText = 'Title: ' + event.title

  const author = document.createElement('p')
  author.innerText = 'Author: ' + event.author

  if (event.type === 'note') {
    const description = document.createElement('p')
    description.innerText = 'Comment: ' + event.description
    content.append(description)
    const underIssue = document.createElement('p')
    underIssue.innerText = 'Issue: ' + event.title
    content.append(underIssue)
  } else if (event.type === 'issue') {
    content.append(title)
  }
  content.append(author)
  content.append(createdDate)
  content.append(link)

  notificationBox.append(content)
  notification.append(notificationBox)
}

/**
 * Function for addressing new issues
 *
 * @param {*} event Event that triggered the update
 */
const newIssueEvent = (event) => {
  const ul = document.getElementById('issues')
  const li = document.createElement('li')
  li.setAttribute('class', 'issues', 'id' + event.id)
  const div = document.createElement('div')
  div.setAttribute('id', 'ribbon')

  const h4 = document.createElement('h4')
  h4.setAttribute('id', 'title')
  const text = document.createTextNode('Title: ' + event.title)

  const spanBody = document.createElement('span')
  spanBody.setAttribute('class', 'body')
  const body = document.createTextNode('Description: ' + event.description)

  const br = document.createElement('br')

  const a = document.createElement('a')
  a.setAttribute('href', event.link)
  const links = document.createTextNode('Link to issue')

  const pComment = document.createElement('p')
  pComment.setAttribute('id', 'comments')
  const comment = document.createTextNode('Comments: ' + 0)

  const pAuthor = document.createElement('p')
  pAuthor.setAttribute('id', 'author')
  const author = document.createTextNode('Author: ' + event.author)

  const pCreated = document.createElement('p')
  pComment.setAttribute('id', 'createdAt')
  const created = document.createTextNode('Created at: ' + event.created_at)

  const pUpdated = document.createElement('p')
  pComment.setAttribute('id', 'updatedAt')
  const updated = document.createTextNode('Updated at: ' + event.created_at)

  h4.appendChild(text)
  spanBody.appendChild(body)
  a.appendChild(links)
  pComment.appendChild(comment)
  pAuthor.appendChild(author)
  pCreated.appendChild(created)
  pUpdated.appendChild(updated)
  div.appendChild(h4)
  div.appendChild(spanBody)
  div.appendChild(br)
  div.appendChild(a)
  div.appendChild(pComment)
  div.appendChild(pAuthor)
  div.appendChild(pCreated)
  div.appendChild(pUpdated)
  li.appendChild(div)

  ul.insertBefore(li, ul.childNodes[0])
}

/**
 * Function to update number of comments in real-time
 *
 * @param {*} event Event that triggered the update
 */
const updateAmountOfComments = (event) => {
  const issue = document.getElementById(event.id)
  const comments = issue.querySelector('#comments')
  let commentNumber = comments.textContent
  commentNumber = commentNumber.replace(/[^0-9]/g, '')
  const newCommentsNumber = parseInt(commentNumber) + 1
  comments.textContent = 'Comments: ' + newCommentsNumber
  const update = issue.querySelector('#updatedAt')
  update.textContent = 'Updated at: ' + event.updated_at
}

/**
 * Function to remove closed issue from the page
 *
 * @param {*} event Event that triggered the update
 */
const removeClosedIssue = (event) => {
  document.getElementById(event.id).remove()
}
