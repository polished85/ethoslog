import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyBFvy0tl9LJ7vVgCYjNeSB28e9Q-3YvOT0",
  authDomain: "ethoslog-24660.firebaseapp.com",
  databaseURL: "https://ethoslog-24660.firebaseio.com",
  projectId: "ethoslog-24660",
  storageBucket: "ethoslog-24660.appspot.com",
  messagingSenderId: "118273395612"
}

// Initialize Firebase
var app = firebase.initializeApp(config)
var db = app.database()
var dbRef = db.ref()
var postsRef = db.ref('posts')
var usersRef = db.ref('users')
var auth = firebase.auth

export function synchronizeList(list, name, cbs) {
  var ref = db.ref(name).orderByChild('inverseScore').limitToFirst(10)
  ref.on('child_added', function _add(snap, prevChild) {
    var data = snap.val()
    data._key = snap.key // assumes data is always an object
    console.log('child_added: ', data)
    var pos = positionAfter(list, prevChild)
    cbs.onChildAdded(pos, data)
    //list.splice(pos, 0, data)
  })

  ref.on('child_removed', function _remove(snap) {
    console.log('child_removed')
    var i = positionFor(list, snap.key)
    if( i > -1 ) {
      cbs.onChildRemoved(i)
      //list.splice(i, 1)
    }
  })

  ref.on('child_changed', function _change(snap) {
    console.log('child_changed')
    var i = positionFor(list, snap.key)
    if( i > -1 ) {
      var value = snap.val()
      value._key = snap.key // assumes data is always an object
      cbs.onChildChanged(i, value)
      // Vue.set(list, i, value)
    }
  })

  ref.on('child_moved', function _move(snap, prevChild) {
    console.log('child_moved')
    var curPos = positionFor(list, snap.key)
    if( curPos > -1 ) {
      var data = list.splice(curPos, 1)[0]
      var newPos = positionAfter(list, prevChild)
      cbs.onChildMoved(newPos, data)
      //list.splice(newPos, 0, data)
    }
  })
  return ref
}

// similar to indexOf, but uses id to find element
function positionFor(list, key) {
  for(var i = 0, len = list.length; i < len; i++) {
    if( list[i]._key === key ) {
      return i;
    }
  }
  return -1;
}

// using the Firebase API's prevChild behavior, we
// place each element in the list after it's prev
// sibling or, if prevChild is null, at the beginning
function positionAfter(list, prevChild) {
  if( prevChild === null ) {
    return 0;
  }
  else {
    var i = positionFor(list, prevChild);
    if( i === -1 ) {
      return list.length;
    }
    else {
      return i+1;
    }
  }
}

export function synchronizeItem(name, key, cb){
  var ref = db.ref(name).orderByKey().equalTo(key)
  ref.on('value', function _add(snap, prevChild) {
    cb(snap.val())
  })
  return ref
}

export function newPost(post, uid){
  console.log('newPost: ', post)
  var newPostKey = postsRef.push().key
  post.inverseScore = parseInt('-' + post.score)
  post.created = Date.now()
  post.author = uid
  var updates = {}
  updates['/posts/' + newPostKey] = post
  return dbRef.update(updates)
}

/* parentId can be a postId or commentId */
export function newComment(comment, uid, parentId){ 
  var newCommentKey = db.ref(`comments/${parentId}`).push().key
  console.log('newCommentKey: ', newCommentKey)
  comment.created = Date.now()
  comment.author = uid
  comment.points = 0
  // comment._key = newCommentKey
  console.log('comment:', comment)
  var updates = {}
  updates['/comments/' + parentId + '/' + newCommentKey] = comment
  return dbRef.update(updates)
}

export function upVotePost(points, key){
  return postsRef.child(key).update({
    "points": points + 10
  })
}

export function removePost(id){
  return postsRef.child(id).remove()
}

export function watchAuthState(cb){
  return auth().onAuthStateChanged(cb)
}

export function signUp (email, pw) {
  return auth().createUserWithEmailAndPassword(email, pw)
}

export function logout () {
  return auth().signOut()
}

export function login (email, pw) {
  return auth().signInWithEmailAndPassword(email, pw)
}

export function resetPassword (email) {
  return auth().sendPasswordResetEmail(email)
}

/* NOT USED */
export function addUser(user) {
  return usersRef.child(user.key).set(user)
}

