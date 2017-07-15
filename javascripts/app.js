var state = {
  skin: .5,
  flesh: .5,
  core: .5
}

var coefficients = {
  someone: {skin: 1, flesh: 0, core: 0},
  coworkers: {skin: .2, flesh: .8, core: 0},
  newfriends: {skin: 0, flesh: 1, core: 0},
  goodfriends: {skin: 0, flesh: .8, core: .2},
  closefriends: {skin: 0, flesh: .5, core: .5},
  family: {skin: 0, flesh: .3, core: .7}
}

var questions = []

var descriptions = {}

$.get('data/questions.json', function(data) {

  $(data.skin).each(function(i, question) {
    questions.push({
      text: question,
      callback: function(answer) {
	state.skin += (answer ? .5 : -.5) / data.skin.length
      }
    })
  })

  $(data.flesh).each(function(i, question) {
    questions.push({
      text: question,
      callback: function(answer) {
	state.flesh += (answer ? -.5 : .5) / data.flesh.length
      }
    })
  })

  $(data.core).each(function(i, question) {
    questions.push({
      text: question,
      callback: function(answer) {
	state.core += (answer ? -.5 : .5) / data.core.length
      }
    })
  })

  $.shuffle(questions)
  
}).then(function() {
  return $.get('data/descriptions.json', function(data) {
    descriptions = data
  })
}).fail(function() {
  throw 'Cannot retrieve questions'
}).done(function() {
  update()
})

function update() {
  console.log(state)
  var question = questions.pop()
  if (question) {
    $('#text').text(question.text)
    $('#yes').off().on('click', function() {
      question.callback(true)
      update()
    })
    $('#no').off().on('click', function() {
      question.callback(false)
      update()
    })
    for (var people in coefficients) {
      var idx = Math.floor((coefficients[people].skin * state.skin +
			    coefficients[people].flesh * state.flesh +
			    coefficients[people].core * state.core) * 5)
      idx = Math.min(4, Math.max(0, idx))
      $('#' + people).attr('src', 'images/smiley-' + idx + '.png')
    }
  } else {
    var profile = ((state.skin < .5 ? 'b' : 'g') +
		   (state.flesh < .5 ? 'b' : 'g') +
		   (state.core < .5 ? 'b' : 'g'))

    $('#apple').attr('src', 'images/' + profile + '.png')
    $('#category').text(descriptions[profile].name)
    $('#deal').text(descriptions[profile].deal)
    $('#good').text(descriptions[profile].good)
    $('#bad').text(descriptions[profile].bad)
    $('#question').toggleClass('hidden')
    $('#description').toggleClass('hidden')
  }
}
